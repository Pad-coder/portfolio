import React, { useState, useEffect, useRef, useCallback } from "react";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Existing refs
  const visualRef = useRef(null);
  const rafRef = useRef(null);

  // --- NEW: ADVANCED ROBOT PHYSICS & ANIMATION REFS ---
  const robotRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const mouthRef = useRef(null);
  const leftCheekRef = useRef(null);
  const rightCheekRef = useRef(null);
  const leftEarRef = useRef(null);
  const rightEarRef = useRef(null);
  const githubBallRef = useRef(null);
  const robotGlowRef = useRef(null);

  // State Machine & Physics Engine Engine (Kept in ref to avoid React re-renders, strictly 60fps)
  const physics = useRef({
    time: 0,
    mouseX: 0, mouseY: 0,
    lastMouseX: 0, lastMouseY: 0,
    eyeX: 0, eyeY: 0, eyeVX: 0, eyeVY: 0,
    smileOffset: 5, targetSmile: 5, smileV: 0,
    blinkScale: 1, targetBlink: 1, blinkV: 0,
    isBlinking: false,
    cheekOp: 0, targetCheekOp: 0, cheekV: 0,
    idleFrames: 0,
    emotion: 'neutral',
    ballX: 0, ballY: 0
  });

  // Spring Interpolation Helper
  const spring = (val, target, vel, stiffness = 0.1, damping = 0.8) => {
    const force = (target - val) * stiffness;
    vel = (vel + force) * damping;
    return [val + vel, vel];
  };

  const handleMouseMove = useCallback((e) => {
    // 1. ORIGINAL 3D TILT LOGIC (PRESERVED)
    const x = (e.clientX - window.innerWidth / 2) * 0.02;
    const y = (e.clientY - window.innerHeight / 2) * 0.02;
    
    if (visualRef.current) {
      visualRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotateY(${x * 0.5}deg) rotateX(${-y * 0.5}deg)`;
    }

    // 2. ROBOT CURSOR TRACKING
    if (robotRef.current) {
      const rect = robotRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      physics.current.mouseX = e.clientX - centerX;
      physics.current.mouseY = e.clientY - centerY;
      physics.current.idleFrames = 0; // Reset idle timer on move
    }
  }, []);

  // Main 60fps Render Loop
  const renderLoop = useCallback(() => {
    const p = physics.current;
    p.time += 1;

    // Calculate Mouse Speed & Distance for Emotion Heuristics
    const speedX = p.mouseX - p.lastMouseX;
    const speedY = p.mouseY - p.lastMouseY;
    const speed = Math.sqrt(speedX * speedX + speedY * speedY);
    const dist = Math.sqrt(p.mouseX * p.mouseX + p.mouseY * p.mouseY);
    
    p.lastMouseX = p.mouseX;
    p.lastMouseY = p.mouseY;

    // --- IDLE LOGIC & GITHUB BALL PHYSICS ---
    if (speed < 1) p.idleFrames++;
    
    // Animate GitHub Ball
    p.ballX = Math.sin(p.time * 0.02) * 80 + 100; // Orbit X
    p.ballY = Math.cos(p.time * 0.015) * 60 - 50; // Orbit Y
    
    if (githubBallRef.current) {
      githubBallRef.current.style.transform = `translate3d(${p.ballX}px, ${p.ballY}px, 0) rotate(${p.time * 0.5}deg)`;
    }

    // Determine target based on idle state (Watch cursor vs Watch ball)
    let targetX = p.mouseX;
    let targetY = p.mouseY;
    
    // --- EMOTION STATE MACHINE ---
    if (p.idleFrames > 120) {
      // CURIOUS/IDLE: Watch the floating GitHub ball
      p.emotion = 'curious';
      targetX = p.ballX; 
      targetY = p.ballY;
      p.targetSmile = 12; // Slight curious smile
      p.targetCheekOp = 0.3;
    } else if (dist > 500) {
      // SAD: Cursor is too far away
      p.emotion = 'sad';
      p.targetSmile = -10; // Frown
      p.targetCheekOp = 0;
    } else if (speed > 15 || (dist < 150 && speed > 5)) {
      // EXCITED: Moving fast or very close
      p.emotion = 'excited';
      p.targetSmile = 25; // Big smile
      p.targetCheekOp = 0.9; // Glowing cheeks
    } else {
      // NEUTRAL: Normal tracking
      p.emotion = 'neutral';
      p.targetSmile = 5; // Pleasant default
      p.targetCheekOp = 0;
    }

    // --- RANDOM NATURAL BLINKING ---
    if (!p.isBlinking && Math.random() < 0.006) {
      p.isBlinking = true;
      p.targetBlink = 0.05; // Squint/Blink
      setTimeout(() => { p.targetBlink = 1; p.isBlinking = false; }, 150);
      
      // Double blink chance
      if (Math.random() < 0.3) {
        setTimeout(() => {
          p.targetBlink = 0.05;
          setTimeout(() => { p.targetBlink = 1; }, 100);
        }, 250);
      }
    }

    // --- APPLY PHYSICS SPRINGS ---
    // 1. Eye Position (Smooth lag)
    const maxEyeX = 14; 
    const maxEyeY = 12;
    let destEyeX = (targetX / 300) * maxEyeX;
    let destEyeY = (targetY / 300) * maxEyeY;
    destEyeX = Math.max(-maxEyeX, Math.min(maxEyeX, destEyeX));
    destEyeY = Math.max(-maxEyeY, Math.min(maxEyeY, destEyeY));

    [p.eyeX, p.eyeVX] = spring(p.eyeX, destEyeX, p.eyeVX, 0.15, 0.7);
    [p.eyeY, p.eyeVY] = spring(p.eyeY, destEyeY, p.eyeVY, 0.15, 0.7);

    // 2. Mouth Morphing
    [p.smileOffset, p.smileV] = spring(p.smileOffset, p.targetSmile, p.smileV, 0.1, 0.75);

    // 3. Blinking
    [p.blinkScale, p.blinkV] = spring(p.blinkScale, p.targetBlink, p.blinkV, 0.4, 0.5);

    // 4. Cheeks
    [p.cheekOp, p.cheekV] = spring(p.cheekOp, p.targetCheekOp, p.cheekV, 0.05, 0.8);

    // --- APPLY TRANSFORMS TO DOM ---
    if (leftEyeRef.current && rightEyeRef.current) {
      const eyeTransform = `translate3d(${p.eyeX}px, ${p.eyeY}px, 0) scaleY(${p.blinkScale})`;
      leftEyeRef.current.style.transform = eyeTransform;
      rightEyeRef.current.style.transform = eyeTransform;
    }

    if (mouthRef.current) {
      // Dynamic SVG quadratic bezier curve for the mouth
      mouthRef.current.setAttribute('d', `M 15 25 Q 50 ${25 + p.smileOffset} 85 25`);
    }

    if (leftCheekRef.current && rightCheekRef.current) {
      leftCheekRef.current.style.opacity = p.cheekOp;
      rightCheekRef.current.style.opacity = p.cheekOp;
    }

    // Micro-movements (Breathing & Head Tilt)
    if (robotRef.current) {
      const breathY = Math.sin(p.time * 0.05) * 4;
      const lookTilt = p.eyeX * 0.5; // Tilt head slightly in look direction
      robotRef.current.style.transform = `translateY(${breathY}px) rotateZ(${lookTilt}deg)`;
    }

    // Ambient Glow Intensity
    if (robotGlowRef.current) {
      const glowScale = 1 + (p.cheekOp * 0.2);
      robotGlowRef.current.style.transform = `scale(${glowScale})`;
      robotGlowRef.current.style.opacity = 0.2 + (p.cheekOp * 0.15);
    }

    // Ear wiggles
    if (leftEarRef.current && rightEarRef.current) {
      const earRot = Math.sin(p.time * 0.1) * (p.emotion === 'excited' ? 15 : 2);
      leftEarRef.current.style.transform = `rotate(${-earRot}deg)`;
      rightEarRef.current.style.transform = `rotate(${earRot}deg)`;
    }

    rafRef.current = requestAnimationFrame(renderLoop);
  }, []);

  useEffect(() => {
    setIsVisible(true);
    window.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(renderLoop);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, renderLoop]);

  const scrollToSection = (sectionId) => {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden bg-[#0a0a0a]">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-lime-500/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] bg-neutral-800/50 blur-[120px] rounded-full mix-blend-screen" />
        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* ========================================= */}
        {/* LEFT CONTENT COLUMN - COMPLETELY PRESERVED */}
        {/* ========================================= */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0">
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
            Building
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

            <button
              onClick={() => scrollToSection("contact")}
              className="w-full sm:w-auto px-8 py-4 bg-white/[0.03] text-white border border-white/10 font-semibold rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 active:scale-95"
            >
              Let's Connect
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

        {/* ========================================= */}
        {/* RIGHT VISUAL CENTERPIECE - ROBOT COMPANION */}
        {/* ========================================= */}
        <div className={`hidden lg:flex relative h-full items-center justify-center transition-all duration-1000 ease-out delay-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
          
          <div ref={visualRef} className="relative w-full max-w-lg flex items-center justify-center" style={{ perspective: "1000px" }}>
            
            {/* Dynamic Mood Glow */}
            <div ref={robotGlowRef} className="absolute inset-0 bg-lime-400 blur-[90px] rounded-full transition-opacity duration-300" style={{ opacity: 0.2 }} />

            {/* Floating GitHub Physics Ball (Robot plays with this when idle) */}
            <div ref={githubBallRef} className="absolute z-20 w-16 h-16 bg-white/[0.05] border border-white/20 rounded-2xl backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
               <svg className="w-8 h-8 text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.5)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>

            {/* Static Code Tag Decorator */}
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-[#0d0d0d] border border-white/10 rounded-full flex items-center justify-center shadow-2xl z-20 animate-float">
              <span className="text-lime-400 font-bold font-mono text-xl">{"</>"}</span>
            </div>

            {/* === THE ROBOT CHARACTER === */}
            <div ref={robotRef} className="relative z-10 will-change-transform">
              
              {/* Ears / Antennas */}
              <div className="absolute top-1/2 -left-4 w-6 h-12 bg-white/5 border border-white/10 rounded-l-full backdrop-blur-md shadow-lg" ref={leftEarRef} style={{ transformOrigin: 'right center' }}>
                <div className="absolute top-1/2 left-2 w-1.5 h-4 bg-lime-400/50 rounded-full -translate-y-1/2" />
              </div>
              <div className="absolute top-1/2 -right-4 w-6 h-12 bg-white/5 border border-white/10 rounded-r-full backdrop-blur-md shadow-lg" ref={rightEarRef} style={{ transformOrigin: 'left center' }}>
                 <div className="absolute top-1/2 right-2 w-1.5 h-4 bg-lime-400/50 rounded-full -translate-y-1/2" />
              </div>

              {/* Main Glass Head */}
              <div className="w-[300px] h-[260px] bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 backdrop-blur-2xl rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col items-center justify-center p-6">
                
                {/* Specular Highlight (Glass Reflection) */}
                <div className="absolute top-2 left-6 right-6 h-6 bg-gradient-to-b from-white/[0.15] to-transparent rounded-full blur-[2px] pointer-events-none" />

                {/* Inner Screen (Face Area) */}
                <div className="w-full h-full bg-[#030303] rounded-[2.5rem] border border-white/5 shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)] relative flex flex-col items-center justify-center overflow-hidden">
                  
                  {/* Digital Screen Scanlines (Subtle) */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

                  {/* Emotion Cheeks */}
                  <div ref={leftCheekRef} className="absolute top-24 left-8 w-12 h-6 bg-lime-400 blur-xl opacity-0 rounded-full transition-opacity duration-200" />
                  <div ref={rightCheekRef} className="absolute top-24 right-8 w-12 h-6 bg-lime-400 blur-xl opacity-0 rounded-full transition-opacity duration-200" />

                  {/* Eyes Container */}
                  <div className="flex gap-10 z-10 relative mt-2">
                    
                    {/* Left Eye Socket */}
                    <div className="w-14 h-16 bg-[#0a0a0a] rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] border border-white/5 relative flex items-center justify-center overflow-hidden">
                      {/* Pupil */}
                      <div ref={leftEyeRef} className="w-8 h-10 bg-lime-400 rounded-full shadow-[0_0_20px_rgba(163,230,53,0.8)] will-change-transform relative">
                        {/* Eye Reflection */}
                        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-white/80 rounded-full blur-[1px]" />
                      </div>
                    </div>

                    {/* Right Eye Socket */}
                    <div className="w-14 h-16 bg-[#0a0a0a] rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] border border-white/5 relative flex items-center justify-center overflow-hidden">
                      {/* Pupil */}
                      <div ref={rightEyeRef} className="w-8 h-10 bg-lime-400 rounded-full shadow-[0_0_20px_rgba(163,230,53,0.8)] will-change-transform relative">
                        {/* Eye Reflection */}
                        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-white/80 rounded-full blur-[1px]" />
                      </div>
                    </div>

                  </div>

                  {/* Dynamic SVG Mouth */}
                  <div className="z-10 mt-6 relative">
                    <svg viewBox="0 0 100 50" className="w-16 h-8 overflow-visible">
                      <path 
                        ref={mouthRef}
                        d="M 15 25 Q 50 30 85 25" 
                        stroke="rgba(163,230,53,0.9)" 
                        strokeWidth="5" 
                        fill="none" 
                        strokeLinecap="round" 
                        className="drop-shadow-[0_0_8px_rgba(163,230,53,0.6)]"
                      />
                    </svg>
                  </div>

                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>

      {/* Premium Scroll Indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-semibold">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-neutral-500 to-transparent">
          <div className="w-full h-1/2 bg-lime-400 animate-slide-down"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
