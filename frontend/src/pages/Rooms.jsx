import { useEffect, useState } from "react";
import api from "../services/api.js";

// "ADD Room" step in the flowchart
const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ roomNumber: "", type: "General", pricePerDay: "" });

  const loadRooms = () => api.get("/rooms").then((res) => setRooms(res.data));

  useEffect(() => { loadRooms(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/rooms", form);
    setForm({ roomNumber: "", type: "General", pricePerDay: "" });
    loadRooms();
  };

  const handleDelete = async (id) => {
    await api.delete(`/rooms/${id}`);
    loadRooms();
  };

  return (
    <div className="container">
      <h2>Rooms</h2>
      <div className="card">
        <h3>Add Room</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <input placeholder="Room Number" required value={form.roomNumber}
            onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option>General</option>
            <option>Semi-Private</option>
            <option>Private</option>
            <option>ICU</option>
          </select>
          <input placeholder="Price per day" type="number" required value={form.pricePerDay}
            onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} />
          <button type="submit">Add Room</button>
        </form>
      </div>

      <div className="card">
        <h3>All Rooms</h3>
        <table>
          <thead>
            <tr><th>Room No.</th><th>Type</th><th>Price/Day</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r._id}>
                <td>{r.roomNumber}</td>
                <td>{r.type}</td>
                <td>₹{r.pricePerDay}</td>
                <td>
                  <span className={`badge ${r.status === "available" ? "green" : "red"}`}>
                    {r.status}
                  </span>
                </td>
                <td><button onClick={() => handleDelete(r._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rooms;
