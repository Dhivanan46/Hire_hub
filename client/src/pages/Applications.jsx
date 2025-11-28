import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets.js";
import moment from "moment";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Applications = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Fetch user applications
  const fetchApplications = async () => {
    try {
      if (user) {
        const { data } = await axios.post(`${backendUrl}/api/user/applications`, {
          userId: user.id
        });
        
        if (data.success) {
          setApplications(data.applications);
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-8 mt-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Applications</h1>
          <p className="text-gray-600">Track all your job applications in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Applications</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <img src={assets.suitcase_icon} alt="Total" className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <img src={assets.person_icon} alt="Pending" className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Accepted</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.accepted}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <img src={assets.person_tick_icon} alt="Accepted" className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Rejected</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.rejected}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <img src={assets.cross_icon} alt="Rejected" className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        {applications.length > 0 ? (
          <div className="overflow-x-auto shadow-xl rounded-lg bg-white">
            <table className="min-w-full table-auto text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
                <tr>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Job Title</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Applied Date</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {applications.map((application, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-all duration-300 border-b"
                  >
                    <td className="py-4 px-6 flex items-center">
                      <img
                        src={assets.company_icon}
                        alt={application.companyName}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      {application.companyName}
                    </td>
                    <td className="py-4 px-6 font-medium">{application.jobTitle}</td>
                    <td className="py-4 px-6">{application.location}</td>
                    <td className="py-4 px-6">{moment(application.appliedDate).format("ll")}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold inline-block
                                  ${
                                    application.status === "Accepted"
                                      ? "bg-green-100 text-green-800"
                                      : application.status === 'Rejected' ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                      >
                        {application.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <img src={assets.upload_area} alt="No applications" className="w-24 h-24 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-6">Start applying to jobs and track your applications here</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
