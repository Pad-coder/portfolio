import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [isTouch, setIsTouch] = useState(false);

  // Use refs instead of state for 60FPS performance
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const scale = useRef(1);
  const isHovering = useRef(false);

  useEffect(() => {
    // Detect touch devices natively
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' || 
        target.closest('a') || 
        target.closest('button') || 
        target.tagName.toLowerCase() === 'input' || 
        target.tagName.toLowerCase() === 'textarea';
        
      if (isInteractive) {
        scale.current = 1.8;
        isHovering.current = true;
      } else {
        scale.current = 1;
        isHovering.current = false;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);

    // Physics Engine Loop
    const render = () => {
      // Linear interpolation (lerp) for buttery smooth follow
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.15;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.15;

      if (cursorRef.current && dotRef.current) {
        // GPU accelerated transforms
        cursorRef.current.style.transform = `translate3d(${smooth.current.x}px, ${smooth.current.y}px, 0) scale(${scale.current})`;
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
        
        // Morph effect on hover
        if (isHovering.current) {
          cursorRef.current.style.backgroundColor = 'rgba(163, 230, 53, 0.1)';
          cursorRef.current.style.borderColor = 'transparent';
        } else {
          cursorRef.current.style.backgroundColor = 'transparent';
          cursorRef.current.style.borderColor = 'rgba(163, 230, 53, 0.5)';
        }
      }
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 border rounded-full pointer-events-none z-[9999] transition-colors duration-300 mix-blend-difference" 
        style={{ willChange: 'transform' }}
      />
      <div 
        ref={dotRef} 
        className="fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] bg-lime-400 rounded-full pointer-events-none z-[10000] mix-blend-difference" 
        style={{ willChange: 'transform' }}
      />
    </>
  );
};

export default CustomCursor;