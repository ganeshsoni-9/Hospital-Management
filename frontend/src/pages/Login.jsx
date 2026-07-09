import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaPaperPlane,
  FaHospital,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

/* ------------------------------------------------------------------ */
/*  ROYAL VARIANT — deep emerald + antique gold, used only on the     */
/*  Login/Register screen. Every other page keeps the teal/coral/     */
/*  green system from Dashboard.jsx etc.                              */
/*                                                                     */
/*  Add this to index.html <head> for the exact fonts (optional, a    */
/*  @import fallback below covers it too):                            */
/*                                                                     */
/*  <link href="https://fonts.googleapis.com/css2?family=Fraunces:    */
/*  opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@     */
/*  400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"  */
/*  rel="stylesheet">                                                 */
/*                                                                     */
/*  NOTE: this page resets button background/border inline, because   */
/*  a global `button { ... }` rule elsewhere in the app was bleeding  */
/*  blue styling onto the tabs and the password-eye toggle.           */
/* ------------------------------------------------------------------ */

const ROYAL = {
  emerald: "#0B4A42",
  emeraldDeep: "#083530",
  gold: "#B8892B",
  goldSoft: "#F4E9D2",
  ivory: "#FBF8F1",
  ink: "#1C2C29",
  muted: "#7C8B85",
  errorFg: "#9B4030",
  errorSoft: "#F6E7E2",
};

