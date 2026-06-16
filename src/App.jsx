import React, { useEffect } from "react";
import Lenis from 'lenis';
import { Analytics } from "@vercel/analytics/react"; 

import GlobalBackground from "./components/GlobalBackground.jsx";
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
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="poppins-regular min-h-screen w-full overflow-x-hidden text-neutral-300 relative selection:bg-lime-500/20 selection:text-lime-200">
      
      <Analytics />

      {/* SINGLE UNIFIED BACKGROUND ENGINE */}
      <GlobalBackground />

      {/* Global CSS Override for Readability & Hardware Acceleration */}
      <style>{`
        /* FIXED: Enforce strict viewport width to fix mobile shifting */
        html, body {
          max-width: 100vw;
          overflow-x: hidden;
        }
        section {
          background-color: transparent !important;
        }
        .glass-panel, .bg-black\\/40, .bg-white\\/\\[0\\.02\\], .bg-white\\/\\[0\\.03\\], .bg-white\\/\\[0\\.04\\] {
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
        }
        html.lenis { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }
        .lenis.lenis-scrolling iframe { pointer-events: none; }
      `}</style>

      <Navbar/>
      
      <main className="relative z-10 flex flex-col w-full overflow-x-hidden">
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