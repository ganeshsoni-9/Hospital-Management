import React from "react";
import {
  FaBullseye,
  FaEye,
  FaUserMd,
  FaUserInjured,
  FaBed,
  FaFileInvoiceDollar,
  FaChartBar,
  FaLock,
  FaHospital,
  FaPrescriptionBottleAlt,
  FaHandHoldingMedical,
  FaClock,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaDirections,
} from "react-icons/fa";

/* ------------------------------------------------------------------ */
/*  Same design system as Dashboard.jsx / Rooms.jsx / Doctors.jsx /    */
/*  Patients.jsx / Billing.jsx / Reports.jsx — keep all seven in      */
/*  sync. Add this to index.html <head> for the exact fonts           */
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

const FEATURES = [
  { label: "Doctor Management", icon: <FaUserMd />, tone: "primary" },
  { label: "Patient Management", icon: <FaUserInjured />, tone: "accent" },
  { label: "Room Allocation", icon: <FaBed />, tone: "primary" },
  { label: "Billing System", icon: <FaFileInvoiceDollar />, tone: "success" },
  { label: "Reports & Analytics", icon: <FaChartBar />, tone: "primary" },
  { label: "Secure Staff Login", icon: <FaLock />, tone: "accent" },
  { label: "Medicine & Pharmacy Store", icon: <FaPrescriptionBottleAlt />, tone: "success" },
];

const WHY_US = [
  {
    label: "Patient-First Care",
    desc: "Every workflow, from admission to discharge, is built around making the patient's experience smoother.",
    icon: <FaHandHoldingMedical />,
    tone: "accent",
  },
  {
    label: "Fast & Organized",
    desc: "Rooms, doctors, and billing stay in sync in real time, so staff spend less time on paperwork.",
    icon: <FaClock />,
    tone: "primary",
  },
  {
    label: "Secure by Design",
    desc: "Staff logins, records, and billing data are protected, with access limited to verified hospital staff.",
    icon: <FaShieldAlt />,
    tone: "success",
  },
];

const TECH_STACK = ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "JWT Authentication", "REST API"];

// Update this once with the store's real address/coordinates if they change.
const ADDRESS_LINE_1 = "Outside Bissau Gate, Bissau Road";
const ADDRESS_LINE_2 = "Ramgarh Shekhawati, Rajasthan";
const MAPS_QUERY = "Bissau Gate, Bissau Road, Ramgarh Shekhawati, Rajasthan";
const MAPS_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&output=embed`;
const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAPS_QUERY)}`;

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10" style={{ background: "#F6FAF9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');

        * { font-family: 'Inter', sans-serif; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes drawLine {
          from { width: 0; }
          to   { width: 56px; }
        }
        .about-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .about-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(18, 51, 49, 0.08);
        }
        .feature-tile {
          transition: transform 0.2s ease, background-color 0.2s ease;
        }
        .feature-tile:hover {
          transform: translateX(3px);
        }
        .map-frame {
          filter: grayscale(8%) contrast(1.02);
          transition: filter 0.3s ease;
        }
        .map-frame:hover {
          filter: grayscale(0%);
        }
        .directions-btn {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .directions-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(14, 92, 86, 0.25);
        }
          /* ================= Loader Line ================= */

.loader-line {
  position: relative;
  width: 70px;
  height: 3px;
  background: rgba(232, 93, 74, 0.2);
  border-radius: 999px;
  overflow: hidden;
}

.loader-line::before {
  content: "";
  position: absolute;
  left: -40%;
  top: 0;
  width: 40%;
  height: 100%;
  background: #E85D4A;
  border-radius: 999px;
  animation: loadingLine 1.3s ease-in-out infinite;
}

