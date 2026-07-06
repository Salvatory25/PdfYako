import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dropzone from '../../components/Dropzone';
import ProcessingState from '../../components/ProcessingState';
import { uploadAndProcess } from '../../services/api';

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
      <div className="max-w-3xl mx-auto">
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
      </div>
    </div>
  );
};

export default JpgToPdf;
