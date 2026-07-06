import { useEffect, useState } from "react";
import api from "../services/api.js";

// "Generate Bill" -> Room/Doctor/Medicine Bill -> "Pay Bill" (Yes/No) -> Discharge
const Billing = () => {
  const [patients, setPatients] = useState([]);
  const [bills, setBills] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [medicineItems, setMedicineItems] = useState([{ name: "", quantity: 1, price: 0 }]);

  const loadAll = async () => {
    const [p, b] = await Promise.all([
      api.get("/patients"),
      api.get("/bills"),
    ]);
    setPatients(p.data.filter((pt) => pt.status === "admitted"));
    setBills(b.data);
  };

  useEffect(() => { loadAll(); }, []);

  const addMedicineRow = () =>
    setMedicineItems([...medicineItems, { name: "", quantity: 1, price: 0 }]);

  const updateMedicineRow = (index, field, value) => {
    const updated = [...medicineItems];
    updated[index][field] = value;
    setMedicineItems(updated);
  };

  const handleGenerateBill = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;
    const items = medicineItems.filter((m) => m.name);
    await api.post("/bills/generate", { patientId: selectedPatient, medicineItems: items });
    setSelectedPatient("");
    setMedicineItems([{ name: "", quantity: 1, price: 0 }]);
    loadAll();
  };

  // "Pay Bill" diamond -> Yes branch
  const handlePay = async (billId) => {
    await api.put(`/bills/${billId}/pay`);
    loadAll();
    alert("Payment recorded. Go to Patients tab to Discharge the patient.");
  };

  return (
    <div className="container">
      <h2>Billing</h2>

      <div className="card">
        <h3>Generate Bill</h3>
        <form onSubmit={handleGenerateBill}>
          <select required value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
            <option value="">Select admitted patient</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>

          <h4>Medicine Bill Items</h4>
          {medicineItems.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "8px" }}>
              <input placeholder="Medicine name" value={item.name}
                onChange={(e) => updateMedicineRow(i, "name", e.target.value)} />
              <input type="number" placeholder="Qty" value={item.quantity}
                onChange={(e) => updateMedicineRow(i, "quantity", Number(e.target.value))} />
              <input type="number" placeholder="Price" value={item.price}
                onChange={(e) => updateMedicineRow(i, "price", Number(e.target.value))} />
            </div>
          ))}
          <button type="button" onClick={addMedicineRow}>+ Add Medicine</button>
          <br />
          <button type="submit">Generate Bill (Room + Doctor + Medicine)</button>
        </form>
      </div>

      <div className="card">
        <h3>All Bills</h3>
        <table>
          <thead>
            <tr>
              <th>Patient</th><th>Room Bill</th><th>Doctor Bill</th><th>Medicine Bill</th>
              <th>Total</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => (
              <tr key={b._id}>
                <td>{b.patient?.name}</td>
                <td>₹{b.roomBill}</td>
                <td>₹{b.doctorBill}</td>
                <td>₹{b.medicineBill}</td>
                <td>₹{b.totalAmount}</td>
                <td>
                  <span className={`badge ${b.paymentStatus === "paid" ? "green" : "red"}`}>
                    {b.paymentStatus}
                  </span>
                </td>
                <td>
                  {b.paymentStatus === "pending" && (
                    <button onClick={() => handlePay(b._id)}>Pay Bill</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;
