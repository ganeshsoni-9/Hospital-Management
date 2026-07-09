import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserInjured,
  FaProcedures,
  FaWalking,
  FaUserMd,
  FaDoorOpen,
  FaDoorClosed,
  FaBed,
  FaRupeeSign,
  FaHourglassHalf,
  FaUserPlus,
  FaStethoscope,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

/* ------------------------------------------------------------------ */
/*  NOTE: for the exact type treatment, add this to your index.html   */
/*  <head>, next to your other <link> tags:                           */
/*                                                                     */
/*  <link rel="preconnect" href="https://fonts.googleapis.com">       */
/*  <link href="https://fonts.googleapis.com/css2?family=Fraunces:    */
/*  opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@     */
/*  400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"  */
/*  rel="stylesheet">                                                 */
/*  (It also works without this — a <style> import below covers it — */
/*  but a real <link> tag loads faster / avoids a flash of fallback   */
/*  fonts.)                                                           */
/* ------------------------------------------------------------------ */

// Semantic color system: 3 tones, each meaning something —
// primary = core count, success = healthy/resolved, accent = needs attention
const TONES = {
  primary: { fg: "#0E5C56", soft: "#E4F3F1", bar: "#0E5C56" },
  success: { fg: "#1F8F63", soft: "#E5F6EE", bar: "#1F8F63" },
  accent: { fg: "#E85D4A", soft: "#FDEAE6", bar: "#E85D4A" },
};

// Animated count-up for numeric stat values
const AnimatedNumber = ({ value, currency }) => {
  const [display, setDisplay] = useState(0);
  const isNumeric = typeof value === "number";

  useEffect(() => {
    if (!isNumeric) return;
    let raf;
    let start = null;
    const duration = 900;
    const from = 0;
    const to = value;

    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, isNumeric]);

  if (!isNumeric) return <>{value}</>;
  return <>{currency ? `₹${display.toLocaleString("en-IN")}` : display.toLocaleString("en-IN")}</>;
};

