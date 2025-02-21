import React, { useState } from "react";
import axios from "axios";
import { employeeCheckin } from "../api";

const CheckIn = () => {
  const [status, setStatus] = useState(""); // Store check-in response

  // Function to get local Wi-Fi IP using WebRTC
  const getLocalIP = async () => {
    return new Promise((resolve) => {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel("");
      pc.createOffer().then((offer) => pc.setLocalDescription(offer));

      pc.onicecandidate = (event) => {
        if (event && event.candidate) {
          const ip = event.candidate.candidate.split(" ")[4]; // Extract IP
          resolve(ip);
        }
        pc.close();
      };
    });
  };

  // Function to handle check-in request
  const handleCheckIn = async () => {
    try {
      const localIp = await getLocalIP(); // Get Wi-Fi IP
      console.log("Employee's Local IP:", localIp);
      const token = localStorage.getItem("token");

      const response = await employeeCheckin({ localIp }, token);

      setStatus(response.data.message); // Update status message
    } catch (error) {
      console.error("Check-in error:", error);
      setStatus(
        error.response?.data?.message || "Error checking in. Try again."
      );
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Employee Check-In
        </h2>
        <button
          onClick={handleCheckIn}
          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Check In
        </button>
        {status && (
          <p className="text-center text-green-600 font-medium dark:text-green-400">
            {status}
          </p>
        )}
      </div>
    </section>
  );
};

export default CheckIn;
