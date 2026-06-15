import React, { useRef, useEffect, useCallback } from 'react';
import { FaGithub } from 'react-icons/fa';

// --- SHARED EVENT & PHYSICS BUS ---
// Ultra-lightweight interaction layer. Zero React re-renders. 60FPS communication.
export const sharedPhysics = {
  ball: { x: 0, y: 0, vx: 0, vy: 0, state: 'idle', isGrabbed: false },
  actions: { pause: 0, forceX: 0, forceY: 0 },
  listeners: {},
  on(event, cb) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(cb);
  },
  emit(event, data) {
    if (this.listeners[event]) this.listeners[event].forEach(cb => cb(data));
  }
};

const MovableDraggableGitHubButton = ({
  githubUrl = "https://github.com/Pad-coder",
  size = 64
}) => {
  // 60FPS Physics Refs
  const pos = useRef({ x: 40, y: typeof window !== 'undefined' ? window.innerHeight - 120 : 0 });
  const vel = useRef({ x: 0, y: 0 });
  const scale = useRef({ x: 1, y: 1 });
  const scaleVel = useRef({ x: 0, y: 0 });
  const rotation = useRef(0);
  
  // Interaction Refs
  const mouse = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const clickStart = useRef({ x: 0, y: 0, time: 0 });
  const idleTime = useRef(0);
  
  // DOM Refs
  const posRef = useRef(null);
  const physicsRef = useRef(null);
  const shadowRef = useRef(null);
  const highlightRef = useRef(null);
  const rafRef = useRef(null);

  // Physics Material Constants
  const FRICTION = 0.94; 
  const BOUNCE = -0.75; 
  const SPRING_STIFFNESS = 0.15; 
  const SPRING_DAMPING = 0.75; 
  const DRAG_ELASTICITY = 0.45; 

  const updatePhysics = useCallback(() => {
    const maxX = window.innerWidth - size;
    const maxY = window.innerHeight - size;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. EXTERNAL FORCE INJECTION (Robot catching/pushing)
    if (sharedPhysics.actions.pause > 0) {
      sharedPhysics.actions.pause--;
      vel.current.x = 0;
      vel.current.y = 0;
    } else {
      if (sharedPhysics.actions.forceX !== 0) {
        vel.current.x += sharedPhysics.actions.forceX;
        sharedPhysics.actions.forceX = 0;
      }
      if (sharedPhysics.actions.forceY !== 0) {
        vel.current.y += sharedPhysics.actions.forceY;
        sharedPhysics.actions.forceY = 0;
      }

      // 2. ELASTIC DRAG OR INERTIA
      if (isDragging.current) {
        const targetX = mouse.current.x - dragOffset.current.x;
        const targetY = mouse.current.y - dragOffset.current.y;

        vel.current.x = (targetX - pos.current.x) * DRAG_ELASTICITY;
        vel.current.y = (targetY - pos.current.y) * DRAG_ELASTICITY;

        pos.current.x += vel.current.x;
        pos.current.y += vel.current.y;
        
        // Stretch based on drag velocity
        const speed = Math.sqrt(vel.current.x**2 + vel.current.y**2);
        scale.current.x = 1 + Math.min(speed * 0.005, 0.2);
        scale.current.y = 1 - Math.min(speed * 0.005, 0.2);
      } else {
        pos.current.x += vel.current.x;
        pos.current.y += vel.current.y;

        vel.current.x *= FRICTION;
        vel.current.y *= FRICTION;

        // Idle Breathing & Floating
        if (Math.abs(vel.current.x) < 0.1 && Math.abs(vel.current.y) < 0.1 && !reducedMotion) {
          idleTime.current += 0.03;
          pos.current.y += Math.sin(idleTime.current) * 0.2; 
          scale.current.x = 1 + Math.sin(idleTime.current * 0.5) * 0.02;
          scale.current.y = 1 - Math.sin(idleTime.current * 0.5) * 0.02;
        }

        // Rolling Illusion
        rotation.current += (vel.current.x) * 0.8;

        // 3. RUBBER WALL COLLISIONS (Squash & Bounce)
        let hitX = false, hitY = false;
        let impactV = 0;

        if (pos.current.x < 0) { pos.current.x = 0; impactV = Math.abs(vel.current.x); vel.current.x *= BOUNCE; hitX = true; } 
        else if (pos.current.x > maxX) { pos.current.x = maxX; impactV = Math.abs(vel.current.x); vel.current.x *= BOUNCE; hitX = true; }

        if (pos.current.y < 0) { pos.current.y = 0; impactV = Math.abs(vel.current.y); vel.current.y *= BOUNCE; hitY = true; } 
        else if (pos.current.y > maxY) { pos.current.y = maxY; impactV = Math.abs(vel.current.y); vel.current.y *= BOUNCE; hitY = true; }

        if (hitX) { scale.current.x = 1 - Math.min(impactV * 0.02, 0.5); scale.current.y = 1 + Math.min(impactV * 0.02, 0.5); }
        if (hitY) { scale.current.x = 1 + Math.min(impactV * 0.02, 0.5); scale.current.y = 1 - Math.min(impactV * 0.02, 0.5); }

        if ((hitX || hitY) && impactV > 8) sharedPhysics.emit('bounced', impactV);
      }
    }

    // 4. SPRING RECOVERY (Return to normal shape)
    if (!isDragging.current && (Math.abs(vel.current.x) > 0.1 || Math.abs(vel.current.y) > 0.1)) {
      scaleVel.current.x = (scaleVel.current.x + (1 - scale.current.x) * SPRING_STIFFNESS) * SPRING_DAMPING;
      scaleVel.current.y = (scaleVel.current.y + (1 - scale.current.y) * SPRING_STIFFNESS) * SPRING_DAMPING;
      scale.current.x += scaleVel.current.x;
      scale.current.y += scaleVel.current.y;
    }

    // Safeties
    pos.current.x = Math.max(-50, Math.min(window.innerWidth + 50, pos.current.x));
    pos.current.y = Math.max(-50, Math.min(window.innerHeight + 50, pos.current.y));

    // 5. UPDATE GLOBAL BUS FOR ROBOT
    sharedPhysics.ball.x = pos.current.x + size / 2;
    sharedPhysics.ball.y = pos.current.y + size / 2;
    sharedPhysics.ball.vx = vel.current.x;
    sharedPhysics.ball.vy = vel.current.y;
    sharedPhysics.ball.isGrabbed = isDragging.current;
    sharedPhysics.ball.state = isDragging.current ? 'dragging' : (Math.abs(vel.current.x) > 1 || Math.abs(vel.current.y) > 1 ? 'rolling' : 'idle');

    // 6. GPU RENDER TRANSFORMS
    if (posRef.current && physicsRef.current) {
      posRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      physicsRef.current.style.transform = `scale3d(${scale.current.x}, ${scale.current.y}, 1) rotate(${rotation.current}deg)`;
    }

    // Dynamic Volume Shadow & Reflection
    if (shadowRef.current && highlightRef.current) {
      const speed = Math.min(Math.sqrt(vel.current.x**2 + vel.current.y**2), 25);
      
      if (isDragging.current) {
        shadowRef.current.style.boxShadow = `0px 30px 50px rgba(0, 0, 0, 0.5), 0px 15px 25px rgba(163, 230, 53, 0.4)`;
        highlightRef.current.style.transform = `translate3d(0, -10%, 0)`;
      } else {
        shadowRef.current.style.boxShadow = `0px ${10 + speed}px ${20 + speed}px rgba(0, 0, 0, 0.4), 0px 5px 15px rgba(163, 230, 53, 0.3)`;
        highlightRef.current.style.transform = `translate3d(0, 0, 0)`;
      }
    }

    rafRef.current = requestAnimationFrame(updatePhysics);
  }, [size]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(rafRef.current);
  }, [updatePhysics]);

  useEffect(() => {
    const handleResize = () => {
      pos.current.x = Math.min(pos.current.x, window.innerWidth - size);
      pos.current.y = Math.min(pos.current.y, window.innerHeight - size);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [size]);

  const handlePointerDown = (e) => {
    e.preventDefault(); 
    const rect = posRef.current.getBoundingClientRect();
    isDragging.current = true;
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    mouse.current = { x: e.clientX, y: e.clientY };
    clickStart.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none'; 
  };

  useEffect(() => {
    const handlePointerMove = (e) => { if (isDragging.current) mouse.current = { x: e.clientX, y: e.clientY }; };

    const handlePointerUp = (e) => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        const moveDist = Math.sqrt(Math.pow(e.clientX - clickStart.current.x, 2) + Math.pow(e.clientY - clickStart.current.y, 2));
        const duration = Date.now() - clickStart.current.time;

        if (moveDist < 10 && duration < 300) {
          sharedPhysics.emit('clicked');
          window.open(githubUrl, '_blank', 'noopener,noreferrer');
        } else {
          sharedPhysics.emit('released');
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [githubUrl]);

  return (
    <>
      <style>{`
        .premium-ball-container { position: fixed; top: 0; left: 0; z-index: 9999; touch-action: none; will-change: transform; }
        .premium-ball-physics { transform-origin: center center; will-change: transform; }
        .premium-ball-visual {
          position: relative; width: ${size}px; height: ${size}px; border-radius: 50%; cursor: grab; display: flex; align-items: center; justify-content: center;
          background: radial-gradient(circle at 30% 30%, #d9f99d 0%, #84cc16 45%, #3f6212 100%);
          box-shadow: inset -8px -8px 20px rgba(0,0,0,0.6), inset 8px 8px 25px rgba(255,255,255,0.7), inset 0px 0px 6px rgba(255,255,255,0.9);
          transition: filter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .premium-ball-container:active .premium-ball-visual { cursor: grabbing; }
        .premium-ball-highlight {
          content: ''; position: absolute; top: 5%; left: 15%; width: 60%; height: 40%; border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%); 
          transform: rotate(-25deg); pointer-events: none; z-index: 2; transition: transform 0.2s ease;
        }
        .premium-ball-icon { position: relative; z-index: 3; color: #1a2e05; filter: drop-shadow(0px 2px 3px rgba(255,255,255,0.5)); }
        .premium-ball-container:hover .premium-ball-visual { filter: brightness(1.1) contrast(1.05); }
      `}</style>

      <div ref={posRef} className="premium-ball-container" onPointerDown={handlePointerDown}>
        <div ref={physicsRef} className="premium-ball-physics">
          <div ref={shadowRef} className="premium-ball-visual group">
            <div ref={highlightRef} className="premium-ball-highlight" />
            <FaGithub className="premium-ball-icon transition-transform duration-300 group-hover:scale-110" size={size * 0.48} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MovableDraggableGitHubButton;