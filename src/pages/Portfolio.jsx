import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import image from "../assets/appImage.png";

const Portfolio = () => {
  return (
    <>
      <div className="h-screen p-10 ">
        <div className="container mx-auto relative top-10  ">
          <div className="card lg:card-side bg-transparent flex shadow-xl hover:shadow-slate-800 duration-300  hover:scale-95 ">
            <figure>
              <img src={image} alt="Album" />
            </figure>
            <div className="card-body font-roboto font-thin text-slate-50">
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
                <button className="btn btn-primary duration-300 transform hover:--translate-x-0 hover:-translate-y-1">
                  See
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-10">
        <Link to="/">
          <IoIosArrowBack className="relative hover:bg-slate-50 hover:text-blue-500 w-10 h-10 rounded-full" />
          Back to Home
        </Link>
      </div>
    </>
  );
};

export default Portfolio;
