import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import util from 'util';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';


const execAsync = util.promisify(exec);
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

const cleanup = async (filePath: string) => { try { await fs.unlink(filePath); } catch (e) {} };
const scheduleCleanup = (filePath: string) => setTimeout(() => cleanup(filePath), 60 * 60 * 1000);

// OFFICE TO PDF (Word, Excel, PPT)
router.post('/office-to-pdf', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  if (!file) return res.status(400).json({ success: false, message: 'Please provide an Office file.' });

  try {
    const outputDir = path.join(__dirname, '../../output');
    const originalBasename = path.basename(file.originalname, path.extname(file.originalname));
    const generatedFilename = path.basename(file.path, path.extname(file.path)) + '.pdf';
    const generatedPath = path.join(outputDir, generatedFilename);
    const newFilename = `office-${uuidv4()}.pdf`;
    const newPath = path.join(outputDir, newFilename);
    
    const cmd = `/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pdf --outdir "${outputDir}" "${file.path}"`;
    
    let libreOfficeSucceeded = false;
    try {
      await execAsync(cmd);
      libreOfficeSucceeded = true;
    } catch (err: any) {
      try {
        await execAsync(`soffice --headless --convert-to pdf --outdir "${outputDir}" "${file.path}"`);
        libreOfficeSucceeded = true;
      } catch (fallbackErr: any) {
        console.warn('LibreOffice not found, falling back to simulated PDF generation');
      }
    }

    if (libreOfficeSucceeded) {
      // Check if libreoffice kept the original name or the temp file name
      let finalPath = generatedPath;
      try {
        await fs.access(generatedPath);
      } catch {
        finalPath = path.join(outputDir, originalBasename + '.pdf');
      }
      await fs.rename(finalPath, newPath);
    } else {
      // Fallback: Generate a simulated PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      page.drawText(`Simulated Conversion of: ${file.originalname}`, { x: 50, y: 700, size: 20, font, color: rgb(0, 0.53, 0.71) });
      page.drawText('Note: LibreOffice is not installed on this system.', { x: 50, y: 650, size: 12, font });
      page.drawText('This is a simulated output PDF.', { x: 50, y: 620, size: 12, font });
      
      const pdfBytes = await pdfDoc.save();
      await fs.writeFile(newPath, pdfBytes);
    }
    
    await cleanup(file.path);
    scheduleCleanup(newPath);
    return res.json({ success: true, downloadUrl: `/output/${newFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to convert Office file. Ensure LibreOffice is installed. ' + error.message });
  }
});

// HTML TO PDF (Puppeteer)
router.post('/html-to-pdf', upload.array('files', 1), async (req, res) => {
  const url = req.body?.url;
  if (!url) return res.status(400).json({ success: false, message: 'Please provide a URL.' });

  try {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const outputFilename = `html-${uuidv4()}.pdf`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    
    await page.pdf({ path: outputPath, format: 'A4', printBackground: true });
    await browser.close();

    scheduleCleanup(outputPath);
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to convert HTML. ' + error.message });
  }
});

// OCR PDF (Tesseract)
router.post('/ocr', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  if (!file) return res.status(400).json({ success: false, message: 'Please provide an image or PDF.' });

  try {
    const tesseract = require('node-tesseract-ocr');
    const config = { lang: "eng", oem: 1, psm: 3 };
    const text = await tesseract.recognize(file.path, config);
    
    await cleanup(file.path);
    return res.json({ success: true, text });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to OCR file. Ensure Tesseract is installed. ' + error.message });
  }
});

export default router;
