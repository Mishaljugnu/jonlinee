import React from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';

interface LogoProps {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'icon-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  theme?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'horizontal',
  size = 'md',
  showSubtitle = true,
  theme = 'light',
}) => {
  const { lang } = useTranslation();
  const subtitleText = lang === 'fr' ? 'ACHETEZ MALIN, ACHETEZ EN LIGNE' : 'SHOP SMART, SHOP ONLINE';

  // Size metrics
  const iconDimensions = {
    sm: 34,
    md: 44,
    lg: 56,
    xl: 80,
  }[size];

  const textSizeClasses = {
    sm: { title: 'text-sm font-black', subtitle: 'text-[9px] tracking-wider' },
    md: { title: 'text-base font-black', subtitle: 'text-[10px] tracking-widest' },
    lg: { title: 'text-xl font-black', subtitle: 'text-xs tracking-widest' },
    xl: { title: 'text-3xl font-black', subtitle: 'text-sm tracking-widest' },
  }[size];

  const isDark = theme === 'dark';
  const primaryTextColor = isDark ? 'text-white' : 'text-[#171827]';
  const subtitleTextColor = isDark ? 'text-slate-400' : 'text-slate-500';

  const iconSvg = (
    <svg
      width={iconDimensions}
      height={iconDimensions}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-md transition-transform hover:scale-105"
      aria-label="J Online Shopping Brand Logo"
    >
      <defs>
        {/* Phone Gradient: Magenta to Royal Blue */}
        <linearGradient id="phoneGrad" x1="20" y1="10" x2="80" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="35%" stopColor="#a855f7" />
          <stop offset="80%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        {/* Hand Gradient: Royal Indigo to Deep Blue */}
        <linearGradient id="handGrad" x1="10" y1="50" x2="45" y2="105" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>

        {/* Speech Bubble Gradient */}
        <linearGradient id="bubbleGrad" x1="60" y1="15" x2="110" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="50%" stopColor="#d946ef" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>

        {/* 3D Drop Shadows */}
        <filter id="shadow3d" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.28" />
        </filter>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Main 3D Phone Body */}
      <g filter="url(#shadow3d)">
        <rect
          x="30"
          y="10"
          width="48"
          height="80"
          rx="14"
          fill="url(#phoneGrad)"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />

        {/* Phone Speaker & Camera detail */}
        <rect x="46" y="15" width="16" height="3.5" rx="1.75" fill="#ffffff" fillOpacity="0.6" />
        <circle cx="41" cy="16.75" r="1.5" fill="#ffffff" fillOpacity="0.6" />

        {/* Phone Screen Notch / Clock Graphic */}
        <circle cx="45" cy="38" r="8" stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.9" />
        <line x1="45" y1="38" x2="52" y2="33" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <rect x="58" y="36.5" width="8" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.8" />

        {/* Phone Home Bar Button */}
        <rect x="46" y="77" width="16" height="6" rx="3" fill="#ffffff" fillOpacity="0.75" />
      </g>

      {/* Stylized Holding Hand */}
      <g filter="url(#shadow3d)">
        {/* Thumb & Palm wrapping the phone */}
        <path
          d="M22 55 C22 47, 28 44, 33 50 L42 66 C44 69, 43 73, 40 76 L35 80 L35 96 C35 102, 22 102, 22 94 Z"
          fill="url(#handGrad)"
        />
        <path
          d="M22 62 C16 67, 16 75, 22 82 L24 84"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </g>

      {/* Shopping Bag Speech Bubble */}
      <g filter="url(#shadow3d)">
        {/* Circular Bubble with pointer tab */}
        <path
          d="M62 48 C62 30, 76 16, 94 16 C111 16, 122 30, 122 47 C122 64, 108 77, 91 77 C84 77, 75 79, 66 84 C68 77, 62 70, 62 62 Z"
          fill="url(#bubbleGrad)"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* White Shopping Bag in bubble */}
        <g transform="translate(77, 28)">
          {/* Bag Body */}
          <rect
            x="2"
            y="12"
            width="28"
            height="26"
            rx="4"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Bag Handles */}
          <path
            d="M9 13 V8 C9 4.5, 12 2, 16 2 C20 2, 23 4.5, 23 8 V13"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{iconSvg}</div>;
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {iconSvg}
        <div className="mt-2.5 flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className={`${primaryTextColor} font-black uppercase leading-tight tracking-tight ${textSizeClasses.title}`}>
              J ONLINE
            </span>
            <span className={`text-[#F47721] font-black uppercase leading-tight tracking-tight ${textSizeClasses.title}`}>
              SHOPPING
            </span>
          </div>
          {showSubtitle && (
            <span className={`${subtitleTextColor} font-bold uppercase ${textSizeClasses.subtitle}`}>
              {subtitleText}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default 'horizontal'
  return (
    <div className={`inline-flex items-center gap-2 sm:gap-3 ${className}`}>
      {iconSvg}
      <div className="flex flex-col text-left leading-tight">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className={`${primaryTextColor} font-black tracking-tight uppercase text-sm sm:text-lg lg:text-xl`}>
            J ONLINE
          </span>
          <span className="text-[#F47721] font-black tracking-tight uppercase text-sm sm:text-lg lg:text-xl">
            SHOPPING
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-[9px] sm:text-[10px] xl:text-[11px] font-bold uppercase tracking-wider hidden sm:block whitespace-nowrap ${subtitleTextColor}`}>
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
