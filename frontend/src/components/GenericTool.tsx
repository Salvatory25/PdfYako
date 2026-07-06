import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dropzone from './Dropzone';
import ProcessingState from './ProcessingState';
import { uploadAndProcess } from '../services/api';

interface GenericToolProps {
  title: string;
  description: string;
  icon: React.ElementType;
  colorClass: string;
  apiEndpoint: string;
  accept?: string;
  maxFiles?: number;
  requiresTextOutput?: boolean;
  extraInput?: {
    type: 'text' | 'password' | 'url';
    label: string;
    placeholder: string;
    key: string;
    defaultValue?: string;
  };
}

const GenericTool: React.FC<GenericToolProps> = ({
  title,
  description,
  icon: Icon,
  colorClass,
  apiEndpoint,
  accept = "application/pdf",
  maxFiles = 1,
  requiresTextOutput = false,
  extraInput
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [extraValue, setExtraValue] = useState(extraInput?.defaultValue || '');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputText, setOutputText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleProcess = async () => {
    // Determine if files are strictly required based on tool type
    if (extraInput?.type !== 'url' && files.length === 0) {
      setErrorMessage(`Please select a ${accept.includes('image') ? 'image' : 'file'}.`);
      setStatus('error');
      return;
    }
    if (extraInput && !extraValue && extraInput.type !== 'url') {
      setErrorMessage(`Please provide ${extraInput.label}.`);
      setStatus('error');
      return;
    }

    try {
      setStatus('uploading');
      setProgress(0);
      
      const additionalData: Record<string, string> = {};
      if (extraInput) {
        additionalData[extraInput.key] = extraValue;
      }

      const response = await uploadAndProcess(apiEndpoint, files, (p) => {
        setProgress(p);
        if (p === 100) setStatus('processing');
      }, additionalData);

      if (requiresTextOutput && (response.text || response.summary)) {
        setOutputText(response.text || response.summary);
      } else {
        setDownloadUrl(response.url);
      }
      
      setStatus('success');
    } catch (error: any) {
      setErrorMessage(error.message || `Failed to process.`);
      setStatus('error');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setExtraValue(extraInput?.defaultValue || '');
    setStatus('idle');
    setDownloadUrl(null);
    setOutputText(null);
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
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${colorClass}`}>
              <Icon className="h-6 w-6" />
            </div>
            {title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {description}
          </p>
        </div>

        {status === 'idle' && (
          <div className="glass-card rounded-3xl p-8 shadow-sm">
            {extraInput && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">{extraInput.label}</label>
                <input 
                  type={extraInput.type === 'url' ? 'url' : extraInput.type === 'password' ? 'password' : 'text'}
                  value={extraValue}
                  onChange={(e) => setExtraValue(e.target.value)}
                  placeholder={extraInput.placeholder}
                  className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            )}
            
            {extraInput?.type !== 'url' && (
              <Dropzone 
                onFileSelect={(selected) => setFiles(selected)} 
                accept={accept}
                maxFiles={maxFiles}
              />
            )}
            
            {(files.length > 0 || extraInput?.type === 'url') && (
              <button 
                onClick={handleProcess}
                className={`w-full mt-6 py-4 text-white font-semibold rounded-xl transition-colors shadow-sm ${colorClass.replace('bg-', 'bg-').replace('-500', '-600')} hover:opacity-90`}
              >
                Process File
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

        {status === 'success' && outputText && (
          <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-4 text-lg">Output:</h3>
            <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 font-mono text-sm overflow-auto max-h-96">
              {outputText}
            </div>
            <button 
              onClick={handleReset}
              className="mt-6 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Process Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericTool;