@keyframes loadingLine {
  0% {
    left: -40%;
  }

  100% {
    left: 100%;
  }
}
      `}</style>

      <div
        className="bg-white shadow-sm rounded-2xl border border-black/5 p-8 sm:p-10 opacity-0"
        style={{ animation: "fadeSlideUp 0.5s ease-out forwards" }}
      >
        {/* ---------------- Header ---------------- */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0"
            style={{ backgroundColor: TONES.primary.soft, color: TONES.primary.fg }}
          >
            <FaHospital />
          </div>
          <div>
            <h1
              className="text-3xl sm:text-4xl"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, color: "#123331" }}
            >
              About VMS
            </h1>
            <p className="text-sm font-medium" style={{ color: TONES.primary.fg }}>
              Vikas Medical Store — Hospital Management System
            </p>
          </div>
        </div>
        <div className="loader-line mb-6"></div>

        <p className="text-[#4A5A58] leading-7 mb-4 max-w-3xl">
          VMS (Vikas Medical Store) is a web-based hospital management system built to simplify
          and digitize day-to-day operations for our facility in Ramgarh Shekhawati. It brings
          patients, doctors, rooms, billing, and reports together on a single platform, so staff
          spend less time juggling registers and paper files and more time looking after patients.
        </p>

        <p className="text-[#4A5A58] leading-7 mb-8 max-w-3xl">
          What started as a neighbourhood medical store has grown into a facility that also
          admits and cares for patients — which is why VMS is built to handle both sides of that
          work: the pharmacy and consultation side, and the full admission-to-discharge hospital
          workflow. Every screen in this system, from adding a new patient to generating a final
          bill, is designed to be quick enough to use during a busy shift and clear enough that
          nothing gets missed.
        </p>

        {/* ---------------- Mission / Vision ---------------- */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <div
            className="about-card rounded-xl border border-black/5 p-6 opacity-0"
            style={{ animation: "fadeSlideUp 0.45s ease-out forwards", animationDelay: "120ms" }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: TONES.accent.soft, color: TONES.accent.fg }}
              >
                <FaBullseye />
              </span>
              <h2 className="text-lg font-semibold" style={{ color: "#123331" }}>
                Our Mission
              </h2>
            </div>
            <p className="text-[#6B8280] text-sm leading-6">
              To provide a secure, efficient, and user-friendly hospital management solution
              for Vikas Medical Store that improves patient care and reduces manual paperwork —
              so every admission, consultation, and bill is handled correctly the first time.
            </p>
          </div>

          <div
            className="about-card rounded-xl border border-black/5 p-6 opacity-0"
            style={{ animation: "fadeSlideUp 0.45s ease-out forwards", animationDelay: "180ms" }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: TONES.primary.soft, color: TONES.primary.fg }}
              >
                <FaEye />
              </span>
              <h2 className="text-lg font-semibold" style={{ color: "#123331" }}>
                Our Vision
              </h2>
            </div>
            <p className="text-[#6B8280] text-sm leading-6">
              To grow VMS into a smart digital healthcare platform that enables fast, reliable,
              and transparent hospital management — for the Ramgarh Shekhawati community and
              everyone else it serves in the years ahead.
            </p>
          </div>
        </div>

        {/* ---------------- Why Choose Us ---------------- */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4" style={{ color: "#123331" }}>
            Why Choose VMS
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {WHY_US.map((w, i) => {
              const t = TONES[w.tone];
              return (
                <div
                  key={w.label}
                  className="about-card rounded-xl border border-black/5 p-5 opacity-0"
                  style={{ animation: "fadeSlideUp 0.4s ease-out forwards", animationDelay: `${260 + i * 80}ms` }}
                >
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm mb-3"
                    style={{ backgroundColor: t.soft, color: t.fg }}
                  >
                    {w.icon}
                  </span>
                  <p className="font-semibold text-sm mb-1.5" style={{ color: "#123331" }}>
                    {w.label}
                  </p>
                  <p className="text-xs text-[#6B8280] leading-5">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------------- Key Features ---------------- */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4" style={{ color: "#123331" }}>
            Key Features
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map((f, i) => {
              const t = TONES[f.tone];
              return (
                <div
                  key={f.label}
                  className="feature-tile flex items-center gap-3 rounded-xl border border-black/5 px-4 py-3.5 opacity-0"
                  style={{
                    backgroundColor: "#F9FBFA",
                    animation: "fadeSlideUp 0.4s ease-out forwards",
                    animationDelay: `${520 + i * 60}ms`,
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                    style={{ backgroundColor: t.soft, color: t.fg }}
                  >
                    {f.icon}
                  </span>
                  <span className="text-sm font-medium" style={{ color: "#123331" }}>
                    {f.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        
        {/* ---------------- Location ---------------- */}
        <div
          className="mb-10 opacity-0"
          style={{ animation: "fadeSlideUp 0.45s ease-out forwards", animationDelay: "1040ms" }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: "#123331" }}>
            Visit Us
          </h2>

          <div className="grid md:grid-cols-5 gap-5">
            {/* Address card */}
            <div className="md:col-span-2 about-card rounded-xl border border-black/5 p-6 flex flex-col">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-base mb-3"
                style={{ backgroundColor: TONES.accent.soft, color: TONES.accent.fg }}
              >
                <FaMapMarkerAlt />
              </span>
              <p className="font-semibold text-sm mb-1" style={{ color: "#123331" }}>
                Vikas Medical Store
              </p>
              <p className="text-sm text-[#6B8280] leading-6">
                {ADDRESS_LINE_1}
                <br />
                {ADDRESS_LINE_2}
              </p>

              <a
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="directions-btn mt-5 inline-flex items-center justify-center gap-2 text-white text-sm font-medium rounded-xl px-4 py-2.5"
                style={{ backgroundColor: TONES.primary.fg, width: "fit-content" }}
              >
                <FaDirections />
                Get Directions
              </a>
            </div>

            {/* Map embed */}
            <div className="md:col-span-3 rounded-xl overflow-hidden border border-black/5">
              <iframe
                title="VMS Location Map"
                className="map-frame w-full h-full min-h-[260px]"
                src={MAPS_EMBED_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* ---------------- Footer ---------------- */}
        <div
          className="mt-10 text-center opacity-0"
          style={{ animation: "fadeIn 0.5s ease-out forwards", animationDelay: "1100ms" }}
        >
          <h2
            className="text-2xl"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, color: TONES.primary.fg }}
          >
            Vikas Medical Store
          </h2>
          <p className="text-[#6B8280] mt-2 text-sm">
            Making healthcare management simple, secure & efficient.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
