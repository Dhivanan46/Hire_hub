import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import {
  assets,
  JobCategories,
  JobLocations,
  jobsData,
} from "../assets/assets";
import JobCard from "./JobCard";

const JobListing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { isSearched, searchFilter, setSearchFilter, job } =
    useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const matchesSelectedCategory = (job) =>
      selectedCategory.length === 0 || selectedCategory.includes(job.category);
    const matchesSelectedLocation = (job) =>
      selectedLocation.length === 0 || selectedLocation.includes(job.location);
    const matchesTitle = (job) =>
      searchFilter.title === "" ||
      searchFilter.title.toLowerCase().includes(job.title.toLowerCase());
    const matchesLocation = (job) =>
      searchFilter.location === "" ||
      searchFilter.location.toLowerCase().includes(job.location.toLowerCase());

    const newFilteredJob = job
      .slice()
      .reverse()
      .filter(
        (job) =>
          matchesSelectedCategory(job) &&
          matchesSelectedLocation(job) &&
          matchesLocation(job) &&
          matchesTitle(job)
      );

    setFilteredJobs(newFilteredJob);
    setCurrentPage(1);
  }, [selectedCategory, selectedLocation, searchFilter, job]);

  const handleCategoryChange = (category) => {
    setSelectedCategory((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    console.log(selectedCategory);
  };
  const handleLocationChange = (location) => {
    setSelectedLocation((prev) =>
      prev.includes(location)
        ? prev.filter((c) => c !== location)
        : [...prev, location]
    );
    console.log(selectedLocation);
  };

  return (
    <div className="flex px-8 pt-8 space-x-8 m-12" id="jobList">
      {/* SideBar (Search Filters) */}
      <div className="w-1/4 max-sm:hidden">
        {/* SearchFilter */}
        {isSearched &&
          (searchFilter.title !== "" || searchFilter.location !== "") && (
            <>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 font-bold">
                Current Search:
              </h3>
              <div className="flex flex-wrap gap-4 mb-4">
                {searchFilter.title !== "" && (
                  <span className="flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {searchFilter.title}
                    <img
                      src={assets.cross_icon}
                      alt="Clear title"
                      onClick={() =>
                        setSearchFilter((prev) => ({ ...prev, title: "" }))
                      }
                      className="w-4 h-4 ml-2 cursor-pointer"
                    />
                  </span>
                )}
                {searchFilter.location !== "" && (
                  <span className="flex items-center bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    {searchFilter.location}
                    <img
                      src={assets.cross_icon}
                      alt="Clear location"
                      onClick={() =>
                        setSearchFilter((prev) => ({ ...prev, location: "" }))
                      }
                      className="w-4 h-4 ml-2 cursor-pointer"
                    />
                  </span>
                )}
              </div>
            </>
          )}
        {/* Category Filter */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 font-bold">
            Search By Categories
          </h3>
          <ul className="space-y-2">
            {JobCategories.map((category, index) => {
              return (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-800"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-blue-600"
                    onChange={() => handleCategoryChange(category)}
                    checked={selectedCategory.includes(category)}
                  />
                  {category}
                </li>
              );
            })}
          </ul>
        </div>
        {/* Location Filter */}
        <div className="mt-10 pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 font-bold">
            Search By Locations
          </h3>
          <ul className="space-y-2">
            {JobLocations.map((location, index) => {
              return (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-800"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-blue-600"
                    onChange={() => handleLocationChange(location)}
                    checked={selectedLocation.includes(location)}
                  />
                  {location}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/* JobListings */}
      <div className="w-3/4">
        <section className="pt-8">
          {" "}
          {/* Fixed: removed px-8 here */}
          <h3 className="text-xl font-bold text-gray-800 mb-1">Latest Jobs</h3>
          <p className="text-sm text-gray-600 mb-6">
            Get your desired job from top companies
          </p>
          {/* Grid Layout for Job Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs
              .slice((currentPage - 1) * 6, currentPage * 6)
              .map((job, index) => (
                <JobCard key={index} job={job} />
              ))}
          </div>
          {/* Pagination */}
          <div>
            {filteredJobs.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <a
                  href="#jobList"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  <img src={assets.left_arrow_icon} alt="Previous" />
                </a>
                {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map(
                  (_, index) => (
                    <a key={index} href="#jobList">
                      <button
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 rounded ${
                          currentPage === index + 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {index + 1}
                      </button>
                    </a>
                  )
                )}
                <a
                  href="#jobList"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, Math.ceil(job.length / 6))
                    )
                  }
                >
                  <img src={assets.right_arrow_icon} alt="Next" />
                </a>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobListing;
