import React, { useState, useEffect, memo } from "react";
import { Menu, X } from "lucide-react";
import myLogo from "../assets/logo.png";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

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
      const sections = navLinks.map((link) => document.getElementById(link.to));

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navLinks[i].to);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault(); // Prevents instant jump, allows smooth scroll
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update URL hash for SEO & history tracking without jumping
      window.history.pushState(null, "", `#${sectionId}`);
    }
    setOpen(false);
  };

  return (
    <header
      /* FIXED: Bumped to z-[100] so it always stays above EVERYTHING.
         FIXED: Added '|| open' so the header background applies when the menu is open, even at the top of the page */
      className={`w-full fixed top-0 left-0 z-[100] transition-all duration-500 ease-in-out ${
        scrolled || open
          ? "bg-[#0a0a0a]/85 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-8 relative z-10">
        {/* Elegant Logo Image & Premium Text */}
        <a
          href="#home"
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
          onClick={(e) => scrollToSection(e, "home")}
          aria-label="Padcoder Home"
        >
          <img
            src={myLogo}
            alt="Padcoder Logo"
            width={150} 
            height={48} 
            fetchPriority="high" 
            decoding="async"
            className="h-9 sm:h-10 md:h-12 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-105"
          />

          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white transition-all duration-300 group-hover:opacity-90">
            Padcoder
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-200">
              .com
            </span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/5 rounded-full px-2 py-1 backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.to}
              href={`#${link.to}`}
              onClick={(e) => scrollToSection(e, link.to)}
              className={`relative px-5 py-2 text-sm font-medium transition-colors duration-300 rounded-full ${
                activeSection === link.to
                  ? "text-neutral-900"
                  : "text-neutral-400 hover:text-white"
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


      <div
        className={`md:hidden absolute top-full left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 transition-all duration-500 ease-in-out shadow-2xl ${
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.to}
              href={`#${link.to}`}
              onClick={(e) => scrollToSection(e, link.to)}
              className={`text-left text-lg font-medium transition-colors ${activeSection === link.to ? "text-lime-400" : "text-white/70 hover:text-white"}`}
            >
              {link.name}
            </a>
          ))}
          <a
            href="/mini-projects"
            className={`rounded-2xl px-4 py-3 text-left text-lg font-semibold transition-colors duration-300 ${
              activeSection === "mini-projects"
                ? "bg-lime-400/10 text-lime-300"
                : "text-white/80 hover:text-white hover:bg-white/5"
            }`}
            rel="noopener noreferrer"
          >
            MINI PROJECTS
          </a>
        </div>
      </div>
    </header>
  );
}

export default memo(Navbar);