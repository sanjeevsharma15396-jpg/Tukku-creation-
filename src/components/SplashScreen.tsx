import React, { useEffect, useState } from 'react';
import { BrandLogo } from './BrandLogo';

interface SplashScreenProps {
  appName: string;
  tagline: string;
  subtext: string;
  enterLabel: string;
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  appName,
  tagline,
  subtext,
  enterLabel,
  onFinish,
}) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 2350);

    const doneTimer = setTimeout(() => {
      onFinish();
    }, 2750);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinish]);

  const handleEarlyEnter = () => {
    setExiting(true);
    setTimeout(onFinish, 260);
  };

  return (
    <div
      className={`absolute inset-0 z-40 flex flex-col items-center justify-center px-6 bg-gradient-to-br from-[#06050A] via-[#170A2E] to-[#090612] transition-opacity duration-300 ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative w-48 h-48 flex items-center justify-center mb-7">
        <div className="absolute w-40 h-40 rounded-full bg-violet-600/20 blur-xl animate-aura-pulse" />
        <div className="absolute w-44 h-44 rounded-full border border-dashed border-violet-400/30 animate-spin-slow flex justify-center">
          <span className="w-2.5 h-2.5 -mt-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc]" />
        </div>
        <div className="absolute w-34 h-34 rounded-full border border-purple-400/35 animate-spin-reverse flex items-end justify-center">
          <span className="w-2 h-2 -mb-1 rounded-full bg-violet-500 shadow-[0_0_8px_#7c3aed]" />
        </div>
        <div className="relative z-10 transition-transform duration-500 scale-100">
          <BrandLogo size={88} />
        </div>
      </div>

      <div className="text-center space-y-2 max-w-[280px]">
        <h1 className="text-2xl font-extrabold tracking-[0.08em] text-[#F5F3FF]">
          {appName}
        </h1>
        <p className="text-sm font-semibold text-violet-300 tracking-wide">
          {tagline}
        </p>
        <p className="text-xs text-[#9C8EC0]">{subtext}</p>
      </div>

      <button
        type="button"
        onClick={handleEarlyEnter}
        className="absolute bottom-10 min-h-[44px] px-6 rounded-full border border-violet-400/25 bg-[#140E24]/80 text-violet-200 text-xs font-semibold hover:bg-violet-600/25 transition-colors cursor-pointer whitespace-nowrap"
      >
        {enterLabel}
      </button>
    </div>
  );
};
