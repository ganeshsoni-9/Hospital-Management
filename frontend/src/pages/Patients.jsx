import { useEffect, useState } from "react";
import {
  FaUserPlus,
  FaBed,
  FaUserMd,
  FaSignOutAlt,
  FaFileDownload,
  FaTrash,
  FaPhoneAlt,
} from "react-icons/fa";
import api from "../services/api.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ------------------------------------------------------------------ */
/*  Same design system as Dashboard.jsx / Rooms.jsx / Doctors.jsx —    */
/*  keep all four in sync. Add this to index.html <head> for the      */
/*  exact fonts (optional, a @import fallback below covers it too):    */
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

// admitted = active, still being monitored -> accent (matches "occupied"
// semantics from the Rooms page); anything else = resolved -> success
const AVATAR_TONES = [TONES.primary, TONES.success, TONES.accent];
const toneForName = (name = "") => {
  const code = name.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return AVATAR_TONES[code % AVATAR_TONES.length];
};
const initialsFor = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const StatusBadge = ({ status }) => {
  const isAdmitted = status === "admitted";
  const t = isAdmitted ? TONES.accent : TONES.success;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: t.soft, color: t.fg }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          backgroundColor: t.fg,
          animation: isAdmitted ? "pulseDot 1.6s ease-in-out infinite" : "none",
        }}
      />
      {status}
    </span>
  );
};

const SelectPill = ({ icon, ...props }) => (
  <div className="relative">
    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px]" style={{ color: TONES.primary.fg }}>
      {icon}
    </span>
    <select
      {...props}
      className="patient-select border border-black/10 rounded-lg pl-7 pr-2 py-1.5 text-xs bg-white min-w-[110px]"
    />
  </div>
);

