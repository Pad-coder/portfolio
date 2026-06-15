import React from 'react';

const SyntaxButterfly = ({ index, type, depthClass, refs }) => {
  return (
    <div 
      ref={el => refs.bugs.current[index] = el} 
      className={`absolute flex items-center justify-center will-change-transform pointer-events-none transition-opacity duration-1000 text-lime-400 ${depthClass}`}
    >
      <svg viewBox="0 0 100 100" className="w-12 h-12 overflow-visible">
         <rect x="48" y="45" width="4" height="10" rx="2" fill="currentColor" className="drop-shadow-[0_0_8px_currentColor]" />
         
         <g ref={el => refs.wingL.current[index] = el} style={{ transformOrigin: '50px 50px', willChange: 'transform' }}>
            {type === 0 && <path d="M 45 40 L 20 50 L 45 60 Z" fill="rgba(163,230,53,0.15)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
            {type === 1 && <path d="M 45 35 C 25 35, 25 50, 15 50 C 25 50, 25 65, 45 65 Z" fill="rgba(163,230,53,0.15)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
            {type === 2 && <path d="M 45 35 L 20 35 L 20 65 L 45 65 Z" fill="rgba(163,230,53,0.15)" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />}
            {type === 3 && <path d="M 45 30 Q 15 50 45 70 Z" fill="rgba(163,230,53,0.15)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
         </g>
         
         <g ref={el => refs.wingR.current[index] = el} style={{ transformOrigin: '50px 50px', willChange: 'transform' }}>
            {type === 0 && <path d="M 55 40 L 80 50 L 55 60 Z" fill="rgba(163,230,53,0.15)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
            {type === 1 && <path d="M 55 35 C 75 35, 75 50, 85 50 C 75 50, 75 65, 55 65 Z" fill="rgba(163,230,53,0.15)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
            {type === 2 && <path d="M 55 35 L 80 35 L 80 65 L 55 65 Z" fill="rgba(163,230,53,0.15)" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />}
            {type === 3 && <path d="M 55 30 Q 85 50 55 70 Z" fill="rgba(163,230,53,0.15)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
         </g>
      </svg>
    </div>
  );
};

export default SyntaxButterfly;