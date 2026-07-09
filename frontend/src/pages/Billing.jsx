import { useEffect, useState } from "react";
import {
  FaFileInvoiceDollar,
  FaPlus,
  FaTrash,
  FaMoneyBillWave,
  FaFileDownload,
} from "react-icons/fa";
import api from "../services/api.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ------------------------------------------------------------------ */
/*  Same design system as Dashboard.jsx / Rooms.jsx / Doctors.jsx /    */
/*  Patients.jsx — keep all five in sync. Add this to index.html      */
/*  <head> for the exact fonts (optional, a @import fallback below    */
/*  covers it too):                                                    */
/*                                                                     */
/*  <link href="https://fonts.googleapis.com/css2?family=Fraunces:    */
/*  opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@     */
/*  400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"  */
/*  rel="stylesheet">                                                 */
/* ------------------------------------------------------------------ */

const TONES = {
  primary: { fg: "#0E5C56", soft: "#E4F3F1" },
  success: { fg: "#1F8F63", soft: "#E5F6EE" },
  accent: { fg: "#E85D4A", soft: "#FDEAE6" },
};

// pending = still needs action -> accent (same "attention" semantics used
// for occupied rooms / admitted patients elsewhere in the app)
const StatusBadge = ({ status }) => {
  const isPaid = status === "paid";
  const t = isPaid ? TONES.success : TONES.accent;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: t.soft, color: t.fg }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: t.fg, animation: isPaid ? "none" : "pulseDot 1.6s ease-in-out infinite" }}
      />
      {status}
    </span>
  );
};

const SkeletonRow = ({ delay }) => (
  <tr className="opacity-0" style={{ animation: "fadeSlideUp 0.4s ease-out forwards", animationDelay: `${delay}ms` }}>
    <td colSpan={7} className="py-3">
      <div
        className="h-10 rounded-lg"
        style={{
          background: "linear-gradient(90deg, #EEF4F3 25%, #F7FAFA 37%, #EEF4F3 63%)",
          backgroundSize: "400px 100%",
          animation: "shimmer 1.4s ease-in-out infinite",
        }}
      />
    </td>
  </tr>
);

