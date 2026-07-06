import React, { useState } from 'react';
import { ArrowLeft, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dropzone from '../../components/Dropzone';
import ProcessingState from '../../components/ProcessingState';
import { uploadAndProcess } from '../../services/api';

const WatermarkPdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('CONFIDENTIAL');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleProcess = async () => {
    if (files.length === 0) {
      setErrorMessage('Please select a PDF file.');
      setStatus('error');
      return;
    }

    try {
      setStatus('uploading');
      setProgress(0);
      
      const response = await uploadAndProcess('/pdf/watermark', files, (p) => {
        setProgress(p);
        if (p === 100) setStatus('processing');
      }, { text });

      setDownloadUrl(response.url);
      setStatus('success');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to watermark PDF.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setText('CONFIDENTIAL');
    setStatus('idle');
    setDownloadUrl(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to home
        </Link>
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-pink-400 flex items-center justify-center text-white">
              <PenTool className="h-6 w-6" />
            </div>
            Watermark PDF
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Stamp text over your PDF.
          </p>
        </div>

        {status === 'idle' && (
          <div className="glass-card rounded-3xl p-8 shadow-sm">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Watermark Text</label>
              <input 
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="CONFIDENTIAL"
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <Dropzone 
              onFileSelect={(selected) => setFiles(selected)} 
              accept="application/pdf"
              maxFiles={1}
            />
            {files.length > 0 && (
              <button 
                onClick={handleProcess}
                className="w-full mt-6 py-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-colors shadow-sm"
              >
                Add Watermark
              </button>
            )}
          </div>
        )}

        <ProcessingState 
          status={status} 
          progress={progress} 
          message={errorMessage} 
          onReset={handleReset}
          downloadUrl={downloadUrl}
        />
      </div>
    </div>
  );
};

export default WatermarkPdf;
