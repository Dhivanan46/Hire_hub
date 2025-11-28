import React from "react";
import { manageJobsData } from "../assets/assets";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const ManageJob = () => {
  const navigate = useNavigate(); 
  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 w-fit">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-600">
              <th className="px-4 py-2 border-b">#</th>
              <th className="px-4 py-2 border-b">Job Title</th>
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Location</th>
              <th className="px-4 py-2 border-b">Applicants</th>
              <th className="px-4 py-2 border-b">Visible</th>
            </tr>
          </thead>
          <tbody>
            {manageJobsData.map((job, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition text-sm text-gray-700"
              >
                <td className="px-4 py-3 border-b">{index + 1}</td>
                <td className="px-4 py-3 border-b">{job.title}</td>
                <td className="px-4 py-3 border-b">
                  {moment(job.date).format("ll")}
                </td>
                <td className="px-4 py-3 border-b">{job.location}</td>
                <td className="px-4 py-3 border-b">{job.applicants}</td>
                <td className="px-4 py-3 border-b">
                  <input type="checkbox" className="accent-blue-500" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Button placed outside */}
      <div className="mt-4">
        <button onClick={e=>{navigate('/dashboard/add-job')}} className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Add New Job
        </button>
      </div>
    </div>
  );
};

export default ManageJob;