const StatCard = ({ label, value, icon, tone, currency, delay, urgent }) => {
  const t = TONES[tone] || TONES.primary;

  return (
    <div
      className="relative bg-white rounded-2xl shadow-sm p-5 border border-black/5 overflow-hidden opacity-0"
      style={{
        animation: `fadeSlideUp 0.5s ease-out forwards`,
        animationDelay: `${delay}ms`,
      }}
    >
      {/* left accent bar */}
      <span
        className="absolute left-0 top-0 h-full w-[5px]"
        style={{ backgroundColor: t.bar }}
      />

      <div className="flex items-center justify-between pl-1.5">
        <div>
          <h2
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: "#123331" }}
          >
            <AnimatedNumber value={value} currency={currency} />
          </h2>
          <p className="text-[#6B8280] mt-1 text-sm font-medium">{label}</p>
        </div>

        <div
          className="relative w-11 h-11 flex items-center justify-center rounded-full text-lg transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: t.soft, color: t.fg }}
        >
          {icon}
          {urgent && (
            <span
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
              style={{
                backgroundColor: t.fg,
                animation: "pulseDot 1.6s ease-in-out infinite",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = ({ delay }) => (
  <div
    className="rounded-2xl p-5 border border-black/5 h-[92px] opacity-0"
    style={{
      background:
        "linear-gradient(90deg, #EEF4F3 25%, #F7FAFA 37%, #EEF4F3 63%)",
      backgroundSize: "400px 100%",
      animation: `fadeSlideUp 0.4s ease-out forwards, shimmer 1.4s ease-in-out infinite`,
      animationDelay: `${delay}ms, 0ms`,
    }}
  />
);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const { staff, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const todayDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    if (!staff) {
      setSummary({
        totalPatients: "-",
        admittedPatients: "-",
        dischargedPatients: "-",
        totalDoctors: "-",
        totalRooms: "-",
        occupiedRooms: "-",
        availableRooms: "-",
        totalRevenue: "-",
        pendingRevenue: "-",
      });
      return;
    }

    api
      .get("/reports/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => console.log("Error fetching summary:", err));
  }, [staff]);

  const handleViewPatientDetails = () => {
    if (!staff) {
      alert(
        "Please login/verify your hospital staff account to access patient data."
      );
      navigate("/login");
    } else {
      navigate("/patients");
    }
  };

  const stats = summary
    ? [
        { label: "Total Patients", value: summary.totalPatients, icon: <FaUserInjured />, tone: "primary" },
        { label: "Admitted", value: summary.admittedPatients, icon: <FaProcedures />, tone: "accent", urgent: true },
        { label: "Discharged", value: summary.dischargedPatients, icon: <FaWalking />, tone: "success" },
        { label: "Total Doctors", value: summary.totalDoctors, icon: <FaUserMd />, tone: "primary" },
        { label: "Total Rooms", value: summary.totalRooms, icon: <FaBed />, tone: "primary" },
        { label: "Occupied Rooms", value: summary.occupiedRooms, icon: <FaDoorClosed />, tone: "accent", urgent: true },
        { label: "Available Rooms", value: summary.availableRooms, icon: <FaDoorOpen />, tone: "success" },
        { label: "Revenue Collected", value: summary.totalRevenue, icon: <FaRupeeSign />, tone: "success", currency: true },
        { label: "Pending Revenue", value: summary.pendingRevenue, icon: <FaHourglassHalf />, tone: "accent", currency: true, urgent: true },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6" style={{ background: "#F6FAF9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');

        * { font-family: 'Inter', sans-serif; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.5); opacity: 0.5; }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes ecgFlow {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -240; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* ---------------- Greeting Header ---------------- */}
      <div className="mb-8" style={{ animation: "fadeIn 0.5s ease-out" }}>
        <div className="flex items-center gap-2 text-sm text-[#6B8280]">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: "#1F8F63", animation: "pulseDot 1.8s ease-in-out infinite" }}
          />
          <span>{todayDate}</span>
        </div>

        <h2
          className="text-4xl mt-1"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: "#123331" }}
        >
          {getGreeting()}
          {staff?.user?.name ? `, ${staff.user.name.trim()}` : ""}
        </h2>
        <p className="text-[#6B8280] mt-1">
          Here's what's happening at your hospital today.
        </p>

        {/* signature: ambient ECG line, ties the header to the hospital subject */}
        <svg
          viewBox="0 0 600 32"
          className="w-full h-6 mt-3"
          preserveAspectRatio="none"
        >
          <path
            d="M0 16 H140 L152 4 L164 28 L176 16 H300 L312 4 L324 28 L336 16 H600"
            fill="none"
            stroke="#0E5C56"
            strokeOpacity="0.35"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 6"
            style={{ animation: "ecgFlow 3s linear infinite" }}
          />
        </svg>
      </div>

      {/* ---------------- Summary Cards ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {!summary
          ? Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} delay={i * 60} />
            ))
          : stats.map((s, i) => (
              <StatCard key={s.label} {...s} delay={i * 60} />
            ))}

        {/* Quick Actions Panel */}
        <div
          className="sm:col-span-1 lg:col-span-3 bg-white rounded-2xl shadow-sm p-5 border border-black/5 opacity-0"
          style={{ animation: "fadeSlideUp 0.5s ease-out forwards", animationDelay: "560ms" }}
        >
          <h3 className="font-semibold text-[#123331] mb-3">Quick Actions</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => navigate("/patients")}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: TONES.primary.soft, color: TONES.primary.fg }}
            >
              <FaUserPlus className="text-lg transition-transform duration-200 group-hover:scale-110" />
              <span className="font-medium">Add Patient</span>
            </button>

            <button
              onClick={() => navigate("/doctors")}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: "#E7F0FB", color: "#1D4E89" }}
            >
              <FaStethoscope className="text-lg transition-transform duration-200 group-hover:scale-110" />
              <span className="font-medium">Manage Doctors</span>
            </button>

            <button
              onClick={() => navigate("/billing")}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: TONES.success.soft, color: TONES.success.fg }}
            >
              <FaFileInvoiceDollar className="text-lg transition-transform duration-200 group-hover:scale-110" />
              <span className="font-medium">View Billing</span>
            </button>
          </div>
        </div>
      </div>

      <hr className="my-6 border-black/5" />

      {/* ---------------- Verification Action Block ---------------- */}
      <div
        className="mt-6 bg-white rounded-2xl shadow-sm p-5 border border-black/5 opacity-0"
        style={{ animation: "fadeSlideUp 0.5s ease-out forwards", animationDelay: "620ms" }}
      >
        <h3 className="text-xl font-semibold mb-2" style={{ color: "#123331" }}>
          Patient Records & Information
        </h3>

        <p className="text-[#6B8280] mb-4">
          Click the button below to view or search patient profiles. (Account
          verification required)
        </p>

        <button
          onClick={handleViewPatientDetails}
          className="text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          style={{ backgroundColor: TONES.primary.fg }}
        >
          {staff ? "Access Patient Directory 🔍" : "Verify Account to Access Directory 🔒"}
        </button>
      </div>

      {/* ---------------- Logout ---------------- */}
      {staff && (
        <div className="mt-10 border-t border-black/5 pt-6 flex justify-center">
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-xl font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            style={{ backgroundColor: TONES.accent.fg }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
