import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const RecruiterLogin = () => {
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(false);
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const {setShowRecruiterLogin} = useContext(AppContext);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (state === "Register" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    setLoading(true);
    
    try {
      if (state === "Login") {
        // Login API call
        const { data } = await axios.post(`${backendUrl}/api/recruiter/login`, {
          email,
          password
        });

        if (data.success) {
          toast.success('Login successful!');
          localStorage.setItem('recruiterToken', data.token);
          localStorage.setItem('recruiterData', JSON.stringify(data.recruiter));
          setShowRecruiterLogin(false);
          // Optionally redirect to dashboard
          window.location.href = '/dashboard';
        }
      } else {
        // Register API call
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        if (image) {
          formData.append('image', image);
        }

        const { data } = await axios.post(`${backendUrl}/api/recruiter/register`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (data.success) {
          toast.success('Account created successfully!');
          localStorage.setItem('recruiterToken', data.token);
          localStorage.setItem('recruiterData', JSON.stringify(data.recruiter));
          setShowRecruiterLogin(false);
          // Optionally redirect to dashboard
          window.location.href = '/dashboard';
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        {/* Login Popup */}
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm relative">
          <h2 className="text-2xl font-semibold mb-6 text-center">{state}</h2>

          <p className="text-center text-gray-600 text-sm mb-6">
            {state === "Login"
              ? "Welcome back! Please sign in to continue"
              : "Create an account to get started"}
          </p>

          {state === "Register" && isDataSubmitted ? (
            <>
              <div className="flex items-center gap-4 my-10">
                <label htmlFor="image">
                  <img
                    src={
                      image ? URL.createObjectURL(image) : assets.upload_area
                    }
                    alt=""
                  />
                  <input
                    onChange={(e) => setImage(e.target.files[0])}
                    type="file"
                    id="image"
                    hidden
                  />
                </label>
                <p>
                  Upload Company <br />
                  Logo
                </p>
              </div>
              <button
                onClick={handleSubmit}
                type="button"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? "Please wait..." : "Create Account"}
              </button>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                {state !== "Login" && (
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Company Name
                    </label>
                    <input
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      id="companyName"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Company Name"
                      required
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email ID
                  </label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    id="email"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Your Email"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    id="password"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <br />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Please wait..." : state === "Login" ? "Login" : "Next"}
                </button>
              </form>
            </>
          )}

          {/* Close icon moved outside of form */}
          <img
            onClick={e=>setShowRecruiterLogin(false)}
            className="absolute top-5 right-5 cursor-pointer"
            src={assets.cross_icon}
            alt=""
          />

          <br />

          {state === "Login" ? (
            <p className="text-sm text-center text-gray-600 mt-4">
              Don’t have an account?{" "}
              <a
                href="#"
                className="text-blue-600 hover:underline"
                onClick={(e) => setState("Register")}
              >
                Sign up
              </a>
            </p>
          ) : (
            <p className="text-sm text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <a
                href="#"
                className="text-blue-600 hover:underline"
                onClick={(e) => setState("Login")}
              >
                Log In
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterLogin;
