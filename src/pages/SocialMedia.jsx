import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import wireframe from '../assets/wireframe.png'

const SocialMedia = ({home}) => {
  const scrollUp = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: 'smooth',
    });
  };
  return <>

    <div className="h-lvh ">
      <div className="flex flex-col gap-5 mb-5 px-4 sm:px-20 py-4 sm:py-10 text-lime-300">
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



        <div className="flex flex-row gap-5 px-4 sm:px-24 sm:items-center">
          <h1 className="text-2xl font-roboto font-light border-r-2 text-lime-300 border-lime-300 pr-3 sm:pr-0">
            Join the Community
          </h1>

          <p className="text-sm  font-roboto font-light text-slate-100">
            I’m always excited to connect with fellow developers, potential collaborators, and anyone interested in tech. Let’s build, learn, and grow together—follow me, say hi, and feel free to share your own projects or questions!
          </p>

        </div>

      </div>
      
    </div>

    <div className=" justify-center flex flex-row  ">

      <Link to="/" className="bg-lime-300 hover:bg-inherit text-neutral-900 hover:text-lime-300 py-3 px-5 mb-10 rounded " onClick={()=>scrollUp(home)}>

        <span className="text-sm ">Back to Home</span>
      </Link>
    </div>
  </>
};

export default SocialMedia;


