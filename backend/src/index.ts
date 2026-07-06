import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static output files
app.use('/output', express.static(path.join(__dirname, '../output')));

// Ensure upload and output directories exist
const uploadsDir = path.join(__dirname, '../uploads');
const outputDir = path.join(__dirname, '../output');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

import pdfRoutes from './routes/pdf';
import advancedRoutes from './routes/advanced';
import officeRoutes from './routes/office';
import simulatedRoutes from './routes/simulated';
import imageRoutes from './routes/image';

// Routes
app.use('/api/pdf', pdfRoutes);
app.use('/api/pdf', advancedRoutes);
app.use('/api/pdf', officeRoutes);
app.use('/api/pdf', simulatedRoutes);
app.use('/api/image', imageRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'success', message: 'Pdfyako API is running', version: '1.0.0' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
