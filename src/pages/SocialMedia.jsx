import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import wireframe from '../assets/wireframe.png'

const SocialMedia = () => {
  return <>

    <div className="h-lvh ">
      <div className="flex flex-col gap-5 mb-5 px-4 py-4 text-lime-300">
        <h1 className="text-xl  sm:text-2xl font-roboto font-light ">
          Follow My Journey
        </h1>

        <p className="text-sm  sm:text-lg  lg:text-2xl font-roboto font-light text-slate-100 ">
          Stay updated on my latest projects. <br /> <br /> Connect with me on social media to keep up with my journey and to join in on the conversation!
        </p>
      </div>

      <div className="flex flex-col gap-10 mb-10 ">

        <div className="flex flex-row gap-8 justify-center my-10">
          <a href="https://github.com/Pad-coder" target="blank"> <FaGithub className="size-10 inline-block text-lime-300" /></a>

          <a href="https://www.linkedin.com/in/padmanaban2002/" target="blank"> <FaLinkedin className="size-10 inline-block text-lime-300" /></a>

          <a href="https://www.instagram.com/pad_coder/" target="blank"> <FaInstagram className="size-10 inline-block text-lime-300" /></a>

          <a href="https://x.com/pad_coder" className="font-light" target="blank"> <FaSquareXTwitter className="size-10 inline-block text-lime-300" /></a>
        </div>



        <div className="flex flex-row gap-5 px-4">
          <h1 className="text-2xl font-roboto font-light border-r-2 text-lime-300 border-lime-300 pr-3">
            Join the Community
          </h1>

          <p className="text-sm  font-roboto font-light text-slate-100">
            I’m always excited to connect with fellow developers, potential collaborators, and anyone interested in tech. Let’s build, learn, and grow together—follow me, say hi, and feel free to share your own projects or questions!
          </p>

        </div>

      </div>
      {/* <div className="  ">
        <img src={wireframe} alt=""  className="w-screen "/>
      </div>*/}
    </div>

    <div className=" justify-center flex flex-row ">

      <Link to="/" className="bg-lime-300 py-5 px-10 mb-10 rounded ">

        <span className="text-sm text-neutral-900">Back to Home</span>
      </Link>
    </div>
  </>
};

export default SocialMedia;


