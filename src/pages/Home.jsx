import React, { useState, useEffect, useRef, useCallback } from "react";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const visualRef = useRef(null);
  const rafRef = useRef(null);

  // High-performance, 60fps parallax effect for the visual element
  const handleMouseMove = useCallback((e) => {
    if (!visualRef.current) return;

    // Calculate mouse position relative to the center of the screen
    const x = (e.clientX - window.innerWidth / 2) * 0.02;
    const y = (e.clientY - window.innerHeight / 2) * 0.02;

    // Use requestAnimationFrame for buttery smooth GPU transforms
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      if (visualRef.current) {
        visualRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotateY(${x * 0.5}deg) rotateX(${-y * 0.5}deg)`;
      }
    });
  }, []);

  useEffect(() => {
    setIsVisible(true);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  const scrollToSection = (sectionId) => {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden bg-[#0a0a0a]"
      id="home"
    >
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-lime-500/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] bg-neutral-800/50 blur-[120px] rounded-full mix-blend-screen" />
        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left Content Column */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0">
          {/* Premium Availability Badge */}
          <div
            className={`transition-all duration-1000 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
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

          {/* Cinematic Headline */}
          <h1
            className={`text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] sm:leading-[1.1] transition-all duration-1000 ease-out delay-150 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            Building
            <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-200">
              Digital Products
            </span>{" "}
            <br className="hidden lg:block" />
            That Matter.
          </h1>

          {/* Authentic Supporting Text */}
          <p
            className={`text-base sm:text-lg lg:text-xl text-neutral-400 max-w-xl font-light leading-relaxed mb-10 transition-all duration-1000 ease-out delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            I transform complex ideas into exceptional web products. Obsessed
            with clean architecture, blazing-fast performance, and building
            interfaces that users love.
          </p>

          {/* Magnetic/Premium Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto transition-all duration-1000 ease-out delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <button
              onClick={() => scrollToSection("projects")}
              className="group relative w-full sm:w-auto px-8 py-4 bg-lime-400 text-neutral-950 font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(163,230,53,0.3)] active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore My Work
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className="w-full sm:w-auto px-8 py-4 bg-white/[0.03] text-white border border-white/10 font-semibold rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 active:scale-95"
            >
              Let's Connect
            </button>
          </div>

          {/* Floating Statistics Row */}
          <div
            className={`flex items-center gap-6 sm:gap-10 mt-12 pt-8 border-t border-white/5 w-full justify-center lg:justify-start transition-all duration-1000 ease-out delay-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-2xl sm:text-3xl font-bold text-white">
                2+
              </span>
              <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest font-semibold mt-1">
                Years Coding
              </span>
            </div>
            <div className="w-[1px] h-8 bg-white/10"></div>
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-2xl sm:text-3xl font-bold text-white">
                20+
              </span>
              <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest font-semibold mt-1">
                Projects Built
              </span>
            </div>
            <div className="w-[1px] h-8 bg-white/10 hidden sm:block"></div>
            <div className="flex flex-col items-center lg:items-start hidden sm:flex">
              <span className="text-2xl sm:text-3xl font-bold text-lime-400">
                100%
              </span>
              <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest font-semibold mt-1">
                Dedication
              </span>
            </div>
          </div>
        </div>

        {/* Right Visual Centerpiece (Hidden on Mobile, Stars on Desktop) */}
        <div
          className={`hidden lg:flex relative h-full items-center justify-center transition-all duration-1000 ease-out delay-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
        >
          {/* Container for 3D Parallax */}
          <div
            ref={visualRef}
            className="relative w-full max-w-lg"
            style={{ perspective: "1000px" }}
          >
            {/* Soft Glow behind the card */}
            <div className="absolute inset-0 bg-lime-400/20 blur-[80px] rounded-full" />

            {/* Glass Code Editor Card */}
            <div className="relative bg-[#0d0d0d]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden z-10">
              {/* Window Controls */}
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <div className="ml-2 text-xs font-mono text-neutral-500">
                  developer.jsx
                </div>
              </div>

              {/* Code Content */}
              <div className="font-mono text-sm leading-loose">
                <div className="text-neutral-400">
                  <span className="text-purple-400">import</span> {"{"}{" "}
                  <span className="text-blue-300">Developer</span> {"}"}{" "}
                  <span className="text-purple-400">from</span>{" "}
                  <span className="text-lime-300">'@padmanaban/core'</span>;
                </div>
                <br />
                <div className="text-neutral-400">
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-blue-300">profile</span> = {"{"}
                </div>
                <div className="pl-6 text-neutral-300">
                  name: <span className="text-lime-300">'Padmanaban M'</span>,
                </div>
                <div className="pl-6 text-neutral-300">
                  role:{" "}
                  <span className="text-lime-300">'Full-Stack Developer'</span>,
                </div>
                <div className="pl-6 text-neutral-300">
                  skills: [<span className="text-lime-300">'React'</span>,{" "}
                  <span className="text-lime-300">'Next.js'</span>,{" "}
                  <span className="text-lime-300">'Node.js'</span>,{" "}
                    
                  <span className="text-lime-300">'Database'</span>],
                </div>
                <div className="pl-6 text-neutral-300">
                  passion:{" "}
                  <span className="text-lime-300">
                    'Building scalable web products'
                  </span>
                  ,
                </div>
                <div className="text-neutral-400">{"}"};</div>
                <br />
                <div className="text-neutral-400">
                  <span className="text-blue-300">export default</span>{" "}
                  <span className="text-yellow-200">function</span>{" "}
                  <span className="text-blue-300">App</span>() {"{"}
                </div>
                <div className="pl-6 text-neutral-400">
                  <span className="text-purple-400">return</span> (
                </div>
                <div className="pl-12 text-neutral-300">
                  &lt;<span className="text-red-400">Developer</span>{" "}
                  <span className="text-purple-400">data</span>={"{"}
                  <span className="text-blue-300">profile</span>
                  {"}"} /&gt;
                </div>
                <div className="pl-6 text-neutral-400">);</div>
                <div className="text-neutral-400">{"}"}</div>
              </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-md animate-float flex items-center justify-center shadow-xl">
              <svg
                className="w-10 h-10 text-lime-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <div
              className="absolute -bottom-8 -left-8 w-20 h-20 bg-lime-400/10 border border-lime-400/20 rounded-full backdrop-blur-md animate-float flex items-center justify-center shadow-xl"
              style={{ animationDelay: "2s" }}
            >
              <span className="text-lime-400 font-bold font-mono">{"</>"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-semibold">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-neutral-500 to-transparent">
          <div className="w-full h-1/2 bg-lime-400 animate-slide-down"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
