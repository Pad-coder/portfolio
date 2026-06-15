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
  const githubBallRef = useRef(null);
  const robotGlowRef = useRef(null);

  // Physics Engine (Kept in ref to avoid React re-renders, strictly 60fps)
  const physics = useRef({
    time: 0,
    mouseX: 0, mouseY: 0,
    lastMouseX: 0, lastMouseY: 0,
    eyeX: 0, eyeY: 0, eyeVX: 0, eyeVY: 0,
    
    // Mouth Spring
    mouthW: 30, mouthH: 5, mouthWV: 0, mouthHV: 0, targetMouthW: 30, targetMouthH: 5,
    
    // Blinking & Winking
    blinkScaleL: 1, blinkScaleR: 1, blinkVL: 0, blinkVR: 0, targetBlinkL: 1, targetBlinkR: 1,
    isBlinking: false,
    
    // Cheeks & Head
    cheekOp: 0, cheekY: 0, cheekVY: 0, targetCheekOp: 0, targetCheekY: 0,
    headTilt: 0, headTiltV: 0, targetHeadTilt: 0,
    
    idleFrames: 0,
    emotion: 'neutral',
    ballX: 0, ballY: 0
  });

  // Mathematical Spring Formula for organic movement
  const spring = (val, target, vel, stiffness = 0.1, damping = 0.75) => {
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

    if (speed < 1) p.idleFrames++;
    
    // --- GITHUB BALL PHYSICS (Orbiting) ---
    p.ballX = Math.sin(p.time * 0.02) * 140; // Wide Orbit X
    p.ballY = Math.cos(p.time * 0.015) * 90 - 40 + Math.sin(p.time * 0.08) * 15; // Orbit Y + Bobbing
    
    if (githubBallRef.current) {
      githubBallRef.current.style.transform = `translate3d(${p.ballX}px, ${p.ballY}px, 0) rotate(${p.time * 1.5}deg)`;
    }

    let targetEyeX = p.mouseX;
    let targetEyeY = p.mouseY;
    let isWatchingBall = false;
    
    // --- EMOTIONAL STATE MACHINE ---
    if (p.idleFrames > 600) {
      // SLEEPY (Idle > 10 seconds)
      p.emotion = 'sleepy';
      p.targetMouthW = 15; p.targetMouthH = 0; // Flat tiny mouth
      p.targetCheekOp = 0; p.targetCheekY = 0;
      p.targetBlinkL = 0.2; p.targetBlinkR = 0.2; // Eyes half closed
      p.targetHeadTilt = 12; // Head droops to the side
      targetEyeX = 0; targetEyeY = 20; // Looking down
    } 
    else if (p.idleFrames > 120) {
      // CURIOUS (Idle > 2 seconds: Watching the floating GitHub ball)
      p.emotion = 'curious';
      isWatchingBall = true;
      targetEyeX = p.ballX; 
      targetEyeY = p.ballY;
      p.targetMouthW = 12; p.targetMouthH = 12; // "Ooh" face
      p.targetCheekOp = 0.4; p.targetCheekY = -2;
      if (!p.isBlinking) { p.targetBlinkL = 1; p.targetBlinkR = 1; }
      p.targetHeadTilt = (p.ballX / 100) * 15; // Tilts head following the ball
    } 
    else if (speed > 30) {
      // SURPRISED / DIZZY (Moving mouse very fast)
      p.emotion = 'surprised';
      p.targetMouthW = 10; p.targetMouthH = 20; // Tall narrow "O" mouth
      p.targetCheekOp = 0.3; p.targetCheekY = 0;
      if (!p.isBlinking) { p.targetBlinkL = 1.3; p.targetBlinkR = 1.3; } // Eyes wide open
      p.targetHeadTilt = (speedX / 50) * 25; // Reactive tilt to momentum
    } 
    else if (dist < 180) {
      // HAPPY / EXCITED (Hovering very close to robot)
      p.emotion = 'happy';
      p.targetMouthW = 35; p.targetMouthH = 25; // Big wide smile
      p.targetCheekOp = 0.9; p.targetCheekY = -12; // Glowing cheeks rise up
      if (!p.isBlinking) { p.targetBlinkL = 1; p.targetBlinkR = 1; }
      p.targetHeadTilt = Math.sin(p.time * 0.1) * 6; // Happy little wiggle
    } 
    else if (dist > 500) {
      // SAD (Cursor abandoned it far away)
      p.emotion = 'sad';
      p.targetMouthW = 25; p.targetMouthH = -10; // Frown
      p.targetCheekOp = 0; p.targetCheekY = 0;
      if (!p.isBlinking) { p.targetBlinkL = 0.8; p.targetBlinkR = 0.8; }
      p.targetHeadTilt = -4; // Slight depressed tilt
    } 
    else {
      // NEUTRAL (Normal tracking)
      p.emotion = 'neutral';
      p.targetMouthW = 30; p.targetMouthH = 6; // Pleasant curve
      p.targetCheekOp = 0.2; p.targetCheekY = 0;
      if (!p.isBlinking) { p.targetBlinkL = 1; p.targetBlinkR = 1; }
      p.targetHeadTilt = (p.eyeX / 14) * 8; // Slight tilt depending on where it looks
    }

    // --- RANDOM BLINKING & WINKING ---
    if (!p.isBlinking && Math.random() < 0.008) {
      p.isBlinking = true;
      
      // 15% chance to wink if happy or neutral
      if (Math.random() < 0.15 && (p.emotion === 'happy' || p.emotion === 'neutral')) {
        p.targetBlinkL = 0.05; // Wink left eye
        setTimeout(() => { p.targetBlinkL = 1; p.isBlinking = false; }, 200);
      } else {
        // Normal Blink
        p.targetBlinkL = 0.05; p.targetBlinkR = 0.05; 
        setTimeout(() => { p.targetBlinkL = 1; p.targetBlinkR = 1; p.isBlinking = false; }, 150);
      }
    }

    // --- APPLY PHYSICS SPRINGS ---
    // 1. Eye Position Constraint
    let destEyeX = Math.max(-14, Math.min(14, targetEyeX / 15));
    let destEyeY = Math.max(-12, Math.min(12, targetEyeY / 15));

    [p.eyeX, p.eyeVX] = spring(p.eyeX, destEyeX, p.eyeVX, 0.15, 0.7);
    [p.eyeY, p.eyeVY] = spring(p.eyeY, destEyeY, p.eyeVY, 0.15, 0.7);

    // 2. Dynamic Mouth Morphing
    [p.mouthW, p.mouthWV] = spring(p.mouthW, p.targetMouthW, p.mouthWV, 0.12, 0.7);
    [p.mouthH, p.mouthHV] = spring(p.mouthH, p.targetMouthH, p.mouthHV, 0.12, 0.7);

    // 3. Blinking / Winking
    [p.blinkScaleL, p.blinkVL] = spring(p.blinkScaleL, p.targetBlinkL, p.blinkVL, 0.3, 0.5);
    [p.blinkScaleR, p.blinkVR] = spring(p.blinkScaleR, p.targetBlinkR, p.blinkVR, 0.3, 0.5);

    // 4. Cheeks & Head Tilt
    [p.cheekOp] = spring(p.cheekOp, p.targetCheekOp, 0, 0.05, 0.8); // Direct lerp for opacity
    [p.cheekY, p.cheekVY] = spring(p.cheekY, p.targetCheekY, p.cheekVY, 0.1, 0.7);
    [p.headTilt, p.headTiltV] = spring(p.headTilt, p.targetHeadTilt, p.headTiltV, 0.08, 0.75);

    // --- APPLY DOM TRANSFORMS ---
    if (leftEyeRef.current) leftEyeRef.current.style.transform = `translate3d(${p.eyeX}px, ${p.eyeY}px, 0) scaleY(${p.blinkScaleL})`;
    if (rightEyeRef.current) rightEyeRef.current.style.transform = `translate3d(${p.eyeX}px, ${p.eyeY}px, 0) scaleY(${p.blinkScaleR})`;

    if (mouthRef.current) {
      // Procedural SVG Quadratic Bezier Curve for infinite mouth shapes
      mouthRef.current.setAttribute('d', `M ${50 - p.mouthW} 25 Q 50 ${25 + p.mouthH} ${50 + p.mouthW} 25`);
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
      const breathDepth = p.emotion === 'sleepy' ? 6 : 3;
      const breathY = Math.sin(p.time * breathSpeed) * breathDepth;
      
      robotRef.current.style.transform = `translateY(${breathY}px) rotateZ(${p.headTilt}deg)`;
    }

    // Ambient Glow reacts to happiness
    if (robotGlowRef.current) {
      const glowScale = 1 + (p.cheekOp * 0.3);
      robotGlowRef.current.style.transform = `scale(${glowScale})`;
      robotGlowRef.current.style.opacity = 0.15 + (p.cheekOp * 0.2);
    }

    // Antennas react to mood
    if (leftEarRef.current && rightEarRef.current) {
      const earRot = Math.sin(p.time * 0.1) * (p.emotion === 'happy' ? 15 : 2);
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
            <div ref={robotGlowRef} className="absolute inset-0 bg-lime-400 blur-[90px] rounded-full transition-opacity duration-300" style={{ opacity: 0.15 }} />

            {/* Floating GitHub Physics Ball (Converted from Box to a perfect Orbiting Sphere) */}
            <div ref={githubBallRef} className="absolute z-30 w-14 h-14 bg-[#111] border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.2)] backdrop-blur-xl">
               <svg className="w-8 h-8 text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.6)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>

            {/* Static Code Tag Decorator */}
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-[#0d0d0d] border border-white/10 rounded-full flex items-center justify-center shadow-2xl z-20 animate-float" style={{ animationDelay: '1s' }}>
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
                <div className="absolute top-2 left-6 right-6 h-6 bg-gradient-to-b from-white/[0.15] to-transparent rounded-full blur-[2px] pointer-events-none z-20" />

                {/* Inner Screen (Face Area) */}
                <div className="w-full h-full bg-[#030303] rounded-[2.5rem] border border-white/5 shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)] relative flex flex-col items-center justify-center overflow-hidden">
                  
                  {/* Digital Screen Scanlines (Subtle) */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

                  {/* Emotion Cheeks */}
                  <div ref={leftCheekRef} className="absolute top-24 left-8 w-14 h-8 bg-lime-400 blur-[14px] opacity-0 rounded-full will-change-transform" />
                  <div ref={rightCheekRef} className="absolute top-24 right-8 w-14 h-8 bg-lime-400 blur-[14px] opacity-0 rounded-full will-change-transform" />

                  {/* Eyes Container */}
                  <div className="flex gap-10 z-10 relative mt-2">
                    
                    {/* Left Eye Socket */}
                    <div className="w-14 h-16 bg-[#0a0a0a] rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] border border-white/5 relative flex items-center justify-center overflow-hidden">
                      {/* Pupil */}
                      <div ref={leftEyeRef} className="w-8 h-10 bg-lime-400 rounded-full shadow-[0_0_15px_rgba(163,230,53,0.6)] will-change-transform relative">
                        {/* Eye Reflection */}
                        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-white/80 rounded-full blur-[1px]" />
                      </div>
                    </div>

                    {/* Right Eye Socket */}
                    <div className="w-14 h-16 bg-[#0a0a0a] rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] border border-white/5 relative flex items-center justify-center overflow-hidden">
                      {/* Pupil */}
                      <div ref={rightEyeRef} className="w-8 h-10 bg-lime-400 rounded-full shadow-[0_0_15px_rgba(163,230,53,0.6)] will-change-transform relative">
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
                        d="M 20 25 Q 50 30 80 25" 
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
