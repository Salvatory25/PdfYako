import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dropzone from '../../components/Dropzone';
import ProcessingState from '../../components/ProcessingState';
import { uploadAndProcess } from '../../services/api';

const CropImage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [cropData, setCropData] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  const handleCrop = async () => {
    if (files.length === 0) {
      setErrorMessage('Please select an image file to crop.');
      setStatus('error');
      return;
    }

    if (cropData.width <= 0 || cropData.height <= 0) {
      setErrorMessage('Please enter a valid width and height greater than 0.');
      setStatus('error');
      return;
    }

    try {
      setStatus('uploading');
      setProgress(0);

      const response = await uploadAndProcess('/image/crop', [files[0]], (p) => {
        setProgress(p);
        if (p === 100) {
          setStatus('processing');
        }
      }, {
        x: cropData.x.toString(),
        y: cropData.y.toString(),
        width: cropData.width.toString(),
        height: cropData.height.toString()
      });

      setDownloadUrl(response.url);
      setStatus('success');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to crop image.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus('idle');
    setProgress(0);
    setDownloadUrl(null);
    setErrorMessage('');
    setCropData({ x: 0, y: 0, width: 0, height: 0 });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCropData({
      ...cropData,
      [e.target.name]: parseInt(e.target.value) || 0
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Tools
        </Link>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Crop Image</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Cut out a specific section of your image by providing coordinates.
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
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">X Offset (px)</label>
                    <input 
                      type="number" name="x" value={cropData.x} onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Y Offset (px)</label>
                    <input 
                      type="number" name="y" value={cropData.y} onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Width (px)</label>
                    <input 
                      type="number" name="width" value={cropData.width} onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Height (px)</label>
                    <input 
                      type="number" name="height" value={cropData.height} onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleCrop}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center"
                  >
                    Crop Image
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

export default CropImage;
