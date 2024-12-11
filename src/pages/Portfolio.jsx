import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import image from "../assets/appImage.png";

const Portfolio = () => {
  return (
    <>
      <div className="h-full p-10 ">
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
                  <button className="btn btn-primary bg-lime-200 border-0 hover:bg-lime-300 duration-300 transform ">See</button>
                </a>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" justify-center flex flex-row ">

        <Link to="/" className="bg-lime-300 py-5 px-10 my-10 rounded ">

          <span className="text-sm text-neutral-900">Back to Home</span>
        </Link>

      </div>
    </>
  );
};

export default Portfolio;
