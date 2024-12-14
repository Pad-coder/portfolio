import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { scrollToUp } from "../utils/scrollUp";

const About = ({home,portfolio}) => {
  
  const scrollTo = scrollToUp()
  

  return <>
    <div className=" text-lime-300 pb-10 pl-10 hover:cursor-default">
      <div className=" flex flex-col gap-4 ml-5 mr-5 ">
        <div className="flex justify-start pt-10 ">
          <h1 className="text-3xl  text-center font-roboto font-light  ">
          Know About me!
          </h1>
        </div>
        <div className=" font-roboto font-thin ">
          <p>
          Greetings! I’m Padmanaban, a full-stack developer with a deep passion
            for creating impactful digital solutions. From designing intuitive
            frontends to building powerful backends, I love diving into all
            aspects of development to bring ideas to life. My journey began with
            an intense curiosity about technology, leading me to pursue software
            development with dedication and enthusiasm.
          </p>
        </div>
      </div>

      

      <div className=" flex flex-col gap-4 ml-5 mr-5 ">
        <div className="flex justify-start pt-10 ">
          <h1 className="text-3xl font-light text-center font-roboto   ">
            What I Do
          </h1>
        </div>

        <div className=" font-roboto font-thin">
          <p>
            Frontend Development: I focus on building responsive, user-friendly
            interfaces using React, JavaScript (ES6+), and Tailwind CSS,
            crafting experiences that users love. <br /><br /> Backend Development: With
            expertise in Node.js, Express, and MongoDB, I develop powerful,
            scalable backend solutions, designing APIs that are fast and
            efficient. <br /><br /> Full-Stack Projects: My projects range from single-page
            applications to complex systems, incorporating user authentication,
            real-time updates with Socket.IO, and secure databases.
          </p>
        </div>
      </div>



      <div className="flex flex-col gap-4 ml-5 mr-5 ">
        <div className="flex justify-start pt-10 ">
          <h1 className="text-3xl font-light text-center font-roboto   ">
            Fun Facts
          </h1>
        </div>

        <div className=" font-roboto font-thin ">
          <ul className="leading-9">
            <li className="list-none hover:list-disc ">
              <b>Favorite Movie:</b> Marvel movies and a classic Tom Cruise
              action flick!
            </li>
            <li className="list-none hover:list-disc ">
              <b>Tech Passion:</b> I’m constantly exploring new trends in
              software development, especially anything related to JavaScript
              and the MERN stack.
            </li>
            <li className="list-none hover:list-disc ">
              <b>Goal:</b> To become a top software developer and make a
              positive impact in the tech industry.
            </li>
          </ul>
        </div>
      </div>
      
    </div>
    <div className="flex  justify-between mx-5 mt-10 mb-5">
        <Link to='/' className="flex items-center gap-2" onClick={()=> scrollTo(home)}>
          <IoIosArrowBack className=" hover:bg-inherit text-neutral-900 bg-lime-300 hover:text-lime-300 rounded-full h-10 w-10" /><span className="text-lime-300">Back to Home</span>
        </Link>

        <Link to='/portfolio' className="flex flex-row-reverse items-center gap-2" onClick={()=> scrollTo(portfolio)}>
          <IoIosArrowBack className=" hover:bg-inherit text-neutral-900 bg-lime-300 hover:text-lime-300 rounded-full rotate-180 h-10 w-10" /><span className="text-lime-300">Portfolio</span>
        </Link>
      </div>
  </>
};

export default About;
