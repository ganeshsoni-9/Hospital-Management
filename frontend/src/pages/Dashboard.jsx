import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const { staff } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 🛑 AGAR STAFF LOGGED IN NAHI HAI
    if (!staff) {
      setSummary({
        totalPatients: "-",
        admittedPatients: "-",
        dischargedPatients: "-",
        totalDoctors: "-",
        totalRooms: "-",
        occupiedRooms: "-",
        availableRooms: "-",
        totalRevenue: "-",
        pendingRevenue: "-",
      });
      return;
    }

    // ✅ Staff logged in hai
    api
      .get("/reports/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => console.log("Error fetching summary:", err));
  }, [staff]);

  const handleViewPatientDetails = () => {
    if (!staff) {
      alert(
        "Please login/verify your hospital staff account to access patient data."
      );
      navigate("/login");
    } else {
      navigate("/patients");
    }
  };

  if (!summary)
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        Loading...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6">
        Hospital Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Patients"
          value={summary.totalPatients}
        />

        <StatCard
          label="Admitted"
          value={summary.admittedPatients}
        />

        <StatCard
          label="Discharged"
          value={summary.dischargedPatients}
        />

        <StatCard
          label="Total Doctors"
          value={summary.totalDoctors}
        />

        <StatCard
          label="Total Rooms"
          value={summary.totalRooms}
        />

        <StatCard
          label="Occupied Rooms"
          value={summary.occupiedRooms}
        />

        <StatCard
          label="Available Rooms"
          value={summary.availableRooms}
        />

        <StatCard
          label="Revenue Collected"
          value={
            summary.totalRevenue === "-"
              ? "-"
              : `₹${summary.totalRevenue}`
          }
        />

        <StatCard
          label="Pending Revenue"
          value={
            summary.pendingRevenue === "-"
              ? "-"
              : `₹${summary.pendingRevenue}`
          }
        />
      </div>

      <hr className="my-6" />

      {/* Verification Action Block */}
      <div className="mt-6 bg-white border rounded-lg shadow p-5">
        <h3 className="text-xl font-semibold mb-2">
          Patient Records & Information
        </h3>

        <p className="text-gray-500 mb-4">
          Click the button below to view or search patient
          profiles. (Account verification required)
        </p>

        <button
          onClick={handleViewPatientDetails}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          {staff
            ? "Access Patient Directory 🔍"
            : "Verify Account to Access Directory 🔒"}
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-lg shadow p-5 text-center border">
    <h2 className="text-3xl font-bold">
      {value}
    </h2>

    <p className="text-gray-500 mt-2">
      {label}
    </p>
  </div>
);

export default Dashboard;