import React from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter, FaHeart, FaCode, FaWhatsapp  } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    const phoneNumber = import.meta.env.VITE_phoneNumber; // Replace with your actual phone number
    const message = "Hello Padmanaban! I found your portfolio and would like to connect with you.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/Pad-coder", name: "GitHub", type: "link" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/padmanaban2002/", name: "LinkedIn", type: "link" },
    { icon: FaInstagram, href: "https://www.instagram.com/pad_coder/", name: "Instagram", type: "link" },
    { icon: FaTwitter, href: "https://x.com/pad_coder", name: "Twitter", type: "link" },
    { icon: FaWhatsapp, href: "", name: "WhatsApp", type: "whatsapp" }
  ];

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
    <footer className="relative bg-black text-white overflow-hidden cursor-none">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-lime-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-lime-400/30 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Top section with content */}
        <div className="border-b border-white/10 py-16 px-6 sm:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Brand section */}
              <div className="lg:col-span-1">
                <div className="mb-6">
                  <h3 className="md:text-2xl font-bold text-lime-400 mb-2">
                    Padmanaban M
                  </h3>
                  <p className="text-white/60 md:text-sm tracking-wider">
                    FULL-STACK DEVELOPER
                  </p>
                </div>
                <p className="text-white/70 leading-relaxed mb-6">
                  Crafting digital experiences with clean code and innovative design. 
                  Let's build something amazing together.
                </p>
                
                {/* Social links */}
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    
                    // Handle WhatsApp differently
                    if (social.type === "whatsapp") {
                      return (
                        <button
                          key={index}
                          onClick={handleWhatsAppClick}
                          className="group w-10 h-10 bg-white/5 hover:bg-green-500 rounded-full flex items-center justify-center border border-white/10 hover:border-green-500 transition-all duration-300 hover:scale-110"
                          aria-label={social.name}
                        >
                          <Icon className="w-4 h-4 text-white/60 group-hover:text-white transition-colors duration-300" />
                        </button>
                      );
                    }
                    
                    // Handle other social links
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group w-10 h-10 bg-white/5 hover:bg-lime-400 rounded-full flex items-center justify-center border border-white/10 hover:border-lime-400 transition-all duration-300 hover:scale-110"
                        aria-label={social.name}
                      >
                        <Icon className="w-4 h-4 text-white/60 group-hover:text-black transition-colors duration-300" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Quick links */}
              <div className="lg:col-span-1">
                <h4 className="text-lg font-semibold text-white mb-6">
                  Quick Links
                </h4>
                <div className="space-y-3">
                  {['home', 'about', 'portfolio', 'contact'].map((section) => (
                    <button
                      key={section}
                      onClick={() => scrollToSection(section)}
                      className="block text-white/60 hover:text-lime-400 transition-color duration-200 text-left capitalize hover:translate-x-1 transform transition-transform"
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div className="lg:col-span-1">
                <h4 className="text-lg font-semibold text-white mb-6">
                  Get in Touch
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
                    <span className="text-white/70 text-sm">
                      Guduvancheri, Tamil Nadu, India
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
                    <a 
                      href="mailto:padmanaban870@gmail.com"
                      className="text-white/70 hover:text-lime-400 transition-colors text-sm"
                    >
                      padmanaban870@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
                    <button
                      onClick={handleWhatsAppClick}
                      className="text-white/70 hover:text-green-400 transition-colors text-sm flex items-center gap-2"
                    >
                      <FaWhatsapp className="w-3 h-3" />
                      Chat on WhatsApp
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
                    <span className="text-white/70 text-sm">
                      Available for freelance
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="py-6 px-6 sm:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* Copyright */}
              <div className="flex items-center gap-2 text-white/60 text-[12px] md:text-sm">
                <span>© {currentYear} Padmanaban M.</span>
                <span>Made with</span>
                <FaHeart className="w-3 h-3 text-red-400 animate-pulse" />
                <span>and</span>
                <FaCode className="w-3 h-3 text-lime-400" />
              </div>

              {/* Tech stack */}
              <div className="flex items-center gap-4 text-white/40 text-xs">
                <span>Built with React</span>
                <span>•</span>
                <span>Styled with Tailwind CSS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative bottom line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-lime-400 to-transparent"></div>
      </div>
    </footer>
  );
}

export default Footer;
