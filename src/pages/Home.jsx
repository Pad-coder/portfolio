import React, { useState, useEffect, useRef, useCallback } from "react";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Existing refs
  const visualRef = useRef(null);
  const rafRef = useRef(null);

  // --- ADVANCED ROBOT PHYSICS & ANIMATION REFS ---
  const robotRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const mouthRef = useRef(null);
  const leftCheekRef = useRef(null);
  const rightCheekRef = useRef(null);
  const leftEarRef = useRef(null);
  const rightEarRef = useRef(null);
  const butterflyRef = useRef(null);
  const leftWingRef = useRef(null);
  const rightWingRef = useRef(null);
  const robotGlowRef = useRef(null);

  // Physics Engine (Stored in ref to avoid React re-renders, strictly 60fps)
  const physics = useRef({
    time: 0,
    mouseX: 0, mouseY: 0,
    lastMouseX: 0, lastMouseY: 0,
    eyeX: 0, eyeY: 0, eyeVX: 0, eyeVY: 0,
    
    // Mouth Spring
    mouthW: 35, mouthH: 8, mouthWV: 0, mouthHV: 0, targetMouthW: 35, targetMouthH: 8,
    
    // Blinking & Winking
    blinkScaleL: 1, blinkScaleR: 1, blinkVL: 0, blinkVR: 0, targetBlinkL: 1, targetBlinkR: 1,
    isBlinking: false,
    
    // Cheeks & Head
    cheekOp: 0, cheekY: 0, cheekVY: 0, targetCheekOp: 0, targetCheekY: 0,
    headTilt: 0, headTiltV: 0, targetHeadTilt: 0,
    
    idleFrames: 0,
    emotion: 'neutral',
    bugX: 0, bugY: 0
  });

  // Mathematical Spring Formula for organic, rubbery movement
  const spring = (val, target, vel, stiffness = 0.1, damping = 0.75) => {
    const force = (target - val) * stiffness;
    vel = (vel + force) * damping;
    return [val + vel, vel];
  };

  // Unified Mouse & Touch Tracker
  const updateCursorPosition = useCallback((clientX, clientY) => {
    // 1. 3D Tilt Background
    const x = (clientX - window.innerWidth / 2) * 0.02;
    const y = (clientY - window.innerHeight / 2) * 0.02;
    if (visualRef.current) {
      visualRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotateY(${x * 0.5}deg) rotateX(${-y * 0.5}deg)`;
    }

    // 2. Robot Face Tracking
    if (robotRef.current) {
      const rect = robotRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      physics.current.mouseX = clientX - centerX;
      physics.current.mouseY = clientY - centerY;
      physics.current.idleFrames = 0; // Reset idle timer when interacting
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

    // Calculate Speed & Distance for Emotion Intelligence
    const speedX = p.mouseX - p.lastMouseX;
    const speedY = p.mouseY - p.lastMouseY;
    const speed = Math.sqrt(speedX * speedX + speedY * speedY);
    const dist = Math.sqrt(p.mouseX * p.mouseX + p.mouseY * p.mouseY);
    
    p.lastMouseX = p.mouseX;
    p.lastMouseY = p.mouseY;

    if (speed < 1) p.idleFrames++;
    
    // --- ORGANIC BUTTERFLY PHYSICS ---
    // Chaotic Lissajous curve for organic bug flight
    p.bugX = Math.sin(p.time * 0.015) * 180 + Math.cos(p.time * 0.04) * 40; 
    p.bugY = Math.cos(p.time * 0.012) * 120 - 50 + Math.sin(p.time * 0.07) * 30; 
    
    if (butterflyRef.current) {
      // Rotation follows movement direction slightly
      const bugRot = Math.sin(p.time * 0.03) * 15;
      butterflyRef.current.style.transform = `translate3d(${p.bugX}px, ${p.bugY}px, 0) rotate(${bugRot}deg)`;
    }

    // Butterfly Wings Flutter Animation
    if (leftWingRef.current && rightWingRef.current) {
      const flutter = Math.sin(p.time * 0.8) * 50; // Fast wing flapping
      leftWingRef.current.style.transform = `rotateY(${flutter}deg)`;
      rightWingRef.current.style.transform = `rotateY(${-flutter}deg)`;
    }

    let targetEyeX = p.mouseX;
    let targetEyeY = p.mouseY;
    
    // --- EMOTIONAL STATE MACHINE ---
    if (p.idleFrames > 500) {
      // SLEEPY (Idle > ~8 seconds)
      p.emotion = 'sleepy';
      p.targetMouthW = 15; p.targetMouthH = 0; // Flat tiny mouth
      p.targetCheekOp = 0; p.targetCheekY = 0;
      p.targetBlinkL = 0.2; p.targetBlinkR = 0.2; // Eyes half closed
      p.targetHeadTilt = 10; // Head droops
      targetEyeX = 0; targetEyeY = 30; 
    } 
    else if (p.idleFrames > 120) {
      // CURIOUS (Idle > 2 seconds: Watches the glowing butterfly)
      p.emotion = 'curious';
      targetEyeX = p.bugX; 
      targetEyeY = p.bugY;
      p.targetMouthW = 14; p.targetMouthH = 14; // "Ooh" face
      p.targetCheekOp = 0.3; p.targetCheekY = -2;
      if (!p.isBlinking) { p.targetBlinkL = 1; p.targetBlinkR = 1; }
      p.targetHeadTilt = (p.bugX / 120) * 15; // Tilts head following the butterfly
    } 
    else if (speed > 30) {
      // SURPRISED / DIZZY (Moving mouse very fast)
      p.emotion = 'surprised';
      p.targetMouthW = 12; p.targetMouthH = 24; // Tall narrow "O" mouth
      p.targetCheekOp = 0.2; p.targetCheekY = 0;
      if (!p.isBlinking) { p.targetBlinkL = 1.3; p.targetBlinkR = 1.3; } // Wide eyes
      p.targetHeadTilt = (speedX / 50) * 20; 
    } 
    else if (dist < 220) {
      // HAPPY / EXCITED (Hovering close to face)
      p.emotion = 'happy';
      p.targetMouthW = 45; p.targetMouthH = 30; // Big wide smile
      p.targetCheekOp = 0.9; p.targetCheekY = -15; // Glowing cheeks rise
      if (!p.isBlinking) { p.targetBlinkL = 1; p.targetBlinkR = 1; }
      p.targetHeadTilt = Math.sin(p.time * 0.1) * 8; // Happy wiggle
    } 
    else {
      // NEUTRAL (Normal cursor tracking)
      p.emotion = 'neutral';
      p.targetMouthW = 35; p.targetMouthH = 8; // Pleasant curve
      p.targetCheekOp = 0.15; p.targetCheekY = 0;
      if (!p.isBlinking) { p.targetBlinkL = 1; p.targetBlinkR = 1; }
      p.targetHeadTilt = (p.eyeX / 16) * 10; // Follows cursor with tilt
    }

    // --- RANDOM BLINKING & WINKING ---
    if (!p.isBlinking && Math.random() < 0.008) {
      p.isBlinking = true;
      if (Math.random() < 0.15 && p.emotion === 'happy') {
        p.targetBlinkL = 0.05; // Happy wink
        setTimeout(() => { p.targetBlinkL = 1; p.isBlinking = false; }, 200);
      } else {
        p.targetBlinkL = 0.05; p.targetBlinkR = 0.05; // Normal Blink
        setTimeout(() => { p.targetBlinkL = 1; p.targetBlinkR = 1; p.isBlinking = false; }, 150);
      }
    }

    // --- APPLY PHYSICS SPRINGS ---
    // 1. Eye Position (Scaled up bounds for bigger face)
    let destEyeX = Math.max(-18, Math.min(18, targetEyeX / 12));
    let destEyeY = Math.max(-16, Math.min(16, targetEyeY / 12));

    [p.eyeX, p.eyeVX] = spring(p.eyeX, destEyeX, p.eyeVX, 0.15, 0.7);
    [p.eyeY, p.eyeVY] = spring(p.eyeY, destEyeY, p.eyeVY, 0.15, 0.7);

    // 2. Dynamic Mouth Morphing
    [p.mouthW, p.mouthWV] = spring(p.mouthW, p.targetMouthW, p.mouthWV, 0.12, 0.7);
    [p.mouthH, p.mouthHV] = spring(p.mouthH, p.targetMouthH, p.mouthHV, 0.12, 0.7);

    // 3. Blinking
    [p.blinkScaleL, p.blinkVL] = spring(p.blinkScaleL, p.targetBlinkL, p.blinkVL, 0.3, 0.5);
    [p.blinkScaleR, p.blinkVR] = spring(p.blinkScaleR, p.targetBlinkR, p.blinkVR, 0.3, 0.5);

    // 4. Cheeks & Head Tilt
    [p.cheekOp] = spring(p.cheekOp, p.targetCheekOp, 0, 0.05, 0.8);
    [p.cheekY, p.cheekVY] = spring(p.cheekY, p.targetCheekY, p.cheekVY, 0.1, 0.7);
    [p.headTilt, p.headTiltV] = spring(p.headTilt, p.targetHeadTilt, p.headTiltV, 0.08, 0.75);

    // --- APPLY DOM TRANSFORMS ---
    if (leftEyeRef.current) leftEyeRef.current.style.transform = `translate3d(${p.eyeX}px, ${p.eyeY}px, 0) scaleY(${p.blinkScaleL})`;
    if (rightEyeRef.current) rightEyeRef.current.style.transform = `translate3d(${p.eyeX}px, ${p.eyeY}px, 0) scaleY(${p.blinkScaleR})`;

    if (mouthRef.current) {
      // Procedural SVG Quadratic Bezier Curve for infinite mouth shapes (Scaled for larger face)
      mouthRef.current.setAttribute('d', `M ${60 - p.mouthW} 35 Q 60 ${35 + p.mouthH} ${60 + p.mouthW} 35`);
    }

    if (leftCheekRef.current && rightCheekRef.current) {
      leftCheekRef.current.style.opacity = p.cheekOp;
      rightCheekRef.current.style.opacity = p.cheekOp;
      leftCheekRef.current.style.transform = `translateY(${p.cheekY}px)`;
      rightCheekRef.current.style.transform = `translateY(${p.cheekY}px)`;
    }

    // Breathing Engine & Body Movement
    if (robotRef.current) {
      const breathSpeed = p.emotion === 'sleepy' ? 0.02 : 0.06;
      const breathDepth = p.emotion === 'sleepy' ? 8 : 4;
      const breathY = Math.sin(p.time * breathSpeed) * breathDepth;
      
      robotRef.current.style.transform = `translateY(${breathY}px) rotateZ(${p.headTilt}deg)`;
    }

    // Ambient Glow reacts to happiness
    if (robotGlowRef.current) {
      const glowScale = 1 + (p.cheekOp * 0.4);
      robotGlowRef.current.style.transform = `scale(${glowScale})`;
      robotGlowRef.current.style.opacity = 0.15 + (p.cheekOp * 0.25);
    }

    // Antennas react to mood
    if (leftEarRef.current && rightEarRef.current) {
      const earRot = Math.sin(p.time * 0.1) * (p.emotion === 'happy' ? 18 : 3);
      leftEarRef.current.style.transform = `rotate(${-earRot}deg)`;
      rightEarRef.current.style.transform = `rotate(${earRot}deg)`;
    }

    rafRef.current = requestAnimationFrame(renderLoop);
  }, []);

  useEffect(() => {
    setIsVisible(true);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchMove, { passive: true });
    
    rafRef.current = requestAnimationFrame(renderLoop);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleTouchMove, renderLoop]);

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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center mt-8 lg:mt-0">
        
        {/* ========================================= */}
        {/* LEFT CONTENT COLUMN */}
        {/* ========================================= */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0">
          
          {/* Mobile Notice (Visible only on small screens) */}
          <div className={`lg:hidden flex items-center justify-center gap-2 mb-8 px-5 py-3 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
             <span className="text-lime-400 text-lg">✨</span>
             <span className="text-xs sm:text-sm text-neutral-400 font-light text-left leading-relaxed">
               For the ultimate 60FPS physics experience, explore this site on a desktop!
             </span>
          </div>

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
        {/* RIGHT VISUAL CENTERPIECE - BIGGER ROBOT + BUTTERFLY */}
        {/* ========================================= */}
        <div className={`flex relative h-full items-center justify-center transition-all duration-1000 ease-out delay-500 mt-16 lg:mt-0 scale-75 sm:scale-90 lg:scale-100 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
          
          <div ref={visualRef} className="relative w-full max-w-lg flex items-center justify-center" style={{ perspective: "1000px" }}>
            
            {/* Dynamic Mood Glow */}
            <div ref={robotGlowRef} className="absolute inset-0 bg-lime-400 blur-[100px] rounded-full transition-opacity duration-300" style={{ opacity: 0.15 }} />

            {/* THE CODE BUTTERFLY (Replaces Github Ball) */}
            <div ref={butterflyRef} className="absolute z-30 flex items-center justify-center will-change-transform pointer-events-none">
              {/* Custom SVG Butterfly representing </> and {} code symbols */}
              <svg viewBox="0 0 24 24" className="w-12 h-12 text-lime-400 drop-shadow-[0_0_15px_rgba(163,230,53,0.9)] overflow-visible">
                {/* Left Wing (Looks like < or { ) */}
                <g ref={leftWingRef} style={{ transformOrigin: '12px 12px', willChange: 'transform' }}>
                  <path d="M12,12 C6,2 0,6 4,18 C6,22 10,16 12,12 Z" fill="currentColor" opacity="0.8" />
                  <path d="M12,12 C8,6 4,8 6,14 C7,16 9,14 12,12 Z" fill="#fff" opacity="0.6" />
                </g>
                {/* Right Wing (Looks like > or } ) */}
                <g ref={rightWingRef} style={{ transformOrigin: '12px 12px', willChange: 'transform' }}>
                  <path d="M12,12 C18,2 24,6 20,18 C18,22 14,16 12,12 Z" fill="currentColor" opacity="0.8" />
                  <path d="M12,12 C16,6 20,8 18,14 C17,16 15,14 12,12 Z" fill="#fff" opacity="0.6" />
                </g>
                {/* Glowing Core / Body */}
                <rect x="11.2" y="8" width="1.6" height="8" rx="0.8" fill="#fff" className="drop-shadow-[0_0_5px_#fff]" />
              </svg>
            </div>

            {/* Static Code Tag Decorator (Moved slightly further out) */}
            <div className="absolute -bottom-16 -left-12 w-24 h-24 bg-[#0d0d0d] border border-white/10 rounded-full flex items-center justify-center shadow-2xl z-20 animate-float" style={{ animationDelay: '1s' }}>
              <span className="text-lime-400 font-bold font-mono text-2xl">{"</>"}</span>
            </div>

            {/* === THE ROBOT CHARACTER (SCALED UP) === */}
            <div ref={robotRef} className="relative z-10 will-change-transform">
              
              {/* Ears / Antennas (Slightly larger) */}
              <div className="absolute top-1/2 -left-5 w-8 h-16 bg-white/5 border border-white/10 rounded-l-full backdrop-blur-md shadow-lg" ref={leftEarRef} style={{ transformOrigin: 'right center' }}>
                <div className="absolute top-1/2 left-2.5 w-2 h-5 bg-lime-400/50 rounded-full -translate-y-1/2" />
              </div>
              <div className="absolute top-1/2 -right-5 w-8 h-16 bg-white/5 border border-white/10 rounded-r-full backdrop-blur-md shadow-lg" ref={rightEarRef} style={{ transformOrigin: 'left center' }}>
                 <div className="absolute top-1/2 right-2.5 w-2 h-5 bg-lime-400/50 rounded-full -translate-y-1/2" />
              </div>

              {/* Main Glass Head (Increased width and height) */}
              <div className="w-[360px] h-[310px] bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 backdrop-blur-2xl rounded-[4rem] shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col items-center justify-center p-7">
                
                {/* Specular Highlight (Glass Reflection) */}
                <div className="absolute top-2 left-8 right-8 h-8 bg-gradient-to-b from-white/[0.15] to-transparent rounded-full blur-[2px] pointer-events-none z-20" />

                {/* Inner Screen (Face Area - Larger) */}
                <div className="w-full h-full bg-[#030303] rounded-[3rem] border border-white/5 shadow-[inset_0_12px_40px_rgba(0,0,0,0.9)] relative flex flex-col items-center justify-center overflow-hidden">
                  
                  {/* Digital Screen Scanlines */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

                  {/* Emotion Cheeks (Adjusted for larger face) */}
                  <div ref={leftCheekRef} className="absolute top-32 left-10 w-16 h-10 bg-lime-400 blur-[18px] opacity-0 rounded-full will-change-transform" />
                  <div ref={rightCheekRef} className="absolute top-32 right-10 w-16 h-10 bg-lime-400 blur-[18px] opacity-0 rounded-full will-change-transform" />

                  {/* Eyes Container (Wider gap) */}
                  <div className="flex gap-14 z-10 relative mt-4">
                    
                    {/* Left Eye Socket (Larger) */}
                    <div className="w-16 h-20 bg-[#0a0a0a] rounded-full shadow-[inset_0_5px_15px_rgba(0,0,0,0.9)] border border-white/5 relative flex items-center justify-center overflow-hidden">
                      {/* Pupil */}
                      <div ref={leftEyeRef} className="w-10 h-12 bg-lime-400 rounded-full shadow-[0_0_20px_rgba(163,230,53,0.7)] will-change-transform relative">
                        <div className="absolute top-2 right-2 w-3 h-3 bg-white/80 rounded-full blur-[1px]" />
                      </div>
                    </div>

                    {/* Right Eye Socket (Larger) */}
                    <div className="w-16 h-20 bg-[#0a0a0a] rounded-full shadow-[inset_0_5px_15px_rgba(0,0,0,0.9)] border border-white/5 relative flex items-center justify-center overflow-hidden">
                      {/* Pupil */}
                      <div ref={rightEyeRef} className="w-10 h-12 bg-lime-400 rounded-full shadow-[0_0_20px_rgba(163,230,53,0.7)] will-change-transform relative">
                        <div className="absolute top-2 right-2 w-3 h-3 bg-white/80 rounded-full blur-[1px]" />
                      </div>
                    </div>

                  </div>

                  {/* Dynamic SVG Mouth (Scaled Up) */}
                  <div className="z-10 mt-8 relative">
                    <svg viewBox="0 0 120 60" className="w-24 h-12 overflow-visible">
                      <path 
                        ref={mouthRef}
                        d="M 25 35 Q 60 43 95 35" 
                        stroke="rgba(163,230,53,0.9)" 
                        strokeWidth="6" 
                        fill="none" 
                        strokeLinecap="round" 
                        className="drop-shadow-[0_0_10px_rgba(163,230,53,0.7)]"
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
