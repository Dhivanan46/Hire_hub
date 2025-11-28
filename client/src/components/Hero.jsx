import React, { useContext, useRef } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Hero = () => {

    const {setSearchFilter,setIsSearched} = useContext(AppContext);

    const titleRef = useRef();
    const locationRef = useRef();

    function handleClick(){
        setSearchFilter({
            title:titleRef.current.value,
            location:locationRef.current.value
        })
        setIsSearched(true)
        // console.log({
        //     title:titleRef.current.value,
        //     location:locationRef.current.value
        // })
    }

  return (
    <div>
      <div className="bg-blue-300 m-12 rounded-2xl shadow-md">
        <div className="py-16 px-6 md:px-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Over 10,000+ jobs to apply
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Your Next Big Career Move Starts Right Here — Explore the Best Job
              Opportunities and Take the First Step Toward Your Future!
            </p>
            <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
              <div className="flex items-center border rounded-full px-4 py-2 w-full md:w-80 bg-white">
                <img
                  src={assets.search_icon}
                  alt="Search"
                  className="w-5 h-5 mr-2"
                />
                <input
                  type="text"
                  placeholder="Search Job Title"
                  className="bg-transparent outline-none flex-grow text-sm"
                  ref={titleRef}
                />
              </div>
              <div className="flex items-center border rounded-full px-4 py-2 w-full md:w-80 bg-white">
                <img
                  src={assets.location_icon}
                  alt="Location"
                  className="w-5 h-5 mr-2"
                />
                <input
                  type="text"
                  placeholder="Search for Location"
                  className="bg-transparent outline-none flex-grow text-sm"
                  ref={locationRef}
                />
              </div>
              <button onClick={handleClick} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 text-sm font-medium">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white m-12 py-4 px-6 rounded-xl shadow-sm flex items-left justify-left gap-6 border border-gray-300">
        <p className="text-sm font-medium text-gray-600">Trusted by</p>
        <img
          src={assets.microsoft_logo}
          alt="Microsoft"
          className="h-6 object-contain"
        />
        <img
          src={assets.accenture_logo}
          alt="Accenture"
          className="h-6 object-contain"
        />
        <img
          src={assets.walmart_logo}
          alt="Walmart"
          className="h-6 object-contain"
        />
        <img
          src={assets.amazon_logo}
          alt="Amazon"
          className="h-6 object-contain"
        />
        <img
          src={assets.samsung_logo}
          alt="Samsung"
          className="h-6 object-contain"
        />
      </div>
    </div>
  );
};

export default Hero;
