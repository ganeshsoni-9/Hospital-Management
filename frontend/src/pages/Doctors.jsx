import { useEffect, useState } from "react";
import api from "../services/api.js";

// "ADD Doctor" step in the flowchart
const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    name: "", specialization: "", qualification: "", phone: "", consultationFee: "",
  });

  const loadDoctors = () => api.get("/doctors").then((res) => setDoctors(res.data));

  useEffect(() => { loadDoctors(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/doctors", form);
    setForm({ name: "", specialization: "", qualification: "", phone: "", consultationFee: "" });
    loadDoctors();
  };

  const handleDelete = async (id) => {
    await api.delete(`/doctors/${id}`);
    loadDoctors();
  };

  return (
    <div className="container">
      <h2>Doctors</h2>
      <div className="card">
        <h3>Add Doctor</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <input placeholder="Name" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Specialization" required value={form.specialization}
            onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
          <input placeholder="Qualification" value={form.qualification}
            onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
          <input placeholder="Phone" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input placeholder="Consultation Fee" type="number" required value={form.consultationFee}
            onChange={(e) => setForm({ ...form, consultationFee: e.target.value })} />
          <button type="submit">Add Doctor</button>
        </form>
      </div>

      <div className="card">
        <h3>All Doctors</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Specialization</th><th>Fee</th><th>Action</th></tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.specialization}</td>
                <td>₹{d.consultationFee}</td>
                <td><button onClick={() => handleDelete(d._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Doctors;
