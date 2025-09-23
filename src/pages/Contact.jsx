import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Custom hook for mouse position
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return mousePosition;
};

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [characters, setCharacters] = useState(0);
  const [cursorVariant, setCursorVariant] = useState("default");
  
  const mousePosition = useMousePosition();

  // Clear any navigation state on component mount
  useEffect(() => {
    // Reset any scroll position or navigation state
    window.scrollTo(0, 0);
    
    // Clear any stored navigation state
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, null, window.location.pathname);
    }
  }, []);

  // Live validation function
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);


  const sendMessage = async () => {
    // Clear previous errors
    setErrorMessage("");
    
    if (!name || !email || !message) {
      setErrorMessage("Fill all the fields");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Invalid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_EMAIL_API, {
        name,
        email,
        message,
      });
      toast.success(`Thank you for messaging me ${name}, I will reach you soon`);
      
      // Reset form
      setName("");
      setEmail("");
      setMessage("");
      setCharacters(0);
      
    } catch (error) {
      if (error.response?.data?.message === "Invalid email address") {
        setErrorMessage("Invalid email address");
        toast.error("Invalid email address");
      } else {
        setErrorMessage("Something went wrong. Please try again!");
        toast.error(error.message || "Something went wrong. Please try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Cursor variants for different hover states
  const cursorVariants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
      backgroundColor: "rgba(163, 230, 53, 0.8)",
    },
    text: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      scale: 1.5,
      backgroundColor: "rgba(163, 230, 53, 0.6)",
      mixBlendMode: "difference",
    },
    button: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      scale: 2,
      backgroundColor: "rgba(163, 230, 53, 0.9)",
      border: "2px solid #a3e635",
    },
    input: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      scale: 0.5,
      backgroundColor: "rgba(163, 230, 53, 1)",
    }
  };

  return (
    <>
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-difference"
        variants={cursorVariants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
        style={{ display: mousePosition.x === 0 && mousePosition.y === 0 ? 'none' : 'block' }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="min-h-screen bg-black px-6 py-24  sm:py-24 lg:px-8"
        style={{ cursor: 'none' }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2 
            className="text-4xl font-light text-white mb-2 sm:text-5xl"
            onMouseEnter={() => setCursorVariant("text")}
            onMouseLeave={() => setCursorVariant("default")}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Get In
          </motion.h2>
          <motion.h2 
            className="text-4xl font-bold text-lime-400 mb-8 sm:text-5xl"
            onMouseEnter={() => setCursorVariant("text")}
            onMouseLeave={() => setCursorVariant("default")}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Touch
          </motion.h2>
          <motion.div 
            className="w-16 h-px bg-lime-400 mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </div>
        
        <motion.form
          className="mx-auto mt-16 max-w-xl sm:mt-20 "
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <div className="space-y-6 cursor-none">
            <div className="cursor-none">
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-white/70 mb-2 cursor-none"
                onMouseEnter={() => setCursorVariant("text")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                Name
              </label>
              <motion.input
                id="name"
                name="name"
                type="text"
                autoFocus
                required
                placeholder="Your name"
                autoComplete="given-name"
                value={name}
                className="block w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-lime-400/50 focus:bg-white/10 focus:outline-none transition-all duration-300 cursor-none backdrop-blur-sm"
                onChange={(e) => setName(e.target.value)}
                onMouseEnter={() => setCursorVariant("input")}
                onMouseLeave={() => setCursorVariant("default")}
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-white/70 mb-2 cursor-none"
                onMouseEnter={() => setCursorVariant("text")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                Email
              </label>
              <motion.input
                id="email"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                autoComplete="email"
                value={email}
                className={`block w-full rounded-lg bg-white/5 border px-4 py-3 text-white placeholder-white/40 focus:border-lime-400/50 focus:bg-white/10 focus:outline-none transition-all duration-300 cursor-none backdrop-blur-sm ${
                  email && !validateEmail(email) ? 'border-red-500/50' : 'border-white/10'
                }`}
                onChange={(e) => setEmail(e.target.value)}
                onMouseEnter={() => setCursorVariant("input")}
                onMouseLeave={() => setCursorVariant("default")}
                whileFocus={{ scale: 1.02 }}
              />
              {email && !validateEmail(email) && (
                <motion.span 
                  className="text-red-400 text-sm mt-1 block"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Please enter a valid email address
                </motion.span>
              )}
            </div>
            
            <div>
              <label 
                htmlFor="message" 
                className="block text-sm font-medium text-white/70 mb-2 cursor-none"
                onMouseEnter={() => setCursorVariant("text")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                Message
              </label>
              <motion.textarea
                id="message"
                name="message"
                required
                placeholder="Your message..."
                rows={4}
                value={message}
                maxLength={500}
                className="block w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-lime-400/50 focus:bg-white/10 focus:outline-none transition-all duration-300 cursor-none backdrop-blur-sm resize-none"
                onChange={(e) => {
                  setMessage(e.target.value);
                  setCharacters(e.target.value.length);
                }}
                onMouseEnter={() => setCursorVariant("input")}
                onMouseLeave={() => setCursorVariant("default")}
                whileFocus={{ scale: 1.01 }}
              />
              <div className="flex justify-between items-center mt-2">
                <span 
                  className="text-white/40 text-sm"
                  onMouseEnter={() => setCursorVariant("text")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  {characters}/500
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-lime-400/10 hover:bg-lime-400 text-lime-400 hover:text-black font-medium py-3 rounded-lg border border-lime-400/30 hover:border-lime-400 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onMouseEnter={() => setCursorVariant("button")}
              onMouseLeave={() => setCursorVariant("default")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </motion.button>
            
            {errorMessage && (
              <motion.div 
                className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="text-red-400 text-sm">{errorMessage}</span>
              </motion.div>
            )}
          </div>
        </motion.form>
      </motion.div>
    </>
  );
};

export default Contact;
