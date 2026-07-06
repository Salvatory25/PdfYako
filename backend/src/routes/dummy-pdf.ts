import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const createDummyPdf = async (text: string = 'Dummy PDF Content'): Promise<string> => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  
  const page = pdfDoc.addPage([500, 500]);
  const { width, height } = page.getSize();
  
  page.drawText(text, {
    x: 50,
    y: height - 100,
    size: 30,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });
  
  const pdfBytes = await pdfDoc.save();
  const filePath = path.join(__dirname, `../../uploads/dummy-${uuidv4()}.pdf`);
  await fs.writeFile(filePath, pdfBytes);
  
  return filePath;
};

export const createDummyJpg = async (): Promise<string> => {
  // A tiny 1x1 pixel PNG (base64)
  const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  const filePath = path.join(__dirname, `../../uploads/dummy-${uuidv4()}.png`);
  await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'));
  return filePath;
};
