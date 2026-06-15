import React, { useState, useEffect, useRef, useCallback } from "react";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Existing refs
  const visualRef = useRef(null);
  const rafRef = useRef(null);

  // --- ADVANCED ROBOT, BALL & BUTTERFLY REFS ---
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
  
  // Butterfly Refs (Max 3)
  const bRefs = useRef([]);
  const wLRefs = useRef([]);
  const wRRefs = useRef([]);

  // Caching Bounding Boxes for Extreme Performance (No layout thrashing)
  const bounds = useRef({ cx: window.innerWidth / 2, cy: window.innerHeight / 2, isMobile: false });

  // Physics Engine (Stored in ref to avoid React re-renders, strictly 60fps)
  const physics = useRef({
    time: 0,
    mouseX: 0, mouseY: 0,
    lastMouseX: 0, lastMouseY: 0,
    eyeX: 0, eyeY: 0, eyeVX: 0, eyeVY: 0,
    
    // Morphing Mouth
    mouthW: 35, mouthH: 8, mouthWV: 0, mouthHV: 0, targetMouthW: 35, targetMouthH: 8,
    
    // Blinking
    blinkScaleL: 1, blinkScaleR: 1, blinkVL: 0, blinkVR: 0, targetBlinkL: 1, targetBlinkR: 1,
    isBlinking: false,
    
    // Cheeks & Head
    cheekOp: 0, cheekY: 0, cheekVY: 0, targetCheekOp: 0, targetCheekY: 0,
    headTilt: 0, headTiltV: 0, targetHeadTilt: 0,
    
    // GitHub Ball
    ballX: 0, ballY: 0, ballVX: 0, ballVY: 0, targetBallX: 0, targetBallY: 0,
    
    // Butterflies (Array of 3)
    bugs: Array.from({length: 3}, () => ({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, angle: 0 })),
    
    // Intelligence System
    idleFrames: 0,
    emotion: 'neutral',
    attentionTarget: 'front' // 'cursor', 'ball', 'bug0', 'bug1', 'bug2', 'front'
  });

  // Mathematical Spring Formula for organic, rubbery movement
  const spring = (val, target, vel, stiffness = 0.1, damping = 0.75) => {
    const force = (target - val) * stiffness;
    vel = (vel + force) * damping;
    return [val + vel, vel];
  };

  // Update bounds efficiently on resize
  const updateBounds = useCallback(() => {
    bounds.current.isMobile = window.innerWidth < 768;
    if (robotRef.current) {
      const rect = robotRef.current.getBoundingClientRect();
      bounds.current.cx = rect.left + rect.width / 2;
      bounds.current.cy = rect.top + rect.height / 2;
    }
  }, []);

  // Unified Mouse & Touch Tracker
  const updateCursorPosition = useCallback((clientX, clientY) => {
    const x = (clientX - window.innerWidth / 2) * 0.02;
    const y = (clientY - window.innerHeight / 2) * 0.02;
    if (visualRef.current) {
      visualRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotateY(${x * 0.5}deg) rotateX(${-y * 0.5}deg)`;
    }

    physics.current.mouseX = clientX - bounds.current.cx;
    physics.current.mouseY = clientY - bounds.current.cy;
    physics.current.idleFrames = 0; 
    physics.current.attentionTarget = 'cursor';
  }, []);

  const handleMouseMove = useCallback((e) => updateCursorPosition(e.clientX, e.clientY), [updateCursorPosition]);
  const handleTouchMove = useCallback((e) => {
    if (e.touches.length > 0) updateCursorPosition(e.touches[0].clientX, e.touches[0].clientY);
  }, [updateCursorPosition]);

  // Main 60fps Render Loop
  const renderLoop = useCallback(() => {
    const p = physics.current;
    const isMobile = bounds.current.isMobile;
    p.time += 1;

    // Calculate Speed & Distance
    const speedX = p.mouseX - p.lastMouseX;
    const speedY = p.mouseY - p.lastMouseY;
    const speed = Math.sqrt(speedX * speedX + speedY * speedY);
    const dist = Math.sqrt(p.mouseX * p.mouseX + p.mouseY * p.mouseY);
    
    p.lastMouseX = p.mouseX;
    p.lastMouseY = p.mouseY;

    if (speed < 1) p.idleFrames++;
    
    // --- 1. GITHUB BALL PHYSICS ---
    // Smooth orbit with inertia
    p.targetBallX = Math.sin(p.time * 0.02) * 160 + Math.sin(p.time * 0.05) * 20; 
    p.targetBallY = Math.cos(p.time * 0.015) * 100 - 40 + Math.cos(p.time * 0.04) * 20;
    [p.ballX, p.ballVX] = spring(p.ballX, p.targetBallX, p.ballVX, 0.05, 0.9);
    [p.ballY, p.ballVY] = spring(p.ballY, p.targetBallY, p.ballVY, 0.05, 0.9);
    
    if (githubBallRef.current) {
      githubBallRef.current.style.transform = `translate3d(${p.ballX}px, ${p.ballY}px, 0) rotate(${p.time * 1.5}deg)`;
    }

    // --- 2. BUTTERFLY SWARM PHYSICS (Exclusion Zone around face) ---
    const bugCount = isMobile ? 1 : 3;
    for (let i = 0; i < bugCount; i++) {
      const bug = p.bugs[i];
      // Orbit rules: Radius safely outside the 150px face area
      const baseRadius = 200 + i * 30; 
      const wobble = Math.sin(p.time * 0.02 + i) * 40;
      const radius = baseRadius + wobble;
      
      const angle = p.time * (0.01 + i * 0.003) + (i * Math.PI * 0.6);
      
      // Target position
      let tx = Math.cos(angle) * radius;
      let ty = Math.sin(angle) * radius * 0.7 - 50; 
      
      // Add organic noise
      tx += Math.sin(p.time * 0.05 + i * 2) * 30;
      ty += Math.cos(p.time * 0.04 + i * 2) * 30;

      // Smooth following
      [bug.x, bug.vx] = spring(bug.x, tx, bug.vx, 0.02, 0.85);
      [bug.y, bug.vy] = spring(bug.y, ty, bug.vy, 0.02, 0.85);
      bug.angle = bug.vx * 2; // Tilt based on horizontal velocity

      if (bRefs.current[i]) {
        bRefs.current[i].style.transform = `translate3d(${bug.x}px, ${bug.y}px, 0) rotate(${bug.angle}deg)`;
      }
      if (wLRefs.current[i] && wRRefs.current[i]) {
        const flutter = Math.sin(p.time * 0.6) * 45;
        wLRefs.current[i].style.transform = `rotateY(${flutter}deg)`;
        wRRefs.current[i].style.transform = `rotateY(${-flutter}deg)`;
      }
    }

    // --- 3. INTELLIGENCE & EMOTION SYSTEM ---
    let targetEyeX = 0;
    let targetEyeY = 0;

    // Attention Randomizer when Idle
    if (p.idleFrames > 120) {
      if (p.time % 180 === 0) { // Every 3 seconds, pick something new to look at
        const rand = Math.random();
        if (rand < 0.25) p.attentionTarget = 'ball';
        else if (rand < 0.45 && bugCount > 0) p.attentionTarget = 'bug0';
        else if (rand < 0.65 && bugCount > 1) p.attentionTarget = 'bug1';
        else if (rand < 0.85 && bugCount > 2) p.attentionTarget = 'bug2';
        else p.attentionTarget = 'front';
      }

      // Execute Attention Logic
      if (p.attentionTarget === 'ball') {
        targetEyeX = p.ballX; targetEyeY = p.ballY;
        p.emotion = 'playful';
        p.targetMouthW = 20; p.targetMouthH = 12; // Playful smile
        p.targetCheekOp = 0.3; p.targetCheekY = -5;
        p.targetHeadTilt = (p.ballX / 150) * 10;
      } else if (p.attentionTarget.startsWith('bug')) {
        const idx = parseInt(p.attentionTarget.replace('bug', ''));
        targetEyeX = p.bugs[idx].x; targetEyeY = p.bugs[idx].y;
        p.emotion = 'curious';
        p.targetMouthW = 15; p.targetMouthH = 8; // Gentle curious expression
        p.targetCheekOp = 0.2; p.targetCheekY = -2;
        p.targetHeadTilt = (p.bugs[idx].x / 150) * 15;
      } else {
        targetEyeX = Math.sin(p.time * 0.02) * 15; // Gentle scanning
        targetEyeY = Math.cos(p.time * 0.015) * 10;
        p.emotion = 'idle';
        p.targetMouthW = 25; p.targetMouthH = 8; // Warm resting face
        p.targetCheekOp = 0.1; p.targetCheekY = 0;
        p.targetHeadTilt = Math.sin(p.time * 0.01) * 3;
      }
      
      // Ensure eyes stay wide awake
      if (!p.isBlinking) { p.targetBlinkL = 1; p.targetBlinkR = 1; }

    } 
    // Reactive Logic (User is interacting)
    else if (speed > 40) {
      p.emotion = 'excited';
      p.targetMouthW = 12; p.targetMouthH = 26; // "O" face
      p.targetCheekOp = 0.2; p.targetCheekY = 0;
      if (!p.isBlinking) { p.targetBlinkL = 1.2; p.targetBlinkR = 1.2; }
      p.targetHeadTilt = (speedX / 50) * 20;
      targetEyeX = p.mouseX; targetEyeY = p.mouseY;
    } 
    else if (dist < 200) {
      p.emotion = 'happy';
      p.targetMouthW = 40; p.targetMouthH = 25; // Big smile
      p.targetCheekOp = 0.8; p.targetCheekY = -12;
      if (!p.isBlinking) { p.targetBlinkL = 1; p.targetBlinkR = 1; }
      p.targetHeadTilt = Math.sin(p.time * 0.1) * 6; // Wiggle
      targetEyeX = p.mouseX; targetEyeY = p.mouseY;
    } 
    else if (dist > 600) {
      p.emotion = 'sad'; // Only sad if extremely far away
      p.targetMouthW = 20; p.targetMouthH = -8; // Frown
      p.targetCheekOp = 0;
      if (!p.isBlinking) { p.targetBlinkL = 0.9; p.targetBlinkR = 0.9; }
      p.targetHeadTilt = -4;
      targetEyeX = p.mouseX; targetEyeY = p.mouseY;
    } 
    else {
      p.emotion = 'neutral';
      p.targetMouthW = 35; p.targetMouthH = 8;
      p.targetCheekOp = 0.15; p.targetCheekY = 0;
      if (!p.isBlinking) { p.targetBlinkL = 1; p.targetBlinkR = 1; }
      p.targetHeadTilt = (p.eyeX / 16) * 10;
      targetEyeX = p.mouseX; targetEyeY = p.mouseY;
    }

    // --- 4. RANDOM BLINKING ---
    if (!p.isBlinking && Math.random() < 0.01) {
      p.isBlinking = true;
      p.targetBlinkL = 0.05; p.targetBlinkR = 0.05; 
      setTimeout(() => { p.targetBlinkL = 1; p.targetBlinkR = 1; p.isBlinking = false; }, 150);
    }

    // --- 5. APPLY PHYSICS SPRINGS TO BODY ---
    let destEyeX = Math.max(-18, Math.min(18, targetEyeX / 12));
    let destEyeY = Math.max(-16, Math.min(16, targetEyeY / 12));
    [p.eyeX, p.eyeVX] = spring(p.eyeX, destEyeX, p.eyeVX, 0.15, 0.7);
    [p.eyeY, p.eyeVY] = spring(p.eyeY, destEyeY, p.eyeVY, 0.15, 0.7);

    [p.mouthW, p.mouthWV] = spring(p.mouthW, p.targetMouthW, p.mouthWV, 0.12, 0.7);
    [p.mouthH, p.mouthHV] = spring(p.mouthH, p.targetMouthH, p.mouthHV, 0.12, 0.7);

    [p.blinkScaleL, p.blinkVL] = spring(p.blinkScaleL, p.targetBlinkL, p.blinkVL, 0.3, 0.5);
    [p.blinkScaleR, p.blinkVR] = spring(p.blinkScaleR, p.targetBlinkR, p.blinkVR, 0.3, 0.5);

    [p.cheekOp] = spring(p.cheekOp, p.targetCheekOp, 0, 0.08, 0.8);
    [p.cheekY, p.cheekVY] = spring(p.cheekY, p.targetCheekY, p.cheekVY, 0.1, 0.7);
    [p.headTilt, p.headTiltV] = spring(p.headTilt, p.targetHeadTilt, p.headTiltV, 0.08, 0.75);

    // --- 6. HIGH PERFORMANCE DOM UPDATES ---
    if (leftEyeRef.current) leftEyeRef.current.style.transform = `translate3d(${p.eyeX}px, ${p.eyeY}px, 0) scaleY(${p.blinkScaleL})`;
    if (rightEyeRef.current) rightEyeRef.current.style.transform = `translate3d(${p.eyeX}px, ${p.eyeY}px, 0) scaleY(${p.blinkScaleR})`;

    if (mouthRef.current) {
      mouthRef.current.setAttribute('d', `M ${60 - p.mouthW} 35 Q 60 ${35 + p.mouthH} ${60 + p.mouthW} 35`);
    }

    if (leftCheekRef.current && rightCheekRef.current) {
      leftCheekRef.current.style.opacity = p.cheekOp;
      rightCheekRef.current.style.opacity = p.cheekOp;
      leftCheekRef.current.style.transform = `translate3d(0, ${p.cheekY}px, 0)`;
      rightCheekRef.current.style.transform = `translate3d(0, ${p.cheekY}px, 0)`;
    }

    if (robotRef.current) {
      const breathY = Math.sin(p.time * 0.05) * 4; // Continuous gentle breathing
      robotRef.current.style.transform = `translate3d(0, ${breathY}px, 0) rotateZ(${p.headTilt}deg)`;
    }

    if (robotGlowRef.current) {
      const glowScale = 1 + (p.cheekOp * 0.2);
      robotGlowRef.current.style.transform = `scale3d(${glowScale}, ${glowScale}, 1)`;
      robotGlowRef.current.style.opacity = 0.15 + (p.cheekOp * 0.15);
    }

    if (leftEarRef.current && rightEarRef.current) {
      let earRot = Math.sin(p.time * 0.1) * (p.emotion === 'happy' ? 12 : 4);
      leftEarRef.current.style.transform = `rotate(${-earRot}deg)`;
      rightEarRef.current.style.transform = `rotate(${earRot}deg)`;
    }

    rafRef.current = requestAnimationFrame(renderLoop);
  }, []);

  useEffect(() => {
    setIsVisible(true);
    updateBounds();
    window.addEventListener("resize", updateBounds);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchMove, { passive: true });
    
    rafRef.current = requestAnimationFrame(renderLoop);
    
    return () => {
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleTouchMove, renderLoop, updateBounds]);

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
        {/* RIGHT VISUAL CENTERPIECE - HIGH PERFORMANCE */}
        {/* ========================================= */}
        <div className={`flex relative h-full items-center justify-center transition-all duration-1000 ease-out delay-500 mt-16 lg:mt-0 scale-75 sm:scale-90 lg:scale-100 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
          
          <div ref={visualRef} className="relative w-full max-w-lg flex items-center justify-center" style={{ perspective: "1000px" }}>
            
            {/* Super Fast Radial Gradient Glow */}
            <div ref={robotGlowRef} className="absolute inset-0 bg-[radial-gradient(circle,rgba(163,230,53,0.35)_0%,transparent_70%)] transition-opacity duration-300 will-change-transform" style={{ opacity: 0.15 }} />

            {/* THE BUTTERFLY SWARM (1 on mobile, 3 on desktop) */}
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                ref={el => bRefs.current[i] = el} 
                className={`absolute z-40 flex items-center justify-center will-change-transform pointer-events-none ${i > 0 ? 'hidden md:flex' : ''}`}
              >
                <svg viewBox="0 0 100 100" className={`w-${i === 0 ? '16' : '10'} h-${i === 0 ? '16' : '10'} overflow-visible`}>
                  {/* Clean SVG without expensive filters */}
                  <g ref={el => wLRefs.current[i] = el} style={{ transformOrigin: '50px 50px', willChange: 'transform' }}>
                    <path d="M 48 45 C 20 10, -10 30, 5 60 C 15 80, 40 60, 48 55 Z" fill="rgba(163,230,53,0.4)" stroke="#bef264" strokeWidth="1" />
                    <path d="M 48 55 C 30 70, 10 90, 20 95 C 35 100, 45 80, 48 65 Z" fill="rgba(163,230,53,0.2)" stroke="#bef264" strokeWidth="0.5" />
                  </g>
                  <g ref={el => wRRefs.current[i] = el} style={{ transformOrigin: '50px 50px', willChange: 'transform' }}>
                    <path d="M 52 45 C 80 10, 110 30, 95 60 C 85 80, 60 60, 52 55 Z" fill="rgba(163,230,53,0.4)" stroke="#bef264" strokeWidth="1" />
                    <path d="M 52 55 C 70 70, 90 90, 80 95 C 65 100, 55 80, 52 65 Z" fill="rgba(163,230,53,0.2)" stroke="#bef264" strokeWidth="0.5" />
                  </g>
                  <rect x="47" y="40" width="6" height="24" rx="3" fill="#fff" />
                </svg>
              </div>
            ))}

            {/* Floating GitHub Physics Ball */}
            <div ref={githubBallRef} className="absolute z-30 w-14 h-14 bg-[#111] border border-white/10 rounded-full flex items-center justify-center will-change-transform shadow-[0_0_20px_rgba(0,0,0,0.5)]">
               <svg className="w-8 h-8 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>

            {/* Static Code Tag Decorator */}
            <div className="absolute -bottom-16 -left-12 w-20 h-20 bg-[#111] border border-white/5 rounded-full flex items-center justify-center shadow-2xl z-20 animate-float" style={{ animationDelay: '1s' }}>
              <span className="text-lime-400 font-bold font-mono text-xl">{"</>"}</span>
            </div>

            {/* === THE ROBOT CHARACTER (Premium & Clean) === */}
            <div ref={robotRef} className="relative z-10 will-change-transform">
              
              {/* Ears / Antennas */}
              <div className="absolute top-1/2 -left-5 w-8 h-16 bg-[#111] border border-white/5 rounded-l-full shadow-xl" ref={leftEarRef} style={{ transformOrigin: 'right center' }}>
                <div className="absolute top-1/2 left-2.5 w-1.5 h-6 bg-lime-400/60 rounded-full -translate-y-1/2" />
              </div>
              <div className="absolute top-1/2 -right-5 w-8 h-16 bg-[#111] border border-white/5 rounded-r-full shadow-xl" ref={rightEarRef} style={{ transformOrigin: 'left center' }}>
                 <div className="absolute top-1/2 right-2.5 w-1.5 h-6 bg-lime-400/60 rounded-full -translate-y-1/2" />
              </div>

              {/* Main Head - Clean Luxury Styling */}
              <div className="w-[360px] h-[310px] bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-[4rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col items-center justify-center p-7">
                
                {/* Specular Highlight */}
                <div className="absolute top-2 left-10 right-10 h-6 bg-gradient-to-b from-white/[0.12] to-transparent rounded-full pointer-events-none z-20" />

                {/* Inner Screen */}
                <div className="w-full h-full bg-[#050505] rounded-[3.2rem] border border-white/5 shadow-[inset_0_15px_40px_rgba(0,0,0,0.9)] relative flex flex-col items-center justify-center overflow-hidden">
                  
                  {/* Performance Safe Emotion Cheeks (Radial Gradients) */}
                  <div ref={leftCheekRef} className="absolute top-32 left-8 w-24 h-16 bg-[radial-gradient(circle,rgba(163,230,53,0.5)_0%,transparent_70%)] opacity-0 will-change-transform" />
                  <div ref={rightCheekRef} className="absolute top-32 right-8 w-24 h-16 bg-[radial-gradient(circle,rgba(163,230,53,0.5)_0%,transparent_70%)] opacity-0 will-change-transform" />

                  {/* Eyes Container */}
                  <div className="flex gap-14 z-10 relative mt-4">
                    {/* Left Eye Socket */}
                    <div className="w-16 h-20 bg-[#0a0a0a] rounded-full shadow-[inset_0_8px_20px_rgba(0,0,0,0.9)] border border-white/5 relative flex items-center justify-center overflow-hidden">
                      <div ref={leftEyeRef} className="w-10 h-12 bg-lime-400 rounded-full will-change-transform relative shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                        <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-white/90 rounded-full" />
                      </div>
                    </div>

                    {/* Right Eye Socket */}
                    <div className="w-16 h-20 bg-[#0a0a0a] rounded-full shadow-[inset_0_8px_20px_rgba(0,0,0,0.9)] border border-white/5 relative flex items-center justify-center overflow-hidden">
                      <div ref={rightEyeRef} className="w-10 h-12 bg-lime-400 rounded-full will-change-transform relative shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                        <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-white/90 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic SVG Mouth */}
                  <div className="z-10 mt-8 relative">
                    <svg viewBox="0 0 120 60" className="w-24 h-12 overflow-visible">
                      <path 
                        ref={mouthRef}
                        d="M 25 35 Q 60 43 95 35" 
                        stroke="#a3e635" 
                        strokeWidth="7" 
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
