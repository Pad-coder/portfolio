import React, { useState, useRef, useEffect } from "react";
import { useSpring, useTrail, animated, useChain, config, useSpringRef } from "@react-spring/web";
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const SocialMedia = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  
  const containerRef = useRef();
  const titleRef = useSpringRef();
  const iconsRef = useSpringRef();
  const textRef = useSpringRef();

  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/Pad-coder", name: "GitHub" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/padmanaban2002/", name: "LinkedIn" },
    { icon: FaInstagram, href: "https://www.instagram.com/pad_coder/", name: "Instagram" },
    { icon: FaSquareXTwitter, href: "https://x.com/pad_coder", name: "Twitter" },
  ];

  // Intersection observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Mouse tracking
  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  // Handle link clicks properly
  const handleSocialClick = (href) => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  // Title animation
  const titleSpring = useSpring({
    ref: titleRef,
    transform: isVisible ? `translateY(0px)` : `translateY(50px)`,
    opacity: isVisible ? 1 : 0,
    config: config.slow
  });

  // Icons trail animation
  const iconTrail = useTrail(socialLinks.length, {
    ref: iconsRef,
    transform: isVisible ? `translateY(0px) scale(1)` : `translateY(30px) scale(0.8)`,
    opacity: isVisible ? 1 : 0,
    config: config.gentle
  });

  // Text animation
  const textSpring = useSpring({
    ref: textRef,
    transform: isVisible ? `translateY(0px)` : `translateY(30px)`,
    opacity: isVisible ? 1 : 0,
    config: config.slow
  });

  // Chain animations
  useChain(isVisible ? [titleRef, iconsRef, textRef] : [], [0, 0.2, 0.4]);

  // Styled cursor animation
  const cursorSpring = useSpring({
    x: mousePos.x - 8,
    y: mousePos.y - 8,
    scale: cursorVariant === 'hover' ? 1.5 : 1,
    config: { tension: 200, friction: 20 }
  });

  const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  } 
}

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden bg-black text-white"
      onMouseMove={handleMouseMove}
      style={{ cursor: 'none' }}
    >
      {/* Professional Styled Cursor */}
      <animated.div
        style={{
          transform: cursorSpring.x.to(x => cursorSpring.y.to(y => 
            cursorSpring.scale.to(s => `translate3d(${x}px, ${y}px, 0) scale(${s})`)
          ))
        }}
        className="fixed w-4 h-4 pointer-events-none z-50"
      >
        <div className="w-full h-full bg-lime-400 rounded-full opacity-80" />
        <div className="absolute inset-0 w-8 h-8 border border-lime-400/30 rounded-full -translate-x-1 -translate-y-1" />
      </animated.div>

      <div className="relative z-10 px-6 py-20 sm:px-20 sm:py-24">
        
        {/* Clean Title */}
        <animated.div 
          style={titleSpring}
          className="text-center mb-32"
        >
          <h1 className="text-5xl sm:text-7xl font-light text-white mb-4 tracking-wide">
            Follow My
          </h1>
          <h1 className="text-5xl sm:text-7xl font-bold text-lime-400 mb-12 tracking-wide">
            Journey
          </h1>
          <div className="w-16 h-px bg-lime-400 mx-auto" />
        </animated.div>

        {/* Minimal Social Icons */}
        <div className="flex justify-center gap-6 mb-40">
          {iconTrail.map((style, index) => {
            const social = socialLinks[index];
            const Icon = social.icon;
            const isHovered = hoveredIndex === index;
            
            const iconSpring = useSpring({
              transform: isHovered ? `translateY(-4px)` : `translateY(0px)`,
              config: config.gentle
            });

            return (
              <animated.div
                key={index}
                style={{ ...style, ...iconSpring }}
                className="group relative"
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  setCursorVariant('hover');
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setCursorVariant('default');
                }}
                onClick={() => handleSocialClick(social.href)}
              >
                <div className="w-12 h-12 bg-white/5 hover:bg-lime-400/10 rounded-full border border-white/10 hover:border-lime-400/30 flex items-center justify-center backdrop-blur-sm transition-all duration-300 cursor-none">
                  <Icon className="w-5 h-5 text-white/60 group-hover:text-lime-400 transition-colors duration-300" />
                </div>

                {/* Minimal tooltip */}
                <div 
                  className={`absolute -top-8 left-1/2 transform -translate-x-1/2 transition-all duration-200 ${
                    isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                  }`}
                >
                  <div className="bg-white/10 backdrop-blur-md text-white px-2 py-1 rounded text-xs font-medium border border-white/10">
                    {social.name}
                  </div>
                </div>
              </animated.div>
            );
          })}
        </div>

        {/* Refined Community Section */}
        <animated.div 
          style={textSpring}
          className="max-w-4xl mx-auto"
        >
          <div 
            className="group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-lime-400/20 rounded-2xl p-8 sm:p-12 backdrop-blur-sm transition-all duration-500"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-2xl sm:text-4xl font-light text-white mb-2">
                  Join the
                </h2>
                <h2 className="text-2xl sm:text-4xl font-bold text-lime-400 mb-6">
                  Community
                </h2>
                <div className="w-12 h-px bg-lime-400 mx-auto" />
              </div>
              
              <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
                Connect with innovators and creators building the future of digital experiences.
              </p>
              
              <button 
                className="group relative px-8 py-3 bg-lime-400/10 hover:bg-lime-400 text-lime-400 hover:text-black font-medium rounded-full border border-lime-400/30 hover:border-lime-400 transition-all duration-300 backdrop-blur-sm"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
                 onClick={() => scrollToSection('contact')}
              >
                <span className="relative z-10">
                  Let's Connect
                </span>
              </button>
            </div>
          </div>
        </animated.div>
      </div>

      {/* Minimal bottom accent */}
      <div className="absolute bottom-0 left-0 right-0">
        <div 
          className="h-px bg-gradient-to-r from-transparent via-lime-400 to-transparent transition-all duration-1000"
          style={{ 
            opacity: isVisible ? 1 : 0
          }}
        />
      </div>
    </div>
  );
};

export default SocialMedia;