const SkeletonRow = ({ delay }) => (
  <tr className="opacity-0" style={{ animation: "fadeSlideUp 0.4s ease-out forwards", animationDelay: `${delay}ms` }}>
    <td colSpan={9} className="py-3">
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

const Patients = () => {
  const [patients, setPatients] = useState(null); // null = still loading
  const [rooms, setRooms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [form, setForm] = useState({
    name: "", age: "", gender: "Male", contact: "", address: "", disease: "",
  });

  const loadAll = async () => {
    try {
      const patientRes = await api.get("/patients").catch((err) => {
        console.error("Patients fetch api failed:", err);
        return { data: [] };
      });
      const roomRes = await api.get("/rooms/available").catch((err) => {
        console.error("Available rooms fetch failed:", err);
        return { data: [] };
      });
      const doctorRes = await api.get("/doctors").catch((err) => {
        console.error("Doctors fetch failed:", err);
        return { data: [] };
      });

      if (patientRes && patientRes.data) setPatients(patientRes.data);
      if (roomRes && roomRes.data) setRooms(roomRes.data);
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
    setSubmitting(true);
    try {
      await api.post("/patients", form);
      setForm({ name: "", age: "", gender: "Male", contact: "", address: "", disease: "" });
      await loadAll();
    } finally {
      setSubmitting(false);
    }
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

  const handleDeletePatient = async (patient) => {
    const confirmed = window.confirm(
      `Kya aap sach me "${patient.name}" ka poora record delete karna chahte hain? Yeh action wapas nahi ho sakta.`
    );
    if (!confirmed) return;

    setRemovingId(patient._id);
    setTimeout(async () => {
      try {
        await api.delete(`/patients/${patient._id}`);
        loadAll();
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Patient delete karne me error aayi. Console check karein.");
      } finally {
        setRemovingId(null);
      }
    }, 260);
  };

  const getPatientBill = async (patientId) => {
    try {
      const bRes = await api.get("/bills").catch(() => ({ data: [] }));
      const allBills = bRes && bRes.data ? bRes.data : [];
      return allBills.find((b) => b.patient?._id === patientId || b.patient === patientId);
    } catch (err) {
      console.error("Bill fetch failed for summary:", err);
      return null;
    }
  };

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

    autoTable(doc, { startY: 25, head: [["Field", "Details"]], body: rows });
    doc.save(`discharge_summary_${p.name}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6" style={{ background: "#F6FAF9" }}>
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
        .patient-input, .patient-select {
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .patient-input:focus, .patient-select:focus {
          outline: none;
          border-color: #0E5C56;
          box-shadow: 0 0 0 3px rgba(14, 92, 86, 0.12);
        }
        .patient-row:hover {
          background-color: #F6FAF9;
        }
        .action-btn {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.12);
        }
      `}</style>

      {/* ---------------- Page Header ---------------- */}
      <div className="mb-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
        <h2
          className="text-3xl"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: "#123331" }}
        >
          Patients
        </h2>
        <p className="text-[#6B8280] mt-1 text-sm">
          Admit patients, assign rooms and doctors, and manage discharge.
        </p>
      </div>

      {/* ---------------- Add Patient ---------------- */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 mb-6 opacity-0"
        style={{ animation: "fadeSlideUp 0.5s ease-out forwards" }}
      >
        <h3 className="font-semibold mb-4" style={{ color: "#123331" }}>
          Add Patient
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="patient-input border border-black/10 rounded-xl px-4 py-2.5 text-sm"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="patient-input border border-black/10 rounded-xl px-4 py-2.5 text-sm"
            placeholder="Age"
            type="number"
            required
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />
          <select
            className="patient-input border border-black/10 rounded-xl px-4 py-2.5 text-sm bg-white"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input
            className="patient-input border border-black/10 rounded-xl px-4 py-2.5 text-sm"
            placeholder="Contact"
            required
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
          <input
            className="patient-input border border-black/10 rounded-xl px-4 py-2.5 text-sm"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <input
            className="patient-input border border-black/10 rounded-xl px-4 py-2.5 text-sm"
            placeholder="Disease"
            value={form.disease}
            onChange={(e) => setForm({ ...form, disease: e.target.value })}
          />

          <button
            type="submit"
            disabled={submitting}
            className="sm:col-span-2 flex items-center justify-center gap-2 text-white font-medium rounded-xl px-4 py-2.5 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 disabled:hover:translate-y-0"
            style={{ backgroundColor: TONES.primary.fg }}
          >
            <FaUserPlus className={submitting ? "animate-spin" : ""} />
            {submitting ? "Adding..." : "Add Patient"}
          </button>
        </form>
      </div>

      {/* ---------------- All Patients ---------------- */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 opacity-0"
        style={{ animation: "fadeSlideUp 0.5s ease-out forwards", animationDelay: "120ms" }}
      >
        <h3 className="font-semibold mb-4" style={{ color: "#123331" }}>
          All Patients
        </h3>

        {patients && patients.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-14 text-center opacity-0"
            style={{ animation: "popIn 0.4s ease-out forwards" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3"
              style={{ backgroundColor: TONES.primary.soft, color: TONES.primary.fg }}
            >
              <FaUserPlus />
            </div>
            <p className="font-medium" style={{ color: "#123331" }}>
              No patients yet
            </p>
            <p className="text-sm text-[#6B8280] mt-1">
              Add your first patient using the form above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6B8280] border-b border-black/5">
                  <th className="pb-3 pr-4 font-semibold">Name</th>
                  <th className="pb-3 pr-4 font-semibold">Room</th>
                  <th className="pb-3 pr-4 font-semibold">Doctor</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 pr-4 font-semibold">Admission</th>
                  <th className="pb-3 pr-4 font-semibold">Discharge</th>
                  <th className="pb-3 pr-4 font-semibold">Assign Room</th>
                  <th className="pb-3 pr-4 font-semibold">Assign Doctor</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {patients === null
                  ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} delay={i * 60} />)
                  : patients.map((p, i) => {
                      const isRemoving = removingId === p._id;
                      const tone = toneForName(p.name);
                      return (
                        <tr
                          key={p._id}
                          className="patient-row border-b border-black/5 last:border-0 align-top opacity-0"
                          style={{
                            animation: isRemoving
                              ? "fadeOutRow 0.26s ease-in forwards"
                              : "fadeSlideUp 0.4s ease-out forwards",
                            animationDelay: isRemoving ? "0ms" : `${i * 50}ms`,
                          }}
                        >
                          <td className="py-3.5 pr-4">
                            <div className="flex items-center gap-2.5">
                              <span
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                                style={{ backgroundColor: tone.soft, color: tone.fg }}
                              >
                                {initialsFor(p.name)}
                              </span>
                              <div>
                                <p className="font-semibold whitespace-nowrap" style={{ color: "#123331" }}>
                                  {p.name}
                                </p>
                                {p.contact && (
                                  <p className="text-xs text-[#6B8280] flex items-center gap-1 mt-0.5">
                                    <FaPhoneAlt className="text-[9px]" />
                                    {p.contact}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 pr-4 whitespace-nowrap">
                            {p.room ? p.room.roomNumber : <span className="text-[#B9C4C2]">—</span>}
                          </td>
                          <td className="py-3.5 pr-4 whitespace-nowrap">
                            {p.doctor ? p.doctor.name : <span className="text-[#B9C4C2]">—</span>}
                          </td>
                          <td className="py-3.5 pr-4">
                            <StatusBadge status={p.status} />
                          </td>
                          <td className="py-3.5 pr-4 whitespace-nowrap text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            {p.admissionDate ? new Date(p.admissionDate).toLocaleDateString() : "-"}
                          </td>
                          <td className="py-3.5 pr-4 whitespace-nowrap text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            {p.dischargeDate ? new Date(p.dischargeDate).toLocaleDateString() : "-"}
                          </td>
                          <td className="py-3.5 pr-4">
                            <SelectPill
                              icon={<FaBed />}
                              defaultValue=""
                              onChange={(e) => handleAssignRoom(p._id, e.target.value)}
                            >
                              <option value="">Select room</option>
                              {rooms.map((r) => (
                                <option key={r._id} value={r._id}>{r.roomNumber}</option>
                              ))}
                            </SelectPill>
                          </td>
                          <td className="py-3.5 pr-4">
                            <SelectPill
                              icon={<FaUserMd />}
                              defaultValue=""
                              onChange={(e) => handleAssignDoctor(p._id, e.target.value)}
                            >
                              <option value="">Select doctor</option>
                              {doctors.map((d) => (
                                <option key={d._id} value={d._id}>{d.name}</option>
                              ))}
                            </SelectPill>
                          </td>
                          <td className="py-3.5">
                            <div className="flex flex-col gap-1.5 items-stretch min-w-[130px]">
                              {p.status === "admitted" && (
                                <button
                                  onClick={() => handleDischarge(p._id)}
                                  className="action-btn inline-flex items-center justify-center gap-1.5 text-white text-xs font-medium rounded-lg px-3 py-2"
                                  style={{ backgroundColor: TONES.primary.fg }}
                                >
                                  <FaSignOutAlt />
                                  Discharge
                                </button>
                              )}
                              {p.status !== "admitted" && (
                                <button
                                  onClick={() => handleDownloadSummary(p)}
                                  className="action-btn inline-flex items-center justify-center gap-1.5 text-xs font-medium rounded-lg px-3 py-2"
                                  style={{ backgroundColor: TONES.primary.soft, color: TONES.primary.fg }}
                                >
                                  <FaFileDownload />
                                  Summary
                                </button>
                              )}
                              <button
                                onClick={() => handleDeletePatient(p)}
                                className="action-btn inline-flex items-center justify-center gap-1.5 text-white text-xs font-medium rounded-lg px-3 py-2"
                                style={{ backgroundColor: TONES.accent.fg }}
                              >
                                <FaTrash />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
