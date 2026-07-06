import React, { useState } from 'react';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dropzone from '../../components/Dropzone';
import ProcessingState from '../../components/ProcessingState';
import { uploadAndProcess } from '../../services/api';

const RotatePdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [degrees, setDegrees] = useState('90');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleProcess = async () => {
    if (files.length === 0) {
      setErrorMessage('Please select a PDF file to rotate.');
      setStatus('error');
      return;
    }

    try {
      setStatus('uploading');
      setProgress(0);
      
      const response = await uploadAndProcess('/pdf/rotate', files, (p) => {
        setProgress(p);
        if (p === 100) setStatus('processing');
      }, { degrees });

      setDownloadUrl(response.url);
      setStatus('success');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to rotate PDF.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setFiles([]);
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
            <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white">
              <RotateCw className="h-6 w-6" />
            </div>
            Rotate PDF
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Rotate your PDFs the way you need them. Select angle below.
          </p>
        </div>

        {status === 'idle' && (
          <div className="glass-card rounded-3xl p-8 shadow-sm">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Rotation Angle</label>
              <select 
                value={degrees} 
                onChange={(e) => setDegrees(e.target.value)}
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="90">90 Degrees Clockwise</option>
                <option value="180">180 Degrees (Upside Down)</option>
                <option value="-90">90 Degrees Counter-Clockwise</option>
              </select>
            </div>
            <Dropzone 
              onFileSelect={(selected) => setFiles(selected)} 
              accept="application/pdf"
              maxFiles={1}
            />
            {files.length > 0 && (
              <button 
                onClick={handleProcess}
                className="w-full mt-6 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
              >
                Rotate PDF
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

export default RotatePdf;
