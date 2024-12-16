import React from "react";
import { motion } from "framer-motion";

const AboutMe = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center mt-10 md:mt-0 mx-10 text-lime-300 md:fixed md:top-10 md:z-10 gap-2 ">
        <motion.h1
          className=" md:text-xl text-sm font-extralight font-roboto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 4 }}
        >
          PADMANABAN M
        </motion.h1>
        <motion.h2
          className="text-sm md:text-xl font-extralight font-roboto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 5 }}
        >
          DEVELOPER
        </motion.h2>
      </div>
    </>
  );
};

export default AboutMe;
