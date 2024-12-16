import React from "react";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    try {
      const response = await axios.post(
        "https://portfolio-be-99ru.onrender.com/api/sendMesssage/",
        { name, email, message }
      );

      await toast.success("Congratlation, I will reach you soon");

      setTimeout(function () {
        location.reload();
      }, 2000);

      return response.data;
    } catch (error) {
      if (error.response.data.message == "Invalid email address") {
        console.error(error.response.data.message);
        toast.error(
          error.response.data.message || "Sorry, You entered wrong mail id."
        );
      } else {
        console.error(error);
        toast.error(error.message || "Fill all the field.");
      }
    }
  };

  return (
    <>
      <div className="px-6 py-24 sm:py-20 lg:px-8">
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl text-center text-lime-300 ">
          <h2 className="text-balance text-4xl font-semibold tracking-tight  sm:text-5xl">
            Contact Me
          </h2>
        </div>
        <form
          className="mx-auto mt-16 max-w-xl sm:mt-20"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm/6 font-semibold text-lime-300"
              >
                Name
              </label>
              <div className="mt-2.5">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter Your Name"
                  autoComplete="given-name"
                  className="block w-full rounded-md bg-lime-300 px-3.5 py-2 text-base text-neutral-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-inherit focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-900"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm/6 font-semibold text-lime-300"
              >
                Email
              </label>
              <div className="mt-2.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Your Email"
                  autoComplete="email"
                  className="block w-full rounded-md bg-lime-300 px-3.5 py-2 text-base text-neutral-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-inherit focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-900"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="block text-sm/6 font-semibold text-lime-300"
              >
                Message
              </label>
              <div className="mt-2.5">
                <textarea
                  id="message"
                  name="message"
                  placeholder="Type Your Message"
                  rows={4}
                  className="block w-full rounded-md bg-lime-300 px-3.5 py-2 text-base text-neutral-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-inherit focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-900"
                  onChange={(e) => setMessage(e.target.value)}
                  defaultValue={""}
                />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="block w-full rounded-md bg-lime-300 px-3.5 py-2.5 text-center text-sm font-semibold text-neutral-900 shadow-sm hover:bg-lime-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Send message
            </button>
            <span className="text-red-200 font-light text-xs">
              *If clicked the button, Please wait, It will take a few seconds
              for the message to go through.
            </span>
          </div>
        </form>
      </div>
    </>
  );
};

export default Contact;
