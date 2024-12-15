import React from 'react'
import { motion } from "framer-motion";

const AboutMe = () => {

  return <>

    <div className='flex flex-col justify-center mx-5 text-lime-300 h-32'>
      <motion.h1 className=" md:text-xl text-sm font-extralight font-roboto "
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 4 }} 
      >PADMANABAN M</motion.h1>
      <motion.h2 className="text-sm md:text-xl font-extralight font-roboto"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 6}} 
      >
        DEVELOPER
      </motion.h2>
    </div>

  </>
}

export default AboutMe