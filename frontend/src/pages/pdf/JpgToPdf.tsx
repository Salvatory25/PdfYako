import React, { useState } from 'react';
import { ArrowLeft, Image as ImageIcon, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dropzone from '../../components/Dropzone';
import ProcessingState from '../../components/ProcessingState';
import { uploadAndProcess } from '../../services/api';
import SEO from '../../components/SEO';

const JpgToPdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleConvert = async () => {
    if (files.length === 0) {
      setErrorMessage('Please select at least one JPG or PNG file.');
      setStatus('error');
      return;
    }

    try {
      setStatus('uploading');
      setProgress(0);
      
      const response = await uploadAndProcess('/pdf/jpg-to-pdf', files, (p) => {
        setProgress(p);
        if (p === 100) {
          setStatus('processing');
        }
      });

      setDownloadUrl(response.url);
      setStatus('success');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to convert images to PDF.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus('idle');
    setProgress(0);
    setDownloadUrl(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="JPG to PDF Converter - Convert Images Online Free" 
        description="Convert JPG, PNG, and GIF images to PDF documents instantly. Fast, secure, and 100% free image to PDF converter with no watermarks." 
        url="https://pdfyako.com/tools/jpg-to-pdf"
        keywords="jpg to pdf, png to pdf, convert image to pdf, picture to pdf, free jpg to pdf"
      />
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Tools
        </Link>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-4">JPG to PDF</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Convert your JPG or PNG images into a PDF document.
          </p>
        </div>

        {status === 'idle' && (
          <div className="glass-card rounded-2xl p-8 shadow-sm">
            <Dropzone 
              onFileSelect={setFiles} 
              accept="image/jpeg, image/png" 
              multiple={true}
              maxFiles={20}
            />
            
            {files.length > 0 && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleConvert}
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center"
                >
                  Convert to PDF
                </button>
              </div>
            )}
          </div>
        )}

        <ProcessingState 
          status={status} 
          progress={progress} 
          message={status === 'error' ? errorMessage : undefined}
          downloadUrl={downloadUrl}
          onReset={handleReset}
        />

        {/* SEO Text Content */}
        {status === 'idle' && (
          <div className="mt-16 text-slate-600 dark:text-slate-400">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">How to Convert JPG to PDF Online</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">1. Upload Images</h3>
                <p className="text-sm">Select one or multiple JPG or PNG images from your computer or mobile device to begin the conversion.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">2. Convert Instantly</h3>
                <p className="text-sm">Click "Convert to PDF" and our servers will instantly transform your images into a single, high-quality PDF document.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">3. Download PDF</h3>
                <p className="text-sm">Download your finished PDF. As always, your uploaded images are securely and permanently deleted from our servers.</p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">The Best Image to PDF Converter</h2>
              <p className="mb-4">
                Pdfyako's JPG to PDF tool allows you to convert images into professional PDF documents without downloading any software. It supports popular formats like JPG, JPEG, and PNG.
              </p>
              <p>
                Our tool is completely free and places no watermarks on your final documents. Whether you need to compile a photo album, submit receipts, or share visual designs, converting them to a PDF ensures they are universally readable on any device.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JpgToPdf;
