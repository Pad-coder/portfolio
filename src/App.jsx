import React, { useEffect } from "react";
import Lenis from 'lenis';

import DigitalUniverse from "./components/DigitalUniverse.jsx";
import Github from './components/Github.jsx'
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Contact from "./pages/Contact.jsx";
import SocialMedia from "./pages/SocialMedia.jsx";

function App() {
  
  // --- PREMIUM SMOOTH SCROLLING (LENIS) ---
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      // Premium Exponential Out Easing (Apple-style)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false, // Keep native touch scrolling on mobile for better UX
      touchMultiplier: 2,
    });

    // Tie Lenis into the browser's native repaint loop for 60fps
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="poppins-regular min-h-screen text-neutral-300 relative">
      
      {/* 1. The Master Background Engine (Pushed to z-[-2]) */}
      <div className="fixed inset-0 z-[-2] pointer-events-none w-full h-full">
        <DigitalUniverse />
      </div>

      {/* 2. Contrast Protection Layer (Sits between Universe and Content) */}
      <div className="fixed inset-0 bg-[#050505]/60 pointer-events-none z-[-1]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_100%)] opacity-80 pointer-events-none z-[-1]" />

      {/* Global CSS Override for Readability & Hardware Acceleration */}
      <style>{`
        /* Make sections transparent so the universe shows through */
        section, .bg-\\[\\#0a0a0a\\], .bg-neutral-900, .bg-\\[\\#050505\\] {
          background-color: transparent !important;
        }
        /* Ensure cards and glass panels retain a dark, blurred backing for text readability */
        .glass-panel, .bg-black\\/40, .bg-white\\/\\[0\\.02\\], .bg-white\\/\\[0\\.03\\], .bg-white\\/\\[0\\.04\\] {
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
        }
        /* Optimize scrolling performance */
        html.lenis {
          height: auto;
        }
        .lenis.lenis-smooth {
          scroll-behavior: auto !important;
        }
        .lenis.lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }
        .lenis.lenis-stopped {
          overflow: hidden;
        }
        .lenis.lenis-scrolling iframe {
          pointer-events: none;
        }
      `}</style>

      <Navbar/>
      
      <main className="relative z-10">
        <section id="home"><Home /></section>
        <section id="about"><About /></section>
        <section id="projects"><Projects /></section>
        <section id="socialmedia"><SocialMedia /></section>
        <section id="contact"><Contact /></section>
      </main>

      <Github/>
      <Footer />
    </div>
  );
}

export default App;