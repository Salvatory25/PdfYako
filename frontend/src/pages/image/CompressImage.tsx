import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dropzone from '../../components/Dropzone';
import ProcessingState from '../../components/ProcessingState';
import { uploadAndProcess } from '../../services/api';

const CompressImage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [quality, setQuality] = useState(60);

  const handleCompress = async () => {
    if (files.length === 0) {
      setErrorMessage('Please select an image file to compress.');
      setStatus('error');
      return;
    }

    try {
      setStatus('uploading');
      setProgress(0);
      
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('quality', quality.toString());

      const response = await uploadAndProcess('/image/compress', [files[0]], (p) => {
        setProgress(p);
        if (p === 100) {
          setStatus('processing');
        }
      }, { quality: quality.toString() });

      setDownloadUrl(response.url);
      setStatus('success');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to compress image.');
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
          <h1 className="text-3xl font-bold tracking-tight mb-4">Compress Image</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Reduce the file size of your images without losing quality.
          </p>
        </div>

        {status === 'idle' && (
          <div className="glass-card rounded-2xl p-8 shadow-sm">
            <Dropzone 
              onFileSelect={setFiles} 
              accept="image/jpeg, image/png, image/webp" 
              multiple={false}
            />
            
            {files.length > 0 && (
              <div className="mt-8">
                <div className="mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex justify-between">
                    <span>Quality</span>
                    <span>{quality}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={quality} 
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-600"
                  />
                  <p className="text-xs text-slate-500 mt-2">Lower quality means smaller file size.</p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleCompress}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center"
                  >
                    Compress Image
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

export default CompressImage;
