import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import logo from "../assets/images/liqwayimage.png";
import HomeAvatar from "../assets/images/Linqimg-removebg-preview.png";
import ButtonComponent from "../components/ButtonComponent";
import { Clock } from "lucide-react";

const Home = () => (
  <>
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 z-0" />

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-24 sm:pb-32">
          <div className="text-center">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Clock className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="block">Track Attendance</span>
              <span className="block text-blue-600 dark:text-blue-400">
                with Confidence
              </span>
            </h1>

            {/* Subheading */}
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10">
              Streamline your workplace attendance tracking with our modern,
              efficient solution. Perfect for businesses of all sizes.
            </p>

            <ButtonComponent label="Employee CheckIn" url={`employee/signin`} />
          </div>
        </div>
      </div>
    </div>
  </>
);

export default Home;
