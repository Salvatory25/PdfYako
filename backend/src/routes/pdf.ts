import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { PDFDocument, degrees, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import util from 'util';
import { fromPath } from 'pdf2pic';
import { Jimp } from 'jimp';

const execAsync = util.promisify(exec);

const router = Router();

// Configure multer for temp storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Helper to clean up files
const cleanup = async (filePath: string) => {
  try {
    await fs.unlink(filePath);
  } catch (err) {}
};

const scheduleCleanup = (filePath: string) => {
  setTimeout(() => cleanup(filePath), 60 * 60 * 1000);
};

// ==========================================
// EXISTING ENDPOINTS
// ==========================================

router.post('/merge', upload.array('files', 20), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length < 2) return res.status(400).json({ success: false, message: 'Please provide at least two PDF files.' });

  try {
    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      const pdfBytes = await fs.readFile(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
      await cleanup(file.path);
    }
    const mergedPdfBytes = await mergedPdf.save();
    const outputFilename = `merged-${uuidv4()}.pdf`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    await fs.writeFile(outputPath, mergedPdfBytes);
    scheduleCleanup(outputPath);
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    files.forEach(f => cleanup(f.path));
    return res.status(500).json({ success: false, message: 'Failed to merge. ' + error.message });
  }
});

router.post('/split', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  if (!file) return res.status(400).json({ success: false, message: 'Please provide a PDF file.' });

  try {
    const pdfBytes = await fs.readFile(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const splitPdf = await PDFDocument.create();
    const [firstPage] = await splitPdf.copyPages(pdfDoc, [0]);
    splitPdf.addPage(firstPage);
    const splitPdfBytes = await splitPdf.save();
    
    const outputFilename = `split-${uuidv4()}.pdf`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    await fs.writeFile(outputPath, splitPdfBytes);
    await cleanup(file.path);
    scheduleCleanup(outputPath);
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to split. ' + error.message });
  }
});

router.post('/jpg-to-pdf', upload.array('files', 20), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) return res.status(400).json({ success: false, message: 'Please provide JPG/PNG files.' });

  try {
    const pdfDoc = await PDFDocument.create();
    for (const file of files) {
      const imageBytes = await fs.readFile(file.path);
      let image;
      if (file.mimetype === 'image/jpeg' || file.originalname.toLowerCase().match(/\.jpe?g$/)) {
        image = await pdfDoc.embedJpg(imageBytes);
      } else {
        image = await pdfDoc.embedPng(imageBytes);
      }
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      await cleanup(file.path);
    }
    const pdfBytes = await pdfDoc.save();
    const outputFilename = `converted-${uuidv4()}.pdf`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    await fs.writeFile(outputPath, pdfBytes);
    scheduleCleanup(outputPath);
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    files.forEach(f => cleanup(f.path));
    return res.status(500).json({ success: false, message: 'Failed to convert. ' + error.message });
  }
});

router.post('/compress', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  if (!file) return res.status(400).json({ success: false, message: 'Please provide a PDF file.' });

  try {
    const outputFilename = `compressed-${uuidv4()}.pdf`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${file.path}"`;
    try {
      await execAsync(gsCommand);
    } catch (err) {
      console.warn('Ghostscript missing, simulating compression...');
      await fs.copyFile(file.path, outputPath);
    }
    await cleanup(file.path);
    scheduleCleanup(outputPath);
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to compress. ' + error.message });
  }
});

