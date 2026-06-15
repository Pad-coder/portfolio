import React, { useState, useEffect, useRef } from "react";
import profile from "/profile.png";

const About = () => {
  const [isVisible, setIsVisible] = useState({});
  const aboutRef = useRef(null);

  // Unifed Schema: Every object now uses the exact same `categories` structure.
  const expertise = [
    {
      title: "Frontend Architecture",
      description:
        "Building responsive, accessible, and high-performance user interfaces using modern JavaScript frameworks and CSS methodologies.",
      categories: [
        { name: "Languages", tools: ["HTML5", "CSS3", "JavaScript"] },
        { name: "Frameworks", tools: ["React", "Next.js"] },
        { name: "Styling", tools: ["Tailwind CSS", "Bootstrap"] },
      ],
      icon: <span className="font-mono font-bold text-xl">&lt;/&gt;</span>,
    },
    {
      title: "Backend Architecture",
      description:
        "Designing secure, scalable server-side systems and RESTful APIs. Emphasizing database optimization and maintainable business logic.",
      categories: [
        { name: "Runtime", tools: ["Node.js", "PHP"] },
        { name: "Frameworks", tools: ["Express"] },
        { name: "Databases", tools: ["MongoDB", "MySQL"] },
      ],
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
          />
        </svg>
      ),
    },
    {
      title: "Full-Stack Integration",
      description:
        "Seamlessly connecting frontend and backend systems with modern development workflows and deployment strategies.",
      categories: [
        { name: "Development", tools: ["React", "Next.js", "JavaScript", "WordPress"] },
        { name: "Design Tools", tools: ["Figma", "Photoshop"] },
        { name: "Workflow", tools: ["Git & GitHub", "Postman", "Docker", "AWS"] },
      ],
      icon: <span className="font-mono font-bold text-xl">[ ]</span>,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = aboutRef.current?.querySelectorAll("[id]");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      ref={aboutRef}
      className="relative text-white overflow-hidden min-h-screen pt-32 pb-24"
    >
      {/* Refined Minimal Ambient Lighting */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[600px] bg-lime-500/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-24 items-start">
          {/* Left Column - Profile Details */}
          <div
            id="about-intro"
            className={`lg:col-span-5 flex flex-col gap-8 transform transition-all duration-[800ms] ease-out delay-200 ${isVisible["about-intro"] ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
          >
            {/* Elegant Image Container */}
            <div className="relative group">
              <div className="w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-neutral-900 rounded-[2rem] border border-white/5 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-white/10 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.02)]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                <img
                  src={profile}
                  alt="Padmanaban M"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 scale-100 brightness-95 group-hover:brightness-105"
                />
              </div>
            </div>

            {/* Premium Profile Card */}
            <div className="bg-white/[0.02] rounded-[2rem] p-8 border border-white/5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Padmanaban M
                  </h2>
                  <p className="text-neutral-400 text-sm mt-1">
                    Full-Stack Developer | Tech Enthusiast
                  </p>
                </div>
                {/* Status Dot */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-lime-400">
                    Available
                  </span>
                </div>
              </div>

              <div className="w-full h-[1px] bg-white/5 mb-6"></div>

              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light mb-6">
                I started coding out of a desire to build things that matter.
                Today, I focus on bridging the gap between elegant frontend
                interfaces and robust backend architectures. I care deeply about
                clean code, intuitive user experiences, and continuous learning.
              </p>

              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center">
                  <span className="text-neutral-500">Focus</span>
                  <span className="text-neutral-300 font-medium">
                    Web Architecture
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-neutral-500">Experience</span>
                  <span className="text-neutral-300 font-medium">
                   2+ Years
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Expertise Cards */}
          <div className="lg:col-span-7 flex flex-col gap-6 pt-2 lg:pt-0">
            {expertise.map((item, index) => (
              <div
                key={item.title}
                id={`expertise-${index}`}
                className={`group bg-white/[0.02] rounded-[2rem] p-8 sm:p-10 border border-white/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.03] hover:border-white/10 transform ${isVisible[`expertise-${index}`] ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
                style={{ transitionDelay: `${300 + index * 150}ms` }}
              >
                <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
                  {/* Premium Icon Container */}
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-neutral-400 group-hover:text-lime-400 group-hover:border-lime-400/20 group-hover:bg-lime-400/5 transition-all duration-300 shrink-0">
                    {item.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white tracking-tight mb-3 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-neutral-400 leading-relaxed font-light text-sm sm:text-base mb-8">
                      {item.description}
                    </p>

                    {/* Unified & Organized Tech Badges */}
                    <div className="flex flex-col gap-4">
                      {item.categories.map((category) => (
                        <div key={category.name} className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] uppercase tracking-widest text-neutral-600 font-semibold w-24 shrink-0">
                            {category.name}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {category.tools.map((tool) => (
                              <span key={tool} className="px-3 py-1 text-xs font-medium bg-black/40 text-neutral-300 rounded-lg border border-white/5 transition-colors duration-300 group-hover:border-white/10">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium CTA Section */}
        <div
          id="cta"
          className={`mt-32 max-w-4xl mx-auto text-center transform transition-all duration-[1000ms] ease-out delay-500 ${isVisible["cta"] ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
        >
          <div className="bg-gradient-to-b from-white/[0.04] to-transparent border-t border-white/5 rounded-[3rem] p-12 sm:p-20 relative overflow-hidden">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Let's Build Something <span className="text-lime-400">Great</span>
              .
            </h3>

            <p className="text-neutral-400 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto mb-10">
              Whether you have a startup idea, need a technical partner, or want
              to revamp an existing product, I'm ready to help turn your vision
              into reality.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => scrollToSection("contact")}
                className="px-8 py-4 bg-white text-neutral-950 rounded-xl font-semibold transition-all duration-300 hover:bg-lime-400 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(163,230,53,0.2)] w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Get In Touch
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>

              <a
                href="/Padmanaban_CV.pdf"
                download
                className="px-8 py-4 bg-transparent border border-white/10 text-white rounded-xl font-medium transition-all duration-300 hover:bg-white/5 hover:border-white/20 w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;