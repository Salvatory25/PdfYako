import React, { useState } from 'react';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dropzone from '../../components/Dropzone';

const RemoveBackground = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleProcess = async () => {
    if (files.length === 0) return;

    try {
      setStatus('processing');
      setProgress(0);
      setProgressMessage('Loading AI models...');
      setErrorMessage('');

      // Create a URL for the selected file
      const imageUrl = URL.createObjectURL(files[0]);

      // Configure background removal
      const config = {
        progress: (key: string, current: number, total: number) => {
          // Calculate percentage based on loading the model and processing
          const percent = Math.round((current / total) * 100);
          setProgress(percent);
          setProgressMessage(`Processing: ${key} (${percent}%)`);
        }
      };

      // Dynamically import the heavy ML library only when needed to prevent bundle crashes!
      const imgly = await import('@imgly/background-removal');
      const removeBg = imgly.default || imgly.removeBackground;

      // Run background removal locally in the browser!
      const blob = await removeBg(imageUrl, config);
      
      // Create a download URL for the result
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setStatus('success');
      
    } catch (error: any) {
      console.error('BG Removal error:', error);
      setErrorMessage(error.message || 'Failed to remove background.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus('idle');
    setProgress(0);
    setProgressMessage('');
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }
    setResultUrl(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Tools
        </Link>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
            AI Background Remover
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Automatically remove the background from any image. <br className="hidden sm:block"/>
            100% free, private, and runs entirely in your browser.
          </p>
        </div>

        {status === 'idle' && (
          <div className="glass-card rounded-2xl p-8 shadow-sm max-w-3xl mx-auto">
            <Dropzone 
              onFileSelect={setFiles} 
              accept="image/png, image/jpeg, image/webp" 
              multiple={false}
            />
            
            {files.length > 0 && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleProcess}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Remove Background
                </button>
              </div>
            )}
          </div>
        )}

        {status === 'processing' && (
          <div className="glass-card rounded-2xl p-12 shadow-sm text-center max-w-xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-xl font-bold mb-2">Erasing Background...</h3>
            <p className="text-slate-500 mb-6">{progressMessage}</p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Note: The first time you use this, it will download AI models (~40MB).
            </p>
          </div>
        )}

        {status === 'success' && resultUrl && (
          <div className="glass-card rounded-2xl p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold mb-4">Original Image</h3>
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                  <img src={URL.createObjectURL(files[0])} alt="Original" className="w-full h-auto" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-indigo-500">Transparent Result</h3>
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-checkered">
                  {/* Using a custom checkered background class in CSS to show transparency */}
                  <div className="w-full h-full relative" style={{ backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/ENCE8OQpZDD+TyQO1HAKg2QOAAAXvA0E8wG+kAAAAABJRU5ErkJggg==")' }}>
                    <img src={resultUrl} alt="Result" className="w-full h-auto relative z-10" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <a 
                href={resultUrl}
                download={`nobg-${files[0].name.split('.')[0]}.png`}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PNG
              </a>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-all"
              >
                Process Another
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="glass-card rounded-2xl p-8 shadow-sm text-center max-w-xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Error Processing Image</h3>
            <p className="text-slate-500 mb-6">{errorMessage}</p>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
