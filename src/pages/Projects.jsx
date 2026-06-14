import React, { useState, useEffect } from "react";
import appImage from '../assets/appImage.webp'
import loopup from '../assets/loopup.webp'

const Projects = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const portfolio = [
    {
      title: "Chatspace",
      subtitle: "Social Media Web Application",
      image: appImage,
      alt: "Screenshot of Chatspace Application",
      description: "This is a beginner-level full-stack chat application with real-time messaging, user authentication, profile management, and post interactions.",
      techStack: "React.js, Tailwind CSS, Node.js, Express, MongoDB",
      link: "https://chatspace-krbm.onrender.com/",
    },
    {
      title: "Loop Up",
      subtitle: "Donation Application",
      image: loopup,
      alt: "Screenshot of Loop Up Application",
      description: "A community-driven platform for donating items, empowering youth to reduce waste and share resources effectively.",
      techStack: "React.js, Firebase, Tailwind CSS, Node Mailer",
      link: "https://loopup-web.netlify.app/",
    },
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
      { threshold: 0.15 } // Lowered threshold slightly for smoother early triggering
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el, index) => {
      el.id = `project-${index}`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const getTechStackArray = (techStack) => {
    return techStack.split(', ');
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white relative overflow-hidden cursor-none">

      {/* Premium Subdued Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Very subtle grid */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
                 linear-gradient(rgba(132, 204, 22, 1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(132, 204, 22, 1) 1px, transparent 1px)
               `,
            backgroundSize: '32px 32px'
          }}>
        </div>
        {/* Soft radial glow in the background center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-lime-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative z-10 max-w-7xl">

        {/* Header - Elegant Typography */}
        <div className="text-center mb-24 lg:mb-32">
          <span className="inline-block text-lime-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Selected Works
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">
            Featured Projects
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Clean code. Simple solutions. Interactive experiences.
          </p>
        </div>

        {/* Projects List */}
        <div className="space-y-24 lg:space-y-32">
          {portfolio.map((project, idx) => (
            <div
              key={idx}
              data-animate
              className={`transform transition-all duration-1000 ease-out ${isVisible[`project-${idx}`]
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-12 opacity-0'
                }`}
            >
              <div
                className="group relative bg-neutral-800/20 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-lime-500/5 hover:border-white/10"
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                onMouseMove={handleMouseMove}
              >
                {/* Modern Spotlight Hover Effect */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-in-out hidden lg:block"
                  style={{
                    background: hoveredCard === idx 
                      ? `radial-gradient(circle 500px at ${mousePosition.x}px ${mousePosition.y}px, rgba(132, 204, 22, 0.06), transparent 50%)` 
                      : 'transparent',
                    opacity: hoveredCard === idx ? 1 : 0
                  }}
                />

                <div className={`flex flex-col lg:flex-row p-4 sm:p-6 gap-8 lg:gap-12 items-center ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>

                  {/* Image Section - Rounded & Zoomed slightly */}
                  <div className="w-full lg:w-1/2 relative overflow-hidden rounded-2xl bg-neutral-800/50 aspect-video lg:aspect-[4/3] border border-white/5 cursor-none">
                    <img
                      src={project.image}
                      alt={project.alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-neutral-900/20 transition-opacity duration-500 group-hover:opacity-0" />
                  </div>

                  {/* Content Section - Refined Spacing */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-6">
                    
                    <div className="mb-8 cursor-none">
                      <p className="text-lime-400 text-sm font-medium tracking-wide uppercase mb-3">
                        {project.subtitle}
                      </p>
                      <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-5 transition-colors duration-300 group-hover:text-lime-300">
                        {project.title}
                      </h2>
                      <p className="text-neutral-400 leading-relaxed text-base lg:text-lg font-light max-w-xl">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack - Premium Pills */}
                    <div className="mb-10">
                      <h3 className="text-white/30 text-xs font-semibold tracking-wider uppercase mb-4">
                        Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2 lg:gap-2.5">
                        {getTechStackArray(project.techStack).map((tech) => (
                          <span
                            key={tech}
                            className="px-3.5 py-1.5 bg-white/[0.03] border border-white/10 text-neutral-300 text-xs sm:text-sm font-medium rounded-full transition-colors duration-300 hover:bg-white/10 hover:text-white cursor-pointer"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button - Elegant Transitions */}
                    <div>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn inline-flex items-center gap-2.5 px-6 py-3 bg-lime-400/5 text-lime-400 hover:bg-lime-400 hover:text-neutral-950 font-medium rounded-xl transition-all duration-300 ease-out border border-lime-400/20 hover:border-lime-400 text-sm sm:text-base"
                      >
                        View Live Project
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Premium CTA Section for Mini Projects */}
        <div className="mt-32 max-w-4xl mx-auto text-center">
          <div className="bg-neutral-800/20 backdrop-blur-md border border-white/5 rounded-3xl p-10 lg:p-16 transition-all duration-500 hover:border-white/10 hover:bg-neutral-800/30">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight">
              More Explorations
            </h3>
            <p className="text-neutral-400 text-base lg:text-lg mb-8 max-w-xl mx-auto font-light leading-relaxed">
              Check out my smaller projects, UI experiments, and technical deep-dives to see my day-to-day coding practice.
            </p>
            <a
              href="/mini-projects"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-neutral-950 hover:bg-lime-400 hover:text-neutral-950 font-medium rounded-xl transition-all duration-300 shadow-lg shadow-white/5 hover:shadow-lime-400/20"
            >
              Explore Mini Projects
            </a>
          </div>
        </div>
        
        {/* Redesigned Roadmap / Coming Soon Indicator */}
        <div className="mt-20 max-w-3xl mx-auto text-center cursor-none">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex items-center gap-3 mb-5 px-4 py-2 rounded-full border border-lime-400/20 bg-lime-400/5">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-lime-400/40 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-lime-400/70 animate-pulse delay-150"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse delay-300"></div>
              </div>
              <span className="text-lime-400 text-xs font-semibold tracking-widest uppercase">
                In Progress
              </span>
            </div>
            <h4 className="text-white text-xl sm:text-2xl font-medium mb-3 tracking-tight">
              New experiences brewing
            </h4>
            <p className="text-neutral-500 text-sm sm:text-base font-light">
              Currently engineering the next generation of side projects. Stay tuned.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Projects;