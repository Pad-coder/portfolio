import React from 'react';
import { useRobotPhysics } from '../hooks/useRobotPhysics';
import SyntaxButterfly from './SyntaxButterfly';

const RobotCompanion = ({ isVisible }) => {
  const { refs, physics } = useRobotPhysics();

  const getDepthClass = (depth) => {
    if (depth === 0) return "scale-[0.4] blur-[4px] opacity-20 z-0"; // Background Layer
    if (depth === 1) return "scale-[0.7] blur-[1.5px] opacity-40 z-0"; // Midground Layer
    return "scale-100 opacity-80 drop-shadow-[0_0_12px_rgba(163,230,53,0.4)] z-0"; // Foreground Layer
  };

  return (
    <div className={`flex relative h-full items-center justify-center transition-all duration-1000 ease-out delay-500 mt-16 lg:mt-0 scale-75 sm:scale-90 lg:scale-100 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
      <div ref={refs.visual} className="relative w-full max-w-lg flex items-center justify-center" style={{ perspective: "1000px" }}>
        
        {/* Glow */}
        <div ref={refs.robotGlow} className="absolute inset-0 bg-[radial-gradient(circle,rgba(163,230,53,0.3)_0%,transparent_60%)] transition-opacity duration-300 will-change-transform" style={{ opacity: 0.15 }} />

        {/* Dynamic Syntax Swarm mapped via Physics State */}
        {physics.bugs.map((bug, i) => {
          if (!bug.isActive) return null;
          return <SyntaxButterfly key={i} index={i} type={bug.shape} depthClass={getDepthClass(bug.depth)} refs={refs} />;
        })}

        {/* The Premium Robot Character */}
        <div ref={refs.robot} className="relative z-10 will-change-transform">
          
          <div ref={refs.bubble} className="absolute -top-16 left-1/2 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide opacity-0 pointer-events-none z-50 shadow-[0_10px_30px_rgba(163,230,53,0.2)] whitespace-nowrap" style={{ willChange: 'transform, opacity', transform: 'translate3d(-50%, 10px, 0) scale3d(0.9, 0.9, 1)', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            Hello!
          </div>

          <div ref={refs.catchRipple} className="absolute inset-0 rounded-full bg-lime-400/20 border border-lime-400/50 opacity-0 pointer-events-none z-0" style={{ transform: 'scale3d(0.5, 0.5, 1)' }} />

          <div className="absolute top-1/2 -left-4 w-6 h-14 bg-gradient-to-r from-[#050505] to-[#141414] border border-white/10 rounded-l-full shadow-lg" ref={refs.leftEar} style={{ transformOrigin: 'right center' }}>
            <div className="absolute top-1/2 left-2 w-1.5 h-4 bg-[#84cc16] rounded-full -translate-y-1/2 shadow-[0_0_8px_rgba(163,230,53,0.5)]" />
          </div>
          <div className="absolute top-1/2 -right-4 w-6 h-14 bg-gradient-to-l from-[#050505] to-[#141414] border border-white/10 rounded-r-full shadow-lg" ref={refs.rightEar} style={{ transformOrigin: 'left center' }}>
             <div className="absolute top-1/2 right-2 w-1.5 h-4 bg-[#84cc16] rounded-full -translate-y-1/2 shadow-[0_0_8px_rgba(163,230,53,0.5)]" />
          </div>

          <div className="w-[340px] h-[300px] bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] border border-white/10 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col items-center justify-center p-6 z-10">
            <div className="absolute top-1.5 left-8 right-8 h-6 bg-gradient-to-b from-white/[0.12] to-transparent rounded-full pointer-events-none z-20" />
            <div className="w-full h-full bg-[#030303] rounded-[2.5rem] border border-white/5 shadow-[inset_0_10px_30px_rgba(0,0,0,0.9)] relative flex flex-col items-center justify-center overflow-hidden">
              
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-0" />
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                  <filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter>
                  <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
                </svg>
              </div>

              <div ref={refs.leftCheek} className="absolute top-32 left-8 w-20 h-16 bg-[radial-gradient(circle,rgba(163,230,53,0.5)_0%,transparent_70%)] opacity-0 will-change-transform z-0" />
              <div ref={refs.rightCheek} className="absolute top-32 right-8 w-20 h-16 bg-[radial-gradient(circle,rgba(163,230,53,0.5)_0%,transparent_70%)] opacity-0 will-change-transform z-0" />

              <div className="flex gap-16 z-10 relative mt-4">
                <div className="w-14 h-16 bg-gradient-to-b from-[#000] to-[#0a0a0a] rounded-full shadow-[inset_0_5px_15px_rgba(0,0,0,1)] border border-white/5 relative flex items-center justify-center overflow-hidden">
                  <div ref={refs.leftEye} className="w-8 h-10 bg-[#a3e635] rounded-full shadow-[0_0_15px_rgba(163,230,53,0.4)] will-change-transform relative">
                    <div ref={refs.highlightL} className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-white/90 rounded-full shadow-[0_0_4px_rgba(255,255,255,0.8)] will-change-transform" />
                  </div>
                </div>
                <div className="w-14 h-16 bg-gradient-to-b from-[#000] to-[#0a0a0a] rounded-full shadow-[inset_0_5px_15px_rgba(0,0,0,1)] border border-white/5 relative flex items-center justify-center overflow-hidden">
                  <div ref={refs.rightEye} className="w-8 h-10 bg-[#a3e635] rounded-full shadow-[0_0_15px_rgba(163,230,53,0.4)] will-change-transform relative">
                    <div ref={refs.highlightR} className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-white/90 rounded-full shadow-[0_0_4px_rgba(255,255,255,0.8)] will-change-transform" />
                  </div>
                </div>
              </div>

              <div className="z-10 mt-6 relative">
                <svg viewBox="0 0 120 60" className="w-24 h-12 overflow-visible">
                  <path ref={refs.mouth} d="M 25 35 Q 60 43 95 35" stroke="#a3e635" strokeWidth="6" fill="none" strokeLinecap="round" style={{ filter: 'drop-shadow(0px 2px 4px rgba(163, 230, 53, 0.4))' }} />
                </svg>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotCompanion;