import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx"; 

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const { staff } = useAuth(); // Hum check kar rahe hain ki staff logged-in hai ya nahi
  const navigate = useNavigate();

  useEffect(() => {
    // 🛑 AGAR STAFF LOGGED IN NAHI HAI: Toh backend API call mat karo! 
    // Seedha dummy data dikha do taaki 401 error na aaye.
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
        pendingRevenue: "-"
      });
      return; // Yahin se wapas laut jao, niche ka api.get mat chalao
    }

    // ✅ AGAR STAFF LOGGED IN HAI: Tabhi actual data mangwao
    api.get("/reports/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => console.log("Error fetching summary:", err));
  }, [staff]); 

  const handleViewPatientDetails = () => {
    if (!staff) {
      alert("Please login/verify your hospital staff account to access patient data.");
      navigate("/login"); 
    } else {
      navigate("/patients");
    }
  };

  if (!summary) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h2>Hospital Dashboard</h2>
      
      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px", marginBottom: "30px" }}>
        <StatCard label="Total Patients" value={summary.totalPatients} />
        <StatCard label="Admitted" value={summary.admittedPatients} />
        <StatCard label="Discharged" value={summary.dischargedPatients} />
        <StatCard label="Total Doctors" value={summary.totalDoctors} />
        <StatCard label="Total Rooms" value={summary.totalRooms} />
        <StatCard label="Occupied Rooms" value={summary.occupiedRooms} />
        <StatCard label="Available Rooms" value={summary.availableRooms} />
        <StatCard label="Revenue Collected" value={summary.totalRevenue === "-" ? "-" : `₹${summary.totalRevenue}`} />
        <StatCard label="Pending Revenue" value={summary.pendingRevenue === "-" ? "-" : `₹${summary.pendingRevenue}`} />
      </div>

      <hr />

      {/* Verification Action Block */}
      <div style={{ marginTop: "20px", padding: "15px", background: "#f8f9fa", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
        <h3>Patient Records & Information</h3>
        <p style={{ color: "#666" }}>Click the button below to view or search patient profiles. (Account verification required)</p>
        
        <button 
          onClick={handleViewPatientDetails} 
          style={{ 
            padding: "10px 20px", 
            background: "#007bff", 
            color: "#fff", 
            border: "none", 
            borderRadius: "5px", 
            cursor: "pointer",
            fontWeight: "bold" 
          }}
        >
          {staff ? "Access Patient Directory 🔍" : "Verify Account to Access Directory 🔒"}
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="card" style={{ textAlign: "center", border: "1px solid #ddd", padding: "15px", borderRadius: "8px", background: "#fff" }}>
    <h3 style={{ margin: 0 }}>{value}</h3>
    <p style={{ color: "#666", margin: 0 }}>{label}</p>
  </div>
);

export default Dashboard;