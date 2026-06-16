import React, { useState, useEffect, useRef, useCallback } from "react";

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
      { threshold: 0.15 }
    );
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out will-change-transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const AnimatedCounter = ({ end, suffix = "", delay = 0 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime = null;
    const duration = 2000; // 2 seconds

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Ease Out Expo
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    setTimeout(() => requestAnimationFrame(animate), delay);
  }, [isVisible, end, delay]);

  return (
    <span ref={countRef} className="tabular-nums font-bold">
      {count}{suffix}
    </span>
  );
};

const TechBadge = ({ tool }) => (
  <span className="px-3 py-1.5 text-xs font-medium bg-white/[0.02] text-neutral-300 rounded-lg border border-white/5 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/15 hover:text-white hover:-translate-y-0.5 cursor-default shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
    {tool}
  </span>
);

// ==========================================
// 2. MAIN SECTION COMPONENTS
// ==========================================

const ProfileCard = () => {
  const cardRef = useRef(null);
  const contentRef = useRef(null);

  // High-performance 3D Tilt (No React state updates)
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || !contentRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const xRotate = (-y / rect.height) * 15;
    const yRotate = (x / rect.width) * 15;
    
    contentRef.current.style.transform = `perspective(1000px) rotateX(${xRotate}deg) rotateY(${yRotate}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!contentRef.current) return;
    contentRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  }, []);

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative h-full w-full rounded-[2.5rem] bg-gradient-to-b from-white/[0.04] to-transparent p-[1px]"
    >
      {/* Animated Glow Border */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-lime-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
      
      {/* Glass Surface */}
      <div 
        ref={contentRef}
        className="relative h-full w-full bg-[#0a0a0a]/90 backdrop-blur-3xl rounded-[2.5rem] p-8 sm:p-10 flex flex-col gap-8 transition-transform duration-300 ease-out shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden"
      >
        {/* Soft Inner Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="flex items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-white/10 to-transparent">
            <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900">
              <img 
                src="/profile.png" 
                alt="Padmanaban" 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Padmanaban M</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
              </span>
              <p className="text-lime-400 text-xs font-semibold tracking-wider uppercase">Open to Work</p>
            </div>
            <p className="text-neutral-500 text-sm mt-1 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Tamil Nadu, India
            </p>
          </div>
        </div>

        <p className="text-neutral-400 text-base leading-relaxed font-light relative z-10">
          I started coding out of a desire to build things that matter. Today, I focus on bridging the gap between elegant frontend interfaces and robust backend architectures, ensuring performance and premium user experiences.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-auto relative z-10 pt-6 border-t border-white/5">
          <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5">
            <p className="text-neutral-500 text-xs uppercase tracking-widest font-semibold mb-1">Experience</p>
            <p className="text-2xl text-white"><AnimatedCounter end={2} suffix="+" delay={200} /> <span className="text-sm text-neutral-400 font-normal">Years</span></p>
          </div>
          <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5">
            <p className="text-neutral-500 text-xs uppercase tracking-widest font-semibold mb-1">Projects</p>
            <p className="text-2xl text-white"><AnimatedCounter end={20} suffix="+" delay={400} /> <span className="text-sm text-neutral-400 font-normal">Built</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExpertiseCard = ({ item }) => (
  <div className="group relative bg-white/[0.02] rounded-[2.5rem] p-8 sm:p-10 border border-white/5 backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.03] hover:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
    <div className="flex flex-col md:flex-row items-start gap-8">
      {/* Premium Icon Container */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-white/10 to-transparent p-[1px] shrink-0">
        <div className="w-full h-full rounded-2xl bg-[#0f0f0f] flex items-center justify-center text-neutral-400 group-hover:text-lime-400 transition-colors duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          {item.icon}
        </div>
      </div>

      <div className="flex-1 w-full">
        <h3 className="text-2xl font-bold text-white tracking-tight mb-3">
          {item.title}
        </h3>
        <p className="text-neutral-400 leading-relaxed font-light text-base mb-8 max-w-2xl">
          {item.description}
        </p>

        {/* Perfect CSS Grid for consistent alignment across all cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {item.categories.map((category) => (
            <div key={category.name} className="flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-lime-400/50" />
                {category.name}
              </span>
              <div className="flex flex-wrap gap-2">
                {category.tools.map((tool) => (
                  <TechBadge key={tool} tool={tool} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// 3. MAIN ASSEMBLED PAGE
// ==========================================

const About = () => {
  const expertise = [
    {
      title: "Frontend Architecture",
      description: "Building responsive, accessible, and high-performance user interfaces using modern JavaScript frameworks and CSS methodologies.",
      categories: [
        { name: "Languages", tools: ["HTML5", "CSS3", "JavaScript"] },
        { name: "Frameworks", tools: ["React", "Next.js"] },
        { name: "Styling", tools: ["Tailwind CSS", "Bootstrap"] },
      ],
      icon: <span className="font-mono font-bold text-xl">&lt;/&gt;</span>,
    },
    {
      title: "Backend Architecture",
      description: "Designing secure, scalable server-side systems and RESTful APIs. Emphasizing database optimization and maintainable business logic.",
      categories: [
        { name: "Runtime", tools: ["Node.js", "PHP"] },
        { name: "Frameworks", tools: ["Express"] },
        { name: "Databases", tools: ["MongoDB", "MySQL"] },
      ],
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>,
    },
    {
      title: "Full-Stack Integration",
      description: "Seamlessly connecting frontend and backend systems with modern development workflows and deployment strategies.",
      categories: [
        { name: "Development", tools: ["React", "Next.js", "WordPress"] },
        { name: "Design Tools", tools: ["Figma", "Photoshop"] },
        { name: "Workflow", tools: ["Git", "Postman", "Docker", "AWS"] },
      ],
      icon: <span className="font-mono font-bold text-xl">[ ]</span>,
    },
  ];

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="about" className="relative text-white overflow-hidden min-h-screen pt-32 pb-24 bg-[#0a0a0a]">
      
      {/* --- Ambient Background & Premium Noise --- */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay z-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="aboutNoise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter>
          <rect width="100%" height="100%" filter="url(#aboutNoise)"/>
        </svg>
      </div>
     
      {/* Soft Light */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-lime-500/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <FadeIn delay={100} className="mb-16">
          <h2 className="text-sm font-semibold text-lime-400 tracking-[0.2em] uppercase mb-3">About Me</h2>
          <p className="text-3xl md:text-5xl font-bold text-white tracking-tight">Engineering Digital Experiences.</p>
        </FadeIn>

        {/* 12-Column Premium Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-32 items-stretch">
          
          {/* Left Column (Profile & Stats) - 4/12 */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-max">
            <FadeIn delay={200} className="h-full">
              <ProfileCard />
            </FadeIn>
          </div>

          {/* Right Column (Expertise Iteration) - 8/12 */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {expertise.map((item, index) => (
              <FadeIn key={item.title} delay={300 + index * 150}>
                <ExpertiseCard item={item} />
              </FadeIn>
            ))}
          </div>

        </div>

        {/* Premium CTA Section */}
        <FadeIn delay={500}>
          <div className="relative max-w-5xl mx-auto text-center bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 rounded-[3rem] p-12 sm:p-20 overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-xl">
            {/* CTA Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-lime-400/10 blur-[80px] rounded-full pointer-events-none" />

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight relative z-10">
              Let's Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-200">Great</span>.
            </h3>

            <p className="text-neutral-400 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto mb-10 relative z-10">
              Whether you have a startup idea, need a technical partner, or want to revamp an existing product, I'm ready to help turn your vision into reality.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
              <button
                onClick={() => scrollToSection("contact")}
                className="group px-8 py-4 bg-white text-neutral-950 rounded-2xl font-semibold transition-all duration-300 hover:bg-lime-400 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(163,230,53,0.25)] w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Get In Touch
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
};

export default About;