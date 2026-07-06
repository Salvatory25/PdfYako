import React from 'react';

const LoadingFallback: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold animate-pulse shadow-lg">
          P
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">Loading tool...</p>
      </div>
    </div>
  );
};

export default LoadingFallback;
