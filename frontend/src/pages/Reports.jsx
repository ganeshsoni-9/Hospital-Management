import { useEffect, useState } from "react";
import {
  FaUserInjured,
  FaProcedures,
  FaWalking,
  FaBed,
  FaUserMd,
  FaRupeeSign,
  FaHourglassHalf,
  FaClipboardList,
} from "react-icons/fa";
import api from "../services/api.js";

/* ------------------------------------------------------------------ */
/*  Same design system as Dashboard.jsx / Rooms.jsx / Doctors.jsx /    */
/*  Patients.jsx / Billing.jsx — keep all six in sync. Add this to    */
/*  index.html <head> for the exact fonts (optional, a @import        */
/*  fallback below covers it too):                                    */
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

const AVATAR_TONES = [TONES.primary, TONES.success, TONES.accent];
const toneForName = (name = "") => {
  const code = name.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return AVATAR_TONES[code % AVATAR_TONES.length];
};
const initialsFor = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

// Count-up animation for the summary numbers
const AnimatedNumber = ({ value, currency }) => {
  const [display, setDisplay] = useState(0);
  const isNumeric = typeof value === "number";

  useEffect(() => {
    if (!isNumeric) return;
    let raf;
    let start = null;
    const duration = 800;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, isNumeric]);

  if (!isNumeric) return <>{value}</>;
  return <>{currency ? `₹${display.toLocaleString("en-IN")}` : display.toLocaleString("en-IN")}</>;
};

const SummaryTile = ({ label, value, icon, tone, currency, sub, delay }) => {
  const t = TONES[tone] || TONES.primary;
  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-black/5 p-4 opacity-0"
      style={{ animation: "fadeSlideUp 0.45s ease-out forwards", animationDelay: `${delay}ms` }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-base flex-shrink-0"
        style={{ backgroundColor: t.soft, color: t.fg }}
      >
        {icon}
      </div>
      <div>
        <p
          className="text-xl font-bold leading-tight"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: "#123331" }}
        >
          <AnimatedNumber value={value} currency={currency} />
        </p>
        <p className="text-xs text-[#6B8280]">
          {label}
          {sub && <span className="ml-1">{sub}</span>}
        </p>
      </div>
    </div>
  );
};

const SkeletonTile = ({ delay }) => (
  <div
    className="rounded-xl h-[68px] opacity-0"
    style={{
      background: "linear-gradient(90deg, #EEF4F3 25%, #F7FAFA 37%, #EEF4F3 63%)",
      backgroundSize: "400px 100%",
      animation: `fadeSlideUp 0.4s ease-out forwards, shimmer 1.4s ease-in-out infinite`,
      animationDelay: `${delay}ms, 0ms`,
    }}
  />
);

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

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [discharged, setDischarged] = useState(null); // null = still loading

  useEffect(() => {
    api.get("/reports/summary").then((res) => setSummary(res.data));
    api.get("/reports/discharged").then((res) => setDischarged(res.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6" style={{ background: "#F6FAF9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');

        * { font-family: 'Inter', sans-serif; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
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
        .report-row:hover {
          background-color: #F6FAF9;
        }
      `}</style>

      {/* ---------------- Page Header ---------------- */}
      <div className="mb-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
        <h2
          className="text-3xl"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: "#123331" }}
        >
          Reports
        </h2>
        <p className="text-[#6B8280] mt-1 text-sm">
          A snapshot of hospital activity, and every patient discharged so far.
        </p>
      </div>

      {/* ---------------- Summary ---------------- */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 mb-6 opacity-0"
        style={{ animation: "fadeSlideUp 0.5s ease-out forwards" }}
      >
        <h3 className="font-semibold mb-4" style={{ color: "#123331" }}>
          Summary
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {!summary
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonTile key={i} delay={i * 60} />)
            : [
                { label: "Total Patients", value: summary.totalPatients, icon: <FaUserInjured />, tone: "primary" },
                { label: "Admitted", value: summary.admittedPatients, icon: <FaProcedures />, tone: "accent" },
                { label: "Discharged", value: summary.dischargedPatients, icon: <FaWalking />, tone: "success" },
                {
                  label: "Rooms",
                  value: summary.totalRooms,
                  icon: <FaBed />,
                  tone: "primary",
                  sub: `(${summary.occupiedRooms} occupied · ${summary.availableRooms} free)`,
                },
                { label: "Total Doctors", value: summary.totalDoctors, icon: <FaUserMd />, tone: "primary" },
                { label: "Revenue Collected", value: summary.totalRevenue, currency: true, icon: <FaRupeeSign />, tone: "success" },
                { label: "Pending Revenue", value: summary.pendingRevenue, currency: true, icon: <FaHourglassHalf />, tone: "accent" },
              ].map((s, i) => <SummaryTile key={s.label} {...s} delay={i * 60} />)}
        </div>
      </div>

      {/* ---------------- Discharged Patients ---------------- */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 opacity-0"
        style={{ animation: "fadeSlideUp 0.5s ease-out forwards", animationDelay: "160ms" }}
      >
        <h3 className="font-semibold mb-4" style={{ color: "#123331" }}>
          Discharged Patients
        </h3>

        {discharged && discharged.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-14 text-center opacity-0"
            style={{ animation: "popIn 0.4s ease-out forwards" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3"
              style={{ backgroundColor: TONES.primary.soft, color: TONES.primary.fg }}
            >
              <FaClipboardList />
            </div>
            <p className="font-medium" style={{ color: "#123331" }}>
              No discharges yet
            </p>
            <p className="text-sm text-[#6B8280] mt-1">
              Discharged patients will show up here once they're released.
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
                  <th className="pb-3 pr-4 font-semibold">Admission</th>
                  <th className="pb-3 font-semibold">Discharge</th>
                </tr>
              </thead>
              <tbody>
                {discharged === null
                  ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} delay={i * 60} />)
                  : discharged.map((p, i) => {
                      const tone = toneForName(p.name);
                      return (
                        <tr
                          key={p._id}
                          className="report-row border-b border-black/5 last:border-0"
                          style={{ animation: "fadeSlideUp 0.4s ease-out forwards", animationDelay: `${i * 50}ms`, opacity: 0 }}
                        >
                          <td className="py-3.5 pr-4">
                            <div className="flex items-center gap-2.5">
                              <span
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                                style={{ backgroundColor: tone.soft, color: tone.fg }}
                              >
                                {initialsFor(p.name)}
                              </span>
                              <span className="font-semibold whitespace-nowrap" style={{ color: "#123331" }}>
                                {p.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 pr-4 whitespace-nowrap">
                            {p.room?.roomNumber || <span className="text-[#B9C4C2]">—</span>}
                          </td>
                          <td className="py-3.5 pr-4 whitespace-nowrap">
                            {p.doctor?.name || <span className="text-[#B9C4C2]">—</span>}
                          </td>
                          <td className="py-3.5 pr-4 whitespace-nowrap text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            {new Date(p.admissionDate).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 whitespace-nowrap text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            {new Date(p.dischargeDate).toLocaleDateString()}
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

export default Reports;
