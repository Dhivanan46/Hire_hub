import React, { useState } from "react";
import { JobCategories, JobLocations } from "../assets/assets";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner Level");
  const [salary, setSalary] = useState(0);
  return (
    <div className="pl-10 pt-6">
      <form action="" className="w-fit space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Job Title</p>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            Job Description
          </p>
          <input
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Job Category
            </p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {JobCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Job Location
            </p>
            <select
              onChange={(e) => setLocation(e.target.value)}
              value={location}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {JobLocations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Job Level</p>
            <select
              onChange={(e) => setLocation(e.target.value)}
              value={level}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Beginner Level">Beginner Level</option>
              <option value="Intermediate Level">Intermediate Level</option>
              <option value="Senior Level">Senior Level</option>
            </select>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Job Salary</p>
          <input
            min={0}
            type="number"
            onChange={(e) => setSalary(e.target.value)}
            value={salary}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJob;
