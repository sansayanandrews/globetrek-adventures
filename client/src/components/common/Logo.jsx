import React from 'react';
import { Compass } from 'lucide-react';

export default function Logo({ size = 'md', variant = 'light', showSubtitle = true }) {
  // Sizes: sm, md, lg
  const iconSizes = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-11 h-11 rounded-2xl',
    lg: 'w-14 h-14 rounded-2xl',
  };

  const compassSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const isDark = variant === 'dark';

  return (
    <div className="flex items-center gap-3 group select-none">
      {/* Blue & White Icon Badge */}
      <div
        className={`${iconSizes[size]} bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 border border-blue-400/30 group-hover:scale-105 transition-all shrink-0`}
      >
        <Compass className={`${compassSizes[size]} text-white drop-shadow-sm`} />
      </div>

      {/* Brand Wordmark */}
      <div>
        <div className={`${textSizes[size]} font-bold font-display tracking-tight flex items-center gap-1.5 leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <span>GlobeTrek</span>
          <span className="text-blue-600 font-extrabold">Adventures</span>
        </div>
        {showSubtitle && (
          <span
            className={`block text-[10px] font-bold tracking-wider uppercase mt-1 ${
              isDark ? 'text-blue-300/80' : 'text-blue-700/70'
            }`}
          >
            Negombo &bull; Sri Lanka
          </span>
        )}
      </div>
    </div>
  );
}
