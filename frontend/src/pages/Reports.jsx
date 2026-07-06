import { useEffect, useState } from "react";
import api from "../services/api.js";

// "Reports" node in the flowchart
const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [discharged, setDischarged] = useState([]);

  useEffect(() => {
    api.get("/reports/summary").then((res) => setSummary(res.data));
    api.get("/reports/discharged").then((res) => setDischarged(res.data));
  }, []);

  return (
    <div className="container">
      <h2>Reports</h2>

      {summary && (
        <div className="card">
          <h3>Summary</h3>
          <ul>
            <li>Total Patients: {summary.totalPatients}</li>
            <li>Admitted: {summary.admittedPatients}</li>
            <li>Discharged: {summary.dischargedPatients}</li>
            <li>Total Rooms: {summary.totalRooms} (Occupied: {summary.occupiedRooms}, Available: {summary.availableRooms})</li>
            <li>Total Doctors: {summary.totalDoctors}</li>
            <li>Revenue Collected: ₹{summary.totalRevenue}</li>
            <li>Pending Revenue: ₹{summary.pendingRevenue}</li>
          </ul>
        </div>
      )}

      <div className="card">
        <h3>Discharged Patients</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Room</th><th>Doctor</th><th>Admission</th><th>Discharge</th></tr>
          </thead>
          <tbody>
            {discharged.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.room?.roomNumber || "-"}</td>
                <td>{p.doctor?.name || "-"}</td>
                <td>{new Date(p.admissionDate).toLocaleDateString()}</td>
                <td>{new Date(p.dischargeDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
