import React from "react";
import AboutMe from "../components/AboutMe";
import Navbar from "../components/Navbar";

const Home = ({about,portfolio,contact,socialmedia}) => {
  return <>
    <div className="grid grid-cols-1 h-lvh">
      <AboutMe />
      
        <Navbar about={about} portfolio={portfolio} contact={contact} socialmedia={socialmedia} />
     
      <div className="grid grid-flow-row text-inherit bg-lime-300 px-5 py-5 my-24 sm:my-36 md:py-12 ">
        <h3 className="text-md md:text-2xl font-roboto text-start mr-24">Turning my love for tech into dynamic web solutions</h3>
        <h4 className="text-md md:text-2xl font-roboto text-end ml-24">I'm <marK className="bg-neutral-900 text-lime-300 p-1 rounded-sm">Padmanaban</marK> , your full-stack innovator with a spark for creativity</h4>
      </div>
    </div>
    
  </>
};

export default Home;
