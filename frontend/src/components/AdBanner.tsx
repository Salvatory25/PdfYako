import React from 'react';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  slot, 
  format = 'auto', 
  responsive = true 
}) => {
  // GOOGLE ADSENSE CONFIGURATION
  // Once approved by Google AdSense, set this to true and populate your client ID below.
  const IS_ADSENSE_ACTIVE = false;
  const GOOGLE_CLIENT_ID = 'ca-pub-7163685583800302'; // Replace with your Google Publisher ID

  if (IS_ADSENSE_ACTIVE) {
    return (
      <div className="w-full flex justify-center my-4 overflow-hidden min-h-[90px]">
        {/* Google AdSense Code */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={GOOGLE_CLIENT_ID}
          data-ad-slot={slot || '1234567890'} // Replace with your Ad Slot ID
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    );
  }

  // Beautiful Placeholder Mode
  return (
    <div className="w-full flex justify-center my-6">
      <div className="w-full max-w-4xl glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 transition-all duration-300 hover:border-indigo-400/50 dark:hover:border-indigo-500/50 min-h-[90px] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500 dark:text-indigo-400 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block text-[10px] tracking-widest text-slate-400 dark:text-slate-500 font-semibold uppercase">
              Advertisement
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Premium Sponsor slot available
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
            Clean & non-intrusive Ad Zone
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
