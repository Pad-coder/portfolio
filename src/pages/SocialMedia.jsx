import React, { useState, useEffect, useRef } from "react";
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const SocialMedia = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerRef = useRef(null);

  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/Pad-coder", name: "GitHub" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/padmanaban-coder/", name: "LinkedIn" },
    { icon: FaInstagram, href: "https://www.instagram.com/pad_coder/", name: "Instagram" },
    { icon: FaSquareXTwitter, href: "https://x.com/pad_coder", name: "Twitter" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSocialClick = (href) => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full pt-32 pb-24">
      <div className="relative z-10 px-6 max-w-7xl mx-auto">
                 
        <div className={`text-center mb-24 transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">
            Follow My <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-200">Journey</span>
          </h1>
          <p className="text-neutral-400 text-lg font-light max-w-2xl mx-auto">
            Stay updated with my latest projects, technical writing, and professional milestones.
          </p>
        </div>

        <div className="flex justify-center gap-6 sm:gap-8 mb-32">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            const isHovered = hoveredIndex === index;
                         
            return (
              <div
                key={index}
                className={`group relative transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}
                style={{ transitionDelay: `${300 + (index * 150)}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleSocialClick(social.href)}
              >
                <div className="w-14 h-14 bg-white/[0.03] hover:bg-lime-400/10 rounded-2xl border border-white/5 hover:border-lime-400/30 flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-lg shadow-black/50 hover:-translate-y-1 cursor-pointer">
                  <Icon className="w-6 h-6 text-neutral-400 group-hover:text-lime-400 transition-colors duration-300" />
                </div>
                
                <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-out pointer-events-none ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                  <div className="bg-black/90 backdrop-blur-xl text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 shadow-xl whitespace-nowrap">
                    {social.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`max-w-3xl mx-auto transition-all duration-1000 ease-out delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 sm:p-16 backdrop-blur-xl transition-all duration-500 hover:border-white/10 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">
              Join the <span className="text-lime-400">Community</span>
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg font-light leading-relaxed max-w-xl mx-auto mb-10">
              Connect with innovators and creators building the future of digital experiences. Let's share knowledge and grow together.
            </p>
            <button
               className="px-8 py-4 bg-white text-neutral-950 font-semibold rounded-xl hover:bg-lime-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-lime-400/20 transition-all duration-300 w-full sm:w-auto"
              onClick={() => scrollToSection('contact')}
            >
              Let's Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;