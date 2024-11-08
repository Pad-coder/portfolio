import React from "react";
import Navbar from "../components/Navbar";
import AboutMe from "../components/AboutMe";
const Home = () => {
  return <>
    <div className="flex flex-col md:flex  md:items-end h-screen">
      <div>
        <Navbar />
      </div>
        
        <div className="flex justify-center md:justify-end">
       <AboutMe />
    </div>
    </div>
    
  </>
};

export default Home;
