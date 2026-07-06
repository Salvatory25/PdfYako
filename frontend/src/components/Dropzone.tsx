import React, { useCallback, useState } from 'react';
import { UploadCloud, File, X } from 'lucide-react';

interface DropzoneProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  multiple?: boolean;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect, accept = '*/*', maxFiles = 10, multiple = false }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const chosenFiles = Array.from(e.target.files);
      processFiles(chosenFiles);
    }
  };

  const processFiles = (files: File[]) => {
    // Very basic filter/limit logic
    let newFiles = [...selectedFiles, ...files];
    if (!multiple) {
      newFiles = [newFiles[0]];
    } else if (newFiles.length > maxFiles) {
      newFiles = newFiles.slice(0, maxFiles);
    }
    
    setSelectedFiles(newFiles);
    onFileSelect(newFiles);
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = selectedFiles.filter((_, idx) => idx !== indexToRemove);
    setSelectedFiles(updatedFiles);
    onFileSelect(updatedFiles);
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all duration-300 ${
          isDragActive 
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10' 
            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
            isDragActive ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
          }`}>
            <UploadCloud className="h-8 w-8" />
          </div>
          <p className="text-lg font-semibold mb-2">
            Drag & Drop your files here
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            or click to browse from your device
          </p>
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Selected Files</h4>
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 overflow-hidden">
                <File className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                <span className="text-sm truncate font-medium">{file.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <button 
                onClick={() => removeFile(idx)}
                className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                title="Remove file"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropzone;
