import { useEffect, useState } from "react";
import api from "../services/api.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Covers: ADD Patient -> Assign Room -> Assign Doctor -> Discharge Patient
const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    name: "", age: "", gender: "Male", contact: "", address: "", disease: "",
  });

  // Merged Safe & Foolproof loadAll function
  const loadAll = async () => {
    try {
      // Teeno api calls ko safely handle karna aur fallback empty array dena
      const patientRes = await api.get("/patients").catch(err => {
        console.error("Patients fetch api failed:", err);
        return { data: [] };
      });

      const roomRes = await api.get("/rooms/available").catch(err => {
        console.error("Available rooms fetch failed:", err);
        return { data: [] };
      });

      const doctorRes = await api.get("/doctors").catch(err => {
        console.error("Doctors fetch failed:", err);
        return { data: [] };
      });

      if (patientRes && patientRes.data) setPatients(patientRes.data);
      if (roomRes && roomRes.data) setRooms(roomRes.data); // Matched with state name
      if (doctorRes && doctorRes.data) setDoctors(doctorRes.data);

    } catch (error) {
      console.error("Error inside Patients loadAll:", error);
    }
  };

  useEffect(() => { 
    loadAll(); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/patients", form);
    setForm({ name: "", age: "", gender: "Male", contact: "", address: "", disease: "" });
    loadAll();
  };

  const handleAssignRoom = async (patientId, roomId) => {
    if (!roomId) return;
    await api.put(`/patients/${patientId}/assign-room`, { roomId });
    loadAll();
  };

  const handleAssignDoctor = async (patientId, doctorId) => {
    if (!doctorId) return;
    await api.put(`/patients/${patientId}/assign-doctor`, { doctorId });
    loadAll();
  };

  const handleDischarge = async (patientId) => {
    await api.put(`/patients/${patientId}/discharge`);
    loadAll();
  };

  // Permanently delete a patient's record (with confirmation)
  const handleDeletePatient = async (patient) => {
    const confirmed = window.confirm(
      `Kya aap sach me "${patient.name}" ka poora record delete karna chahte hain? Yeh action wapas nahi ho sakta.`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/patients/${patient._id}`);
      loadAll(); // list turant refresh ho jayegi, Dashboard bhi agli baar load hone par updated count dikhayega
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Patient delete karne me error aayi. Console check karein.");
    }
  };

  // Fetch this patient's bill (if any) to include final amount in the summary
  const getPatientBill = async (patientId) => {
    try {
      const bRes = await api.get("/bills").catch(() => ({ data: [] }));
      const allBills = bRes && bRes.data ? bRes.data : [];
      return allBills.find(
        (b) => b.patient?._id === patientId || b.patient === patientId
      );
    } catch (err) {
      console.error("Bill fetch failed for summary:", err);
      return null;
    }
  };

  // Generate & download Discharge Summary PDF for a patient
  const handleDownloadSummary = async (p) => {
    const bill = await getPatientBill(p._id);

    const admissionDate = p.admissionDate ? new Date(p.admissionDate) : null;
    const dischargeDate = p.dischargeDate ? new Date(p.dischargeDate) : new Date();
    const totalDays = admissionDate
      ? Math.max(1, Math.ceil((dischargeDate - admissionDate) / (1000 * 60 * 60 * 24)))
      : "N/A";

    const doc = new jsPDF();
    doc.text("Patient Discharge Summary", 14, 15);

    const rows = [
      ["Patient Name", p.name],
      ["Age", p.age],
      ["Gender", p.gender],
      ["Contact", p.contact],
      ["Disease", p.disease || "-"],
      ["Room", p.room ? p.room.roomNumber : "-"],
      ["Doctor", p.doctor ? p.doctor.name : "-"],
      ["Admission Date", admissionDate ? admissionDate.toLocaleDateString() : "N/A"],
      ["Discharge Date", dischargeDate.toLocaleDateString()],
      ["Total Days Admitted", totalDays],
      ["Final Bill Amount", bill ? `Rs. ${bill.totalAmount}` : "Not billed yet"],
      ["Payment Status", bill ? bill.paymentStatus : "N/A"],
    ];

    autoTable(doc, {
      startY: 25,
      head: [["Field", "Details"]],
      body: rows,
    });

    doc.save(`discharge_summary_${p.name}.pdf`);
  };

  return (
    <div className="container">
      <h2>Patients</h2>
      <div className="card">
        <h3>Add Patient</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <input placeholder="Name" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Age" type="number" required value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })} />
          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
          <input placeholder="Contact" required value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          <input placeholder="Address" value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input placeholder="Disease" value={form.disease}
            onChange={(e) => setForm({ ...form, disease: e.target.value })} />
          <button type="submit">Add Patient</button>
        </form>
      </div>

      <div className="card">
        <h3>All Patients</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Room</th><th>Doctor</th><th>Status</th>
              <th>Admission Date</th><th>Discharge Date</th>
              <th>Assign Room</th><th>Assign Doctor</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.room ? p.room.roomNumber : "-"}</td>
                <td>{p.doctor ? p.doctor.name : "-"}</td>
                <td>
                  <span className={`badge ${p.status === "admitted" ? "green" : "yellow"}`}>
                    {p.status}
                  </span>
                </td>
                <td>{p.admissionDate ? new Date(p.admissionDate).toLocaleDateString() : "-"}</td>
                <td>{p.dischargeDate ? new Date(p.dischargeDate).toLocaleDateString() : "-"}</td>
                <td>
                  <select defaultValue="" onChange={(e) => handleAssignRoom(p._id, e.target.value)}>
                    <option value="">Select room</option>
                    {rooms.map((r) => (
                      <option key={r._id} value={r._id}>{r.roomNumber}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select defaultValue="" onChange={(e) => handleAssignDoctor(p._id, e.target.value)}>
                    <option value="">Select doctor</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <div className="flex flex-col sm:flex-row gap-1">
                    {p.status === "admitted" && (
                      <button onClick={() => handleDischarge(p._id)} className="w-full sm:w-auto">
                        Discharge
                      </button>
                    )}
                    {p.status !== "admitted" && (
                      <button onClick={() => handleDownloadSummary(p)} className="w-full sm:w-auto">
                        Download Summary
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePatient(p)}
                      className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;
