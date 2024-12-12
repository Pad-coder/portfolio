import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home.jsx"
import About from "./pages/About.jsx"
import Portfolio from "./pages/Portfolio.jsx"
import Contact from "./pages/Contact.jsx"
import SocialMedia from "./pages/SocialMedia.jsx"
import Footer from './components/Footer.jsx'
import { Toaster } from "react-hot-toast"
function App() {
  let data = true

  return (
    <>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/socialmedia" element={<SocialMedia />} />
      </Routes>
      
      <Footer />
      <Toaster />
    </>
  )
}

export default App
