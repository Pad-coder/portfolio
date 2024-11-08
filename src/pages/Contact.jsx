import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";



const Contact = () => {
  return <>
    <div className="h-screen ">
     <div className="h-screen flex flex-row items-center justify-center ">
     <div className="bg-white w-28 h-48 rounded-lg shadow-md shadow-current font-roboto font-light">
      <div>
      <h1 className="text-2xl font-bold mb-4">Get in Touch :)</h1>
      </div>

      <div>
      <p className="text-lg mb-4 ">
      Contact me at{""}
      <a href="mailto:padmanaban870@gmail.com" className="hover:text-blue-500 hover:title " title="Click to Mail Me"> Padmanaban870@gmail.com</a>
    </p>
    <p className="text-lg mb-4">
      You can also reach me at <a href="tel:+916383225445" className="hover:text-blue-500 hover:title " title="Click to Call Me">+91 6383225445</a>
    </p>
    <p className="text-lg mb-4">
      Or find me on social media at{" "}
      <a
        href="https://www.linkedin.com/in/padmanaban2002/"
        className="hover:text-blue-500 hover:title " title="Click to Connect Me"
      >
        https://www.linkedin.com/in/padmanaban2002/
      </a>
    </p>
    <p className="text-lg mb-4">
      You can also find me on other social media platforms at{" "}
      <a
        href="https://www.instagram.com/pad_coder/"
         className="hover:text-blue-500 hover:title " title="Click to Follow Me"
      >
        https://www.instagram.com/pad_coder/
      </a>
    </p>
      </div>

      </div>
      </div> 
   
        
      </div>
      
  </>;
};

export default Contact;

{/* <div className="absolute  bottom-10 left-10">
        <Link to="/">
          <IoIosArrowBack className="relative hover:bg-slate-50 hover:text-blue-500 w-10 h-10 rounded-full" />
          Back to Home
        </Link>
      </div> */}


      
      // <h1 className="text-3xl font-bold mb-4">Get in Touch :)</h1>
      
      
    