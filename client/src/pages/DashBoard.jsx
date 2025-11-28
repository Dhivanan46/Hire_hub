import React from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
const DashBoard = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Navbar */}
      <div className="w-full bg-white shadow-md px-8 py-5">
        <div className="flex justify-between items-center">
          <div>
            <img
              onClick={(e) => navigate("/")}
              src={assets.logo}
              alt=""
              className="w-36 h-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-6">
            <p className="text-gray-700 font-medium">Hi, Mervin</p>
            <div className="relative group inline-block">
              <img
                className="cursor-pointer w-8 h-8"
                src={assets.company_icon}
                alt="Company Icon"
              />
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col bg-white border border-gray-300 shadow-lg rounded-md z-10">
                <ul className="list-none m-0 p-2 text-sm text-gray-700">
                  <li className="py-1 px-4 cursor-pointer hover:bg-gray-100">
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-56 min-h-screen bg-white p-4 shadow-lg border-r border-gray-200 flex flex-col gap-2">
          <NavLink
            to={"/dashBoard/add-job"}
            className={({ isActive }) =>
              `flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-md transition ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              }`
            }
          >
            <img src={assets.add_icon} alt="Add Job" className="w-6 h-6" />
            <p>Add Job</p>
          </NavLink>

          <NavLink
            to={"/dashBoard/manage-job"}
            className={({ isActive }) =>
              `flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-md transition ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              }`
            }
          >
            <img src={assets.home_icon} alt="Manage Job" className="w-6 h-6" />
            <p>Manage Job</p>
          </NavLink>

          <NavLink
            to={"/dashBoard/view-applications"}
            className={({ isActive }) =>
              `flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-md transition ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              }`
            }
          >
            <img
              src={assets.person_tick_icon}
              alt="View Applications"
              className="w-6 h-6"
            />
            <p>View Applications</p>
          </NavLink>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default DashBoard;