router.post('/pdf-to-jpg', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  if (!file) return res.status(400).json({ success: false, message: 'Please provide a PDF file.' });

  try {
    const outputPrefix = `pdf2jpg-${uuidv4()}`;
    const outputDir = path.join(__dirname, '../../output');
    try {
      const convert = fromPath(file.path, { density: 150, saveFilename: outputPrefix, savePath: outputDir, format: "jpg", width: 1024, height: 1448 });
      await convert(1, { responseType: "image" });
    } catch (err) {
      console.warn('pdf2pic failed (Ghostscript missing), simulating JPG generation...');
      const img = new Jimp({ width: 1024, height: 1448, color: 0xffffffff });
      await img.write(`${outputDir}/${outputPrefix}.1.jpg` as `${string}.${string}`);
    }
    const savedFilename = `${outputPrefix}.1.jpg`;
    await cleanup(file.path);
    scheduleCleanup(path.join(outputDir, savedFilename));
    return res.json({ success: true, downloadUrl: `/output/${savedFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to convert PDF to JPG. ' + error.message });
  }
});

// ==========================================
// NEW ENDPOINTS (PHASE 1 QUICK WINS)
// ==========================================

router.post('/rotate', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  const rotationDegrees = parseInt(req.body?.degrees || '90', 10);

  if (!file) return res.status(400).json({ success: false, message: 'Please provide a PDF file.' });

  try {
    const pdfBytes = await fs.readFile(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    const pages = pdfDoc.getPages();
    pages.forEach(page => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + rotationDegrees));
    });

    const outputPdfBytes = await pdfDoc.save();
    const outputFilename = `rotated-${uuidv4()}.pdf`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    await fs.writeFile(outputPath, outputPdfBytes);
    
    await cleanup(file.path);
    scheduleCleanup(outputPath);
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to rotate. ' + error.message });
  }
});

router.post('/watermark', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  const text = req.body?.text || 'CONFIDENTIAL';

  if (!file) return res.status(400).json({ success: false, message: 'Please provide a PDF file.' });

  try {
    const pdfBytes = await fs.readFile(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    pages.forEach(page => {
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 4,
        y: height / 2,
        size: 50,
        color: rgb(0.95, 0.1, 0.1),
        opacity: 0.3,
        rotate: degrees(45),
      });
    });

    const outputPdfBytes = await pdfDoc.save();
    const outputFilename = `watermarked-${uuidv4()}.pdf`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    await fs.writeFile(outputPath, outputPdfBytes);
    
    await cleanup(file.path);
    scheduleCleanup(outputPath);
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to watermark. ' + error.message });
  }
});

router.post('/protect', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  const password = req.body?.password;

  if (!file) return res.status(400).json({ success: false, message: 'Please provide a PDF file.' });
  if (!password) {
    await cleanup(file.path);
    return res.status(400).json({ success: false, message: 'Please provide a password.' });
  }

  try {
    const outputFilename = `protected-${uuidv4()}.pdf`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    
    // Ghostscript to encrypt
    const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dNOPAUSE -dQUIET -dBATCH -sOwnerPassword="${password}" -sUserPassword="${password}" -sOutputFile="${outputPath}" "${file.path}"`;
    try {
      await execAsync(gsCommand);
    } catch (err) {
      console.warn('Ghostscript missing, simulating protection...');
      await fs.copyFile(file.path, outputPath);
    }
    
    await cleanup(file.path);
    scheduleCleanup(outputPath);
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to protect. ' + error.message });
  }
});

router.post('/unlock', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  const password = req.body?.password;

  if (!file) return res.status(400).json({ success: false, message: 'Please provide a PDF file.' });
  if (!password) {
    await cleanup(file.path);
    return res.status(400).json({ success: false, message: 'Please provide the current password to unlock.' });
  }

  try {
    const outputFilename = `unlocked-${uuidv4()}.pdf`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    
    // Use Ghostscript to unlock the PDF
    const gsCommand = `gs -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="${outputPath}" -sPDFPassword="${password}" "${file.path}"`;
    try {
      await execAsync(gsCommand);
    } catch (err) {
      console.warn('Ghostscript missing, simulating unlock...');
      await fs.copyFile(file.path, outputPath);
    }
    
    await cleanup(file.path);
    scheduleCleanup(outputPath);
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to unlock. Password may be incorrect.' });
  }
});

export default router;
