import React from "react";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import AboutMe from "./components/AboutMe.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Contact from "./pages/Contact.jsx";
import SocialMedia from "./pages/SocialMedia.jsx";
import Footer from "./components/Footer.jsx";
import { Toaster } from "react-hot-toast";

import { Link, animateScroll as scroll, scroller } from "react-scroll";

function App() {
  return (
    <>
      <div className="font-sans min-h-screen">
        <div className=" flex justify-center sm:justify-end  sm:shadow-xl bg-neutral-900 py-4 md:fixed md:top-0 w-full  z-10 shadow-lg relative">
          <div className="flex flex-col sm:flex-row  lg:pr-36 lg:mt-10 lg:gap-10 my-5  gap-2 ">
            <Link to="home" smooth={true} duration={500}>
              <button className="btn btn-sm w-24 lg:w-27 text-xl lg:text-2xl  duration-700 bg-transparent   font-light hover:bg-lime-300 border-0 text-lime-300 hover:text-neutral-900">
                Home
              </button>
            </Link>
            <Link to="about" smooth={true} duration={500}>
              <button className="btn btn-sm w-24 lg:w-27 text-xl lg:text-2xl  duration-700 bg-transparent   font-light hover:bg-lime-300 border-0 text-lime-300 hover:text-neutral-900">
                About
              </button>
            </Link>
            <Link to="portfolio" smooth={true} duration={500}>
              <button className="btn btn-sm w-24 lg:w-27 text-xl lg:text-2xl  duration-700 bg-transparent   font-light hover:bg-lime-300 border-0 text-lime-300 hover:text-neutral-900">
                Portfolio
              </button>
            </Link>

            <Link to="socialmedia" smooth={true} duration={500}>
              <button className="btn btn-sm w-24 lg:w-27 text-xl lg:text-2xl  duration-700 bg-transparent   font-light hover:bg-lime-300 border-0 text-lime-300 hover:text-neutral-900">
                Social
              </button>
            </Link>

            <Link to="contact" smooth={true} duration={500}>
              <button className="btn btn-sm w-24 lg:w-27 text-xl lg:text-2xl  duration-700 bg-transparent   font-light hover:bg-lime-300 border-0 text-lime-300 hover:text-neutral-900">
                Contact
              </button>
            </Link>
          </div>
        </div>
        <AboutMe />
        {/* Content */}
        <div className="mt-10">
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
        </div>

        <Footer />
      </div>
      <Toaster />
    </>
  );
}

export default App;
{
  //Backup:-
  /* <Routes>
        <Route path="/" element={<Home  />} />
        <Route path="/about" element={<About  />} />
        <Route path="/portfolio" element={<Portfolio  />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/socialmedia" element={<SocialMedia />} />
      </Routes> */
}
