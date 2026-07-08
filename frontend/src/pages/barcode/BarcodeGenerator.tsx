import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import bwipjs from 'bwip-js';
import AdBanner from '../../components/AdBanner';

type BarcodeType = 'code128' | 'ean13' | 'upca' | 'code39';

const BarcodeGenerator = () => {
  const [barcodeType, setBarcodeType] = useState<BarcodeType>('code128');
  const [inputValue, setInputValue] = useState('PDFYAKO123');
  const [includeText, setIncludeText] = useState(true);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [scale, setScale] = useState(3);
  const [height, setHeight] = useState(15);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState('');

  const barcodeOptions = [
    { value: 'code128', label: 'Code 128 (Alphanumeric, universally used)' },
    { value: 'ean13', label: 'EAN-13 (Retail products worldwide)' },
    { value: 'upca', label: 'UPC-A (Retail products in US/Canada)' },
    { value: 'code39', label: 'Code 39 (Basic alphanumeric)' },
  ];

  useEffect(() => {
    generateBarcode();
  }, [barcodeType, inputValue, includeText, fgColor, bgColor, scale, height]);

  const generateBarcode = () => {
    if (!canvasRef.current) return;
    setError('');

    try {
      // Clear previous canvas
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      if (!inputValue) {
        return; // Don't attempt to generate if empty
      }

      bwipjs.toCanvas(canvas, {
        bcid: barcodeType,
        text: inputValue,
        scale: scale,
        height: height,
        includetext: includeText,
        textxalign: 'center',
        barcolor: fgColor.replace('#', ''),
        backgroundcolor: bgColor.replace('#', ''),
        textcolor: fgColor.replace('#', '')
      });
    } catch (e: any) {
      setError(e.message || 'Invalid input for this barcode type.');
    }
  };

  const handleDownload = () => {
    if (error || !inputValue) return;
    
    if (canvasRef.current) {
      const pngUrl = canvasRef.current.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `pdfyako-barcode-${barcodeType}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Tools
        </Link>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Barcode Generator</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Generate 1D barcodes instantly for retail, logistics, and inventory.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 shadow-sm space-y-6">
            
            <div>
              <label className="block text-sm font-medium mb-2">Barcode Type</label>
              <select 
                value={barcodeType}
                onChange={(e) => setBarcodeType(e.target.value as BarcodeType)}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {barcodeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data Value</label>
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'} focus:ring-2 outline-none`}
                placeholder="Enter data to encode"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <label className="flex items-center space-x-2 cursor-pointer mt-4">
              <input 
                type="checkbox" 
                checked={includeText}
                onChange={(e) => setIncludeText(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium">Show human-readable text below barcode</span>
            </label>

            {/* Customization Options */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Foreground Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-10 w-20 rounded cursor-pointer"
                  />
                  <span className="text-sm text-slate-500 uppercase">{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Background Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-10 w-20 rounded cursor-pointer"
                  />
                  <span className="text-sm text-slate-500 uppercase">{bgColor}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Scale (Size)</label>
                <input 
                  type="range" 
                  min="1" max="5" step="1"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-right text-xs text-slate-500">{scale}x</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Height</label>
                <input 
                  type="range" 
                  min="5" max="30" step="1"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-right text-xs text-slate-500">{height} units</div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 shadow-sm sticky top-24 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-6 w-full text-center">Live Preview</h3>
              
              <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-100 flex items-center justify-center min-h-[200px] w-full overflow-hidden">
                <canvas ref={canvasRef} id="barcode-canvas"></canvas>
              </div>

              <div className="w-full mt-6 space-y-3">
                <button 
                  onClick={handleDownload}
                  disabled={!!error || !inputValue}
                  className={`w-full py-3 font-medium rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
                    error || !inputValue 
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <Download className="h-4 w-4" />
                  Download PNG
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ad Placement */}
        <AdBanner slot="barcode-generator-bottom" />
      </div>
    </div>
  );
};

export default BarcodeGenerator;
