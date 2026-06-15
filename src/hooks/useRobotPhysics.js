import { useEffect, useRef, useCallback } from "react";
import { sharedPhysics } from "../components/Github.jsx";

const catchPhrases = ["Gotcha!", "Nice throw!", "Too easy!", "My turn!", "Catch me if you can!", "Yay! Let's build!", "Wheee!", "Ooh, close one!", "You're good at this!", "Let's goooo!"];
const idlePhrases = ["👋 Hi there!", "Check my GitHub!", "🚀 Welcome!", "Let's build!"];
const throwPhrases = ["Whoa!", "Fast!", "Incoming!", "Yikes!", "That was close!", "Nice try!", "Phew!", "Whoa, a curveball!", "Zoom!", "That was a rocket!"];

const spring = (val, target, vel, stiffness = 0.1, damping = 0.75) => {
  const force = (target - val) * stiffness;
  vel = (vel + force) * damping;
  return [val + vel, vel];
};

export const useRobotPhysics = () => {
  // Consolidate all DOM refs required by the physics engine
  const refs = {
    visual: useRef(null),
    robot: useRef(null),
    leftEye: useRef(null),
    rightEye: useRef(null),
    highlightL: useRef(null),
    highlightR: useRef(null),
    mouth: useRef(null),
    leftCheek: useRef(null),
    rightCheek: useRef(null),
    leftEar: useRef(null),
    rightEar: useRef(null),
    robotGlow: useRef(null),
    bubble: useRef(null),
    catchRipple: useRef(null),
    bugs: useRef([]),
    wingL: useRef([]),
    wingR: useRef([])
  };

  const robotRect = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const rafRef = useRef(null);
  const bubbleTimer = useRef(null);

  // Independent Physics Engine State (Zero React Renders)
  const physics = useRef({
    time: 0,
    mouseX: 0, mouseY: 0, lastMouseX: 0, lastMouseY: 0, scrollY: 0,
    eyeX: 0, eyeY: 0, eyeVX: 0, eyeVY: 0,
    mouthW: 35, mouthH: 8, mouthWV: 0, mouthHV: 0, targetMouthW: 35, targetMouthH: 8,
    blinkScaleL: 1, blinkScaleR: 1, blinkVL: 0, blinkVR: 0, targetBlinkL: 1, targetBlinkR: 1,
    isBlinking: false,
    cheekOp: 0, cheekY: 0, cheekVY: 0, targetCheekOp: 0, targetCheekY: 0,
    headTilt: 0, headTiltV: 0, targetHeadTilt: 0,
    idleFrames: 0, emotion: 'neutral',
    isCatching: 0, catchCooldown: 0, flinchFrames: 0, celebrateFrames: 0,
    bugs: Array.from({ length: 6 }, (_, i) => ({
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 600 - 100,
      vx: 0, vy: 0, tx: 0, ty: 0,
      isScared: false,
      isActive: i < (typeof window !== 'undefined' && window.innerWidth < 768 ? 3 : 6),
      shape: i % 4, 
      depth: i % 3, 
      speedOff: Math.random() * 0.006 + 0.004,
      radiusX: Math.random() * 250 + 200, 
      radiusY: Math.random() * 150 + 150,
      phase: Math.random() * Math.PI * 2,
      behavior: Math.random() > 0.5 ? 'follow' : 'avoid'
    }))
  });

  const showBubble = useCallback((text) => {
    if (!refs.bubble.current) return;
    refs.bubble.current.innerText = text;
    refs.bubble.current.style.opacity = '1';
    refs.bubble.current.style.transform = 'translate3d(-50%, 0, 0) scale3d(1, 1, 1)';
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => {
      if (refs.bubble.current) {
        refs.bubble.current.style.opacity = '0';
        refs.bubble.current.style.transform = 'translate3d(-50%, 10px, 0) scale3d(0.9, 0.9, 1)';
      }
    }, 2500);
  }, []);

  const triggerRipple = useCallback(() => {
    if (!refs.catchRipple.current) return;
    refs.catchRipple.current.style.transition = 'none';
    refs.catchRipple.current.style.transform = 'scale3d(0.5, 0.5, 1)';
    refs.catchRipple.current.style.opacity = '1';
    void refs.catchRipple.current.offsetWidth;
    refs.catchRipple.current.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    refs.catchRipple.current.style.transform = 'scale3d(2.5, 2.5, 1)';
    refs.catchRipple.current.style.opacity = '0';
  }, []);

  const updateRect = useCallback(() => {
    if (refs.robot.current) {
      const rect = refs.robot.current.getBoundingClientRect();
      robotRect.current = { x: rect.left, y: rect.top, w: rect.width, h: rect.height };
    }
  }, []);

  const updateCursorPosition = useCallback((clientX, clientY) => {
    const x = (clientX - window.innerWidth / 2) * 0.02;
    const y = (clientY - window.innerHeight / 2) * 0.02;
    if (refs.visual.current) {
      refs.visual.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotateY(${x * 0.5}deg) rotateX(${-y * 0.5}deg)`;
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

  useEffect(() => {
    sharedPhysics.on('clicked', () => {
      showBubble("Yay! Let's build!");
      physics.current.celebrateFrames = 90;
    });
    sharedPhysics.on('released', () => {
      physics.current.idleFrames = 0;
      if (Math.random() > 0.7) showBubble("Wheee!");
    });
    sharedPhysics.on('bounced', (impact) => {
      const b = sharedPhysics.ball;
      const faceX = robotRect.current.x + robotRect.current.w / 2;
      const faceY = robotRect.current.y + robotRect.current.h / 2;
      const dist = Math.sqrt((b.x - faceX)**2 + (b.y - faceY)**2);
      
      if (dist < 400) {
        physics.current.flinchFrames = 30;
        if (impact > 15) showBubble(throwPhrases[Math.floor(Math.random() * throwPhrases.length)]);
      }
    });
  }, [showBubble]);

  const renderLoop = useCallback(() => {
    const p = physics.current;
    const b = sharedPhysics.ball;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    p.time += 1;

    const speedX = p.mouseX - p.lastMouseX;
    const speedY = p.mouseY - p.lastMouseY;
    const mouseSpeed = Math.sqrt(speedX**2 + speedY**2);
    
    p.lastMouseX = p.mouseX; p.lastMouseY = p.mouseY;
    if (mouseSpeed < 1) p.idleFrames++;

    const faceX = robotRect.current.x + robotRect.current.w / 2;
    const faceY = robotRect.current.y + robotRect.current.h / 2;
    const ballDx = b.x - faceX;
    const ballDy = b.y - faceY;
    const ballDist = Math.sqrt(ballDx**2 + ballDy**2);
    const ballSpeed = Math.sqrt(b.vx**2 + b.vy**2);

    // CATCH ENGINE
    if (ballDist < 160 && !b.isGrabbed && ballSpeed > 3 && p.catchCooldown <= 0 && p.flinchFrames <= 0) {
      p.catchCooldown = 180; 
      p.isCatching = 40; 
      sharedPhysics.actions.pause = 40; 
      showBubble(catchPhrases[Math.floor(Math.random() * catchPhrases.length)]);
      triggerRipple();
    }

    if (p.catchCooldown > 0) p.catchCooldown--;
    if (p.isCatching > 0) {
      p.isCatching--;
      if (p.isCatching === 0) {
        sharedPhysics.actions.forceX = (ballDx / ballDist) * 25;
        sharedPhysics.actions.forceY = (ballDy / ballDist) * 25 - 5;
      }
    }

    // BUTTERFLY FLOCKING
    for (let i = 0; i < 6; i++) {
      const bug = p.bugs[i];
      if (!bug.isActive || reducedMotion) continue;

      let tX = Math.sin(p.time * bug.speedOff + bug.phase) * bug.radiusX + Math.cos(p.time * 0.005 + bug.phase) * 50;
      let tY = Math.cos(p.time * (bug.speedOff * 0.8) + bug.phase) * bug.radiusY - 80 + Math.sin(p.time * 0.007 + bug.phase) * 40;

      const bDx = b.x - faceX - bug.x;
      const bDy = b.y - faceY - bug.y;
      const bDist = Math.sqrt(bDx**2 + bDy**2);
      
      if (bDist < 300 || b.isGrabbed || ballSpeed > 10) {
        bug.isScared = true;
        if (bDist > 0) {
           const escapeFactor = Math.min(300 / bDist, 3);
           tX -= (bDx / bDist) * escapeFactor * 150;
           tY -= (bDy / bDist) * escapeFactor * 150 - 50;
        }
      } else {
        bug.isScared = false;
      }

      const mDx = p.mouseX - bug.x;
      const mDy = p.mouseY - bug.y;
      const mDist = Math.sqrt(mDx**2 + mDy**2);

      if (mDist < 250 && !isMobile && !bug.isScared && mDist > 0) {
        if (bug.behavior === 'follow') {
           tX += mDx * 0.15;
           tY += mDy * 0.15;
        } else {
           const pushFactor = (250 - mDist) / 250; 
           tX -= (mDx / mDist) * pushFactor * 120;
           tY -= (mDy / mDist) * pushFactor * 120;
        }
      }

      const stiffness = bug.isScared ? 0.04 : 0.015;
      [bug.x, bug.vx] = spring(bug.x, tX, bug.vx, stiffness, 0.85);
      [bug.y, bug.vy] = spring(bug.y, tY, bug.vy, stiffness, 0.85);
    }

    // ATTENTION SYSTEM
    let targetEyeX = p.mouseX;
    let targetEyeY = p.mouseY;
    
    if (p.isCatching > 0) {
      p.emotion = 'excited'; targetEyeX = ballDx; targetEyeY = ballDy;
      p.targetMouthW = 40; p.targetMouthH = 20; p.targetBlinkL = 1.2; p.targetBlinkR = 1.2;
      p.targetHeadTilt = (ballDx / 150) * 15;
    } else if (p.flinchFrames > 0) {
      p.flinchFrames--; p.emotion = 'surprised'; targetEyeX = -ballDx; targetEyeY = -ballDy; 
      p.targetMouthW = 10; p.targetMouthH = 20; p.targetBlinkL = 0.1; p.targetBlinkR = 0.1; 
      p.targetHeadTilt = (ballDx > 0 ? -25 : 25); 
    } else if (p.celebrateFrames > 0) {
      p.celebrateFrames--; p.emotion = 'happy'; targetEyeX = ballDx; targetEyeY = ballDy;
      p.targetMouthW = 45; p.targetMouthH = 30; p.targetCheekOp = 0.9; p.targetCheekY = -15;
      p.targetHeadTilt = Math.sin(p.time * 0.2) * 10;
      if (!p.isBlinking) { p.targetBlinkL = 1; p.targetBlinkR = 1; }
    } else if (b.isGrabbed || (ballSpeed > 5 && ballDist < 600)) {
      targetEyeX = ballDx; targetEyeY = ballDy;
      const isIncoming = (b.vx * ballDx + b.vy * ballDy) < 0; 
      if (isIncoming && ballSpeed > 15 && ballDist < 350) {
        p.emotion = 'dodging'; p.targetMouthW = 15; p.targetMouthH = 25; p.targetBlinkL = 0.3; p.targetBlinkR = 0.3; p.targetHeadTilt = ballDx > 0 ? -20 : 20;
      } else if (b.isGrabbed) {
        p.emotion = 'curious'; p.targetMouthW = 15; p.targetMouthH = 15; p.targetCheekOp = 0.4; p.targetHeadTilt = (ballDx / 150) * 10;
      } else {
        p.emotion = 'playful'; p.targetMouthW = 30; p.targetMouthH = 10; p.targetHeadTilt = (ballDx / 200) * 10;
      }
    } else if ((b.y > window.innerHeight - 50 || b.y < 50 || b.x < 50 || b.x > window.innerWidth - 50) && b.state === 'idle') {
      p.emotion = 'sad'; targetEyeX = ballDx; targetEyeY = ballDy; p.targetMouthW = 20; p.targetMouthH = -8; p.targetCheekOp = 0; p.targetCheekY = 0;
      if (!p.isBlinking) { p.targetBlinkL = 0.8; p.targetBlinkR = 0.8; } p.targetHeadTilt = -5;
    } else {
      if (p.idleFrames > 120) {
        const cycle = Math.floor(p.time / 400) % 3; 
        if (cycle === 0) { 
          let nearest = p.bugs[0]; targetEyeX = nearest.x; targetEyeY = nearest.y;
          p.targetMouthW = 14; p.targetMouthH = 14; p.targetHeadTilt = (targetEyeX / 150) * 12; p.targetCheekOp = 0.3; p.targetCheekY = -5;
        } else if (cycle === 1) { 
          targetEyeX = 0; targetEyeY = 0; p.targetMouthW = 35; p.targetMouthH = -5; p.targetHeadTilt = Math.sin(p.time * 0.05) * 6; p.targetCheekOp = 0.5; p.targetCheekY = -2;
          if (p.time % 800 === 0) showBubble(idlePhrases[Math.floor(Math.random() * idlePhrases.length)]);
        } else {
          targetEyeX = ballDx; targetEyeY = ballDy; p.targetMouthW = 25; p.targetMouthH = 5; p.targetHeadTilt = (ballDx / 200) * 8; p.targetCheekOp = 0.1;
        }
        if (!p.isBlinking) { p.targetBlinkL = 1; p.targetBlinkR = 1; }
      } else if (mouseSpeed > 30) {
        p.targetMouthW = 10; p.targetMouthH = 25; p.targetCheekOp = 0.2; p.targetCheekY = 0; p.targetHeadTilt = (speedX / 50) * 20; 
        if (!p.isBlinking) { p.targetBlinkL = 1.3; p.targetBlinkR = 1.3; } 
      } else {
        p.targetMouthW = 35; p.targetMouthH = 8; p.targetCheekOp = 0.1; p.targetCheekY = 0; p.targetHeadTilt = (p.eyeX / 16) * 10; 
        if (!p.isBlinking) { p.targetBlinkL = 1; p.targetBlinkR = 1; }
      }
    }

    // BLINKING
    if (!p.isBlinking && Math.random() < 0.008) {
      p.isBlinking = true;
      if (Math.random() < 0.15 && (p.emotion === 'happy' || p.emotion === 'neutral')) {
        p.targetBlinkL = 0.05; setTimeout(() => { p.targetBlinkL = 1; p.isBlinking = false; }, 200);
      } else {
        p.targetBlinkL = 0.05; p.targetBlinkR = 0.05; setTimeout(() => { p.targetBlinkL = 1; p.targetBlinkR = 1; p.isBlinking = false; }, 150);
      }
    }

    // APPLY SPRINGS
    let destEyeX = Math.max(-16, Math.min(16, targetEyeX / 12));
    let destEyeY = Math.max(-14, Math.min(14, targetEyeY / 12));
    
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const scrollOffset = (window.scrollY - p.scrollY) * 0.5;
      destEyeY = Math.max(-14, Math.min(14, destEyeY + scrollOffset));
      p.scrollY = window.scrollY;
    }

    [p.eyeX, p.eyeVX] = spring(p.eyeX, destEyeX, p.eyeVX, 0.15, 0.7);
    [p.eyeY, p.eyeVY] = spring(p.eyeY, destEyeY, p.eyeVY, 0.15, 0.7);
    [p.mouthW, p.mouthWV] = spring(p.mouthW, p.targetMouthW, p.mouthWV, 0.12, 0.7);
    [p.mouthH, p.mouthHV] = spring(p.mouthH, p.targetMouthH, p.mouthHV, 0.12, 0.7);
    [p.blinkScaleL, p.blinkVL] = spring(p.blinkScaleL, p.targetBlinkL, p.blinkVL, 0.3, 0.5);
    [p.blinkScaleR, p.blinkVR] = spring(p.blinkScaleR, p.targetBlinkR, p.blinkVR, 0.3, 0.5);
    [p.cheekOp] = spring(p.cheekOp, p.targetCheekOp, 0, 0.05, 0.8);
    [p.cheekY, p.cheekVY] = spring(p.cheekY, p.targetCheekY, p.cheekVY, 0.1, 0.7);
    [p.headTilt, p.headTiltV] = spring(p.headTilt, p.targetHeadTilt, p.headTiltV, 0.08, 0.75);

    // DOM TRANSFORMS
    for (let i = 0; i < 6; i++) {
      const bug = p.bugs[i];
      if (!bug.isActive || !refs.bugs.current[i]) continue;
      const tilt = (bug.x - p.bugs[i].tx) * -0.2; 
      refs.bugs.current[i].style.transform = `translate3d(${bug.x}px, ${bug.y}px, 0) rotate(${tilt}deg)`;
      
      if (refs.wingL.current[i] && refs.wingR.current[i]) {
        const flutterSpeed = bug.isScared ? 1.5 : 0.6;
        const flutterAmp = bug.isScared ? 60 : 40;
        const flutter = Math.sin(p.time * flutterSpeed + bug.phase) * flutterAmp;
        refs.wingL.current[i].style.transform = `rotateY(${flutter}deg)`;
        refs.wingR.current[i].style.transform = `rotateY(${-flutter}deg)`;
      }
    }

    if (refs.leftEye.current) refs.leftEye.current.style.transform = `translate3d(${p.eyeX}px, ${p.eyeY}px, 0) scale3d(1, ${p.blinkScaleL}, 1)`;
    if (refs.rightEye.current) refs.rightEye.current.style.transform = `translate3d(${p.eyeX}px, ${p.eyeY}px, 0) scale3d(1, ${p.blinkScaleR}, 1)`;
    if (refs.highlightL.current) refs.highlightL.current.style.transform = `translate3d(${-p.eyeX * 0.3}px, ${-p.eyeY * 0.3}px, 0)`;
    if (refs.highlightR.current) refs.highlightR.current.style.transform = `translate3d(${-p.eyeX * 0.3}px, ${-p.eyeY * 0.3}px, 0)`;
    if (refs.mouth.current) refs.mouth.current.setAttribute('d', `M ${60 - p.mouthW} 35 Q 60 ${35 + p.mouthH} ${60 + p.mouthW} 35`);

    if (refs.leftCheek.current && refs.rightCheek.current) {
      refs.leftCheek.current.style.opacity = p.cheekOp; refs.rightCheek.current.style.opacity = p.cheekOp;
      refs.leftCheek.current.style.transform = `translate3d(0, ${p.cheekY}px, 0)`; refs.rightCheek.current.style.transform = `translate3d(0, ${p.cheekY}px, 0)`;
    }

    if (refs.robot.current) {
      const breathY = reducedMotion ? 0 : Math.sin(p.time * 0.04) * 3;
      refs.robot.current.style.transform = `translate3d(0, ${breathY}px, 0) rotateZ(${p.headTilt}deg)`;
    }

    if (refs.robotGlow.current) {
      const glowScale = 1 + (p.cheekOp * 0.3);
      refs.robotGlow.current.style.transform = `scale3d(${glowScale}, ${glowScale}, 1)`;
      refs.robotGlow.current.style.opacity = 0.15 + (p.cheekOp * 0.2);
    }

    if (refs.leftEar.current && refs.rightEar.current) {
      const earRot = Math.sin(p.time * 0.1) * (p.emotion === 'excited' ? 12 : 3);
      refs.leftEar.current.style.transform = `rotate(${-earRot}deg)`;
      refs.rightEar.current.style.transform = `rotate(${earRot}deg)`;
    }

    rafRef.current = requestAnimationFrame(renderLoop);
  }, [showBubble, triggerRipple]);

  useEffect(() => {
    updateRect(); 
    physics.current.scrollY = window.scrollY;

    const handleVisibility = () => {
      if (document.hidden) { if (rafRef.current) cancelAnimationFrame(rafRef.current); } 
      else { rafRef.current = requestAnimationFrame(renderLoop); }
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

  return { refs, physics: physics.current };
};