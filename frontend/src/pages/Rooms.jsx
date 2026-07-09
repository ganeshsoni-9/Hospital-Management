import { useEffect, useState } from "react";
import { FaBed, FaHospitalUser, FaHouseUser, FaDoorOpen, FaTrash, FaPlus } from "react-icons/fa";
import api from "../services/api.js";

/* ------------------------------------------------------------------ */
/*  Same design system as Dashboard.jsx — keep the two in sync.       */
/*  Add this to index.html <head> for the exact fonts (optional,      */
/*  a @import fallback below covers it too):                          */
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

// Room type → icon + tone, so the icon itself carries meaning
// (ICU is the highest-acuity room, so it gets the "attention" tone)
const TYPE_META = {
  General: { icon: <FaBed />, tone: "primary" },
  "Semi-Private": { icon: <FaDoorOpen />, tone: "primary" },
  Private: { icon: <FaHouseUser />, tone: "success" },
  ICU: { icon: <FaHospitalUser />, tone: "accent" },
};

const StatusBadge = ({ status }) => {
  const isAvailable = status === "available";
  const t = isAvailable ? TONES.success : TONES.accent;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: t.soft, color: t.fg }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          backgroundColor: t.fg,
          animation: isAvailable ? "none" : "pulseDot 1.6s ease-in-out infinite",
        }}
      />
      {status}
    </span>
  );
};

const SkeletonRow = ({ delay }) => (
  <tr className="opacity-0" style={{ animation: "fadeSlideUp 0.4s ease-out forwards", animationDelay: `${delay}ms` }}>
    <td colSpan={5} className="py-3">
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

const Rooms = () => {
  const [rooms, setRooms] = useState(null); // null = still loading
  const [form, setForm] = useState({ roomNumber: "", type: "General", pricePerDay: "" });
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const loadRooms = () => api.get("/rooms").then((res) => setRooms(res.data));

  useEffect(() => {
    loadRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/rooms", form);
      setForm({ roomNumber: "", type: "General", pricePerDay: "" });
      await loadRooms();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    // fade the row out, then actually delete once the animation finishes
    setRemovingId(id);
    setTimeout(async () => {
      await api.delete(`/rooms/${id}`);
      setRemovingId(null);
      loadRooms();
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
        .room-input {
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .room-input:focus {
          outline: none;
          border-color: #0E5C56;
          box-shadow: 0 0 0 3px rgba(14, 92, 86, 0.12);
        }
        .room-row:hover {
          background-color: #F6FAF9;
        }
      `}</style>

      {/* ---------------- Page Header ---------------- */}
      <div className="mb-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
        <h2
          className="text-3xl"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: "#123331" }}
        >
          Rooms
        </h2>
        <p className="text-[#6B8280] mt-1 text-sm">
          Add new rooms and manage availability across the hospital.
        </p>
      </div>

      {/* ---------------- Add Room ---------------- */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 mb-6 opacity-0"
        style={{ animation: "fadeSlideUp 0.5s ease-out forwards" }}
      >
        <h3 className="font-semibold mb-4" style={{ color: "#123331" }}>
          Add Room
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="room-input border border-black/10 rounded-xl px-4 py-2.5 text-sm"
            placeholder="Room Number"
            required
            value={form.roomNumber}
            onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
          />

          <select
            className="room-input border border-black/10 rounded-xl px-4 py-2.5 text-sm bg-white"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option>General</option>
            <option>Semi-Private</option>
            <option>Private</option>
            <option>ICU</option>
            <option>Semi-ICU</option>
          </select>

          <input
            className="room-input border border-black/10 rounded-xl px-4 py-2.5 text-sm"
            placeholder="Price per day"
            type="number"
            required
            value={form.pricePerDay}
            onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
          />

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 text-white font-medium rounded-xl px-4 py-2.5 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 disabled:hover:translate-y-0"
            style={{ backgroundColor: TONES.primary.fg }}
          >
            <FaPlus className={submitting ? "animate-spin" : ""} />
            {submitting ? "Adding..." : "Add Room"}
          </button>
        </form>
      </div>

      {/* ---------------- All Rooms ---------------- */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 opacity-0"
        style={{ animation: "fadeSlideUp 0.5s ease-out forwards", animationDelay: "120ms" }}
      >
        <h3 className="font-semibold mb-4" style={{ color: "#123331" }}>
          All Rooms
        </h3>

        {rooms && rooms.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-14 text-center opacity-0"
            style={{ animation: "popIn 0.4s ease-out forwards" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3"
              style={{ backgroundColor: TONES.primary.soft, color: TONES.primary.fg }}
            >
              <FaBed />
            </div>
            <p className="font-medium" style={{ color: "#123331" }}>
              No rooms yet
            </p>
            <p className="text-sm text-[#6B8280] mt-1">
              Add your first room using the form above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6B8280] border-b border-black/5">
                  <th className="pb-3 font-semibold">Room No.</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Price/Day</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {rooms === null
                  ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} delay={i * 60} />)
                  : rooms.map((r, i) => {
                      const meta = TYPE_META[r.type] || TYPE_META.General;
                      const isRemoving = removingId === r._id;
                      return (
                        <tr
                          key={r._id}
                          className="room-row border-b border-black/5 last:border-0 opacity-0"
                          style={{
                            animation: isRemoving
                              ? "fadeOutRow 0.26s ease-in forwards"
                              : "fadeSlideUp 0.4s ease-out forwards",
                            animationDelay: isRemoving ? "0ms" : `${i * 50}ms`,
                          }}
                        >
                          <td className="py-3.5 font-semibold" style={{ color: "#123331", fontFamily: "'JetBrains Mono', monospace" }}>
                            {r.roomNumber}
                          </td>
                          <td className="py-3.5">
                            <span className="inline-flex items-center gap-2">
                              <span
                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                                style={{ backgroundColor: TONES[meta.tone].soft, color: TONES[meta.tone].fg }}
                              >
                                {meta.icon}
                              </span>
                              {r.type}
                            </span>
                          </td>
                          <td className="py-3.5 font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            ₹{r.pricePerDay}
                          </td>
                          <td className="py-3.5">
                            <StatusBadge status={r.status} />
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => handleDelete(r._id)}
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

export default Rooms;
