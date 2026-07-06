import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const router = Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });
const cleanup = async (filePath: string) => { try { await fs.unlink(filePath); } catch (e) {} };
const scheduleCleanup = (filePath: string) => setTimeout(() => cleanup(filePath), 60 * 60 * 1000);

// Helper to extract text from PDF
const extractPdfText = async (filePath: string) => {
  try {
    const pdf = require('pdf-parse');
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text || '';
  } catch (e) {
    return 'Could not parse text from this PDF.';
  }
};

// PDF TO WORD (Real .docx generation)
router.post('/pdf-to-word', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  if (!file) return res.status(400).json({ success: false, message: 'Please provide a PDF file.' });

  try {
    const text = await extractPdfText(file.path);
    
    // Generate real docx
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: text.split('\n').map((line: string) => new Paragraph({
                    children: [new TextRun(line)],
                })),
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);
    
    const outputFilename = `word-${uuidv4()}.docx`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    await fs.writeFile(outputPath, buffer);
    
    await cleanup(file.path);
    scheduleCleanup(outputPath);
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to convert PDF to Word. ' + error.message });
  }
});

// PDF TO EXCEL (CSV Generation)
router.post('/pdf-to-excel', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  if (!file) return res.status(400).json({ success: false, message: 'Please provide a PDF.' });

  try {
    const text = await extractPdfText(file.path);
    
    // Parse tabular data (basic approach: split by multiple spaces or tabs into columns)
    const csvContent = text.split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .map((line: string) => {
        // Split by 2 or more spaces, or tabs, to guess columns
        const columns = line.split(/\s{2,}|\t/);
        return columns.map((col: string) => `"${col.replace(/"/g, '""')}"`).join(',');
      })
      .join('\n');
    
    const outputFilename = `excel-${uuidv4()}.csv`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    await fs.writeFile(outputPath, csvContent);
    
    await cleanup(file.path);
    scheduleCleanup(outputPath);
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to convert PDF to Excel. ' + error.message });
  }
});

// PDF TO HTML
router.post('/pdf-to-html', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  if (!file) return res.status(400).json({ success: false, message: 'Please provide a PDF.' });

  try {
    const text = await extractPdfText(file.path);
    
    // Basic HTML formatting
    const htmlContent = `<!DOCTYPE html>
<html>
<head><title>Converted PDF</title></head>
<body>
${text.split('\n').map((line: string) => `<p>${line}</p>`).join('\n')}
</body>
</html>`;
    
    const outputFilename = `html-${uuidv4()}.html`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    await fs.writeFile(outputPath, htmlContent);
    
    await cleanup(file.path);
    scheduleCleanup(outputPath);
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to convert to HTML. ' + error.message });
  }
});

// PDF TO POWERPOINT (Text slides generation)
router.post('/pdf-to-powerpoint', upload.array('files', 1), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const file = files && files.length > 0 ? files[0] : undefined;
  if (!file) return res.status(400).json({ success: false, message: 'Please provide a PDF.' });

  try {
    const text = await extractPdfText(file.path);
    
    // Create a basic text representation of slides
    const slidesContent = text.split('\n\n').map((block: string, idx: number) => `--- Slide ${idx + 1} ---\n${block}\n`).join('\n');
    
    const outputFilename = `presentation-${uuidv4()}.txt`;
    const outputPath = path.join(__dirname, '../../output', outputFilename);
    await fs.writeFile(outputPath, slidesContent);
    
    await cleanup(file.path);
    scheduleCleanup(outputPath);
    return res.json({ success: true, downloadUrl: `/output/${outputFilename}` });
  } catch (error: any) {
    await cleanup(file.path);
    return res.status(500).json({ success: false, message: 'Failed to convert PDF to PowerPoint format. ' + error.message });
  }
});

export default router;
