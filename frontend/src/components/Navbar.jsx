import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { staff, logout } = useAuth();
  const navigate = useNavigate();

  if (!staff) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ background: "#1e293b", padding: "12px 20px", display: "flex", justifyContent: "space-between" }}>
      <div style={{ display: "flex", gap: "18px" }}>
        <Link style={linkStyle} to="/">Dashboard</Link>
        <Link style={linkStyle} to="/rooms">Rooms</Link>
        <Link style={linkStyle} to="/doctors">Doctors</Link>
        <Link style={linkStyle} to="/patients">Patients</Link>
        <Link style={linkStyle} to="/billing">Billing</Link>
        <Link style={linkStyle} to="/reports">Reports</Link>
      </div>
      <div style={{ color: "#fff" }}>
        {staff.name} <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Logout</button>
      </div>
    </nav>
  );
};

const linkStyle = { color: "#fff", textDecoration: "none", fontSize: "14px" };

export default Navbar;