const Billing = () => {
  const [patients, setPatients] = useState([]);
  const [bills, setBills] = useState(null); // null = still loading
  const [selectedPatient, setSelectedPatient] = useState("");
  const [medicineItems, setMedicineItems] = useState([{ name: "", quantity: 1, price: 0 }]);
  const [submitting, setSubmitting] = useState(false);
  const [payingId, setPayingId] = useState(null);

  const loadAll = async () => {
    try {
      const pRes = await api.get("/patients").catch((err) => {
        console.error("Patients fetch failed:", err);
        return { data: [] };
      });
      const bRes = await api.get("/bills").catch((err) => {
        console.error("Bills fetch failed:", err);
        return { data: [] };
      });

      if (pRes && pRes.data) setPatients(pRes.data.filter((pt) => pt.status === "admitted"));
      if (bRes && bRes.data) setBills(bRes.data);
    } catch (error) {
      console.error("Error in loadAll:", error);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const addMedicineRow = () =>
    setMedicineItems([...medicineItems, { name: "", quantity: 1, price: 0 }]);

  const removeMedicineRow = (index) =>
    setMedicineItems(medicineItems.filter((_, i) => i !== index));

  const updateMedicineRow = (index, field, value) => {
    const updated = [...medicineItems];
    updated[index][field] = value;
    setMedicineItems(updated);
  };

  const handleGenerateBill = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;
    setSubmitting(true);
    try {
      const items = medicineItems.filter((m) => m.name);
      await api.post("/bills/generate", { patientId: selectedPatient, medicineItems: items });
      setSelectedPatient("");
      setMedicineItems([{ name: "", quantity: 1, price: 0 }]);
      await loadAll();
    } finally {
      setSubmitting(false);
    }
  };

  const handlePay = async (billId) => {
    setPayingId(billId);
    try {
      await api.put(`/bills/${billId}/pay`);
      await loadAll();
      alert("Payment recorded. Go to Patients tab to Discharge the patient.");
    } finally {
      setPayingId(null);
    }
  };

  const handleDownloadPDF = (bill) => {
    const doc = new jsPDF();
    doc.text("Hospital Bill", 14, 15);
    doc.text(`Patient: ${bill.patient?.name || "N/A"}`, 14, 25);
    doc.text(`Status: ${bill.paymentStatus}`, 14, 32);

    const billRows = [
      ["Room Bill", `Rs. ${bill.roomBill}`],
      ["Doctor Bill", `Rs. ${bill.doctorBill}`],
      ["Medicine Bill", `Rs. ${bill.medicineBill}`],
      ["Total Amount", `Rs. ${bill.totalAmount}`],
    ];

    autoTable(doc, { startY: 40, head: [["Item", "Amount"]], body: billRows });
    doc.save(`bill_${bill.patient?.name || bill._id}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6" style={{ background: "#F6FAF9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');

        * { font-family: 'Inter', sans-serif; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOutRow {
          from { opacity: 1; transform: translateX(0); max-height: 60px; }
          to   { opacity: 0; transform: translateX(8px); max-height: 0; }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.5); opacity: 0.5; }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .bill-input, .bill-select {
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .bill-input:focus, .bill-select:focus {
          outline: none;
          border-color: #0E5C56;
          box-shadow: 0 0 0 3px rgba(14, 92, 86, 0.12);
        }
        .bill-row:hover {
          background-color: #F6FAF9;
        }
        .med-row {
          animation: fadeSlideUp 0.3s ease-out forwards;
        }
      `}</style>

      {/* ---------------- Page Header ---------------- */}
      <div className="mb-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
        <h2
          className="text-3xl"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: "#123331" }}
        >
          Billing
        </h2>
        <p className="text-[#6B8280] mt-1 text-sm">
          Generate bills for admitted patients and track payment status.
        </p>
      </div>

      {/* ---------------- Generate Bill ---------------- */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 mb-6 opacity-0"
        style={{ animation: "fadeSlideUp 0.5s ease-out forwards" }}
      >
        <h3 className="font-semibold mb-4" style={{ color: "#123331" }}>
          Generate Bill
        </h3>

        <form onSubmit={handleGenerateBill} className="flex flex-col gap-4">
          <select
            required
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="bill-select w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm bg-white"
          >
            <option value="">Select admitted patient</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>

          <div>
            <h4 className="text-sm font-semibold mb-2" style={{ color: "#123331" }}>
              Medicine Bill Items
            </h4>

            <div className="flex flex-col gap-2">
              {medicineItems.map((item, i) => (
                <div key={i} className="med-row flex flex-col sm:flex-row gap-2 w-full items-center opacity-0">
                  <input
                    placeholder="Medicine name"
                    value={item.name}
                    onChange={(e) => updateMedicineRow(i, "name", e.target.value)}
                    className="bill-input w-full sm:flex-1 border border-black/10 rounded-xl px-4 py-2.5 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateMedicineRow(i, "quantity", Number(e.target.value))}
                    className="bill-input w-full sm:w-24 border border-black/10 rounded-xl px-4 py-2.5 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    min="0"
                    value={item.price}
                    onChange={(e) => updateMedicineRow(i, "price", Number(e.target.value))}
                    className="bill-input w-full sm:w-28 border border-black/10 rounded-xl px-4 py-2.5 text-sm"
                  />
                  {medicineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicineRow(i)}
                      className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg transition-colors duration-200"
                      style={{ backgroundColor: TONES.accent.soft, color: TONES.accent.fg }}
                      aria-label="Remove medicine row"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-1">
            <button
              type="button"
              onClick={addMedicineRow}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: TONES.primary.soft, color: TONES.primary.fg }}
            >
              <FaPlus className="text-xs" />
              Add Medicine
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 text-white font-medium rounded-xl px-4 py-2.5 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 disabled:hover:translate-y-0"
              style={{ backgroundColor: TONES.primary.fg }}
            >
              <FaFileInvoiceDollar className={submitting ? "animate-pulse" : ""} />
              {submitting ? "Generating..." : "Generate Bill (Room + Doctor + Medicine)"}
            </button>
          </div>
        </form>
      </div>

      {/* ---------------- All Bills ---------------- */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 opacity-0"
        style={{ animation: "fadeSlideUp 0.5s ease-out forwards", animationDelay: "120ms" }}
      >
        <h3 className="font-semibold mb-4" style={{ color: "#123331" }}>
          All Bills
        </h3>

        {bills && bills.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-14 text-center opacity-0"
            style={{ animation: "popIn 0.4s ease-out forwards" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3"
              style={{ backgroundColor: TONES.primary.soft, color: TONES.primary.fg }}
            >
              <FaFileInvoiceDollar />
            </div>
            <p className="font-medium" style={{ color: "#123331" }}>
              No bills yet
            </p>
            <p className="text-sm text-[#6B8280] mt-1">
              Generate a bill for an admitted patient above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6B8280] border-b border-black/5">
                  <th className="pb-3 pr-4 font-semibold">Patient</th>
                  <th className="pb-3 pr-4 font-semibold">Room Bill</th>
                  <th className="pb-3 pr-4 font-semibold">Doctor Bill</th>
                  <th className="pb-3 pr-4 font-semibold">Medicine Bill</th>
                  <th className="pb-3 pr-4 font-semibold">Total</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {bills === null
                  ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} delay={i * 60} />)
                  : bills.map((b, i) => (
                      <tr
                        key={b._id}
                        className="bill-row border-b border-black/5 last:border-0 opacity-0"
                        style={{ animation: "fadeSlideUp 0.4s ease-out forwards", animationDelay: `${i * 50}ms` }}
                      >
                        <td className="py-3.5 pr-4 font-semibold whitespace-nowrap" style={{ color: "#123331" }}>
                          {b.patient?.name || "—"}
                        </td>
                        <td className="py-3.5 pr-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          ₹{b.roomBill}
                        </td>
                        <td className="py-3.5 pr-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          ₹{b.doctorBill}
                        </td>
                        <td className="py-3.5 pr-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          ₹{b.medicineBill}
                        </td>
                        <td className="py-3.5 pr-4 font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#123331" }}>
                          ₹{b.totalAmount}
                        </td>
                        <td className="py-3.5 pr-4">
                          <StatusBadge status={b.paymentStatus} />
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex flex-col sm:flex-row gap-1.5 justify-end">
                            {b.paymentStatus === "pending" && (
                              <button
                                onClick={() => handlePay(b._id)}
                                disabled={payingId === b._id}
                                className="inline-flex items-center justify-center gap-1.5 text-white text-xs font-medium rounded-lg px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
                                style={{ backgroundColor: TONES.success.fg }}
                              >
                                <FaMoneyBillWave />
                                {payingId === b._id ? "Processing..." : "Pay Bill"}
                              </button>
                            )}
                            <button
                              onClick={() => handleDownloadPDF(b)}
                              className="inline-flex items-center justify-center gap-1.5 text-xs font-medium rounded-lg px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                              style={{ backgroundColor: TONES.primary.soft, color: TONES.primary.fg }}
                            >
                              <FaFileDownload />
                              PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
