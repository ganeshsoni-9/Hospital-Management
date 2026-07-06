import { useEffect, useState } from "react";
import api from "../services/api.js";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/reports/summary").then((res) => setSummary(res.data));
  }, []);

  if (!summary) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px" }}>
        <StatCard label="Total Patients" value={summary.totalPatients} />
        <StatCard label="Admitted" value={summary.admittedPatients} />
        <StatCard label="Discharged" value={summary.dischargedPatients} />
        <StatCard label="Total Doctors" value={summary.totalDoctors} />
        <StatCard label="Total Rooms" value={summary.totalRooms} />
        <StatCard label="Occupied Rooms" value={summary.occupiedRooms} />
        <StatCard label="Available Rooms" value={summary.availableRooms} />
        <StatCard label="Revenue Collected" value={`₹${summary.totalRevenue}`} />
        <StatCard label="Pending Revenue" value={`₹${summary.pendingRevenue}`} />
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="card" style={{ textAlign: "center" }}>
    <h3 style={{ margin: 0 }}>{value}</h3>
    <p style={{ color: "#666", margin: 0 }}>{label}</p>
  </div>
);

export default Dashboard;
