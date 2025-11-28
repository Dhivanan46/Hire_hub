import React from "react";
import { assets } from "../assets/assets";
import {useNavigate} from "react-router-dom";


const JobCard = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      {/* Company Icon */}
      <div className="mb-4">
        <img
          src={assets.company_icon}
          alt="Company"
          className="w-12 h-12 object-contain mx-auto"
        />
      </div>

      {/* Job Title */}
      <div className="font-bold text-lg text-gray-800 mb-2">{job.title}</div>

      {/* Location and Level */}
      <div className="text-sm text-gray-600 mb-4">
        <span className="mr-4">{job.location}</span>
        <span className="mr-4">{job.level}</span>
      </div>

      {/* Job Description */}
      <div className="text-sm text-gray-500 mb-4">
        <p
          dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}
        ></p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        onClick={()=>{navigate(`/ApplyJob/${job._id}`); scrollTo(0,0)}}>
          Apply Now
        </button>
        <button className="border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-600 hover:text-white transition duration-300"
        onClick={()=>{navigate(`/ApplyJob/${job._id}`); scrollTo(0,0)}}>
          Learn More
        </button>
      </div>
    </div>
  );
};

export default JobCard;
