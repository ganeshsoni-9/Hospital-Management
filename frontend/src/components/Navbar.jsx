import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHospital, FaSun, FaMoon } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { staff } = useAuth();

  // Dark mode state - initialized from localStorage (defaults to light)
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  // Dropdown state for Gmail avatar click
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);

  // Apply/remove the "dark" class on <html> whenever darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  if (!staff) return null;

  // Email is nested inside staff.user
  const userEmail = staff.user?.email;

  // Get first letter of email (uppercase)
  const emailFirstLetter = userEmail
    ? userEmail.charAt(0).toUpperCase()
    : "?";

  return (
    <nav className="bg-slate-800 dark:bg-slate-950 text-white px-6 py-4 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

        {/* Left Section */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-blue-300 transition"
          >
            <FaHospital className="text-3xl text-blue-400" />
            <span className="text-2xl font-bold tracking-wide">
              VMS
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-wrap gap-5 text-base">

            <Link className="hover:text-blue-300 transition" to="/">
              Dashboard
            </Link>

            <Link className="hover:text-blue-300 transition" to="/rooms">
              Rooms
            </Link>

            <Link className="hover:text-blue-300 transition" to="/doctors">
              Doctors
            </Link>

            <Link className="hover:text-blue-300 transition" to="/patients">
              Patients
            </Link>

            <Link className="hover:text-blue-300 transition" to="/billing">
              Billing
            </Link>

            <Link className="hover:text-blue-300 transition" to="/reports">
              Reports
            </Link>

            <Link className="hover:text-blue-300 transition" to="/about">
              About
            </Link>

          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Dark mode toggle button */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="text-xl hover:text-blue-300 transition p-2 rounded-full hover:bg-slate-700"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <span className="font-medium text-gray-200">
            {staff.user?.name}
          </span>

          {/* Gmail avatar - orange bg, white letter, click shows email name */}
          <div className="relative">
            <button
              onClick={() => setShowEmailDropdown((prev) => !prev)}
              aria-label="Show Gmail account"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg transition"
            >
              {emailFirstLetter}
            </button>

            {/* Dropdown showing only the email name */}
            {showEmailDropdown && (
              <div className="absolute right-0 top-full mt-2 whitespace-nowrap bg-slate-900 text-white text-sm px-3 py-1.5 rounded-md shadow-lg z-50">
                {userEmail || "No email found"}
              </div>
            )}
          </div>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;