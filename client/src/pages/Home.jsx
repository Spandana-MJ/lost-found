
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-10">
        {/* Text */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Lost something?  
            <span className="text-indigo-600"> We’ll help you find it.</span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Report lost or found items and help others recover what’s important
            to them. Together, we make finding easier.
          </p>
          <div className="mt-6 flex gap-4">
            <Link
              to="/report"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition"
            >
              Report an Item
            </Link>
            <Link
              to="/listings"
              className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg shadow-sm transition"
            >
              View Listings
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1">
          <img
            src="https://cdn-icons-png.flaticon.com/512/855/855497.png"
            alt="Lost and Found"
            className="w-full max-w-sm mx-auto drop-shadow-lg"
          />
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Easy Reporting
            </h3>
            <p className="mt-2 text-gray-600">
              Quickly submit lost or found items in just a few clicks.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Verified Listings
            </h3>
            <p className="mt-2 text-gray-600">
              Admin verification ensures trustworthy item posts.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Community Driven
            </h3>
            <p className="mt-2 text-gray-600">
              Work together to reunite people with their belongings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}




