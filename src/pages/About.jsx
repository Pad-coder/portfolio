import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
const About = () => {
  return (
    <div className=" text-lime-300 pb-10 pl-10 hover:cursor-default">
      <div className=" flex flex-col gap-4 ml-5 mr-5 ">
        <div className="flex justify-start pt-10 ">
          <h1 className="text-3xl  text-center font-roboto font-light  ">
            About
          </h1>
        </div>
        <div className=" font-roboto font-thin ">
          <p>
            Hello! I’m Padmanaban, a full-stack developer with a deep passion
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
          <h1 className="text-3xl text-center font-roboto font-light   ">
            My Journey
          </h1>
        </div>

        <div className=" font-roboto font-thin ">
          <p>
            Starting with the basics of HTML and CSS, I gradually expanded my
            skill set to JavaScript, React, Node.js, and MongoDB. Over time,
            I’ve tackled diverse projects, from building chat applications with
            real-time messaging to creating robust e-commerce platforms. This
            hands-on experience has helped me master the essential tools and
            techniques that make a great developer.
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
      <div className="ml-5 mt-10">
        <Link to='/' >
          <IoIosArrowBack className=" hover:bg-slate-100 hover:text-blue-500 rounded-full h-10 w-10" /><span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default About;