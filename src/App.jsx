import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home.jsx"
import About from "./pages/About.jsx"
import Portfolio from "./pages/Portfolio.jsx"
import Contact from "./pages/Contact.jsx"
import SocialMedia from "./pages/SocialMedia.jsx"
function App() {

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-400 to-blue-900 ... ">


        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/socialmedia" element={<SocialMedia />} />
        </Routes>
       
      </div>
      <footer className="footer footer-center bg-base-300 text-base-content p-4">
          <aside>
            <p>Copyright © {new Date().getFullYear()} - All right reserved by ACME Industries Ltd</p>
          </aside>
        </footer>
    </>
  )
}

export default App