const Login = () => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const switchTab = (toLogin) => {
    setIsLoginTab(toLogin);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      if (isLoginTab) {
        const data = await login(formData.email, formData.password);
        if (data) {
          navigate("/");
        }
      } else {
        const { data } = await api.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        setMessage(data.message || "OTP sent successfully!");
        setTimeout(() => {
          navigate("/verify-otp", { state: { email: formData.email } });
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center px-4 py-10"
      style={{
        minHeight: "80vh",
        background: `radial-gradient(circle at 50% 0%, #12594F 0%, ${ROYAL.emeraldDeep} 55%, #051E1B 100%)`,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');

        * { font-family: 'Inter', sans-serif; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%      { transform: translateX(-4px); }
          40%      { transform: translateX(4px); }
          60%      { transform: translateX(-3px); }
          80%      { transform: translateX(3px); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        @keyframes crestGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(184, 137, 43, 0.35); }
          50%      { box-shadow: 0 0 0 8px rgba(184, 137, 43, 0); }
        }
        .royal-input {
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .royal-input:focus {
          outline: none;
          border-color: ${ROYAL.gold};
          box-shadow: 0 0 0 3px rgba(184, 137, 43, 0.18);
        }
        .royal-submit {
          background: linear-gradient(135deg, ${ROYAL.emerald}, ${ROYAL.emeraldDeep});
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .royal-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 26px rgba(11, 74, 66, 0.4);
        }
        .royal-tab {
          background: transparent !important;
          border: none !important;
        }
        .royal-eye-toggle {
          background: transparent !important;
          border: none !important;
        }
        .field-wrap {
          animation: fadeSlideUp 0.35s ease-out forwards;
        }
        .crest {
          animation: crestGlow 2.6s ease-in-out infinite;
        }
      `}</style>

      <div
        className="w-full opacity-0"
        style={{
          maxWidth: "460px",
          animation: "fadeSlideUp 0.55s ease-out forwards",
        }}
      >
        <div
          className="rounded-[28px] p-[1.5px]"
          style={{ background: `linear-gradient(135deg, ${ROYAL.gold}, #E7CD8F, ${ROYAL.gold})` }}
        >
          <div
            className="rounded-[26px] p-8 sm:p-9"
            style={{ backgroundColor: ROYAL.ivory }}
          >
            {/* ---------------- Brand mark ---------------- */}
            <div className="flex flex-col items-center mb-7">
              <div
                className="crest w-14 h-14 rounded-full flex items-center justify-center text-xl mb-3"
                style={{
                  background: `linear-gradient(135deg, ${ROYAL.emerald}, ${ROYAL.emeraldDeep})`,
                  color: ROYAL.goldSoft,
                  border: `1.5px solid ${ROYAL.gold}`,
                }}
              >
                <FaHospital />
              </div>
              <p
                className="text-[11px] font-semibold tracking-[0.18em]"
                style={{ color: ROYAL.gold }}
              >
                VMS · VIKAS MEDICAL STORE
              </p>
              <span
                className="mt-2 h-[1px] w-16"
                style={{ background: `linear-gradient(90deg, transparent, ${ROYAL.gold}, transparent)` }}
              />
            </div>

            {/* ---------------- Tabs ---------------- */}
            <div className="relative flex mb-2 rounded-full p-1" style={{ backgroundColor: ROYAL.goldSoft }}>
              <button
                type="button"
                onClick={() => switchTab(true)}
                className="royal-tab relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-full transition-colors duration-300"
                style={{ color: isLoginTab ? "#fff" : ROYAL.emerald }}
              >
                Staff Login
              </button>
              <button
                type="button"
                onClick={() => switchTab(false)}
                className="royal-tab relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-full transition-colors duration-300"
                style={{ color: !isLoginTab ? "#fff" : ROYAL.emerald }}
              >
                Create Account
              </button>

              {/* sliding pill indicator */}
              <span
                className="absolute top-1 bottom-1 rounded-full"
                style={{
                  width: "calc(50% - 4px)",
                  left: isLoginTab ? "4px" : "calc(50% + 0px)",
                  background: `linear-gradient(135deg, ${ROYAL.emerald}, ${ROYAL.emeraldDeep})`,
                  transition: "left 0.3s ease",
                }}
              />
            </div>

            <h2
              key={isLoginTab ? "login-title" : "register-title"}
              className="text-center mt-6 mb-6 text-[28px] opacity-0"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 700,
                color: ROYAL.ink,
                animation: "fadeIn 0.35s ease-out forwards",
              }}
            >
              {isLoginTab ? "Welcome Back, Staff" : "Register New Account"}
            </h2>

            {error && (
              <div
                className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl mb-4 opacity-0"
                style={{
                  backgroundColor: ROYAL.errorSoft,
                  color: ROYAL.errorFg,
                  animation: "popIn 0.3s ease-out forwards, shake 0.4s ease-in-out 0.3s",
                }}
              >
                <FaExclamationCircle className="flex-shrink-0" />
                {error}
              </div>
            )}

            {message && (
              <div
                className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl mb-4 opacity-0"
                style={{ backgroundColor: "#E4F1EA", color: ROYAL.emerald, animation: "popIn 0.3s ease-out forwards" }}
              >
                <FaCheckCircle className="flex-shrink-0" />
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!isLoginTab && (
                <div className="field-wrap opacity-0">
                  <label className="block mb-1.5 text-xs font-semibold tracking-wide" style={{ color: ROYAL.muted }}>
                    FULL NAME
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: ROYAL.gold }} />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="royal-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                      style={{ border: `1px solid ${ROYAL.goldSoft}`, backgroundColor: "#fff", color: ROYAL.ink }}
                    />
                  </div>
                </div>
              )}

              <div className="field-wrap opacity-0" style={{ animationDelay: "40ms" }}>
                <label className="block mb-1.5 text-xs font-semibold tracking-wide" style={{ color: ROYAL.muted }}>
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: ROYAL.gold }} />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@hospital.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="royal-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                    style={{ border: `1px solid ${ROYAL.goldSoft}`, backgroundColor: "#fff", color: ROYAL.ink }}
                  />
                </div>
              </div>

              <div className="field-wrap opacity-0" style={{ animationDelay: "80ms" }}>
                <label className="block mb-1.5 text-xs font-semibold tracking-wide" style={{ color: ROYAL.muted }}>
                  PASSWORD
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: ROYAL.gold }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="royal-input w-full pl-10 pr-10 py-2.5 rounded-xl text-sm"
                    style={{ border: `1px solid ${ROYAL.goldSoft}`, backgroundColor: "#fff", color: ROYAL.ink }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="royal-eye-toggle absolute right-3 top-1/2 -translate-y-1/2 text-xs p-1"
                    style={{ color: ROYAL.gold }}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="royal-submit field-wrap opacity-0 mt-2 flex items-center justify-center gap-2 text-white font-semibold rounded-xl py-3 text-sm disabled:opacity-70"
                style={{ animationDelay: "120ms", letterSpacing: "0.02em" }}
              >
                {submitting ? (
                  "Please wait..."
                ) : isLoginTab ? (
                  <>
                    <FaSignInAlt />
                    Sign In Securely
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Verification OTP
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
