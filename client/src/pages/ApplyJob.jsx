import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { assets, jobsData } from "../assets/assets";
import kconvert from "k-convert";
import moment from "moment";
import JobCard from "../components/JobCard";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [jobData, setJobData] = useState(null);
  const { job } = useContext(AppContext);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const fetchJob = async () => {
    const data = job.filter((job) => job._id === id);
    if (data.length !== 0) {
      setJobData(data[0]);
    }
  };

  // Fetch user profile to check resume
  const fetchUserProfile = async () => {
    try {
      if (user) {
        const { data } = await axios.post(`${backendUrl}/api/user/profile`, {
          userId: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          image: user.imageUrl
        });
        
        if (data.success) {
          setUserProfile(data.user);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Check if user has already applied
  const checkApplicationStatus = async () => {
    try {
      if (user) {
        const { data } = await axios.post(`${backendUrl}/api/user/applications`, {
          userId: user.id
        });
        
        if (data.success) {
          const applied = data.applications.some(app => app.jobId === id);
          setHasApplied(applied);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle job application
  const handleApply = async () => {
    if (!user) {
      toast.error("Please login to apply for jobs");
      return;
    }

    // Check if user has uploaded resume
    if (!userProfile || !userProfile.resume) {
      toast.error("Please upload your resume in the Profile page before applying");
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      return;
    }

    try {
      setApplying(true);
      const { data } = await axios.post(`${backendUrl}/api/user/apply`, {
        userId: user.id,
        jobId: jobData._id,
        companyId: jobData.companyId._id,
        jobTitle: jobData.title,
        companyName: jobData.companyId.name,
        location: jobData.location
      });

      if (data.success) {
        toast.success("Application submitted successfully!");
        setHasApplied(true);
        setTimeout(() => {
          navigate('/applications');
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply for job");
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    if (job.length > 0) {
      fetchJob();
    }
  }, [id, job]);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    if (user && jobData) {
      checkApplicationStatus();
    }
  }, [user, jobData]);

  return jobData ? (
    <div>
      {console.log(jobData)}
      <Navbar />
      <div className="flex flex-col lg:flex-row items-center justify-between bg-blue-50 p-8 rounded-lg shadow-md mt-8 mx-auto max-w-7xl w-full min-h-[200px]">
        {/* Left Side: Logo and Details */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start w-full lg:w-3/4 ml-12">
          {/* Logo */}
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src={jobData.companyId.image}
              alt="Company Logo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="ml-6 flex flex-col">
            {/* Row 1: Company Name */}
            <h2 className="text-xl font-semibold text-gray-800">
              {jobData.title}
            </h2>

            {/* Row 2: Job Title + Other Info in one line */}
            <div className="flex flex-wrap gap-6 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <img
                  src={assets.suitcase_icon}
                  alt="Suitcase"
                  className="w-4 h-4"
                />
                {jobData.title}
              </span>
              <span className="flex items-center gap-2">
                <img
                  src={assets.location_icon}
                  alt="Location"
                  className="w-4 h-4"
                />
                {jobData.location}
              </span>
              <span className="flex items-center gap-2">
                <img
                  src={assets.person_icon}
                  alt="Person"
                  className="w-4 h-4"
                />
                {jobData.level}
              </span>
              <span className="flex items-center gap-2">
                <img src={assets.money_icon} alt="Money" className="w-4 h-4" />
                CTC: {kconvert.convertTo(jobData.salary)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Apply Button and Timestamp */}
        <div className="flex flex-col items-center justify-center w-full lg:w-1/4 mt-6 lg:mt-0">
          <button
            onClick={handleApply}
            disabled={applying || hasApplied || !user}
            className={`px-6 py-2 rounded-lg transition mb-2 ${
              hasApplied
                ? 'bg-green-500 text-white cursor-not-allowed'
                : applying
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {hasApplied ? 'Already Applied' : applying ? 'Applying...' : 'Apply Now'}
          </button>
          <p className="text-sm text-gray-500">
            Posted: {moment(jobData.date).fromNow()}
          </p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-start p-6 mt-6 ml-[8%]">
  {/* Left Side: Job Description */}
  <div className="w-full lg:w-2/3 mr-8">
    <h2 className="font-bold text-2xl mb-4">Job Description</h2>
    <div
      className="rich-text"
      dangerouslySetInnerHTML={{ __html: jobData.description }}
    ></div>
    <button
      onClick={handleApply}
      disabled={applying || hasApplied || !user}
      className={`px-6 py-2 rounded-lg transition mt-6 ${
        hasApplied
          ? 'bg-green-500 text-white cursor-not-allowed'
          : applying
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {hasApplied ? 'Already Applied' : applying ? 'Applying...' : 'Apply Now'}
    </button>
  </div>

  {/* Right Side: JobCards */}
  <div className="w-full lg:w-1/3 mr-[8%]">
    {job
      .filter(
        (job) =>
          job._id !== jobData._id &&
          job.companyId._id === jobData.companyId._id
      )
      .slice(0, 4)
      .map((job, index) => (
        <JobCard key={index} job={job} />
      ))}
  </div>
</div>

    </div>
  ) : (
    <Loader />
  );
};

export default ApplyJob;
