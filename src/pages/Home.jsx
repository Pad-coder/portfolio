import React, { useState, useEffect, useRef, useCallback } from "react";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Existing architecture refs
  const visualRef = useRef(null);
  const rafRef = useRef(null);

  // --- OPTIMIZED ROBOT & PHYSICS REFS ---
  const robotRef = useRef(null);
  const robotRect = useRef({ x: 0, y: 0, w: 0, h: 0 }); // Cached for performance
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const mouthRef = useRef(null);
  const leftCheekRef = useRef(null);
  const rightCheekRef = useRef(null);
  const leftEarRef = useRef(null);
  const rightEarRef = useRef(null);
  const robotGlowRef = useRef(null);

  // Single Butterfly Refs
  const bugRef = useRef(null); 
  const wingLRef = useRef(null); 
  const wingRRef = useRef(null);

  // Physics Engine (Strictly isolated from React State to ensure 60fps)
  const physics = useRef({
    time: 0,
    mouseX: 0, mouseY: 0, lastMouseX: 0, lastMouseY: 0,
    eyeX: 0, eyeY: 0, eyeVX: 0, eyeVY: 0,
    mouthW: 35, mouthH: 8, mouthWV: 0, mouthHV: 0, targetMouthW: 35, targetMouthH: 8,
    blinkScaleL: 1, blinkScaleR: 1, blinkVL: 0, blinkVR: 0, targetBlinkL: 1, targetBlinkR: 1,
    isBlinking: false,
    cheekOp: 0, cheekY: 0, cheekVY: 0, targetCheekOp: 0, targetCheekY: 0,
    headTilt: 0, headTiltV: 0, targetHeadTilt: 0,
    idleFrames: 0, emotion: 'neutral',
    
    // Advanced Target Physics (1 Butterfly)
    bug: { x: 0, y: -100, vx: 0, vy: 0, tx: 0, ty: 0 }
  });

  // Mathematical Spring Formula for organic, rubbery movement
  const spring = (val, target, vel, stiffness = 0.1, damping = 0.75) => {
    const force = (target - val) * stiffness;
    vel = (vel + force) * damping;
    return [val + vel, vel];
  };

  // High-performance DOM bounds caching
  const updateRect = useCallback(() => {
    if (robotRef.current) {
      const rect = robotRef.current.getBoundingClientRect();
      robotRect.current = { x: rect.left, y: rect.top, w: rect.width, h: rect.height };
    }
  }, []);

  // Unified Mouse & Touch Tracker (Uses cached bounds = No layout thrashing)
  const updateCursorPosition = useCallback((clientX, clientY) => {
    const x = (clientX - window.innerWidth / 2) * 0.02;
    const y = (clientY - window.innerHeight / 2) * 0.02;
    
    if (visualRef.current) {
      visualRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotateY(${x * 0.5}deg) rotateX(${-y * 0.5}deg)`;
    }

    if (robotRect.current.w > 0) {
      const centerX = robotRect.current.x + robotRect.current.w / 2;
      const centerY = robotRect.current.y + robotRect.current.h / 2;
      physics.current.mouseX = clientX - centerX;
      physics.current.mouseY = clientY - centerY;
      physics.current.idleFrames = 0; 
    }
  }, []);

  const handleMouseMove = useCallback((e) => updateCursorPosition(e.clientX, e.clientY), [updateCursorPosition]);
  const handleTouchMove = useCallback((e) => {
    if (e.touches.length > 0) updateCursorPosition(e.touches[0].clientX, e.touches[0].clientY);
  }, [updateCursorPosition]);

  // Main 60fps Render Loop
  const renderLoop = useCallback(() => {
    const p = physics.current;
    p.time += 1;

    // Emotion Intelligence Heuristics
    const speedX = p.mouseX - p.lastMouseX;
    const speedY = p.mouseY - p.lastMouseY;
    const speed = Math.sqrt(speedX * speedX + speedY * speedY);
    const dist = Math.sqrt(p.mouseX * p.mouseX + p.mouseY * p.mouseY);
    
    p.lastMouseX = p.mouseX; p.lastMouseY = p.mouseY;
    if (speed < 1) p.idleFrames++;
    
    // --- EXCLUSION ZONE ORBIT PHYSICS ---
    // Butterfly floats in an organic, elegant pattern around the face
    p.bug.tx = Math.sin(p.time * 0.012) * 240 + Math.cos(p.time * 0.005) * 40;
    p.bug.ty = -180 + Math.cos(p.time * 0.018) * 80 + Math.sin(p.time * 0.008) * 30;

    // Calculate Spring for the butterfly
    [p.bug.x, p.bug.vx] = spring(p.bug.x, p.bug.tx, p.bug.vx, 0.015, 0.9);
    [p.bug.y, p.bug.vy] = spring(p.bug.y, p.bug.ty, p.bug.vy, 0.015, 0.9);

    let targetEyeX = p.mouseX;
    let targetEyeY = p.mouseY;
    
    // --- COMPANION EMOTIONAL STATE MACHINE ---
    if (p.idleFrames > 120) {
      // IDLE COMPANION (Alternates between watching the butterfly and looking forward playfully)
      const cycle = Math.floor(p.time / 300) % 2; 

      if (cycle === 0) { 
        p.emotion = 'curious'; 
        targetEyeX = p.bug.x; 
        targetEyeY = p.bug.y;
        p.targetMouthW = 12; p.targetMouthH = 12; // "Ooh" face
        p.targetHeadTilt = (targetEyeX / 150) * 12; // Curious tilt
      } else { 
        p.emotion = 'seeking'; 
        targetEyeX = 0; 
        targetEyeY = 0;
        p.targetMouthW = 35; p.targetMouthH = -5; // Playful smirk
        p.targetHeadTilt = Math.sin(p.time * 0.05) * 8; // Happy wiggle
      }

      p.targetCheekOp = 0.4; p.targetCheekY = -5;
      if (!p.isBlinking) { p.targetBlinkL = 1; p.targetBlinkR = 1; }
    } 
    else if (speed > 30) {
      // EXCITED (Fast cursor movement)
      p.emotion = 'excited';
      p.targetMouthW = 10; p.targetMouthH = 25; // Wide "O" mouth
      p.targetCheekOp = 0.2; p.targetCheekY = 0;
      if (!p.isBlinking) { p.targetBlinkL = 1.3; p.targetBlinkR = 1.3; } // Wide eyes
      p.targetHeadTilt = (speedX / 50) * 20; 
    } 
    else if (dist < 200) {
      // HAPPY (Hovering close to face)
      p.emotion = 'happy';
      p.targetMouthW = 45; p.targetMouthH = 25; // Big wide smile
      p.targetCheekOp = 0.8; p.targetCheekY = -12; // Glowing cheeks rise
      if (!p.isBlinking) { p.targetBlinkL = 1; p.targetBlinkR = 1; }
      p.targetHeadTilt = Math.sin(p.time * 0.1) * 6; // Happy wiggle
    } 
    else if (dist > (window.innerWidth / 2)) {
      // SAD (Cursor abandoned it at the edges of the screen)
      p.emotion = 'sad';
      p.targetMouthW = 20; p.targetMouthH = -8; // Frown
      p.targetCheekOp = 0; p.targetCheekY = 0;
      if (!p.isBlinking) { p.targetBlinkL = 0.8; p.targetBlinkR = 0.8; }
      p.targetHeadTilt = -5; // Slight depressed tilt
    }
    else {
      // NEUTRAL (Normal cursor tracking)
      p.emotion = 'neutral';
      p.targetMouthW = 35; p.targetMouthH = 8; // Pleasant curve
      p.targetCheekOp = 0.1; p.targetCheekY = 0;
      if (!p.isBlinking) { p.targetBlinkL = 1; p.targetBlinkR = 1; }
      p.targetHeadTilt = (p.eyeX / 16) * 10; // Follows cursor with tilt
    }

    // --- RANDOM BLINKING & WINKING ---
    if (!p.isBlinking && Math.random() < 0.008) {
      p.isBlinking = true;
      if (Math.random() < 0.15 && (p.emotion === 'happy' || p.emotion === 'neutral')) {
        p.targetBlinkL = 0.05; // Cute wink
        setTimeout(() => { p.targetBlinkL = 1; p.isBlinking = false; }, 200);
      } else {
        p.targetBlinkL = 0.05; p.targetBlinkR = 0.05; // Normal Blink
        setTimeout(() => { p.targetBlinkL = 1; p.targetBlinkR = 1; p.isBlinking = false; }, 150);
      }
    }

    // --- APPLY ROBOT SPRINGS ---
    let destEyeX = Math.max(-16, Math.min(16, targetEyeX / 12));
    let destEyeY = Math.max(-14, Math.min(14, targetEyeY / 12));
    [p.eyeX, p.eyeVX] = spring(p.eyeX, destEyeX, p.eyeVX, 0.15, 0.7);
    [p.eyeY, p.eyeVY] = spring(p.eyeY, destEyeY, p.eyeVY, 0.15, 0.7);

    [p.mouthW, p.mouthWV] = spring(p.mouthW, p.targetMouthW, p.mouthWV, 0.12, 0.7);
    [p.mouthH, p.mouthHV] = spring(p.mouthH, p.targetMouthH, p.mouthHV, 0.12, 0.7);

    [p.blinkScaleL, p.blinkVL] = spring(p.blinkScaleL, p.targetBlinkL, p.blinkVL, 0.3, 0.5);
    [p.blinkScaleR, p.blinkVR] = spring(p.blinkScaleR, p.targetBlinkR, p.blinkVR, 0.3, 0.5);

    [p.cheekOp] = spring(p.cheekOp, p.targetCheekOp, 0, 0.05, 0.8);
    [p.cheekY, p.cheekVY] = spring(p.cheekY, p.targetCheekY, p.cheekVY, 0.1, 0.7);
    [p.headTilt, p.headTiltV] = spring(p.headTilt, p.targetHeadTilt, p.headTiltV, 0.08, 0.75);

    // --- HIGH PERFORMANCE DOM TRANSFORMS ---
    
    // Update Single Butterfly
    if (bugRef.current) {
      const tilt = (p.bug.x - p.bug.tx) * -0.5; // Natural flight banking
      bugRef.current.style.transform = `translate3d(${p.bug.x}px, ${p.bug.y}px, 0) rotate(${tilt}deg)`;
      
      if (wingLRef.current && wingRRef.current) {
        const flutter = Math.sin(p.time * 0.6) * 45;
        wingLRef.current.style.transform = `rotateY(${flutter}deg)`;
        wingRRef.current.style.transform = `rotateY(${-flutter}deg)`;
      }
    }

    if (leftEyeRef.current) leftEyeRef.current.style.transform = `translate3d(${p.eyeX}px, ${p.eyeY}px, 0) scaleY(${p.blinkScaleL})`;
    if (rightEyeRef.current) rightEyeRef.current.style.transform = `translate3d(${p.eyeX}px, ${p.eyeY}px, 0) scaleY(${p.blinkScaleR})`;

    if (mouthRef.current) mouthRef.current.setAttribute('d', `M ${60 - p.mouthW} 35 Q 60 ${35 + p.mouthH} ${60 + p.mouthW} 35`);

    if (leftCheekRef.current && rightCheekRef.current) {
      leftCheekRef.current.style.opacity = p.cheekOp;
      rightCheekRef.current.style.opacity = p.cheekOp;
      leftCheekRef.current.style.transform = `translate3d(0, ${p.cheekY}px, 0)`;
      rightCheekRef.current.style.transform = `translate3d(0, ${p.cheekY}px, 0)`;
    }

    if (robotRef.current) {
      const breathY = Math.sin(p.time * 0.04) * 4;
      robotRef.current.style.transform = `translate3d(0, ${breathY}px, 0) rotateZ(${p.headTilt}deg)`;
    }

    if (robotGlowRef.current) {
      const glowScale = 1 + (p.cheekOp * 0.3);
      robotGlowRef.current.style.transform = `scale3d(${glowScale}, ${glowScale}, 1)`;
      robotGlowRef.current.style.opacity = 0.15 + (p.cheekOp * 0.2);
    }

    if (leftEarRef.current && rightEarRef.current) {
      const earRot = Math.sin(p.time * 0.1) * (p.emotion === 'excited' ? 12 : 3);
      leftEarRef.current.style.transform = `rotate(${-earRot}deg)`;
      rightEarRef.current.style.transform = `rotate(${earRot}deg)`;
    }

    rafRef.current = requestAnimationFrame(renderLoop);
  }, []);

  // Initialization & Listeners
  useEffect(() => {
    setIsVisible(true);
    updateRect(); // Initial cache

    const handleVisibility = () => {
      // PAUSE PHYSICS WHEN TAB IS HIDDEN TO SAVE BATTERY
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      } else {
        rafRef.current = requestAnimationFrame(renderLoop);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchMove, { passive: true });
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    
    rafRef.current = requestAnimationFrame(renderLoop);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchMove);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleTouchMove, renderLoop, updateRect]);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden bg-[#0a0a0a]">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-lime-500/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] bg-neutral-800/50 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center mt-8 lg:mt-0">
        
        {/* ========================================= */}
        {/* LEFT CONTENT COLUMN (PRESERVED EXACTLY)   */}
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
        {/* RIGHT VISUAL CENTERPIECE - PREMIUM ROBOT  */}
        {/* ========================================= */}
        <div className={`flex relative h-full items-center justify-center transition-all duration-1000 ease-out delay-500 mt-16 lg:mt-0 scale-75 sm:scale-90 lg:scale-100 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
          
          <div ref={visualRef} className="relative w-full max-w-lg flex items-center justify-center" style={{ perspective: "1000px" }}>
            
            {/* FAST Performance Radial Glow */}
            <div ref={robotGlowRef} className="absolute inset-0 bg-[radial-gradient(circle,rgba(163,230,53,0.3)_0%,transparent_60%)] transition-opacity duration-300 will-change-transform" style={{ opacity: 0.15 }} />

            {/* Dynamic Single Butterfly */}
            <div ref={bugRef} className="absolute z-40 flex items-center justify-center will-change-transform pointer-events-none transition-opacity duration-500">
              <svg viewBox="0 0 100 100" className="w-16 h-16 overflow-visible">
                {/* Antennae */}
                <path d="M 45 40 Q 35 20 25 15 M 55 40 Q 65 20 75 15" stroke="#a3e635" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <circle cx="25" cy="15" r="1.5" fill="#fff" />
                <circle cx="75" cy="15" r="1.5" fill="#fff" />
                {/* Left Wings */}
                <g ref={wingLRef} style={{ transformOrigin: '50px 50px', willChange: 'transform' }}>
                  <path d="M 48 45 C 20 10, -10 30, 5 60 C 15 80, 40 60, 48 55 Z" fill="rgba(163,230,53,0.5)" stroke="#bef264" strokeWidth="1" />
                  <path d="M 45 48 C 25 25, 5 40, 15 55 Z" fill="rgba(255,255,255,0.6)" />
                  <path d="M 48 55 C 30 70, 10 90, 20 95 C 35 100, 45 80, 48 65 Z" fill="rgba(163,230,53,0.3)" stroke="#bef264" strokeWidth="0.5" />
                </g>
                {/* Right Wings */}
                <g ref={wingRRef} style={{ transformOrigin: '50px 50px', willChange: 'transform' }}>
                  <path d="M 52 45 C 80 10, 110 30, 95 60 C 85 80, 60 60, 52 55 Z" fill="rgba(163,230,53,0.5)" stroke="#bef264" strokeWidth="1" />
                  <path d="M 55 48 C 75 25, 95 40, 85 55 Z" fill="rgba(255,255,255,0.6)" />
                  <path d="M 52 55 C 70 70, 90 90, 80 95 C 65 100, 55 80, 52 65 Z" fill="rgba(163,230,53,0.3)" stroke="#bef264" strokeWidth="0.5" />
                </g>
                {/* Body */}
                <rect x="47" y="40" width="6" height="24" rx="3" fill="#fff" />
              </svg>
            </div>

            {/* Static Code Tag Decorator */}
            <div className="absolute -bottom-12 -left-12 w-20 h-20 bg-[#0d0d0d] border border-white/10 rounded-full flex items-center justify-center shadow-2xl z-20 animate-float" style={{ animationDelay: '1s' }}>
              <span className="text-lime-400 font-bold font-mono text-xl">{"</>"}</span>
            </div>

            {/* === THE PREMIUM ROBOT COMPANION === */}
            <div ref={robotRef} className="relative z-10 will-change-transform">
              
              {/* Ears / Antennas */}
              <div className="absolute top-1/2 -left-4 w-6 h-14 bg-[#141414] border border-white/5 rounded-l-full shadow-lg" ref={leftEarRef} style={{ transformOrigin: 'right center' }}>
                <div className="absolute top-1/2 left-2 w-1.5 h-4 bg-[#84cc16] rounded-full -translate-y-1/2" />
              </div>
              <div className="absolute top-1/2 -right-4 w-6 h-14 bg-[#141414] border border-white/5 rounded-r-full shadow-lg" ref={rightEarRef} style={{ transformOrigin: 'left center' }}>
                 <div className="absolute top-1/2 right-2 w-1.5 h-4 bg-[#84cc16] rounded-full -translate-y-1/2" />
              </div>

              {/* Main Head - Apple-like rounded rectangle proportions */}
              <div className="w-[340px] h-[300px] bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a] border border-white/10 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col items-center justify-center p-6">
                
                {/* Premium Specular Highlight */}
                <div className="absolute top-1.5 left-8 right-8 h-6 bg-gradient-to-b from-white/[0.12] to-transparent rounded-full pointer-events-none z-20" />

                {/* Inner Screen */}
                <div className="w-full h-full bg-[#030303] rounded-[2.5rem] border border-white/5 shadow-[inset_0_10px_30px_rgba(0,0,0,0.9)] relative flex flex-col items-center justify-center overflow-hidden">
                  
                  {/* Subtle Screen Scanlines */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

                  {/* High-Perf Emotion Cheeks */}
                  <div ref={leftCheekRef} className="absolute top-32 left-8 w-20 h-16 bg-[radial-gradient(circle,rgba(163,230,53,0.5)_0%,transparent_70%)] opacity-0 will-change-transform" />
                  <div ref={rightCheekRef} className="absolute top-32 right-8 w-20 h-16 bg-[radial-gradient(circle,rgba(163,230,53,0.5)_0%,transparent_70%)] opacity-0 will-change-transform" />

                  {/* Better Proportioned Eyes */}
                  <div className="flex gap-16 z-10 relative mt-4">
                    
                    {/* Left Eye */}
                    <div className="w-14 h-16 bg-[#0a0a0a] rounded-full shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] border border-white/5 relative flex items-center justify-center overflow-hidden">
                      <div ref={leftEyeRef} className="w-8 h-10 bg-[#a3e635] rounded-full shadow-[0_0_12px_rgba(163,230,53,0.3)] will-change-transform relative">
                        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-white/90 rounded-full" />
                      </div>
                    </div>

                    {/* Right Eye */}
                    <div className="w-14 h-16 bg-[#0a0a0a] rounded-full shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] border border-white/5 relative flex items-center justify-center overflow-hidden">
                      <div ref={rightEyeRef} className="w-8 h-10 bg-[#a3e635] rounded-full shadow-[0_0_12px_rgba(163,230,53,0.3)] will-change-transform relative">
                        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-white/90 rounded-full" />
                      </div>
                    </div>

                  </div>

                  {/* Clean SVG Mouth */}
                  <div className="z-10 mt-6 relative">
                    <svg viewBox="0 0 120 60" className="w-24 h-12 overflow-visible">
                      <path 
                        ref={mouthRef}
                        d="M 25 35 Q 60 43 95 35" 
                        stroke="#a3e635" 
                        strokeWidth="6" 
                        fill="none" 
                        strokeLinecap="round" 
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
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-1000 hidden lg:flex ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-semibold">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-neutral-500 to-transparent">
          <div className="w-full h-1/2 bg-lime-400 animate-slide-down"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
