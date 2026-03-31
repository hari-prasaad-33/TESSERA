import React from 'react';

const IllustrationPlaceholder = ({ description, aspectRatio = '16/9', className = '' }) => (
  <div
    className={`relative w-full rounded-2xl border-2 border-dashed border-white/10 bg-tessera-void/50 overflow-hidden ${className}`}
    style={{ aspectRatio }}
  >
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4">
        <svg className="w-5 h-5 text-tessera-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M6.75 7.5h.008v.008H6.75V7.5z" />
        </svg>
      </div>
      <span className="font-mono text-[10px] text-tessera-dim/60 tracking-wider uppercase max-w-xs leading-relaxed">
        {description}
      </span>
    </div>
  </div>
);

export default IllustrationPlaceholder;
