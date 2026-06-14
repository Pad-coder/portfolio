import React, { useRef, useEffect, useCallback } from 'react';
import { FaGithub } from 'react-icons/fa';

const MovableDraggableGitHubButton = ({
  githubUrl = "https://github.com/Pad-coder",
  size = 64 // Slightly larger base size looks better for 3D objects
}) => {
  // Physics State (Stored in refs for 60FPS - No React re-renders)
  const pos = useRef({ x: 20, y: typeof window !== 'undefined' ? window.innerHeight - 120 : 0 });
  const vel = useRef({ x: 0, y: 0 });
  const scale = useRef({ x: 1, y: 1 });
  const scaleVel = useRef({ x: 0, y: 0 });
  const rotation = useRef(0);
  
  // Interaction State
  const mouse = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const clickStart = useRef({ x: 0, y: 0, time: 0 });
  const idleTime = useRef(0);
  
  // DOM Elements
  const posRef = useRef(null);
  const physicsRef = useRef(null);
  const shadowRef = useRef(null);
  const rafRef = useRef(null);

  // Physics Constants
  const FRICTION = 0.94; // Air resistance / sliding friction
  const BOUNCE = -0.75; // Loses 25% energy on wall impact
  const SPRING_STIFFNESS = 0.15; // Rubber ball stretch return speed
  const SPRING_DAMPING = 0.75; // Rubber ball bounce settlement
  const DRAG_ELASTICITY = 0.4; // How tightly it follows the cursor

  // Main Physics Engine Loop
  const updatePhysics = useCallback(() => {
    const maxX = window.innerWidth - size;
    const maxY = window.innerHeight - size;

    if (isDragging.current) {
      // 1. ELASTIC DRAGGING (Smooth follow)
      const targetX = mouse.current.x - dragOffset.current.x;
      const targetY = mouse.current.y - dragOffset.current.y;

      // Calculate throw velocity based on distance to target
      vel.current.x = (targetX - pos.current.x) * DRAG_ELASTICITY;
      vel.current.y = (targetY - pos.current.y) * DRAG_ELASTICITY;

      pos.current.x += vel.current.x;
      pos.current.y += vel.current.y;

      // Rotate based on drag direction
      rotation.current += vel.current.x * 0.5;
    } else {
      // 2. MOMENTUM & INERTIA
      pos.current.x += vel.current.x;
      pos.current.y += vel.current.y;

      // Apply friction
      vel.current.x *= FRICTION;
      vel.current.y *= FRICTION;

      // Idle floating animation when almost stopped
      if (Math.abs(vel.current.x) < 0.1 && Math.abs(vel.current.y) < 0.1) {
        idleTime.current += 0.03;
        pos.current.y += Math.sin(idleTime.current) * 0.2; // Soft breathing vertical float
        rotation.current += Math.sin(idleTime.current * 0.5) * 0.1; // Soft tilt
      } else {
        // Natural rolling rotation
        rotation.current += vel.current.x * 0.3;
      }

      // 3. ELASTIC WALL COLLISIONS
      let hitX = false, hitY = false;
      let impactV = 0;

      if (pos.current.x < 0) {
        pos.current.x = 0;
        impactV = Math.abs(vel.current.x);
        vel.current.x *= BOUNCE;
        hitX = true;
      } else if (pos.current.x > maxX) {
        pos.current.x = maxX;
        impactV = Math.abs(vel.current.x);
        vel.current.x *= BOUNCE;
        hitX = true;
      }

      if (pos.current.y < 0) {
        pos.current.y = 0;
        impactV = Math.abs(vel.current.y);
        vel.current.y *= BOUNCE;
        hitY = true;
      } else if (pos.current.y > maxY) {
        pos.current.y = maxY;
        impactV = Math.abs(vel.current.y);
        vel.current.y *= BOUNCE;
        hitY = true;
      }

      // Apply Rubber Ball Squash & Stretch on Impact
      if (hitX) {
        const squeeze = Math.min(impactV * 0.015, 0.4);
        scale.current.x = 1 - squeeze;
        scale.current.y = 1 + squeeze;
      }
      if (hitY) {
        const squeeze = Math.min(impactV * 0.015, 0.4);
        scale.current.x = 1 + squeeze;
        scale.current.y = 1 - squeeze;
      }
    }

    // 4. SPRING ANIMATION (Return scale to 1.0)
    const targetScale = isDragging.current ? 1.08 : 1; // Slight lift/expand when grabbed
    
    const forceX = (targetScale - scale.current.x) * SPRING_STIFFNESS;
    const forceY = (targetScale - scale.current.y) * SPRING_STIFFNESS;

    scaleVel.current.x = (scaleVel.current.x + forceX) * SPRING_DAMPING;
    scaleVel.current.y = (scaleVel.current.y + forceY) * SPRING_DAMPING;

    scale.current.x += scaleVel.current.x;
    scale.current.y += scaleVel.current.y;

    // Safety boundary constraints to prevent runaway off-screen physics
    pos.current.x = Math.max(-50, Math.min(window.innerWidth + 50, pos.current.x));
    pos.current.y = Math.max(-50, Math.min(window.innerHeight + 50, pos.current.y));

    // 5. APPLY HARDWARE ACCELERATED TRANSFORMS
    if (posRef.current && physicsRef.current) {
      // Outer layer handles position
      posRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      // Inner layer handles rotation, squash, and stretch
      physicsRef.current.style.transform = `scale(${scale.current.x}, ${scale.current.y}) rotate(${rotation.current}deg)`;
    }

    // Dynamic Shadow Depth
    if (shadowRef.current) {
      if (isDragging.current) {
        shadowRef.current.style.boxShadow = `0px 30px 40px rgba(0, 0, 0, 0.4), 0px 10px 20px rgba(163, 230, 53, 0.3)`;
      } else {
        // Shadow stretches slightly with speed
        const speed = Math.min(Math.sqrt(vel.current.x**2 + vel.current.y**2), 20);
        shadowRef.current.style.boxShadow = `0px ${10 + speed}px ${20 + speed}px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(163, 230, 53, 0.2)`;
      }
    }

    rafRef.current = requestAnimationFrame(updatePhysics);
  }, [size]);

  // Boot Physics Engine
  useEffect(() => {
    rafRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(rafRef.current);
  }, [updatePhysics]);

  // Window Resize Boundary Check
  useEffect(() => {
    const handleResize = () => {
      pos.current.x = Math.min(pos.current.x, window.innerWidth - size);
      pos.current.y = Math.min(pos.current.y, window.innerHeight - size);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [size]);

  // Input Handlers
  const handlePointerDown = (e) => {
    e.preventDefault(); // Prevents touch scrolling
    const rect = posRef.current.getBoundingClientRect();
    
    isDragging.current = true;
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    mouse.current = { x: e.clientX, y: e.clientY };
    clickStart.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none'; // Prevent text selection
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (isDragging.current) {
        mouse.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerUp = (e) => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        // Detect click (minimal movement & short duration)
        const moveDist = Math.sqrt(
          Math.pow(e.clientX - clickStart.current.x, 2) + 
          Math.pow(e.clientY - clickStart.current.y, 2)
        );
        const duration = Date.now() - clickStart.current.time;

        if (moveDist < 10 && duration < 300) {
          window.open(githubUrl, '_blank', 'noopener,noreferrer');
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
      {/* Embedded Styles for Premium Graphics */}
      <style>{`
        .premium-ball-container {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
          touch-action: none; /* Prevents scroll on mobile drag */
          will-change: transform; /* Hint to GPU */
        }
        
        .premium-ball-physics {
          transform-origin: center center;
          will-change: transform;
        }

        .premium-ball-visual {
          position: relative;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          cursor: grab;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: filter 0.3s ease;
          
          /* 3D Base Color & Depth */
          background: radial-gradient(circle at 30% 30%, #d9f99d 0%, #84cc16 40%, #4d7c0f 100%);
          
          /* Inner shadows for spherical volume */
          box-shadow: 
            inset -8px -8px 20px rgba(0,0,0,0.4),
            inset 8px 8px 20px rgba(255,255,255,0.6),
            inset 0px 0px 4px rgba(255,255,255,0.8);
        }

        .premium-ball-container:active .premium-ball-visual {
          cursor: grabbing;
        }

        /* Specular Highlight (The Glassy Reflection) */
        .premium-ball-visual::before {
          content: '';
          position: absolute;
          top: 4%;
          left: 12%;
          width: 50%;
          height: 35%;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%);
          transform: rotate(-30deg);
          pointer-events: none;
          z-index: 2;
        }

        /* Bottom bounce reflection */
        .premium-ball-visual::after {
          content: '';
          position: absolute;
          bottom: 5%;
          right: 15%;
          width: 40%;
          height: 20%;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(163, 230, 53, 0.6) 0%, rgba(0,0,0,0) 70%);
          filter: blur(2px);
          pointer-events: none;
        }

        .premium-ball-icon {
          position: relative;
          z-index: 3;
          color: #1a2e05; /* Deep green, better contrast than pure black */
          filter: drop-shadow(0px 2px 2px rgba(255,255,255,0.4));
        }

        /* Hover Feedback */
        .premium-ball-container:hover .premium-ball-visual {
          filter: brightness(1.05) contrast(1.05);
        }
      `}</style>

      {/* Layer 1: Handles Position (Translate3D) */}
      <div 
        ref={posRef} 
        className="premium-ball-container" 
        onPointerDown={handlePointerDown}
      >
        {/* Layer 2: Handles Physics (Squash, Stretch, Rotation) */}
        <div ref={physicsRef} className="premium-ball-physics">
          
          {/* Layer 3: Handles Visuals & Shadows */}
          <div ref={shadowRef} className="premium-ball-visual group">
            
            <FaGithub 
              className="premium-ball-icon transition-transform duration-300 group-hover:scale-110" 
              size={size * 0.45} 
            />

            {/* Hover Tooltip - Hidden natively via CSS opacity */}
            <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
              <div className="bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-xl border border-white/10">
                GitHub Profile
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-transparent border-t-black/80" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default MovableDraggableGitHubButton;