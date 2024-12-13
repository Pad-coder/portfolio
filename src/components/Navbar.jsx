import React from 'react'
import { Link } from 'react-router-dom'


const Navbar = ({about,portfolio,contact,socialmedia}) => {

  const scrollUp = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: 'smooth',
    });
  };
  return (
    <>
    <div className=" flex justify-center sm:justify-end  sm:shadow-xl ">
      <div className='flex flex-col sm:flex-row  lg:pr-36 lg:mt-10 lg:gap-10 my-5  gap-2 '>
        <Link to='/about' onClick={()=> scrollUp(about)}><button className='btn btn-sm w-24 lg:w-27 text-xl lg:text-2xl  duration-700 bg-transparent   font-light hover:bg-blue-400 border-0 text-lime-300'>About</button></Link>
        <Link to='/portfolio' onClick={()=> scrollUp(portfolio)}><button className='btn btn-sm w-24 lg:w-27 text-xl lg:text-2xl  duration-700 bg-transparent   font-light hover:bg-blue-400 border-0 text-lime-300'>Portfolio</button></Link>
        <Link to='/contact' onClick={()=> scrollUp(contact)}><button className='btn btn-sm w-24 lg:w-27 text-xl lg:text-2xl  duration-700 bg-transparent   font-light hover:bg-blue-400 border-0 text-lime-300'>Contact</button></Link>
        <Link to='/socialmedia' onClick={()=> scrollUp(socialmedia)}><button className='btn btn-sm w-24 lg:w-27 text-xl lg:text-2xl  duration-700 bg-transparent   font-light hover:bg-blue-400 border-0 text-lime-300'>Social</button></Link>
      </div>
      </div>
    </>
  )
}

export default Navbar
