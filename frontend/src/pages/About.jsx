import React from "react";

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-4xl font-bold text-blue-700 mb-6">
          About Hospital Management System
        </h1>

        <p className="text-gray-700 leading-8 mb-6">
          The Hospital Management System (HMS) is a web-based application
          developed to simplify and digitize hospital operations. It helps
          hospital staff efficiently manage patients, doctors, rooms, billing,
          and reports from a single platform.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <div className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">
              🎯 Our Mission
            </h2>

            <p className="text-gray-600">
              To provide a secure, efficient, and user-friendly hospital
              management solution that improves patient care and reduces manual
              paperwork.
            </p>
          </div>

          <div className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">
              👁 Our Vision
            </h2>

            <p className="text-gray-600">
              To create a smart digital healthcare platform that enables fast,
              reliable, and transparent hospital management for everyone.
            </p>
          </div>

        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            ✨ Key Features
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <div className="bg-gray-50 border rounded-lg p-4">
              👨‍⚕️ Doctor Management
            </div>

            <div className="bg-gray-50 border rounded-lg p-4">
              🧑‍🤝‍🧑 Patient Management
            </div>

            <div className="bg-gray-50 border rounded-lg p-4">
              🏥 Room Allocation
            </div>

            <div className="bg-gray-50 border rounded-lg p-4">
              💳 Billing System
            </div>

            <div className="bg-gray-50 border rounded-lg p-4">
              📊 Reports & Analytics
            </div>

            <div className="bg-gray-50 border rounded-lg p-4">
              🔐 Secure Staff Login
            </div>

          </div>
        </div>

        <div className="mt-10 bg-blue-50 border-l-4 border-blue-600 p-5 rounded">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            Technologies Used
          </h3>

          <p className="text-gray-700">
            React.js • Tailwind CSS • Node.js • Express.js • MongoDB • JWT
            Authentication • REST API
          </p>
        </div>

        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold text-blue-700">
            Hospital Management System
          </h2>

          <p className="text-gray-600 mt-2">
            Making Healthcare Management Simple, Secure & Efficient.
          </p>
        </div>

      </div>
    </div>
  );
};

export default About;