import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dropzone from '../../components/Dropzone';
import ProcessingState from '../../components/ProcessingState';
import { uploadAndProcess } from '../../services/api';

const ResizeImage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  const handleResize = async () => {
    if (files.length === 0) {
      setErrorMessage('Please select an image file to resize.');
      setStatus('error');
      return;
    }

    if (!width && !height) {
      setErrorMessage('Please enter either a width or a height.');
      setStatus('error');
      return;
    }

    try {
      setStatus('uploading');
      setProgress(0);
      
      const payload: any = {};
      if (width) payload.width = width;
      if (height) payload.height = height;

      const response = await uploadAndProcess('/image/resize', [files[0]], (p) => {
        setProgress(p);
        if (p === 100) {
          setStatus('processing');
        }
      }, payload);

      setDownloadUrl(response.url);
      setStatus('success');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to resize image.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus('idle');
    setProgress(0);
    setDownloadUrl(null);
    setErrorMessage('');
    setWidth('');
    setHeight('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Tools
        </Link>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Resize Image</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Change the dimensions of your image. Enter width, height, or both.
          </p>
        </div>

        {status === 'idle' && (
          <div className="glass-card rounded-2xl p-8 shadow-sm">
            <Dropzone 
              onFileSelect={setFiles} 
              accept="image/*" 
              multiple={false}
            />
            
            {files.length > 0 && (
              <div className="mt-8">
                <div className="mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Width (px)
                    </label>
                    <input 
                      type="number"
                      placeholder="Auto"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Height (px)
                    </label>
                    <input 
                      type="number"
                      placeholder="Auto"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <p className="text-xs text-slate-500 col-span-2">Leave one blank to maintain aspect ratio.</p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleResize}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center"
                  >
                    Resize Image
                  </button>
                </div>
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

export default ResizeImage;
