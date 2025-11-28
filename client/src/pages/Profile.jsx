import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  const { user } = useUser();
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: "",
    image: ""
  });
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Fetch user profile data
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
          setUserData({
            name: data.user.name || user.fullName,
            email: data.user.email || user.primaryEmailAddress.emailAddress,
            phone: data.user.phone || "",
            resume: data.user.resume || "",
            image: data.user.image || user.imageUrl
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to load profile');
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // Handle resume upload
  const handleResumeUpload = async () => {
    try {
      if (!resume) {
        toast.error("Please select a resume file");
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('userId', user.id);
      formData.append('name', user.fullName);
      formData.append('email', user.primaryEmailAddress?.emailAddress);
      formData.append('image', user.imageUrl);

      const { data } = await axios.post(`${backendUrl}/api/user/upload-resume`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        toast.success("Resume uploaded successfully!");
        setUserData(prev => ({ ...prev, resume: data.resumeUrl }));
        setResume(null);
        setIsEdit(false);
        // Refresh user profile data
        await fetchUserProfile();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload resume");
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, {
        userId: user.id,
        name: userData.name,
        phone: userData.phone
      });

      if (data.success) {
        toast.success("Profile updated successfully!");
        setIsEdit(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 mt-10">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center gap-6 mb-6">
            <img
              src={userData.image}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                disabled={!isEdit}
                className={`w-full px-4 py-2 border rounded-lg ${
                  isEdit ? 'border-blue-500' : 'border-gray-300 bg-gray-50'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={userData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                disabled={!isEdit}
                placeholder="Enter your phone number"
                className={`w-full px-4 py-2 border rounded-lg ${
                  isEdit ? 'border-blue-500' : 'border-gray-300 bg-gray-50'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {isEdit ? (
                <>
                  <button
                    onClick={handleProfileUpdate}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEdit(false);
                      fetchUserProfile();
                    }}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Resume</h2>
          
          {userData.resume ? (
            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <img src={assets.resume_download_icon} alt="Resume" className="w-8 h-8" />
                <div>
                  <p className="font-semibold text-gray-800">Resume Uploaded</p>
                  <p className="text-sm text-gray-600">Click to view your resume</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={userData.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Resume
                </a>
                <button
                  onClick={() => setIsEdit(true)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Update
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <img src={assets.upload_area} alt="Upload" className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p className="text-gray-600 mb-4">No resume uploaded yet</p>
            </div>
          )}

          {/* Resume Upload Form */}
          {isEdit && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <label
                htmlFor="resumeUpload"
                className="flex items-center justify-center gap-3 cursor-pointer border-2 border-dashed border-blue-500 p-6 rounded-lg hover:bg-blue-50 transition"
              >
                <img
                  src={assets.profile_upload_icon}
                  alt="Upload"
                  className="w-10 h-10"
                />
                <div className="text-center">
                  <p className="font-semibold text-gray-800">
                    {resume ? resume.name : "Choose Resume File"}
                  </p>
                  <p className="text-sm text-gray-600">PDF format only</p>
                </div>
                <input
                  id="resumeUpload"
                  onChange={(e) => setResume(e.target.files?.[0])}
                  type="file"
                  hidden
                  accept="application/pdf"
                />
              </label>
              {resume && (
                <button
                  onClick={handleResumeUpload}
                  disabled={loading}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Uploading..." : "Upload Resume"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
