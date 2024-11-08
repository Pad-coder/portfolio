import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
const SocialMedia = () => {
  return <>
  
  <div className=" absolute top-5 left-10">
        <Link to="/">
          <IoIosArrowBack className="relative hover:bg-slate-50 hover:text-blue-500 w-10 h-10 rounded-full" />
          Back to Home
        </Link>
      </div>
    <div className="flex p-20 justify-center min-h-screen ">
      <div className=" flex flex-col  h-full text-slate-50 rounded-lg ">
        <div className="flex flex-col gap-5 p-5 h-2">
          <h1 className="text-xl sm:text-xs md:text-3xl lg:text-3xl font-roboto font-light">
            Follow My Journey
          </h1>
          <div className="h-10 border-b-4">

          </div>
          <p className="text-sm  md:text-xl  lg:text-2xl font-roboto font-light">
            Stay updated on my latest projects, tech insights, and personal journey as a developer! I share everything from coding tips to behind-the-scenes glimpses of my daily life. Connect with me on social media to keep up with my journey and to join in on the conversation!
          </p>
          <div className="w-full h-full  sm:text-xl text-2xl font-roboto font-semibold ">
            <h1>Social: </h1>
            <table className="flex flex-col p-3 gap-5">
              <tr>
                1. <a href="https://github.com/Pad-coder">Github <FaGithub className="size-6 inline-block" /></a>
              </tr>
              <tr>
                2. <a href="https://www.linkedin.com/in/padmanaban2002/">Linkedin <FaLinkedin className="size-6 inline-block" /></a>
              </tr>
              <tr>
                3. <a href="https://www.instagram.com/pad_coder/">Instagram <FaInstagram className="size-6 inline-block" /></a>
              </tr>
              <tr>
                4. <a href="https://x.com/pad_coder" className="font-light">X <FaSquareXTwitter className="size-6 inline-block" /></a>
              </tr>
            </table>
            <br /><br />
            <div>
              <h1 className="text-xl sm:text-xs md:text-3xl lg:text-3xl font-roboto font-light">
                Join the Community
              </h1>
              <p className="text-sm  md:text-xl  lg:text-2xl font-roboto font-light">
                I’m always excited to connect with fellow developers, potential collaborators, and anyone interested in tech. Let’s build, learn, and grow together—follow me, say hi, and feel free to share your own projects or questions!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </>
};

export default SocialMedia;
