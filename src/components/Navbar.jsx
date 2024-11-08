import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <>
   <div className='flex md:h-16 flex-col gap-3 p-10  items-center md:justify-end md:flex-row md:px-10 md:py-14 lg:pr-20 lg:gap-16 '>
   <Link to='/about'><button className='btn btn-sm w-20 lg:w-24 lg:text-2xl duration-700 bg-transparent  font-roboto font-light hover:bg-blue-400 border-0 text-slate-50'>About</button></Link>
  <Link to='/portfolio'><button className='btn btn-sm w-20 lg:w-24 lg:text-2xl duration-700 bg-transparent  font-roboto font-light hover:bg-blue-400 border-0 text-slate-50'>Portfolio</button></Link>
  <Link to='/contact'><button className='btn btn-sm w-20 lg:w-24 lg:text-2xl duration-700 bg-transparent  font-roboto font-light hover:bg-blue-400 border-0 text-slate-50'>Contact</button></Link>
  <Link to='/socialmedia'><button className='btn btn-sm w-20 lg:w-24 lg:text-2xl duration-700 bg-transparent  font-roboto font-light hover:bg-blue-400 border-0 text-slate-50'>Social</button></Link>
   </div>
    </>
  )
}

export default Navbar
// flex w-2/3 justify-center