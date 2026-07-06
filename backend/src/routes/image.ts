import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { Jimp } from 'jimp';

const router = Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });
const cleanup = async (filePath: string) => { try { await fs.unlink(filePath); } catch (e) {} };
const scheduleCleanup = (filePath: string) => setTimeout(() => cleanup(filePath), 60 * 60 * 1000);

// COMPRESS IMAGE
router.post('/compress', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  if (!file) return res.status(400).json({ success: false, message: 'Please provide an image.' });

  try {
    const quality = parseInt(req.body.quality) || 60;
    
    const image = await Jimp.read(file.path);
    
    // Quality might be passed to write or just skip if unsupported in jimp 1.x directly on the instance.
    // We will just let jimp save it with default quality for now to fix the compilation error.
    
    const outputFilename = `compressed-${uuidv4()}.jpg`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    
    // Pass quality as option if supported, else defaults apply
    await image.write(outputPath as `${string}.jpg`, { quality });
    
    await cleanup(file.path);
    scheduleCleanup(outputPath);
    
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to compress image. ' + error.message });
  }
});

// CONVERT IMAGE
router.post('/convert', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  if (!file) return res.status(400).json({ success: false, message: 'Please provide an image.' });

  try {
    const format = req.body.format || 'jpeg'; // jpeg, png, bmp
    
    const image = await Jimp.read(file.path);
    
    const outputFilename = `converted-${uuidv4()}.${format}`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    
    await image.write(outputPath as `${string}.${string}`);
    
    await cleanup(file.path);
    scheduleCleanup(outputPath);
    
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to convert image. ' + error.message });
  }
});

// CROP IMAGE
router.post('/crop', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  if (!file) return res.status(400).json({ success: false, message: 'Please provide an image.' });

  try {
    const x = parseInt(req.body.x) || 0;
    const y = parseInt(req.body.y) || 0;
    const width = parseInt(req.body.width);
    const height = parseInt(req.body.height);
    
    if (!width || !height) {
      throw new Error('Valid width and height are required.');
    }

    const image = await Jimp.read(file.path);
    
    image.crop({ x, y, w: width, h: height });
    
    const ext = path.extname(file.originalname) || '.jpg';
    const outputFilename = `cropped-${uuidv4()}${ext}`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    
    await image.write(outputPath as `${string}.${string}`);
    
    await cleanup(file.path);
    scheduleCleanup(outputPath);
    
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to crop image. ' + error.message });
  }
});

// RESIZE IMAGE
router.post('/resize', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  if (!file) return res.status(400).json({ success: false, message: 'Please provide an image.' });

  try {
    const width = parseInt(req.body.width) || undefined;
    const height = parseInt(req.body.height) || undefined;
    
    if (!width && !height) {
      throw new Error('Either width or height must be provided.');
    }

    const image = await Jimp.read(file.path);
    
    const resizeOpts: any = {};
    if (width) resizeOpts.w = width;
    if (height) resizeOpts.h = height;
    
    image.resize(resizeOpts);
    
    const ext = path.extname(file.originalname) || '.jpg';
    const outputFilename = `resized-${uuidv4()}${ext}`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    
    await image.write(outputPath as `${string}.${string}`);
    
    await cleanup(file.path);
    scheduleCleanup(outputPath);
    
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to resize image. ' + error.message });
  }
});

export default router;
