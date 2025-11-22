import React, { useState, useEffect, useRef } from "react";
import profile from '/profile.png'
const About = () => {
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const aboutRef = useRef(null);



  const expertise = [
    {
      title: "Frontend Architecture",
      description: "Building responsive, accessible, and high-performance user interfaces using modern JavaScript frameworks and CSS methodologies.",
      tools: ["React.js", "Next.js", "Javascript", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap"],
      icon: "</>"
    },
    {
      title: "Backend Development",
      description: "Designing scalable server-side applications with robust APIs, database optimization, and security best practices.",
      tools: ["Node.js", "Express", "PHP", "MongoDB", "MySQL"],
      icon: "{ }"
    },
    {
      title: "Full-Stack Integration",
      description: "Seamlessly connecting frontend and backend systems with modern development workflows and deployment strategies.",
      tools: ["React.js", "Node.js", "Express.js", "MongoDB", "Figma", "Photoshop", "Illustrator", "Git", "GitHub"],
      icon: "[ ]"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = aboutRef.current?.querySelectorAll('[id]');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    if (aboutRef.current) {
      const rect = aboutRef.current.getBoundingClientRect();
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
  };
  return (
    <section
      ref={aboutRef}
      className="relative bg-neutral-900 text-white overflow-hidden min-h-screen cursor-none"
      onMouseMove={handleMouseMove}
      id="about"
    >
      {/* Custom Cursor */}
      <div
        className="fixed pointer-events-none z-50 w-4 h-4 bg-white/40 rounded-full mix-blend-difference transition-all duration-200"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
      />

      {/* Decorative Tech Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-6xl text-white/5 animate-float">&lt;/&gt;</div>
        <div className="absolute top-40 right-20 text-4xl text-white/5 animate-float" style={{ animationDelay: '1s' }}>{ }</div>
        <div className="absolute bottom-40 left-20 text-5xl text-white/5 animate-float" style={{ animationDelay: '2s' }}>[ ]</div>
        <div className="absolute bottom-20 right-10 text-3xl text-white/5 animate-float" style={{ animationDelay: '3s' }}>( )</div>
        <div className="absolute top-1/2 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24 relative z-10">

        {/* Header Section */}
        <div
          id="about-header"
          className={`text-center mb-16 transform transition-all duration-1000 cursor-none ${isVisible['about-header'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
        >
          <div className="inline-block relative mb-6">
            <h1 className="text-xl md:text-6xl font-black tracking-tight">
              ABOUT <span className="text-lime-400">•</span> ME
            </h1>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-white via-lime-400 to-white rounded-full"></div>
          </div>
          <p className="text-md md:text-xl poppins-light text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transforming complex problems into elegant digital solutions
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16 ">

          {/* Left Column - Image Placeholder & Intro */}
          <div
            id="about-intro"
            className={` lg:col-span-1 transform transition-all duration-1000 delay-300 cursor-none ${isVisible['about-intro'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
          >
            {/* Image Placeholder */}
            <div className="relative mb-8 group cursor-none">
              <div className=" md:w-full md:aspect-square bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-2xl border-2 border-dashed border-gray-600/50 flex items-center justify-center hover:border-gray-500/70 transition-all duration-300">
                <img src={profile} alt="Profile" />
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-lime-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-2 border-gray-600/50 rounded-full"></div>
            </div>

            {/* Professional Intro */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm cursor-none">
              <h2 className="text-lg md:text-2xl font-bold mb-4 text-white">PADMANABAN M</h2>
              <p className="text-sm md:text-lg text-gray-300 leading-relaxed mb-4">
                A passionate <strong className="text-lime-400">Full-Stack Developer</strong> and <strong className="text-lime-400">Tech Enthusiast</strong> with expertise in modern web technologies. I specialize in creating scalable, user-centric applications that solve real-world problems.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                <span className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></span>
                Available for exciting projects
              </div>
            </div>
          </div>

          {/* Right Column - Expertise Cards */}
          <div className="lg:col-span-2 ">
            <div className="grid gap-6 ">
              {expertise.map((item, index) => (
                <div
                  key={item.title}
                  id={`expertise-${index}`}
                  className={`bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/70 hover:bg-gray-800/70 transition-all duration-300 group  backdrop-blur-sm transform cursor-none  ${isVisible[`expertise-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}
                  style={{ transitionDelay: `${400 + index * 200}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-xl md:text-3xl text-lime-400 font-mono group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-2xl font-bold mb-3 text-white group-hover:text-lime-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className=" text-gray-300 leading-relaxed mb-4">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-3 py-1 text-xs font-mono bg-gray-700/50 text-gray-200 rounded-full hover:bg-lime-400 hover:text-gray-900 transition-colors duration-300 cursor-pointer border border-gray-600/30"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>



        {/* Call to Action */}
        <div
          id="cta"
          className={`text-center transform transition-all duration-1000 ${isVisible['cta'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
        >
          <div className="inline-block relative">
            <h3 className="text-xl md:text-3xl font-bold mb-6 text-white">
              Ready to <span className="text-lime-400">collaborate</span>?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-4 py-2 bg-lime-400 text-gray-900 rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-lime-400/25 relative overflow-hidden"
                onClick={() => scrollToSection('portfolio')}
              >
                <span className="relative z-10">View My Work</span>
                <div className="absolute inset-0 bg-gradient-to-r from-lime-300 to-lime-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="absolute inset-0 flex items-center justify-center text-gray-900 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  View My Work
                </span>
              </button>

              <button
                className="px-4 py-2 border-2 border-gray-600 text-gray-300 rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:bg-lime-400 hover:text-gray-900 hover:border-lime-400"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '../../public/Padmanaban_CV.pdf'; // Put your resume in public folder
                  link.download = 'Padmanaban_CV.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.1; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default About;
