import request from 'supertest';
import app from '../index';
import { createDummyPdf, createDummyJpg } from './dummy-pdf';
import fs from 'fs/promises';

// Mock child_process and pdf2pic to prevent actual gs/gm calls
jest.mock('child_process', () => {
  return {
    exec: (cmd: string, callback: any) => {
      // Simulate creating the output file since the endpoint expects it
      // Extract the outputFile from the command
      const match = cmd.match(/-sOutputFile="([^"]+)"/);
      if (match && match[1]) {
        // Create an empty dummy file at the output path so the route succeeds
        require('fs').writeFileSync(match[1], 'mock-gs-output');
      }
      callback(null, { stdout: 'mock success', stderr: '' });
    }
  };
});

jest.mock('pdf2pic', () => {
  return {
    fromPath: (path: string, options: any) => {
      return async (page: number, config: any) => {
        // Create the dummy JPG output file
        const savedFilename = `${options.saveFilename}.${page}.jpg`;
        const outputPath = require('path').join(options.savePath, savedFilename);
        require('fs').writeFileSync(outputPath, 'mock-jpg-data');
        return { path: outputPath };
      };
    }
  };
});

describe('Pdfyako API', () => {
  it('should return 200 for health check', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
  });

  describe('PDF Routes (Core)', () => {
    let dummyPdfPath: string;
    let dummyPdfPath2: string;
    let dummyJpgPath: string;

    beforeAll(async () => {
      dummyPdfPath = await createDummyPdf('Test PDF 1');
      dummyPdfPath2 = await createDummyPdf('Test PDF 2');
      dummyJpgPath = await createDummyJpg();
    });

    afterAll(async () => {
      try { await fs.unlink(dummyPdfPath); } catch (e) {}
      try { await fs.unlink(dummyPdfPath2); } catch (e) {}
      try { await fs.unlink(dummyJpgPath); } catch (e) {}
    });

    it('POST /api/pdf/merge - should merge two PDFs', async () => {
      const res = await request(app)
        .post('/api/pdf/merge')
        .attach('files', dummyPdfPath)
        .attach('files', dummyPdfPath2);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('POST /api/pdf/split - should split a PDF', async () => {
      const res = await request(app)
        .post('/api/pdf/split')
        .attach('files', dummyPdfPath);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('POST /api/pdf/rotate - should rotate a PDF', async () => {
      const res = await request(app)
        .post('/api/pdf/rotate')
        .field('degrees', '90')
        .attach('files', dummyPdfPath);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('POST /api/pdf/watermark - should watermark a PDF', async () => {
      const res = await request(app)
        .post('/api/pdf/watermark')
        .field('text', 'CONFIDENTIAL')
        .attach('files', dummyPdfPath);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('POST /api/pdf/compress - should compress a PDF using ghostscript (mocked)', async () => {
      const res = await request(app)
        .post('/api/pdf/compress')
        .attach('files', dummyPdfPath);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('POST /api/pdf/protect - should encrypt a PDF using ghostscript (mocked)', async () => {
      const res = await request(app)
        .post('/api/pdf/protect')
        .field('password', 'secret')
        .attach('files', dummyPdfPath);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('POST /api/pdf/unlock - should unlock a PDF using ghostscript (mocked)', async () => {
      const res = await request(app)
        .post('/api/pdf/unlock')
        .field('password', 'secret')
        .attach('files', dummyPdfPath);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('POST /api/pdf/jpg-to-pdf - should convert image to PDF', async () => {
      const res = await request(app)
        .post('/api/pdf/jpg-to-pdf')
        .attach('files', dummyJpgPath);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
    
    it('POST /api/pdf/pdf-to-jpg - should convert pdf to jpg (mocked)', async () => {
      const res = await request(app)
        .post('/api/pdf/pdf-to-jpg')
        .attach('files', dummyPdfPath);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('PDF Routes (Simulated)', () => {
    let dummyPdfPath: string;

    beforeAll(async () => {
      dummyPdfPath = await createDummyPdf('Simulated Text Data');
    });

    afterAll(async () => {
      try { await fs.unlink(dummyPdfPath); } catch (e) {}
    });

    it('POST /api/pdf/pdf-to-word', async () => {
      const res = await request(app)
        .post('/api/pdf/pdf-to-word')
        .attach('files', dummyPdfPath);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    }, 15000);

    it('POST /api/pdf/pdf-to-excel', async () => {
      const res = await request(app)
        .post('/api/pdf/pdf-to-excel')
        .attach('files', dummyPdfPath);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
