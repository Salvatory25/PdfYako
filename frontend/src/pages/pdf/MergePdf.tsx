import React, { useState } from 'react';
import { ArrowLeft, Layers, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dropzone from '../../components/Dropzone';
import ProcessingState from '../../components/ProcessingState';
import { uploadAndProcess } from '../../services/api';
import SEO from '../../components/SEO';

const MergePdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleMerge = async () => {
    if (files.length < 2) {
      setErrorMessage('Please select at least 2 PDF files to merge.');
      setStatus('error');
      return;
    }

    try {
      setStatus('uploading');
      setProgress(0);
      
      const response = await uploadAndProcess('/pdf/merge', files, (p) => {
        setProgress(p);
        if (p === 100) {
          setStatus('processing');
        }
      });

      setDownloadUrl(response.url);
      setStatus('success');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to merge PDFs.');
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
        title="Merge PDF Files Online for Free - Pdfyako" 
        description="Combine multiple PDF files into a single document seamlessly and securely. No watermarks, no limits, completely free online PDF merger." 
        url="https://pdfyako.com/tools/merge-pdf"
        keywords="merge pdf, combine pdf, join pdf, merge pdf free, online pdf merger"
      />
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Tools
        </Link>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Merge PDF</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Combine multiple PDF files into a single document seamlessly.
          </p>
        </div>

        {status === 'idle' && (
          <div className="glass-card rounded-2xl p-8 shadow-sm">
            <Dropzone 
              onFileSelect={setFiles} 
              accept="application/pdf" 
              multiple={true}
              maxFiles={20}
            />
            
            {files.length > 0 && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleMerge}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center"
                >
                  Merge PDFs
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">How to Merge PDF Files Online</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">1. Select Files</h3>
                <p className="text-sm">Upload two or more PDF files from your device. You can drag and drop them directly into the upload area.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">2. Merge Instantly</h3>
                <p className="text-sm">Click the merge button. Our cloud servers will combine your documents in a matter of seconds.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">3. Download Safely</h3>
                <p className="text-sm">Download your merged PDF. All uploaded files are automatically deleted from our servers for your privacy.</p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">The Best Free PDF Merger</h2>
              <p className="mb-4">
                Pdfyako provides a seamless, fast, and secure way to combine PDF files online. Whether you are merging invoices, assembling a report, or organizing personal documents, our tool is designed to be the easiest PDF merger available.
              </p>
              <p>
                There are absolutely no watermarks, no file size limits, and no registration required. Your privacy is our top priority, which is why all files are permanently deleted from our servers immediately after processing.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MergePdf;
