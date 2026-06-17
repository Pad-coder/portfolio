import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import appImage from "../assets/appImage.webp";
import loopup from "../assets/loopup.webp";

// ==========================================
// 1. REUSABLE MICRO-COMPONENTS
// ==========================================

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 },
    );
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// ==========================================
// 2. PREMIUM PROJECT CARD (Linear Style)
// ==========================================

const ProjectCard = ({ project, idx }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // High-performance CSS variable spotlight (Zero React Re-renders)
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  const techArray = project.techStack.split(", ");

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-[2.5rem] bg-[#0a0a0a] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
      style={{
        // The magic "borderless" inner highlight
        boxShadow:
          "inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 20px 40px rgba(0,0,0,0.4)",
      }}
    >
      {/* Linear-style Mouse Spotlight 
        Uses CSS variables set by onMouseMove for 60fps performance 
      */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-in-out z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(800px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(163, 230, 53, 0.04), transparent 40%)`,
        }}
      />

      <div
        className={`relative z-10 flex flex-col lg:flex-row p-6 sm:p-10 lg:p-12 gap-10 lg:gap-16 items-center ${idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
      >
        {/* Image Presentation */}
        <div className="w-full lg:w-1/2 relative rounded-[1.5rem] overflow-hidden bg-[#111] aspect-[4/3] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]">
          <div className="absolute inset-0 border border-white/5 rounded-[1.5rem] z-20 pointer-events-none" />
          <img
            src={project.image}
            alt={project.alt}
            width={600}
            height={450}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />
          {/* Elegant image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-20 z-10" />
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-lime-400/50" />
              <p className="text-lime-400 text-xs font-semibold tracking-[0.2em] uppercase">
                {project.subtitle}
              </p>
            </div>

            <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight mb-6 transition-colors duration-300">
              {project.title}
            </h2>

            <p className="text-neutral-400 leading-relaxed text-base lg:text-lg font-light max-w-xl">
              {project.description}
            </p>
          </div>

          {/* Premium Tech Stack Pills */}
          <div className="mb-10">
            <div className="flex flex-wrap gap-2.5">
              {techArray.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-white/[0.02] text-neutral-300 text-xs font-medium rounded-xl transition-all duration-300 hover:bg-white/[0.06] hover:text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Button - Linear Style */}
          <div>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-neutral-950 font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(255,255,255,0.1)] active:scale-95 text-sm sm:text-base"
            >
              <span className="relative z-10 flex items-center gap-2">
                View Live Project
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-lime-400 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN PAGE
// ==========================================

const Projects = () => {
  const portfolio = [
    {
      title: "Chatspace",
      subtitle: "Social Application",
      image: appImage,
      alt: "Screenshot of Chatspace Application",
      description:
        "A full-stack real-time messaging ecosystem. Features secure authentication, profile management, and instantaneous post interactions wrapped in a premium UI.",
      techStack: "React.js, Tailwind CSS, Node.js, Express, MongoDB",
      link: "https://chatspace-krbm.onrender.com/",
    },
    {
      title: "Loop Up",
      subtitle: "Donation Platform",
      image: loopup,
      alt: "Screenshot of Loop Up Application",
      description:
        "A community-driven platform engineered to facilitate seamless item donations, empowering youth to reduce waste and share resources effectively.",
      techStack: "React.js, Firebase, Tailwind CSS, Node Mailer",
      link: "https://loopup-web.netlify.app/",
    },
  ];

  return (
    <div className="relative w-full min-h-screen text-white cursor-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative z-10 max-w-7xl">
        <FadeIn delay={100} className="text-center mb-20 lg:mb-32">
          <span className="inline-block text-lime-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Selected Works
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight text-white">
            Featured Projects.
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Clean architecture. Exceptional user experiences. Designed and
            engineered from the ground up.
          </p>
        </FadeIn>

        <div className="space-y-16 lg:space-y-24">
          {portfolio.map((project, idx) => (
            <FadeIn key={idx} delay={200 + idx * 100}>
              <ProjectCard project={project} idx={idx} />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={400} className="mt-32 max-w-4xl mx-auto text-center">
          <div className="relative rounded-[3rem] p-12 lg:p-20 overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-md">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-lime-400/10 blur-[80px] rounded-full pointer-events-none" />

            <h3 className="text-3xl lg:text-5xl font-bold text-white mb-6 tracking-tight relative z-10">
              More Explorations.
            </h3>
            <p className="text-neutral-400 text-base lg:text-lg mb-10 max-w-2xl mx-auto font-light leading-relaxed relative z-10">
              Discover smaller projects, UI experiments, and technical
              deep-dives to see my day-to-day coding practices.
            </p>

            <a
              href="/mini-projects"
              className="relative z-10 inline-flex items-center justify-center px-10 py-4 bg-white text-neutral-950 font-semibold rounded-2xl transition-all duration-300 hover:bg-lime-400 hover:scale-[1.02] shadow-[0_10px_40px_rgba(255,255,255,0.1)] active:scale-95"
            >
              Explore Mini Projects
            </a>
          </div>
        </FadeIn>

        <FadeIn
          delay={600}
          className="mt-24 max-w-3xl mx-auto text-center cursor-none"
        >
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex items-center gap-3 mb-6 px-5 py-2.5 rounded-full bg-white/[0.02] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-lime-400/40 animate-pulse"></div>
                <div
                  className="w-1.5 h-1.5 rounded-full bg-lime-400/70 animate-pulse"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
              <span className="text-neutral-300 text-xs font-semibold tracking-widest uppercase">
                In Progress
              </span>
            </div>
            <h4 className="text-white text-2xl font-medium mb-3 tracking-tight">
              New experiences brewing
            </h4>
            <p className="text-neutral-500 text-base font-light">
              Currently engineering the next generation of digital products.
              Stay tuned.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default memo(Projects);
