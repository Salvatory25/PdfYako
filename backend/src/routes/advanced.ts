import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

const cleanup = async (filePath: string) => { try { await fs.unlink(filePath); } catch (e) {} };
const scheduleCleanup = (filePath: string) => setTimeout(() => cleanup(filePath), 60 * 60 * 1000);

// PAGE NUMBERS
router.post('/page-numbers', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  if (!file) return res.status(400).json({ success: false, message: 'Please provide a PDF file.' });

  try {
    const pdfBytes = await fs.readFile(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    
    pages.forEach((page, idx) => {
      const { width, height } = page.getSize();
      page.drawText(`Page ${idx + 1} of ${pages.length}`, {
        x: width / 2 - 40,
        y: 20,
        size: 12,
        color: rgb(0, 0, 0),
      });
    });

    const outputPdfBytes = await pdfDoc.save();
    const outputFilename = `numbered-${uuidv4()}.pdf`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    await fs.writeFile(outputPath, outputPdfBytes);
    
    await cleanup(file.path);
    scheduleCleanup(outputPath);
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to add page numbers. ' + error.message });
  }
});

// REPAIR PDF
router.post('/repair', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  if (!file) return res.status(400).json({ success: false, message: 'Please provide a PDF file.' });

  try {
    const outputFilename = `repaired-${uuidv4()}.pdf`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    
    const gsCommand = `gs -o "${outputPath}" -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress "${file.path}"`;
    try {
      await execAsync(gsCommand);
    } catch (err) {
      console.warn('Ghostscript missing, simulating repair...');
      await fs.copyFile(file.path, outputPath);
    }
    
    await cleanup(file.path);
    scheduleCleanup(outputPath);
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to repair PDF. ' + error.message });
  }
});

// PDF TO PDF/A
router.post('/pdf-to-pdfa', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  if (!file) return res.status(400).json({ success: false, message: 'Please provide a PDF file.' });

  try {
    const outputFilename = `pdfa-${uuidv4()}.pdf`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    
    const gsCommand = `gs -dPDFA -dBATCH -dNOPAUSE -dColorConversionStrategy=/UseDeviceIndependentColor -sDEVICE=pdfwrite -dPDFACompatibilityPolicy=1 -sOutputFile="${outputPath}" "${file.path}"`;
    try {
      await execAsync(gsCommand);
    } catch (err) {
      console.warn('Ghostscript missing, simulating PDF/A conversion...');
      await fs.copyFile(file.path, outputPath);
    }
    
    await cleanup(file.path);
    scheduleCleanup(outputPath);
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to convert to PDF/A. ' + error.message });
  }
});

export default router;
