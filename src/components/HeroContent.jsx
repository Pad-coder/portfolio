import React from 'react';

const HeroContent = ({ isVisible, scrollToSection }) => {
  return (
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-6">
    
      <div className={`transition-all duration-1000 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-8 hover:bg-white/[0.05] hover:border-white/20 transition-colors cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
          </span>
          <span className="text-[11px] font-semibold text-neutral-300 tracking-[0.15em] uppercase">
            Open for Freelance & Full-Time
          </span>
        </div>
      </div>

      <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] sm:leading-[1.1] transition-all duration-1000 ease-out delay-150 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
        Building{"  "}
        <br className="hidden lg:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-200">
          Digital Products
        </span>{" "}
        <br className="hidden lg:block" />
        That Matter.
      </h1>

      <p className={`text-base sm:text-lg lg:text-xl text-neutral-400 max-w-xl font-light leading-relaxed mb-10 transition-all duration-1000 ease-out delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
        I transform complex ideas into exceptional web products. Obsessed
        with clean architecture, blazing-fast performance, and building
        interfaces that users love.
      </p>

      <div className={`flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto transition-all duration-1000 ease-out delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
        <button
          onClick={() => scrollToSection("projects")}
          className="group relative w-full sm:w-auto px-8 py-4 bg-lime-400 text-neutral-950 font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(163,230,53,0.3)] active:scale-95"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Explore My Work
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
        </button>


      </div>

      <div className={`flex items-center gap-6 sm:gap-10 mt-12 pt-8 border-t border-white/5 w-full justify-center lg:justify-start transition-all duration-1000 ease-out delay-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
        <div className="flex flex-col items-center lg:items-start">
          <span className="text-2xl sm:text-3xl font-bold text-white">2+</span>
          <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest font-semibold mt-1">Years Coding</span>
        </div>
        <div className="w-[1px] h-8 bg-white/10"></div>
        <div className="flex flex-col items-center lg:items-start">
          <span className="text-2xl sm:text-3xl font-bold text-white">20+</span>
          <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest font-semibold mt-1">Projects Built</span>
        </div>
        <div className="w-[1px] h-8 bg-white/10 hidden sm:block"></div>
        <div className="flex flex-col items-center lg:items-start hidden sm:flex">
          <span className="text-2xl sm:text-3xl font-bold text-lime-400">100%</span>
          <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest font-semibold mt-1">Dedication</span>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;