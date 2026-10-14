import React from 'react';

interface CityNexusLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const CityNexusLogo: React.FC<CityNexusLogoProps> = ({ 
  size = 'md', 
  showSubtitle = true,
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-3xl',
    xl: 'text-5xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* City Nexus Geometric Brand Mark */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 shadow-lg shadow-cyan-500/25 p-1.5 border border-cyan-400/30`}>
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Interlocking Hexagonal Nexus Rings */}
          <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="3 2" />
          
          {/* Central Nexus Core */}
          <polygon 
            points="20,8 30,14 30,26 20,32 10,26 10,14" 
            stroke="#ffffff" 
            strokeWidth="2" 
            fill="rgba(6, 182, 212, 0.4)" 
          />
          
          {/* Interconnecting Node Links */}
          <line x1="20" y1="8" x2="20" y2="32" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="14" x2="30" y2="26" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="26" x2="30" y2="14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          
          {/* Orbital Nodes */}
          <circle cx="20" cy="20" r="3.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="20" cy="8" r="2" fill="#a5f3fc" />
          <circle cx="30" cy="14" r="2" fill="#a5f3fc" />
          <circle cx="30" cy="26" r="2" fill="#a5f3fc" />
          <circle cx="20" cy="32" r="2" fill="#a5f3fc" />
          <circle cx="10" cy="26" r="2" fill="#a5f3fc" />
          <circle cx="10" cy="14" r="2" fill="#a5f3fc" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className={`font-extrabold tracking-tight text-white leading-tight ${titleSizes[size]}`}>
          <span>CITY</span>{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
            NEXUS
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-slate-400 font-medium tracking-wider uppercase font-mono ${subtitleSizes[size]}`}>
            Autonomous Urban Operating System
          </span>
        )}
      </div>
    </div>
  );
};
