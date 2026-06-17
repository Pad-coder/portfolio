import React, { useState, useEffect, useRef, memo } from "react";
import toast from "react-hot-toast";

import {
  FaWhatsapp,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaPaperPlane,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FiMapPin, FiMail, FiClock, FiGlobe, FiCheck } from "react-icons/fi";

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
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Input = ({ label, id, type = "text", valid, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-full group relative">
      <label
        htmlFor={id}
        className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 uppercase tracking-widest ml-1 transition-colors duration-300 group-focus-within:text-lime-400"
      >
        {label}
      </label>
      <div className="relative">
        {/* Soft Animated Background Glow */}
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r from-lime-400/0 via-lime-400/20 to-lime-400/0 rounded-[18px] blur-md opacity-0 transition-opacity duration-500 pointer-events-none ${isFocused ? "opacity-100" : "group-hover:opacity-40"}`}
        />

        {type === "textarea" ? (
          <textarea
            id={id}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="relative w-full min-h-[100px] sm:min-h-[120px] lg:min-h-[140px] bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-white text-sm sm:text-base placeholder-neutral-600 focus:outline-none focus:border-lime-400/50 transition-all duration-300 resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
            {...props}
          />
        ) : (
          <input
            id={id}
            type={type}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="relative w-full h-12 sm:h-14 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-2xl px-4 sm:px-5 text-white text-sm sm:text-base placeholder-neutral-600 focus:outline-none focus:border-lime-400/50 transition-all duration-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
            {...props}
          />
        )}

        {/* Success Indicator */}
        <div
          className={`absolute right-4 top-1/2 -translate-y-1/2 text-lime-400 transition-all duration-500 pointer-events-none ${valid ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        >
          <FiCheck className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, text, highlight }) => (
  <div className="group flex items-center gap-3 sm:gap-4 p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] hover:-translate-y-1 overflow-hidden">
    <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-[10px] sm:rounded-[12px] bg-black/50 flex items-center justify-center text-neutral-400 group-hover:text-lime-400 group-hover:bg-lime-400/10 transition-all duration-500 border border-white/5 group-hover:border-lime-400/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
      {icon}
    </div>
    <span
      className={`text-xs sm:text-sm font-medium truncate transition-colors duration-300 ${
        highlight
          ? "text-white group-hover:text-lime-300"
          : "text-neutral-400 group-hover:text-white"
      }`}
    >
      {text}
    </span>
  </div>
);

// ==========================================
// 2. MAIN SECTION COMPONENT
// ==========================================

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, null, window.location.pathname);
    }
  }, []);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isNameValid = name.length >= 2;
  const isEmailValid = validateEmail(email);
  const isMessageValid = message.length >= 2;

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!isNameValid || !isEmailValid || !isMessageValid) {
      toast.error("Please fill all fields correctly.", {
        style: {
          background: "#171717",
          color: "#fff",
          border: "1px solid #262626",
        },
      });
      return;
    }

    setLoading(true);

    try {
      const emailjs = (await import("@emailjs/browser")).default;
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { name, email, message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      toast.success(`Thank you ${name}! I'll reply soon.`, {
        style: {
          background: "#171717",
          color: "#fff",
          border: "1px solid #a3e635",
        },
        icon: "🚀",
      });

      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Something went wrong. Please try again!", {
        style: {
          background: "#171717",
          color: "#fff",
          border: "1px solid #ef4444",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const phoneNumber = import.meta.env.VITE_phoneNumber;
  const waMessage =
    "Hello Padmanaban! I found your portfolio and would like to connect with you.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="relative w-full min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 text-neutral-300 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 lg:gap-16 items-center w-full">
          
          <div className="md:col-span-5 flex flex-col gap-6 sm:gap-10 w-full">
            <FadeIn delay={100}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-4 sm:mb-6 hover:bg-white/[0.05] transition-colors shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] w-max">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-300 tracking-[0.15em] uppercase">
                  Available for Freelance
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight mb-3 sm:mb-4">
                Let's build <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-200">
                  together.
                </span>
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base lg:text-lg font-light leading-relaxed max-w-full sm:max-w-md">
                Whether you have a specific project in mind or just want to
                explore possibilities, I'm ready to bring your vision to
                reality.
              </p>
            </FadeIn>

            <FadeIn
              delay={200}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 w-full"
            >
              <InfoCard
                icon={<FiMapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                text="Tamil Nadu, India"
              />
              <InfoCard
                icon={<FiGlobe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                text="Open Worldwide"
              />
              <InfoCard
                icon={<FiMail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                text="padmanaban870@gmail.com"
                highlight
              />
              <InfoCard
                icon={<FiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                text="Replies in 24h"
              />
            </FadeIn>
          </div>

          <div className="md:col-span-7 w-full">
            <FadeIn delay={400}>
              <div className="relative rounded-3xl sm:rounded-[2rem] bg-gradient-to-b from-white/[0.04] to-transparent p-[1px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] sm:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group/form w-full">
                <div className="absolute inset-0 bg-lime-400/10 blur-xl sm:blur-2xl rounded-3xl sm:rounded-[2rem] opacity-0 group-hover/form:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />

                <div className="relative bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-3xl sm:rounded-[2rem] p-5 sm:p-8 lg:p-10 border border-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] z-10 w-full">
                  <form onSubmit={sendMessage} className="flex flex-col gap-4 sm:gap-6 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
                      <Input
                        label="Name"
                        id="name"
                        placeholder="Tell me your name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        valid={isNameValid}
                        required
                      />
                      <Input
                        label="Email"
                        id="email"
                        type="email"
                        placeholder="Your email address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        valid={isEmailValid}
                        required
                      />
                    </div>

                    <div className="w-full">
                      <Input
                        label="Message"
                        id="message"
                        type="textarea"
                        placeholder="What would you like to discuss with me?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        valid={isMessageValid}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1 sm:pt-2 w-full">
                      <button
                        type="submit"
                        disabled={loading}
                        className="group/btn relative w-full bg-lime-400 text-neutral-950 font-semibold h-12 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(163,230,53,0.15)] sm:shadow-[0_0_20px_rgba(163,230,53,0.15)] hover:shadow-[0_0_25px_rgba(163,230,53,0.3)] sm:hover:shadow-[0_0_30px_rgba(163,230,53,0.3)] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out" />
                        <span className="text-sm sm:text-base">
                          {loading ? "Sending..." : "Send Message"}
                        </span>
                        {!loading && (
                          <FaPaperPlane className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                        )}
                      </button>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/wa w-full bg-white/[0.03] border border-white/10 text-white font-medium h-12 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 hover:bg-[#25D366]/10 hover:border-[#25D366]/30 hover:text-[#25D366] transition-all duration-300 active:scale-95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] hover:shadow-[0_0_15px_rgba(37,211,102,0.1)] sm:hover:shadow-[0_0_20px_rgba(37,211,102,0.1)]"
                      >
                        <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 group-hover/wa:text-[#25D366] transition-colors" />
                        <span className="text-sm sm:text-base">WhatsApp</span>
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Contact);