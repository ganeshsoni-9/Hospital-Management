import { Link, useNavigate } from "react-router-dom";
import { FaHospital } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { staff, logout } = useAuth();
  const navigate = useNavigate();

  if (!staff) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-800 text-white px-6 py-4 shadow-lg">
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

            <Link
              className="hover:text-blue-300 transition"
              to="/"
            >
              Dashboard
            </Link>

            <Link
              className="hover:text-blue-300 transition"
              to="/rooms"
            >
              Rooms
            </Link>

            <Link
              className="hover:text-blue-300 transition"
              to="/doctors"
            >
              Doctors
            </Link>

            <Link
              className="hover:text-blue-300 transition"
              to="/patients"
            >
              Patients
            </Link>

            <Link
              className="hover:text-blue-300 transition"
              to="/billing"
            >
              Billing
            </Link>

            <Link
              className="hover:text-blue-300 transition"
              to="/reports"
            >
              Reports
            </Link>

            <Link className="hover:text-blue-300 transition" to="/about">
              About
            </Link>

          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          <span className="font-medium text-gray-200">
            {staff.name}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-medium transition duration-200"
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;