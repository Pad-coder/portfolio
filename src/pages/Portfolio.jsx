import React, { useState, useEffect } from "react";
import appImage from '../assets/appImage.png'
import loopup from '../assets/loopup.jpeg'

const Portfolio = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const portfolio = [
    {
      title: "Chatspace",
      subtitle: "Social Media Web Application",
      image: appImage,
      description: "This is a beginner-level full-stack chat application with real-time messaging, user authentication, profile management, and post interactions.",
      techStack: "React.js, Tailwind CSS, Node.js, Express, MongoDB",
      link: "https://chatspace-krbm.onrender.com/",
    },
    {
      title: "Loop Up",
      subtitle: "Donation Application",
      image: loopup,
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
      { threshold: 0.3 }
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
    <div className="min-h-screen bg-neutral-900 text-lime-400 relative overflow-hidden cursor-none">

      {/* Simple Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
                 linear-gradient(rgba(132, 204, 22, 0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(132, 204, 22, 0.1) 1px, transparent 1px)
               `,
            backgroundSize: '40px 40px'
          }}>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10">

        {/* Header - Responsive Typography */}
        <div className="text-center mb-16 lg:mb-20 ">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 tracking-tight">
            PROJECTS
          </h1>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-lime-400 mx-auto mb-6 lg:mb-8"></div>
          <p className="text-base sm:text-lg lg:text-xl text-neutral-400 max-w-xl lg:max-w-2xl mx-auto px-4">
            Clean code. Simple solutions. Interactive experiences.
          </p>
        </div>

        {/* Projects - Equal Height Sections */}
        <div className="space-y-12 lg:space-y-20">
          {portfolio.map((project, idx) => (
            <div
              key={idx}
              data-animate
              className={`transform transition-all duration-1000 ${isVisible[`project-${idx}`]
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-16 opacity-0'
                }`}
            >
              <div
                className="group relative bg-neutral-800/50 border border-neutral-700 rounded-2xl lg:rounded-3xl overflow-hidden transition-all duration-500 hover:border-lime-400 hover:shadow-2xl hover:shadow-lime-400/20"
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                onMouseMove={handleMouseMove}
              >

                {/* Interactive Background Glow */}
                <div
                  className={`absolute rounded-full bg-lime-400/5 transition-all duration-300 pointer-events-none hidden lg:block ${hoveredCard === idx ? 'opacity-100' : 'opacity-0'
                    }`}
                  style={{
                    width: '200px',
                    height: '200px',
                    left: mousePosition.x - 100,
                    top: mousePosition.y - 100,
                    transform: 'translate(-50%, -50%)',
                  }}
                />

                {/* Responsive Layout Container - Equal Heights */}
                <div className={`flex flex-col lg:flex-row lg:min-h-[500px] xl:min-h-[600px] ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}>

                  {/* Image Section - Full Height Match */}
                  <div className="w-full lg:w-1/2 relative lg:h-auto">
                    <div className="h-64 sm:h-80 lg:h-full overflow-hidden cursor-none">
                      <img
                        src={project.image}
                        alt={project.title}
                        className={`w-full h-full object-cover transition-all duration-700 ${hoveredCard === idx ? 'scale-110 brightness-110' : 'scale-100 brightness-90'
                          }`}
                      />

                      {/* Image Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent transition-opacity duration-500 ${hoveredCard === idx ? 'opacity-100' : 'opacity-60'
                        }`} />

                      {/* Project Number - Responsive Positioning */}
                      {/* <div className={`absolute top-4 right-4 lg:top-6 lg:right-6 w-10 h-10 lg:w-12 lg:h-12 bg-lime-400/20 border-2 border-lime-400 rounded-full flex items-center justify-center font-black text-sm lg:text-lg transition-all duration-300 ${hoveredCard === idx ? 'scale-110 bg-lime-400/30' : 'scale-100'
                        }`}>
                        {String(idx + 1).padStart(2, '0')}
                      </div> */}
                    </div>
                  </div>

                  {/* Content Section - Full Height with Centered Content */}
                  <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-center lg:h-full">

                    {/* Project Title - Responsive Typography */}
                    <div className="mb-6 lg:mb-8 cursor-none">
                      <h2 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black mb-2 lg:mb-3 transition-all duration-300 leading-tight ${hoveredCard === idx ? 'text-lime-300' : 'text-lime-400'
                        }`}>
                        {project.title}
                      </h2>
                      <p className="text-neutral-400 text-sm sm:text-base lg:text-lg font-light mb-4 lg:mb-6">
                        {project.subtitle}
                      </p>
                      <p className="text-neutral-300 leading-relaxed text-sm sm:text-base lg:text-lg">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack - Responsive Tags */}
                    <div className="mb-6 lg:mb-8">
                      <h3 className="text-lime-400 font-bold mb-3 lg:mb-4 text-sm sm:text-base lg:text-lg">
                        TECH STACK
                      </h3>
                      <div className="flex flex-wrap gap-2 lg:gap-3">
                        {getTechStackArray(project.techStack).map((tech, techIdx) => (
                          <span
                            key={tech}
                            className={`px-3 py-1.5 lg:px-4 lg:py-2 bg-neutral-700/50 border border-neutral-600 text-neutral-300 font-medium rounded-md lg:rounded-lg transition-all duration-300 hover:border-lime-400 hover:text-lime-400 hover:bg-lime-400/10 cursor-pointer transform hover:scale-105 text-xs sm:text-sm lg:text-base`}
                            style={{
                              transitionDelay: `${techIdx * 50}ms`
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button - Responsive Sizing */}
                    <div>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 lg:gap-3 px-6 py-3 lg:px-8 lg:py-4 bg-transparent border-2 border-lime-400 text-lime-400 font-bold rounded-lg lg:rounded-xl transition-all duration-300 hover:bg-lime-400 hover:text-neutral-900 hover:shadow-lg hover:shadow-lime-400/30 transform hover:scale-105 text-sm lg:text-base "
                      >
                        VIEW PROJECT
                        <svg
                          className="w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-300 group-hover:translate-x-1"
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

        {/* Footer - Responsive */}
        <div className="text-center mt-16 lg:mt-24 cursor-none">
          <div className="inline-block border-2 border-lime-400/30 rounded-xl lg:rounded-2xl p-6 lg:p-8 bg-neutral-800/30 backdrop-blur-sm mx-4">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 lg:mb-4">
              MORE PROJECTS COMING SOON
            </h3>
            <p className="text-neutral-400 mb-4 lg:mb-6 max-w-xs sm:max-w-md text-sm sm:text-base">
              Currently working on new exciting projects. Stay tuned for updates.
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
