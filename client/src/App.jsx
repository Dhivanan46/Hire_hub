import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import { AppContext } from "./context/AppContext";
import RecruiterLogin from "./components/RecruiterLogin";
import DashBoard from "./pages/DashBoard";
import AddJob from "./pages/AddJob";
import ManageJob from "./pages/ManageJob";
import ViewApplications from "./pages/ViewApplications";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {

  const {showRecruiterLogin} = useContext(AppContext);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      {showRecruiterLogin && <RecruiterLogin />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ApplyJob/:id" element={<ApplyJob />} />
        <Route path="/Applications" element={<Applications />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/dashBoard" element={<DashBoard />}>
        <Route path="add-job" element={<AddJob />}/>
        <Route path="manage-job" element={<ManageJob />}/>
        <Route path="view-applications" element={<ViewApplications />}/>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
