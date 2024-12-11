import React from "react";
import AboutMe from "../components/AboutMe";
import Navbar from "../components/Navbar";

const Home = () => {
  return <>
    <div className=" flex flex-col h-lvh">
      <AboutMe />
      <div className=" flex justify-center sm:justify-end  sm:shadow-xl ">
        <Navbar />
      </div>
      
    </div>
    
  </>
};

export default Home;
