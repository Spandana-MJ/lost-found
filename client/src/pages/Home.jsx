
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import LostAndFoundImg from '../assets/lost-img.png';
import manageImg from '../assets/manage.png';
import reportingImg from '../assets/reporting.png';
import community from '../assets/community.png';
export default function Home() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-100 via-white to-indigo-100 min-h-screen font-inter">
      {/* 🟣 Floating Decorative Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300/40 rounded-full blur-3xl animate-pulse"></div>

      {/* 🌟 Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-14">
        {/* Text Section */}
        <motion.div
          className="flex-1 backdrop-blur-md bg-white/60 p-10 rounded-3xl shadow-xl border border-white/40"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
            Lost something? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600 animate-gradient-x">
              We’ll help you find it.
            </span>
          </h1>
          <p className="mt-6 text-gray-700 text-lg leading-relaxed max-w-lg">
            Report lost or found items, browse community posts, and help others
            recover what’s important — all in one trusted platform.
          </p>

          <div className="mt-8 flex gap-5">
            <Link
              to="/report"
              className="px-6 py-3 rounded-xl text-white font-semibold shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              🚀 Report an Item
            </Link>
            <Link
              to="/listings"
              className="px-6 py-3 rounded-xl border font-semibold border-gray-300 bg-white hover:bg-gray-100 shadow-sm hover:scale-105 transition-transform duration-300"
            >
              🔍 View Listings
            </Link>
          </div>
        </motion.div>

        {/* Illustration Section */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.img
            src={LostAndFoundImg}
            alt="Lost and Found Illustration"
            className="w-full max-w-md drop-shadow-2xl"
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </section>

      {/* 💡 Features Section */}
      <section className="bg-white py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
              FindIt
            </span>
            ?
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Easy Reporting",
                desc: "Submit lost or found items quickly and effortlessly.",
                img: reportingImg,
              },
              {
                title: "Verified Listings",
                desc: "Admin verification ensures trustworthy item posts.",
                img: manageImg,
              },
              {
                title: "Community Driven",
                desc: "Work together to reunite people with their belongings.",
                img: community,
              }
            
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-2xl shadow-sm border border-gray-100 bg-white hover:shadow-2xl hover:bg-gradient-to-br from-white to-indigo-50 transition-all"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="w-20 h-20 mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🌍 Footer */}
      <footer className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-8 text-center mt-10 relative z-10">
        <div className="flex justify-center gap-6 mb-3">
          <a href="https://github.com/Spandana-MJ" target="_blank" rel="noreferrer">
            <FaGithub className="text-2xl hover:text-gray-200 transition-colors" />
          </a>
          <a href="https://linkedin.com/in/Spandana-MJ" target="_blank" rel="noreferrer">
            <FaLinkedin className="text-2xl hover:text-gray-200 transition-colors" />
          </a>
          <a href="https://my-portfolio-alpha-one-48.vercel.app" target="_blank" rel="noreferrer">
            <FaGlobe className="text-2xl hover:text-gray-200 transition-colors" />
          </a>
        </div>
        <p className="text-sm">
          © {new Date().getFullYear()} <b>Lost and Found</b>

        </p>
      </footer>
    </div>
  );
}















