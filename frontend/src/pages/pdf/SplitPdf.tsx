import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dropzone from '../../components/Dropzone';
import ProcessingState from '../../components/ProcessingState';
import { uploadAndProcess } from '../../services/api';

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
      <div className="max-w-3xl mx-auto">
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
      </div>
    </div>
  );
};

export default SplitPdf;
