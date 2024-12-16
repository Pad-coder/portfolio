import React from "react";

const Home = () => {
  return (
    <>
      <div className="md:mt-24  bg-lime-300">
        <div className=" flex flex-col justify-evenly  items-center md:items-stretch mx-5 h-60 text-neutral-900 ">
          <h3 className="text-md  md:text-2xl mr-20 font-roboto text-start ">
            Turning my love for tech into dynamic web solutions
          </h3>
          <h4 className="text-md md:text-2xl ml-20  font-roboto text-end ">
            I'm{" "}
            <marK className="bg-neutral-900 text-lime-300 p-1 rounded-sm">
              Padmanaban
            </marK>{" "}
            , your full-stack innovator with a spark for creativity
          </h4>
        </div>
      </div>
    </>
  );
};

export default Home;
