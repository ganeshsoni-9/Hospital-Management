import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const Login = () => {
  const [isLoginTab, setIsLoginTab] = useState(true); // Toggle System
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (isLoginTab) {
        // --- LOGIN FLOW ---
        const data = await login(formData.email, formData.password);
        if (data) {
          navigate("/"); // Direct Go to Home Screen
        }
      } else {
        // --- SIGN UP FLOW ---
        const { data } = await api.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        setMessage(data.message || "OTP sent successfully!");
        
        // OTP Page par automatic Email state transfer karna
        setTimeout(() => {
          navigate("/verify-otp", { state: { email: formData.email } });
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div className="card" style={{ width: "100%", maxWidth: "420px", padding: "25px", boxShadow: "0px 4px 15px rgba(0,0,0,0.1)", borderRadius: "10px", background: "#fff" }}>
        
        {/* Modern Tabs Design */}
        <div style={{ display: "flex", marginBottom: "20px", borderBottom: "2px solid #f1f5f9" }}>
          <button 
            onClick={() => { setIsLoginTab(true); setError(""); }}
            style={{ flex: 1, padding: "12px", border: "none", background: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer", color: isLoginTab ? "#2563eb" : "#94a3b8", borderBottom: isLoginTab ? "3px solid #2563eb" : "none" }}
          >
            Staff Login
          </button>
          <button 
            onClick={() => { setIsLoginTab(false); setError(""); }}
            style={{ flex: 1, padding: "12px", border: "none", background: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer", color: !isLoginTab ? "#2563eb" : "#94a3b8", borderBottom: !isLoginTab ? "3px solid #2563eb" : "none" }}
          >
            Create Account
          </button>
        </div>

        <h2 style={{ textAlign: "center", margin: "10px 0 20px 0", color: "#1e293b" }}>
          {isLoginTab ? "Welcome Back Staff" : "Register New Account"}
        </h2>

        {error && <p style={{ color: "#ef4444", background: "#fee2e2", padding: "10px", borderRadius: "5px", fontSize: "14px" }}>{error}</p>}
        {message && <p style={{ color: "#10b981", background: "#d1fae5", padding: "10px", borderRadius: "5px", fontSize: "14px" }}>{message}</p>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          
          {/* Sign Up Form ke liye Name Field */}
          {!isLoginTab && (
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "5px", color: "#475569" }}>Full Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="Enter Full Name"
                value={formData.name} 
                onChange={handleInputChange} 
                required 
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              />
            </div>
          )}

          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#475569" }}>Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="name@hospital.com"
              value={formData.email} 
              onChange={handleInputChange} 
              required 
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#475569" }}>Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••"
              value={formData.password} 
              onChange={handleInputChange} 
              required 
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <button 
            type="submit" 
            style={{ width: "100%", padding: "12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "10px", transition: "0.2s" }}
          >
            {isLoginTab ? "Sign In Securely" : "Send Verification OTP ✉️"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;