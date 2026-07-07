import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api.js"; // आपका api service instance

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // लॉगिन या रजिस्टर पेज से जो ईमेल ट्रांसफर होगा उसे पकड़ेगा
  const email = location.state?.email || ""; 

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp });
      setMessage(data.message || "OTP Verified Successfully!");
      
      // ओटीपी वेरीफाई होते ही सीधे लॉगिन पेज पर भेज देगा
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, marginTop: 80 }}>
      <div className="card" style={{ padding: 20, boxShadow: "0px 0px 10px #ccc", borderRadius: 8 }}>
        <h2>Enter OTP Verification</h2>
        <p>OTP sent to: <strong>{email || "your email"}</strong></p>
        
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
        
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter 6-Digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <button type="submit" style={{ width: "100%", padding: "10px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Verify & Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;