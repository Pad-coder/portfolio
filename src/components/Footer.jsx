import React from 'react'

function Footer() {
  return (
    <div className="flex py-8 px-2 font-medium h-10 w-full justify-center items-center bg-lime-300 ">

      <p className=" text-xsm md:text-base text-green-950 text-center">Copyright © {new Date().getFullYear()} - All right reserved by Padmanaban</p>

    </div>
  )
}

export default Footer