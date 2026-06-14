import React from "react";
import Github from './components/Github.jsx'
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Contact from "./pages/Contact.jsx";
import SocialMedia from "./pages/SocialMedia.jsx";

function App() {
  return (
    <div className="poppins-regular min-h-screen text-neutral-300">
      <Navbar/>
        <section id="home"><Home /></section>
        <section id="about"><About /></section>
        <section id="projects"><Projects /></section>
        <section id="socialmedia"><SocialMedia /></section>
        <section id="contact"><Contact /></section>
      <Github/>
      <Footer />
    </div>
  );
}

export default App;