import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import ThemeToggle from './components/ThemeToggle.tsx';
import PageTransition from './components/PageTransition.tsx';
import LoadingFallback from './components/LoadingFallback.tsx';

// Lazy loaded routes
const Home = lazy(() => import('./pages/Home.tsx'));
const MergePdf = lazy(() => import('./pages/pdf/MergePdf.tsx'));
const SplitPdf = lazy(() => import('./pages/pdf/SplitPdf.tsx'));
const JpgToPdf = lazy(() => import('./pages/pdf/JpgToPdf.tsx'));
const QrGenerator = lazy(() => import('./pages/qr/QrGenerator.tsx'));
const BarcodeGenerator = lazy(() => import('./pages/barcode/BarcodeGenerator.tsx'));

const RotatePdf = lazy(() => import('./pages/pdf/RotatePdf.tsx'));
const WatermarkPdf = lazy(() => import('./pages/pdf/WatermarkPdf.tsx'));

// Named exports from MegaSuite need special handling for lazy
const ScanToPdf = lazy(() => import('./pages/pdf/MegaSuite.tsx').then(m => ({ default: m.ScanToPdf })));
const PageNumbers = lazy(() => import('./pages/pdf/MegaSuite.tsx').then(m => ({ default: m.PageNumbers })));
const WordToPdf = lazy(() => import('./pages/pdf/MegaSuite.tsx').then(m => ({ default: m.WordToPdf })));
const PdfToWord = lazy(() => import('./pages/pdf/MegaSuite.tsx').then(m => ({ default: m.PdfToWord })));
const PdfToExcel = lazy(() => import('./pages/pdf/MegaSuite.tsx').then(m => ({ default: m.PdfToExcel })));
const PdfToHtml = lazy(() => import('./pages/pdf/MegaSuite.tsx').then(m => ({ default: m.PdfToHtml })));

const CompressImage = lazy(() => import('./pages/image/CompressImage.tsx'));
const ConvertImage = lazy(() => import('./pages/image/ConvertImage.tsx'));
const CropImage = lazy(() => import('./pages/image/CropImage.tsx'));
const ResizeImage = lazy(() => import('./pages/image/ResizeImage.tsx'));

// We need a wrapper to use useLocation inside Router
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          
          {/* Phase 0 Tools */}
          <Route path="/tools/merge-pdf" element={<PageTransition><MergePdf /></PageTransition>} />
          <Route path="/tools/split-pdf" element={<PageTransition><SplitPdf /></PageTransition>} />
          <Route path="/tools/jpg-to-pdf" element={<PageTransition><JpgToPdf /></PageTransition>} />
          <Route path="/tools/qr" element={<PageTransition><QrGenerator /></PageTransition>} />
          <Route path="/tools/barcode" element={<PageTransition><BarcodeGenerator /></PageTransition>} />

          {/* Phase 1 Tools */}
          <Route path="/tools/rotate-pdf" element={<PageTransition><RotatePdf /></PageTransition>} />
          <Route path="/tools/watermark" element={<PageTransition><WatermarkPdf /></PageTransition>} />

          {/* Phase 2 Mega Suite Tools */}
          <Route path="/tools/scan-to-pdf" element={<PageTransition><ScanToPdf /></PageTransition>} />
          <Route path="/tools/page-numbers" element={<PageTransition><PageNumbers /></PageTransition>} />
          <Route path="/tools/word-to-pdf" element={<PageTransition><WordToPdf /></PageTransition>} />
          <Route path="/tools/pdf-to-word" element={<PageTransition><PdfToWord /></PageTransition>} />
          <Route path="/tools/pdf-to-excel" element={<PageTransition><PdfToExcel /></PageTransition>} />
          <Route path="/tools/pdf-to-html" element={<PageTransition><PdfToHtml /></PageTransition>} />

          {/* Image Tools */}
          <Route path="/tools/compress-image" element={<PageTransition><CompressImage /></PageTransition>} />
          <Route path="/tools/convert-image" element={<PageTransition><ConvertImage /></PageTransition>} />
          <Route path="/tools/crop-image" element={<PageTransition><CropImage /></PageTransition>} />
          <Route path="/tools/resize-image" element={<PageTransition><ResizeImage /></PageTransition>} />

        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-x-hidden">
        <ThemeToggle />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
