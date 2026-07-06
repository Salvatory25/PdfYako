import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dropzone from '../../components/Dropzone';
import ProcessingState from '../../components/ProcessingState';
import { uploadAndProcess } from '../../services/api';

const ConvertImage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [format, setFormat] = useState('jpeg');

  const handleConvert = async () => {
    if (files.length === 0) {
      setErrorMessage('Please select an image file to convert.');
      setStatus('error');
      return;
    }

    try {
      setStatus('uploading');
      setProgress(0);
      
      const response = await uploadAndProcess('/image/convert', [files[0]], (p) => {
        setProgress(p);
        if (p === 100) {
          setStatus('processing');
        }
      }, { format });

      setDownloadUrl(response.url);
      setStatus('success');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to convert image.');
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
          <h1 className="text-3xl font-bold tracking-tight mb-4">Convert Image</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Convert your images to JPG, PNG, or BMP instantly.
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
                <div className="mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Convert to Format
                  </label>
                  <div className="flex gap-4">
                    {['jpeg', 'png', 'bmp'].map(fmt => (
                      <label key={fmt} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="format" 
                          value={fmt}
                          checked={format === fmt}
                          onChange={(e) => setFormat(e.target.value)}
                          className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium uppercase text-slate-700 dark:text-slate-300">{fmt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleConvert}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center"
                  >
                    Convert Image
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

export default ConvertImage;
