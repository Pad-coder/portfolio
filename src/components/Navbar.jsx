import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navRef = useRef(null);

  const navLinks = [

    { name: "ABOUT", to: "about" },
    { name: "PORTFOLIO", to: "portfolio" },
    { name: "SOCIAL", to: "socialmedia" },
    { name: "CONTACT", to: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Set scrolled state for background blur effect
      setScrolled(currentScrollY > 50);

      // Navbar hide/show logic
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setNavbarVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        setNavbarVisible(true);
      }

      setLastScrollY(currentScrollY);

      // Update active section based on scroll position
      const sections = navLinks.map(link => document.getElementById(link.to));
      const scrollPosition = currentScrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navLinks[i].to);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, navLinks]);

  const handleMouseMove = (e) => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setOpen(false);
  };

  const handleMouseEnter = (variant) => {
    setCursorVariant(variant);
  };

  const handleMouseLeave = () => {
    setCursorVariant('default');
  };

  return (
    <>
      {/* Custom Cursor for Navbar */}
      <div className={`fixed pointer-events-none z-50 transition-all duration-200 ease-out  ${cursorVariant === 'hover'
            ? 'w-12 h-12 bg-neutral-900/20 border-2 border-neutral-900'
            : cursorVariant === 'logo'
              ? 'w-16 h-16 bg-lime-500/20 border-2 border-lime-600'
              : 'w-4 h-4 bg-neutral-900/40'
          } rounded-full mix-blend-difference`}
        style={{
          left: mousePosition.x - (cursorVariant === 'hover' ? 24 : cursorVariant === 'logo' ? 32 : 8),
          top: mousePosition.y - (cursorVariant === 'hover' ? 24 : cursorVariant === 'logo' ? 32 : 8),
        }}
      />

      <header
        ref={navRef}
        className={`w-full fixed top-0 z-20 transition-all duration-500 cursor-none ${scrolled
            ? 'bg-lime-300/95 backdrop-blur-md shadow-lg border-b border-neutral-900/10'
            : 'bg-lime-300'
          } ${navbarVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        onMouseMove={handleMouseMove}
      >
        <div className="flex justify-between items-center px-4 sm:px-8 py-4">
          {/* Logo/Name Section */}
          <div
            className="flex flex-col cursor-pointer group"
            onMouseEnter={() => handleMouseEnter('logo')}
            onMouseLeave={handleMouseLeave}
            onClick={() => scrollToSection('home')}
          >
            <div className="relative overflow-hidden">
              <span className="block text-neutral-900 text-md md:text-2xl font-black tracking-tight transition-all duration-500 group-hover:tracking-wider">
                PADMANABAN M
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-1 bg-neutral-900 transition-all duration-500 group-hover:w-full rounded-full"></div>
            </div>
            <span className="text-neutral-700 text-sm md:text-base font-medium tracking-widest transition-all duration-500 group-hover:text-neutral-900 group-hover:tracking-wider">
              FULL-STACK DEVELOPER
            </span>

            {/* Decorative elements */}
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-neutral-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute -bottom-2 -right-2 w-3 h-3 border border-neutral-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-2">
            {navLinks.map((link, index) => (
              <button
                key={link.to}
                onClick={() => scrollToSection(link.to)}
                onMouseEnter={() => handleMouseEnter('hover')}
                onMouseLeave={handleMouseLeave}
                className={`relative px-6 py-3 text-lg font-medium transition-all duration-300 rounded-full overflow-hidden group ${activeSection === link.to
                    ? 'bg-neutral-900 text-lime-300 shadow-lg'
                    : 'text-neutral-900 hover:bg-neutral-900/10 hover:scale-105'
                  }`}
              >
                <span className="relative z-10">{link.name}</span>

                {/* Hover effect background */}
                {activeSection !== link.to && (
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/10 to-neutral-900/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                )}

                {/* Active indicator */}
                {activeSection === link.to && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-lime-300 rounded-full animate-pulse"></div>
                )}

                {/* Floating number indicator */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-900/10 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {index + 1}
                </div>
              </button>
            ))}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden relative p-2 rounded-full bg-neutral-900/10 transition-all duration-300 hover:bg-neutral-900/20 hover:scale-110"
            onClick={() => setOpen(!open)}
            onMouseEnter={() => handleMouseEnter('hover')}
            onMouseLeave={handleMouseLeave}
            aria-label="Toggle navigation"
          >
            <div className="relative">
              {open ? <X size={24} className="text-neutral-900" /> : <Menu size={24} className="text-neutral-900" />}
              <div className="absolute -inset-2 border border-neutral-900/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className="bg-neutral-900/5 backdrop-blur border-t border-neutral-900/10">
            {navLinks.map((link, index) => (
              <button
                key={link.to}
                onClick={() => scrollToSection(link.to)}
                className={`w-full text-left px-8 py-4 text-lg font-medium transition-all duration-300 hover:bg-neutral-900/10 hover:pl-12 relative group ${activeSection === link.to ? 'bg-neutral-900/10 text-neutral-900 font-bold' : 'text-neutral-700'
                  }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="relative z-10">{link.name}</span>

                {/* Mobile active indicator */}
                {activeSection === link.to && (
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-neutral-900 rounded-full"></div>
                )}

                {/* Mobile hover effect */}
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-neutral-900/20 to-neutral-900/40 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
              </button>
            ))}

            {/* Mobile menu footer */}
            <div className="px-8 py-4 border-t border-neutral-900/10">
              <span className="text-xs text-neutral-600 font-mono">
                &lt;/navigation&gt;
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Progress Indicator */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-neutral-900 to-neutral-700 transition-all duration-300 rounded-full"
          style={{
            width: `${Math.min(100, (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)}%`
          }}
        />
      </header>

      <style jsx="true">{`
        @keyframes slideDown {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-down {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}

export default Navbar;
