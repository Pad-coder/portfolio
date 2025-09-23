import React, { useState, useEffect, useRef } from "react";

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isVisible, setIsVisible] = useState(false);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [nameAnimation, setNameAnimation] = useState('');
  const [clickRipples, setClickRipples] = useState([]);
  const heroRef = useRef(null);

  const skills = [
    "JavaScript", "HTML5", "CSS3", "React JS", "Node.js", "Express JS", 
    "MongoDB", "MySQL", "Tailwind CSS", "Bootstrap", "WordPress", "PHP", 
    "Redux Toolkit", "Git & GitHub", "Figma", "Photoshop", "Illustrator"
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const skillInterval = setInterval(() => {
      setCurrentSkillIndex((prev) => (prev + 1) % skills.length);
    }, 2000);

    // Name animation sequence
    setTimeout(() => setNameAnimation('slide-in'), 500);
    setTimeout(() => setNameAnimation('glow'), 1500);

    return () => clearInterval(skillInterval);
  }, []);

  const handleMouseMove = (e) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleClick = (e) => {
    const rect = heroRef.current.getBoundingClientRect();
    const newRipple = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    setClickRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setClickRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 1000);
  };

  const handleMouseEnter = (variant) => {
    setCursorVariant(variant);
  };

  const handleMouseLeave = () => {
    setCursorVariant('default');
  };

  // Add this function to your component where the buttons are located
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};

  return (
    <div 
      ref={heroRef}
      className="pt-24 lg:pt-24  bg-lime-300 container mx-auto relative overflow-hidden min-h-screen cursor-none"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* Custom Cursor */}
      <div
        className={`fixed pointer-events-none z-50 transition-all duration-200 ease-out ${
          cursorVariant === 'hover' 
            ? 'w-16 h-16 bg-neutral-900/20 border-2 border-neutral-900' 
            : cursorVariant === 'click'
            ? 'w-12 h-12 bg-neutral-900/30 border border-neutral-900'
            : 'w-6 h-6 bg-neutral-900/40'
        } rounded-full mix-blend-difference`}
        style={{
          left: mousePosition.x - (cursorVariant === 'hover' ? 32 : cursorVariant === 'click' ? 24 : 12),
          top: mousePosition.y - (cursorVariant === 'hover' ? 32 : cursorVariant === 'click' ? 24 : 12),
        }}
      />

      {/* Click Ripples */}
      {clickRipples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: '40px',
            height: '40px',
          }}
        >
          <div className="w-full h-full border-2 border-neutral-900/30 rounded-full"></div>
        </div>
      ))}

      {/* Geometric Background Elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 border-2 border-neutral-900/10 rotate-45 animate-spin-slow"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-neutral-900/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 border border-neutral-900/15 rotate-12 animate-bounce-slow"></div>
        <div className="absolute bottom-20 right-10 w-24 h-1 bg-neutral-900/10 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-32 bg-gradient-to-b from-transparent via-neutral-900/10 to-transparent animate-pulse"></div>
      </div>

      <div className="flex flex-col justify-center items-center mx-5 min-h-screen text-neutral-900 relative z-10 px-4">
        
        {/* Name Section with Unique Animation */}
        <div className={`text-center mb-8 ${nameAnimation === 'slide-in' ? 'animate-slide-in' : nameAnimation === 'glow' ? 'animate-name-glow' : ''}`}>
          <div className="relative inline-block">
            <h1 
              className="text-2xl md:text-7xl lg:text-8xl font-black tracking-tight cursor-pointer select-none"
              onMouseEnter={() => handleMouseEnter('hover')}
              onMouseLeave={handleMouseLeave}
            >
              <span className="relative inline-block hover:animate-bounce">P</span>
              <span className="relative inline-block hover:animate-bounce delay-75">A</span>
              <span className="relative inline-block hover:animate-bounce delay-100">D</span>
              <span className="relative inline-block hover:animate-bounce delay-125">M</span>
              <span className="relative inline-block hover:animate-bounce delay-150">A</span>
              <span className="relative inline-block hover:animate-bounce delay-175">N</span>
              <span className="relative inline-block hover:animate-bounce delay-200">A</span>
              <span className="relative inline-block hover:animate-bounce delay-225">B</span>
              <span className="relative inline-block hover:animate-bounce delay-250">A</span>
              <span className="relative inline-block hover:animate-bounce delay-275">N</span>
              <span className="mx-4 text-lime-600">•</span>
              <span className="relative inline-block hover:animate-bounce delay-300">M</span>
            </h1>
            
            {/* Decorative underline that follows cursor */}
            <div 
              className="absolute -bottom-2 h-1 bg-neutral-900 transition-all duration-300 rounded-full"
              style={{
                left: `${(mousePosition.x / (heroRef.current?.offsetWidth || 1)) * 100}%`,
                width: `${50 + (mousePosition.x / (heroRef.current?.offsetWidth || 1)) * 50}px`,
              }}
            />
          </div>
        </div>

        {/* Role Description with Interactive Elements */}
        <div className={`text-center mb-12 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm md:text-2xl font-medium">
            <div 
              className="px-6 py-3 bg-neutral-900/5 backdrop-blur rounded-full border border-neutral-900/20 hover:bg-neutral-900/10 transition-all duration-300 cursor-pointer"
              onMouseEnter={() => handleMouseEnter('hover')}
              onMouseLeave={handleMouseLeave}
            >
              Full Stack Developer
            </div>
            <div className="text-xl md:text-3xl animate-pulse">×</div>
            <div 
              className="px-6 py-3 bg-neutral-900/5 backdrop-blur rounded-full border border-neutral-900/20 hover:bg-neutral-900/10 transition-all duration-300 cursor-pointer"
              onMouseEnter={() => handleMouseEnter('hover')}
              onMouseLeave={handleMouseLeave}
            >
              Tech Enthusiast
            </div>
          </div>
        </div>

        {/* Dynamic Skills Showcase */}
        <div className={`mb-12 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="text-center mb-6">
            <span className="text-md md:text-xl text-neutral-700">Advancing expertise in</span>
          </div>
          
          <div className="relative">
            <div 
              className="text-xl md:text-4xl font-bold text-center px-8 py-4 bg-neutral-900/5 rounded-2xl border border-neutral-900/20  md:min-w-64 cursor-pointer hover:scale-105 transition-all duration-300"
              onMouseEnter={() => handleMouseEnter('click')}
              onMouseLeave={handleMouseLeave}
            >
              <span className="relative">
                {skills[currentSkillIndex]}
                <div className="absolute -inset-2 bg-lime-400/20 rounded-lg animate-pulse -z-10"></div>
              </span>
            </div>
            
            {/* Skill Progress Indicator */}
            <div className="flex justify-center mt-4 space-x-1">
              {skills.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSkillIndex ? 'bg-neutral-900 scale-125' : 'bg-neutral-900/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Call-to-Actions */}
        <div className={`flex flex-col md:flex-row gap-6 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
  <button 
    className="group relative px-4 py-2 bg-neutral-900 text-lime-300 rounded-2xl font-bold overflow-hidden transition-all duration-500 hover:scale-110 hover:rotate-1"
    onMouseEnter={() => handleMouseEnter('click')}
    onMouseLeave={handleMouseLeave}
    onClick={() => scrollToSection('portfolio')}
  >
    <span className="relative z-10 text-lg">Explore My Work</span>
    <div className="absolute inset-0 bg-gradient-to-r from-lime-500 to-lime-400 transform -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-neutral-900 font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10">
        Explore My Work
      </span>
    </div>
  </button>
  
  <button 
    className="group px-4 py-2 border-2 border-neutral-900 text-neutral-900 rounded-2xl font-bold transition-all duration-500 hover:scale-110 hover:-rotate-1 hover:bg-neutral-900 hover:text-lime-300 relative overflow-hidden"
    onMouseEnter={() => handleMouseEnter('click')}
    onMouseLeave={handleMouseLeave}
    onClick={() => scrollToSection('socialmedia')}
  >
    <span className="text-lg">Let's Connect</span>
    <div className="absolute top-0 left-0 w-0 h-full bg-neutral-900 transition-all duration-500 group-hover:w-full -z-10"></div>
  </button>
</div>


        {/* Personal Touch - Signature */}
        <div className={`mb-2 mt-16 text-center transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="inline-block relative">
            <span className="text-sm text-neutral-700 font-mono">
              &lt;/creativity_meets_code&gt;
            </span>
            <div 
              className="absolute -top-4 -left-4 w-3 h-3 bg-neutral-900/20 rounded-full animate-ping"
              style={{
                animationDelay: `${mousePosition.x / 100}s`
              }}
            />
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes slide-in {
          0% { transform: translateX(-100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes name-glow {
          0%, 100% { text-shadow: 0 0 5px rgba(0,0,0,0.1); }
          50% { text-shadow: 0 0 20px rgba(0,0,0,0.2), 0 0 30px rgba(0,0,0,0.1); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-slide-in {
          animation: slide-in 0.8s ease-out forwards;
        }
        
        .animate-name-glow {
          animation: name-glow 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;