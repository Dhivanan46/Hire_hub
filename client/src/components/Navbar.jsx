import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useUser, UserButton, useClerk } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const {setShowRecruiterLogin} = useContext(AppContext);
  return (
    <div className="shadow py-4">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        <img onClick={()=>{navigate('/')}} className="cursor-pointer w-28 sm:w-32" src={assets.logo} />

        {user ? (
          <div className="flex items-center gap-3 max-sm:hidden">
            <Link to={"/profile"} className="hover:text-blue-600 transition">Profile</Link>
            <Link to={"/applications"} className="hover:text-blue-600 transition">Applied Jobs</Link>
            <p> | Hi, {user.firstName + " " + user.lastName}</p>
            <UserButton />
          </div>
        ) : (
          <div className="flex gap-4 max-sm:text-xs">
            <button className="text-gray-600" onClick={(e) => setShowRecruiterLogin(true)}>Recruiter LogIn</button>
            <button
              className="bg-blue-600 text-black-600 px-6 sm:px-9 py-2 rounded-full"
              onClick={(e) => openSignIn()}
            >
              LogIn
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
