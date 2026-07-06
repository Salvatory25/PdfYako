import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home.tsx';
import MergePdf from './pages/pdf/MergePdf.tsx';
import SplitPdf from './pages/pdf/SplitPdf.tsx';
import JpgToPdf from './pages/pdf/JpgToPdf.tsx';
import QrGenerator from './pages/qr/QrGenerator.tsx';
import BarcodeGenerator from './pages/barcode/BarcodeGenerator.tsx';
import ThemeToggle from './components/ThemeToggle.tsx';
import PageTransition from './components/PageTransition.tsx';

import RotatePdf from './pages/pdf/RotatePdf.tsx';
import WatermarkPdf from './pages/pdf/WatermarkPdf.tsx';
import {
  ScanToPdf,
  PageNumbers,
  PdfToWord, PdfToExcel, PdfToHtml
} from './pages/pdf/MegaSuite.tsx';

import CompressImage from './pages/image/CompressImage.tsx';
import ConvertImage from './pages/image/ConvertImage.tsx';
import CropImage from './pages/image/CropImage.tsx';
import ResizeImage from './pages/image/ResizeImage.tsx';

// We need a wrapper to use useLocation inside Router
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
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
        
        <Route path="/tools/pdf-to-word" element={<PageTransition><PdfToWord /></PageTransition>} />
        <Route path="/tools/pdf-to-excel" element={<PageTransition><PdfToExcel /></PageTransition>} />
        <Route path="/tools/pdf-to-html" element={<PageTransition><PdfToHtml /></PageTransition>} />

        {/* Image Tools */}
        <Route path="/tools/compress-image" element={<PageTransition><CompressImage /></PageTransition>} />
        <Route path="/tools/convert-image" element={<PageTransition><ConvertImage /></PageTransition>} />
        <Route path="/tools/crop-image" element={<PageTransition><CropImage /></PageTransition>} />
        <Route path="/tools/resize-image" element={<PageTransition><ResizeImage /></PageTransition>} />

      </Routes>
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
