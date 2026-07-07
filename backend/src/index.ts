import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { startCleanupCron } from './utils/cleanup';

const app = express();
const PORT = process.env.PORT || 3001;

// Global Security Headers
app.use(helmet());

// Rate Limiting (30 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/', limiter);

// CORS Restrictions
const allowedOrigins = [
  'https://pdfyako.com',
  'https://www.pdfyako.com',
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    // For a strict production API, you might want to reject !origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

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
  // Start the background cron job for file cleanup
  startCleanupCron();
  console.log('[Cron] Cleanup service initialized.');

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
