import React, { useState } from 'react';
import { ArrowLeft, Scissors, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dropzone from '../../components/Dropzone';
import ProcessingState from '../../components/ProcessingState';
import { uploadAndProcess } from '../../services/api';
import SEO from '../../components/SEO';

const SplitPdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSplit = async () => {
    if (files.length === 0) {
      setErrorMessage('Please select a PDF file to split.');
      setStatus('error');
      return;
    }

    try {
      setStatus('uploading');
      setProgress(0);
      
      const response = await uploadAndProcess('/pdf/split', files, (p) => {
        setProgress(p);
        if (p === 100) {
          setStatus('processing');
        }
      });

      setDownloadUrl(response.url);
      setStatus('success');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to split PDF.');
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
        title="Split PDF Files Online for Free - Pdfyako" 
        description="Extract pages from your PDF or split PDF documents instantly and securely. No watermarks, completely free online PDF splitter." 
        url="https://pdfyako.com/tools/split-pdf"
        keywords="split pdf, extract pdf pages, separate pdf, cut pdf, free pdf splitter"
      />
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Tools
        </Link>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Split PDF</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Extract the first page of your PDF easily.
          </p>
        </div>

        {status === 'idle' && (
          <div className="glass-card rounded-2xl p-8 shadow-sm">
            <Dropzone 
              onFileSelect={setFiles} 
              accept="application/pdf" 
              multiple={false}
              maxFiles={1}
            />
            
            {files.length > 0 && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSplit}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center"
                >
                  Split PDF
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">How to Split PDF Files Online</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Scissors className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">1. Upload PDF</h3>
                <p className="text-sm">Select or drag and drop a PDF file from your computer or mobile device into the upload box.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">2. Split Instantly</h3>
                <p className="text-sm">Click the split button. Our engine will quickly process your file and extract the requested pages.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">3. Download Securely</h3>
                <p className="text-sm">Download your newly separated PDF file. The original file is securely deleted to protect your privacy.</p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">The Easiest Way to Extract PDF Pages</h2>
              <p className="mb-4">
                Pdfyako allows you to quickly split PDF files or extract specific pages without downloading any complicated software. It works entirely in your browser and on our secure cloud servers, meaning you can separate PDF files on Mac, Windows, iOS, and Android.
              </p>
              <p>
                As always, our tools are 100% free to use. We don't add any watermarks to your documents, and we don't ask you to register for an account. Simply upload, split, and download!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplitPdf;
