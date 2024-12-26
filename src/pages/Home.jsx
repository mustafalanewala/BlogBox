import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-[calc(100vh-64px)] px-4 overflow-hidden">
      {/* Hero Section */}
      <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-gray-800 leading-snug drop-shadow-md text-center">
        Welcome to{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 animate-text-gradient">
          BlogBox
        </span>
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 mb-8 text-center max-w-2xl leading-relaxed">
        Unleash your creativity, share your ideas, and connect with a vibrant
        community of thinkers and storytellers.
      </p>

      {/* CTA Button */}
      <Link
        to="/blogs"
        className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-10 py-4 rounded-full text-lg shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        Explore Blogs
      </Link>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 sm:w-24 sm:h-24 w-16 h-16 bg-blue-200 rounded-full opacity-50 animate-float sm:top-16 sm:left-16"></div>
      <div className="absolute bottom-20 right-20 sm:w-32 sm:h-32 w-24 h-24 bg-teal-200 rounded-full opacity-50 animate-float sm:bottom-16 sm:right-16"></div>
      <div className="absolute bottom-10 left-20 sm:w-16 sm:h-16 w-12 h-12 bg-blue-300 rounded-full opacity-50 animate-float sm:bottom-24 sm:left-24"></div>
    </div>
  );
};

export default Home;
