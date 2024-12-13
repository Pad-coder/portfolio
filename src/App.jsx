import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home.jsx"
import About from "./pages/About.jsx"
import Portfolio from "./pages/Portfolio.jsx"
import Contact from "./pages/Contact.jsx"
import SocialMedia from "./pages/SocialMedia.jsx"
import Footer from './components/Footer.jsx'
import { Toaster } from "react-hot-toast"
import {useRef} from 'react'

function App() {
  const home = useRef(null);
  const about = useRef(null);
  const portfolio = useRef(null);
  const contact = useRef(null);
  const socialmedia = useRef(null);


  return (
    <>

      <Routes>
        <Route path="/" element={<Home ref={home} home={home} about={about} portfolio={portfolio} contact={contact} socialmedia={socialmedia} />} />
        <Route path="/about" element={<About ref={about} home={home} portfolio={portfolio} />} />
        <Route path="/portfolio" element={<Portfolio ref={portfolio} home={home} contact={contact} />} />
        <Route path="/contact" element={<Contact ref={contact} home={home} socialmedia={socialmedia} />} />
        <Route path="/socialmedia" element={<SocialMedia ref={socialmedia} home={home} />} />
      </Routes>
      
      <Footer />
      <Toaster />
    </>
  )
}

export default App
