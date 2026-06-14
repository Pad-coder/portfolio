import React from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    const phoneNumber = import.meta.env.VITE_phoneNumber; 
    const message = "Hello Padmanaban! I found your portfolio and would like to connect with you.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/Pad-coder", name: "GitHub" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/padmanaban2002/", name: "LinkedIn" },
    { icon: FaInstagram, href: "https://www.instagram.com/pad_coder/", name: "Instagram" },
    { icon: FaTwitter, href: "https://x.com/pad_coder", name: "Twitter" },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="relative border-t border-white/5 bg-[#0a0a0a] pt-20 pb-10 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand section */}
          <div className="lg:col-span-2 pr-4">
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Padmanaban M.</h3>
            <p className="text-neutral-500 text-sm tracking-widest font-semibold uppercase mb-6">Full-Stack Engineer</p>
            <p className="text-neutral-400 font-light leading-relaxed max-w-sm mb-8">
              Crafting digital experiences with clean code, elegant design, and exceptional performance. Let's build the future together.
            </p>
            
            {/* Minimal Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/[0.03] rounded-full flex items-center justify-center border border-white/5 transition-all duration-300 hover:bg-white/[0.1] hover:border-white/20 hover:-translate-y-1"
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4 text-neutral-400 hover:text-white transition-colors duration-300" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Navigation</h4>
            <div className="flex flex-col space-y-4">
              {['home', 'about', 'projects', 'socialmedia', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="text-left text-neutral-400 font-light hover:text-lime-400 transition-colors duration-300 capitalize text-sm w-fit"
                >
                  {section === 'socialmedia' ? 'Social Media' : section}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Contact</h4>
            <div className="flex flex-col space-y-4">
              <span className="text-neutral-400 text-sm font-light">Chennai, Tamil Nadu, India</span>
              <a href="mailto:padmanaban870@gmail.com" className="text-neutral-400 text-sm font-light hover:text-lime-400 transition-colors">
                padmanaban870@gmail.com
              </a>
              <button onClick={handleWhatsAppClick} className="text-left text-neutral-400 text-sm font-light hover:text-green-400 transition-colors flex items-center gap-2 w-fit">
                <FaWhatsapp className="w-4 h-4" />
                WhatsApp
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-sm font-light">
            © {currentYear} PadCoder.com . All Rights Reserved..
          </p>
          <div className="flex items-center gap-2 text-neutral-500 text-sm font-light">
            <span>Designed & <span className="text-white">Developed</span> by</span>
            
            
            <span className="text-lime-400">Padmanaban</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;