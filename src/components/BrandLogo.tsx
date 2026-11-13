import React from 'react';

interface BrandLogoProps {
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 64 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      aria-label="TUKKU-CREATION Logo"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="tukkuGradPreview" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="55%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>
        <linearGradient id="tukkuInnerPreview" x1="16" y1="16" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width="72"
        height="72"
        rx="22"
        fill="#130B24"
        stroke="url(#tukkuGradPreview)"
        strokeWidth="2.5"
      />
      <path d="M23 26H57V34H44V56H36V34H23V26Z" fill="url(#tukkuInnerPreview)" />
      <path
        d="M52 44C52 38.4772 56.4772 34 62 34V40C59.7909 40 58 41.7909 58 44C58 46.2091 59.7909 48 62 48V54C56.4772 54 52 49.5228 52 44Z"
        fill="url(#tukkuGradPreview)"
      />
    </svg>
  );
};
