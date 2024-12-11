import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <>
      <div className='flex flex-col sm:flex-row  lg:pr-36 lg:mt-10 lg:gap-10 my-5  gap-2 '>
        <Link to='/about'><button className='btn btn-sm w-24 lg:w-27 text-xl lg:text-2xl  duration-700 bg-transparent   font-light hover:bg-blue-400 border-0 text-lime-300'>About</button></Link>
        <Link to='/portfolio'><button className='btn btn-sm w-24 lg:w-27 text-xl lg:text-2xl  duration-700 bg-transparent   font-light hover:bg-blue-400 border-0 text-lime-300'>Portfolio</button></Link>
        <Link to='/contact'><button className='btn btn-sm w-24 lg:w-27 text-xl lg:text-2xl  duration-700 bg-transparent   font-light hover:bg-blue-400 border-0 text-lime-300'>Contact</button></Link>
        <Link to='/socialmedia'><button className='btn btn-sm w-24 lg:w-27 text-xl lg:text-2xl  duration-700 bg-transparent   font-light hover:bg-blue-400 border-0 text-lime-300'>Social</button></Link>
      </div>
    </>
  )
}

export default Navbar
// flex w-2/3 justify-center