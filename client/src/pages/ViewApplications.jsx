import React from "react";
import { assets, viewApplicationsPageData } from "../assets/assets";

const ViewApplications = () => {
  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
          <thead className="bg-gray-100 text-gray-700 text-sm font-medium">
            <tr>
              <th className="px-4 py-2 text-left border-b">#</th>
              <th className="px-4 py-2 text-left border-b">User Name</th>
              <th className="px-4 py-2 text-left border-b">Job Title</th>
              <th className="px-4 py-2 text-left border-b">Location</th>
              <th className="px-4 py-2 text-left border-b">Resume</th>
              <th className="px-4 py-2 text-left border-b">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {viewApplicationsPageData.map((applicant, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b">{index + 1}</td>
                <td className="px-4 py-3 border-b flex items-center gap-2">
                  <img
                    src={applicant.imgSrc}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{applicant.name}</span>
                </td>
                <td className="px-4 py-3 border-b">{applicant.jobTitle}</td>
                <td className="px-4 py-3 border-b">{applicant.location}</td>
                <td className="px-4 py-3 border-b">
                  <a
                    href={applicant.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    Resume
                    <img
                      src={assets.resume_download_icon}
                      alt="download"
                      className="w-4 h-4"
                    />
                  </a>
                </td>
                <td className="px-4 py-3 border-b">
                  <div className="relative group inline-block">
                    <button className="text-gray-500 px-2 py-1 hover:bg-gray-200 rounded">
                      ...
                    </button>

                    <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 shadow-lg rounded hidden group-hover:block z-10">
                      <button className="block w-full text-left px-4 py-2 text-sm hover:bg-green-100">
                        Accept
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm hover:bg-red-100">
                        Reject
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplications;
