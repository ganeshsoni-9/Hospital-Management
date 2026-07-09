import { useEffect, useState } from "react";
import { FaUserMd, FaPlus, FaTrash, FaPhoneAlt, FaGraduationCap } from "react-icons/fa";
import api from "../services/api.js";

/* ------------------------------------------------------------------ */
/*  Same design system as Dashboard.jsx / Rooms.jsx — keep all three  */
/*  in sync. Add this to index.html <head> for the exact fonts        */
/*  (optional, a @import fallback below covers it too):                */
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

// Deterministic initials avatar tint — same doctor always gets the same
// shade, so the color carries identity rather than being random noise
const AVATAR_TONES = [TONES.primary, TONES.success, TONES.accent];
const toneForName = (name = "") => {
  const code = name.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return AVATAR_TONES[code % AVATAR_TONES.length];
};
const initialsFor = (name = "") =>
  name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const SkeletonRow = ({ delay }) => (
  <tr className="opacity-0" style={{ animation: "fadeSlideUp 0.4s ease-out forwards", animationDelay: `${delay}ms` }}>
    <td colSpan={4} className="py-3">
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

const Doctors = () => {
  const [doctors, setDoctors] = useState(null); // null = still loading
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    qualification: "",
    phone: "",
    consultationFee: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const loadDoctors = () => api.get("/doctors").then((res) => setDoctors(res.data));

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/doctors", form);
      setForm({ name: "", specialization: "", qualification: "", phone: "", consultationFee: "" });
      await loadDoctors();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setRemovingId(id);
    setTimeout(async () => {
      await api.delete(`/doctors/${id}`);
      setRemovingId(null);
      loadDoctors();
    }, 260);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6" style={{ background: "#F6FAF9" }}>
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
        .doc-input {
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .doc-input:focus {
          outline: none;
          border-color: #0E5C56;
          box-shadow: 0 0 0 3px rgba(14, 92, 86, 0.12);
        }
        .doc-row:hover {
          background-color: #F6FAF9;
        }
        .doc-avatar {
          transition: transform 0.2s ease;
        }
        .doc-row:hover .doc-avatar {
          transform: scale(1.08);
        }
      `}</style>

      {/* ---------------- Page Header ---------------- */}
      <div className="mb-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
        <h2
          className="text-3xl"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: "#123331" }}
        >
          Doctors
        </h2>
        <p className="text-[#6B8280] mt-1 text-sm">
          Add doctors and manage your hospital's consulting staff.
        </p>
      </div>

      {/* ---------------- Add Doctor ---------------- */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 mb-6 opacity-0"
        style={{ animation: "fadeSlideUp 0.5s ease-out forwards" }}
      >
        <h3 className="font-semibold mb-4" style={{ color: "#123331" }}>
          Add Doctor
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="doc-input border border-black/10 rounded-xl px-4 py-2.5 text-sm"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="doc-input border border-black/10 rounded-xl px-4 py-2.5 text-sm"
            placeholder="Specialization"
            required
            value={form.specialization}
            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
          />

          <input
            className="doc-input border border-black/10 rounded-xl px-4 py-2.5 text-sm"
            placeholder="Qualification"
            value={form.qualification}
            onChange={(e) => setForm({ ...form, qualification: e.target.value })}
          />

          <input
            className="doc-input border border-black/10 rounded-xl px-4 py-2.5 text-sm"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            className="doc-input border border-black/10 rounded-xl px-4 py-2.5 text-sm sm:col-span-1"
            placeholder="Consultation Fee"
            type="number"
            required
            value={form.consultationFee}
            onChange={(e) => setForm({ ...form, consultationFee: e.target.value })}
          />

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 text-white font-medium rounded-xl px-4 py-2.5 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 disabled:hover:translate-y-0"
            style={{ backgroundColor: TONES.primary.fg }}
          >
            <FaPlus className={submitting ? "animate-spin" : ""} />
            {submitting ? "Adding..." : "Add Doctor"}
          </button>
        </form>
      </div>

      {/* ---------------- All Doctors ---------------- */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 opacity-0"
        style={{ animation: "fadeSlideUp 0.5s ease-out forwards", animationDelay: "120ms" }}
      >
        <h3 className="font-semibold mb-4" style={{ color: "#123331" }}>
          All Doctors
        </h3>

        {doctors && doctors.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-14 text-center opacity-0"
            style={{ animation: "popIn 0.4s ease-out forwards" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3"
              style={{ backgroundColor: TONES.primary.soft, color: TONES.primary.fg }}
            >
              <FaUserMd />
            </div>
            <p className="font-medium" style={{ color: "#123331" }}>
              No doctors yet
            </p>
            <p className="text-sm text-[#6B8280] mt-1">
              Add your first doctor using the form above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6B8280] border-b border-black/5">
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Specialization</th>
                  <th className="pb-3 font-semibold">Fee</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {doctors === null
                  ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} delay={i * 60} />)
                  : doctors.map((d, i) => {
                      const isRemoving = removingId === d._id;
                      const tone = toneForName(d.name);
                      return (
                        <tr
                          key={d._id}
                          className="doc-row border-b border-black/5 last:border-0 opacity-0"
                          style={{
                            animation: isRemoving
                              ? "fadeOutRow 0.26s ease-in forwards"
                              : "fadeSlideUp 0.4s ease-out forwards",
                            animationDelay: isRemoving ? "0ms" : `${i * 50}ms`,
                          }}
                        >
                          <td className="py-3.5">
                            <div className="flex items-center gap-3">
                              <span
                                className="doc-avatar w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                style={{ backgroundColor: tone.soft, color: tone.fg }}
                              >
                                {initialsFor(d.name) || <FaUserMd />}
                              </span>
                              <div>
                                <p className="font-semibold" style={{ color: "#123331" }}>
                                  {d.name}
                                </p>
                                {d.qualification && (
                                  <p className="text-xs text-[#6B8280] flex items-center gap-1 mt-0.5">
                                    <FaGraduationCap className="text-[10px]" />
                                    {d.qualification}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5">
                            <span
                              className="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
                              style={{ backgroundColor: TONES.primary.soft, color: TONES.primary.fg }}
                            >
                              {d.specialization}
                            </span>
                            {d.phone && (
                              <p className="text-xs text-[#6B8280] flex items-center gap-1 mt-1.5">
                                <FaPhoneAlt className="text-[10px]" />
                                {d.phone}
                              </p>
                            )}
                          </td>
                          <td className="py-3.5 font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            ₹{d.consultationFee}
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => handleDelete(d._id)}
                              className="inline-flex items-center gap-1.5 text-white text-xs font-medium rounded-lg px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                              style={{ backgroundColor: TONES.accent.fg }}
                            >
                              <FaTrash />
                              Delete
                            </button>
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

export default Doctors;
