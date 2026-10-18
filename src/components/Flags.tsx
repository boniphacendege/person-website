import React from 'react';

export const BritishFlag: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg
    viewBox="0 0 60 30"
    className={`${className} rounded-xs shadow-xs shrink-0 overflow-hidden inline-block align-middle`}
    aria-label="British Flag"
  >
    <clipPath id="uk-clip-s">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <clipPath id="uk-clip-t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
    </clipPath>
    <g clipPath="url(#uk-clip-s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-clip-t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

export const TanzaniaFlag: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg
    viewBox="0 0 48 32"
    className={`${className} rounded-xs shadow-xs shrink-0 overflow-hidden inline-block align-middle`}
    aria-label="Tanzania Flag"
  >
    {/* Green upper triangle */}
    <polygon points="0,0 48,0 0,32" fill="#1eb53a" />
    {/* Blue lower triangle */}
    <polygon points="48,0 48,32 0,32" fill="#00a3dd" />
    {/* Yellow/Gold border for diagonal stripe */}
    <polygon points="0,32 0,26 39,0 48,0 48,6 9,32" fill="#fcd116" />
    {/* Black diagonal stripe */}
    <polygon points="0,32 0,28 42,0 48,0 48,4 6,32" fill="#000000" />
  </svg>
);
