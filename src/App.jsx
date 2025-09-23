import React from "react";

import Github from './components/Github.jsx'
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Contact from "./pages/Contact.jsx";
import SocialMedia from "./pages/SocialMedia.jsx";

import { Toaster } from "react-hot-toast";



function App() {
  return (
    <>
      <div className="poppins-regular min-h-screen">
        <Navbar/>
       
        {/* Content */}
       
          <section id="home">
            <Home />
          </section>

          <section id="about">
            <About />
          </section>

          <section id="portfolio">
            <Portfolio />
          </section>

          <section id="socialmedia">
            <SocialMedia />
          </section>

          <section id="contact">
            <Contact />
          </section>
        <Github/>

        <Footer />
      </div>
      <Toaster />
    </>
  );
}

export default App;
