import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaGithub } from 'react-icons/fa';

const MovableDraggableGitHubButton = ({ 
  githubUrl = "https://github.com/Pad-coder",
  size = 56
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 100 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [clickStartPos, setClickStartPos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  // Get viewport constraints
  const getViewportConstraints = useCallback(() => {
    return {
      minX: 0,
      minY: 0,
      maxX: window.innerWidth - size,
      maxY: window.innerHeight - size
    };
  }, [size]);

  // Constrain position within viewport
  const constrainPosition = useCallback((x, y) => {
    const constraints = getViewportConstraints();
    return {
      x: Math.max(constraints.minX, Math.min(constraints.maxX, x)),
      y: Math.max(constraints.minY, Math.min(constraints.maxY, y))
    };
  }, [getViewportConstraints]);

  // Handle drag start
  const handleDragStart = useCallback((clientX, clientY) => {
    const rect = buttonRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;
    
    setIsDragging(true);
    setDragOffset({ x: offsetX, y: offsetY });
    setClickStartPos({ x: clientX, y: clientY });
    
    // Add grabbing cursor to body
    document.body.style.cursor = 'grabbing';
  }, []);

  // Handle drag move with smooth real-time updates
  const handleDragMove = useCallback((clientX, clientY) => {
    if (!isDragging) return;
    
    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;
    const constrainedPos = constrainPosition(newX, newY);
    
    // Real-time position update for smooth dragging
    setPosition(constrainedPos);
  }, [isDragging, dragOffset, constrainPosition]);

  // Handle drag end
  const handleDragEnd = useCallback((clientX, clientY) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    document.body.style.cursor = '';
    
    // Calculate movement distance to detect click vs drag
    const moveDistance = Math.sqrt(
      Math.pow(clientX - clickStartPos.x, 2) + 
      Math.pow(clientY - clickStartPos.y, 2)
    );
    
    // If minimal movement, treat as click
    if (moveDistance < 8) {
      window.open(githubUrl, '_blank', 'noopener,noreferrer');
    }
  }, [isDragging, clickStartPos, githubUrl]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    handleDragStart(e.clientX, e.clientY);
  }, [handleDragStart]);

  // Touch event handlers
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  }, [handleDragStart]);

  // Global event listeners for smooth dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      e.preventDefault();
      handleDragMove(e.clientX, e.clientY);
    };
    
    const handleMouseUp = (e) => {
      handleDragEnd(e.clientX, e.clientY);
    };
    
    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    };
    
    const handleTouchEnd = (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      handleDragEnd(touch.clientX, touch.clientY);
    };
    
    if (isDragging) {
      // Add global listeners for smooth dragging outside button area
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      // Prevent text selection and other interactions while dragging
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.pointerEvents = 'none';
      
      // Keep button interactive during drag
      if (buttonRef.current) {
        buttonRef.current.style.pointerEvents = 'auto';
      }
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      // Restore normal interactions
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.pointerEvents = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Handle window resize to keep button in viewport
  useEffect(() => {
    const handleResize = () => {
      const constrainedPos = constrainPosition(position.x, position.y);
      setPosition(constrainedPos);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, constrainPosition]);

  return (
    <div
      ref={buttonRef}
      className={`fixed z-[9999] select-none transition-all duration-150 ease-out ${
        isDragging 
          ? 'cursor-grabbing scale-110 z-[10000]' 
          : 'cursor-grab hover:scale-105'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size}px`,
        height: `${size}px`,
        transform: isDragging ? 'rotate(3deg)' : 'rotate(0deg)',
        transformOrigin: 'center',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Main Button Circle */}
      <div
        className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-150 ${
          isDragging 
            ? 'bg-lime-500 shadow-2xl' 
            : 'bg-lime-400 hover:bg-lime-500 shadow-lg hover:shadow-xl'
        }`}
        style={{
          boxShadow: isDragging 
            ? '0 12px 30px rgba(163, 230, 53, 0.7), 0 0 0 6px rgba(255, 255, 255, 0.4)' 
            : '0 6px 20px rgba(163, 230, 53, 0.5)'
        }}
      >
        <FaGithub 
          className={`text-black transition-all duration-150 ${
            isDragging ? 'animate-pulse scale-110' : 'group-hover:scale-110'
          }`}
          size={size * 0.4}
        />
      </div>
      
      {/* Drag Indicator Rings */}
      {isDragging && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 rounded-full border-4 border-white/60 animate-ping" />
          <div className="absolute inset-0 rounded-full border-2 border-lime-300/80 animate-pulse" 
               style={{ animationDelay: '0.5s' }} />
        </div>
      )}
      
      {/* Hover Tooltip */}
      <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 transition-all duration-200 ${
        isDragging ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-0 group-hover:opacity-100 scale-100'
      }`}>
        <div className="bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
          {isDragging ? 'Dragging...' : 'GitHub Profile'}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90" />
        </div>
      </div>
      
      {/* Position Indicator (optional - shows current coordinates) */}
      {isDragging && (
        <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono">
          {Math.round(position.x)}, {Math.round(position.y)}
        </div>
      )}
    </div>
  );
};

export default MovableDraggableGitHubButton;
