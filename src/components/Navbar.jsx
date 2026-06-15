import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import myLogo from '../assets/logo.png'; 

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { name: "HOME", to: "home" },
    { name: "ABOUT", to: "about" },
    { name: "PROJECTS", to: "projects" },
    { name: "SOCIAL", to: "socialmedia" },
    { name: "CONTACT", to: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const scrollPosition = window.scrollY + 100;
      const sections = navLinks.map(link => document.getElementById(link.to));

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
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault(); // Prevents instant jump, allows smooth scroll
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL hash for SEO & history tracking without jumping
      window.history.pushState(null, '', `#${sectionId}`);
    }
    setOpen(false);
  };

  return (
    <header className={`w-full fixed top-0 z-40 transition-all duration-500 ease-in-out ${
      scrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-8">
        
        {/* Elegant Logo Image & Premium Text (Now a semantic link) */}
        <a 
          href="#home"
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
          onClick={(e) => scrollToSection(e, 'home')}
          aria-label="Padcoder Home"
        >
          {/* Logo Image - Removed loading="lazy" for better LCP */}
          <img 
            src={myLogo} 
            alt="Padcoder Logo" 
            className="h-9 sm:h-10 md:h-12 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-105"
          />
          
          {/* Stylish Brand Text */}
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white transition-all duration-300 group-hover:opacity-90">
            Padcoder<span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-200">.com</span>
          </span>
        </a>

        {/* Desktop Navigation (Converted to semantic anchor tags) */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/5 rounded-full px-2 py-1 backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.to}
              href={`#${link.to}`}
              onClick={(e) => scrollToSection(e, link.to)}
              className={`relative px-5 py-2 text-sm font-medium transition-colors duration-300 rounded-full ${
                activeSection === link.to ? 'text-neutral-900' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {activeSection === link.to && (
                <div className="absolute inset-0 bg-lime-400 rounded-full -z-10 transition-all duration-500 ease-out layout-animation"></div>
              )}
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white hover:text-lime-400 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-black/95 backdrop-blur-xl border-b border-white/10 transition-all duration-500 ease-in-out ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.to}
              href={`#${link.to}`}
              onClick={(e) => scrollToSection(e, link.to)}
              className={`text-left text-lg font-medium transition-colors ${activeSection === link.to ? 'text-lime-400' : 'text-white/70 hover:text-white'}`}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Navbar;