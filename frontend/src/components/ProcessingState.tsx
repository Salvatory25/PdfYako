import React from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ProcessingStateProps {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  progress?: number;
  message?: string;
  onReset?: () => void;
  downloadUrl?: string | null;
}

const ProcessingState: React.FC<ProcessingStateProps> = ({ 
  status, 
  progress = 0, 
  message, 
  onReset,
  downloadUrl 
}) => {
  if (status === 'idle') return null;

  return (
    <div className="w-full mt-8 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-center transition-all duration-300">
      {(status === 'uploading' || status === 'processing') && (
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {status === 'uploading' ? 'Uploading files...' : 'Processing document...'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{message || 'Please wait'}</p>
          
          <div className="w-full max-w-xs bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Task Complete!</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{message || 'Your file is ready to download.'}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            {downloadUrl && (
              <a 
                href={downloadUrl} 
                download
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center"
              >
                Download File
              </a>
            )}
            {onReset && (
              <button 
                onClick={onReset}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 font-medium rounded-xl transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm">{message || 'An error occurred during processing.'}</p>
          
          {onReset && (
            <button 
              onClick={onReset}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 font-medium rounded-xl transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProcessingState;
