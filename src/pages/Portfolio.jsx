import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import image from "../assets/appImage.png";

const Portfolio = ({home,contact}) => {

  const scrollUp = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <div className="h-lvh p-10 ">
        <div className="container mx-auto relative top-10  ">
          <div className="card lg:card-side bg-transparent flex shadow-xl hover:shadow-lime-800 duration-300 ">
            <figure>
              <img src={image} alt="Album" />
            </figure>
            <div className="card-body font-roboto font-thin text-lime-300">
              <h2 className="card-title">
                Chatspace (Social Media Web Application)
              </h2>
              <p>
                This is a beginner-level full-stack chat application with
                real-time messaging, user authentication, profile management,
                and post interactions.
              </p>
              <p>
                <b>Tech Stacks:React .js, Tailwind CSS, Node.js, Express, MongoDB, Mongoose</b>
              </p>
              <div className="card-actions justify-end">


                <a href="https://chatspace-krbm.onrender.com/" target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-primary bg-lime-200 border-0 hover:bg-blue-300 duration-300 transform text-gray-700 ">See</button>
                </a>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex  justify-between mx-5 mt-10 mb-5">
        <Link to='/' className="flex items-center gap-2" onClick={()=> scrollUp(home)}>
          <IoIosArrowBack className=" hover:bg-inherit text-neutral-900 bg-lime-300 hover:text-lime-300 rounded-full h-10 w-10" /><span className="text-lime-300">Back to Home</span>
        </Link>

        <Link to='/contact' className="flex flex-row-reverse items-center gap-2" onClick={()=> scrollUp(contact)}>
          <IoIosArrowBack className=" hover:bg-inherit text-neutral-900 bg-lime-300 hover:text-lime-300 rounded-full rotate-180 h-10 w-10" /><span className="text-lime-300">Contact me</span>
        </Link>
      </div>
    </>
  );
};

export default Portfolio;
