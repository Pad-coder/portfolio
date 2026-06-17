import React, { useEffect, Suspense, lazy } from "react";
import Lenis from 'lenis';
import { Analytics } from "@vercel/analytics/react"; 

// 1. Critical elements loaded instantly
import GlobalBackground from "./components/GlobalBackground.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";

// 2. Below-the-fold elements lazy loaded to slash initial JS payload
const About = lazy(() => import("./pages/About.jsx"));
const Projects = lazy(() => import("./pages/Projects.jsx"));
const SocialMedia = lazy(() => import("./pages/SocialMedia.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Github = lazy(() => import("./components/Github.jsx"));
const Footer = lazy(() => import("./components/Footer.jsx"));

export default function App() {
  
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

    return () => lenis.destroy();
  }, []);

  return (
    <div className="poppins-regular min-h-screen w-full overflow-x-clip text-neutral-300 relative selection:bg-lime-500/20 selection:text-lime-200">
      <Analytics />
      <GlobalBackground />

      <style>{`
        html, body { max-width: 100vw; overflow-x: hidden; }
        section { background-color: transparent !important; }
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
      
      <main className="relative z-10 flex flex-col w-full overflow-x-clip">
        {/* LCP Critical Section */}
        <section id="home"><Home /></section>
        
        {/* Lazy Loaded Sections */}
        <Suspense fallback={<div className="h-screen w-full" />}>
          <section id="about"><About /></section>
          <section id="projects"><Projects /></section>
          <section id="socialmedia"><SocialMedia /></section>
          <section id="contact"><Contact /></section>
          <Github/>
          <Footer />
        </Suspense>
      </main>
    </div>
  );
}