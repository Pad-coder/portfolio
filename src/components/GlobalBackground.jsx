import React from 'react';
import DigitalUniverse from './DigitalUniverse.jsx';

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none w-full h-full bg-[#050505] overflow-hidden">
      
      {/* 1. The Master Canvas Engine (Stars, Syntax, Particles) */}
      <div className="absolute inset-0 opacity-90">
        <DigitalUniverse />
      </div>

      {/* 2. Global Ambient Lighting (These were causing the horizontal scroll) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-lime-500/10 blur-[150px] rounded-full mix-blend-screen" />
      <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[60vh] bg-lime-400/5 blur-[150px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[15%] w-[60vw] h-[50vh] bg-lime-600/5 blur-[150px] rounded-full mix-blend-screen" />

      {/* 3. Global Premium Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="globalNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#globalNoise)" />
        </svg>
      </div>

      {/* 4. Global Vignette & Edge Masking */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_100%)] opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] opacity-60" />
      
    </div>
  );
}