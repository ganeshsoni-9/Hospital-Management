import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";

import Login from "./pages/Login.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx"; 
import Dashboard from "./pages/Dashboard.jsx";
import Rooms from "./pages/Rooms.jsx"; 
import Doctors from "./pages/Doctors.jsx";
import Patients from "./pages/Patients.jsx";
import Billing from "./pages/Billing.jsx";
import Reports from "./pages/Reports.jsx";
import About from "./pages/About";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Yeh dono ab PUBLIC hain - Sabko dikhenge */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/" element={<Dashboard />} /> 
        <Route path="/patients" element={<Patients />} />
        <Route path="/about" element={<About />} /> 

        {/* Baki sensitive routes abhi bhi protected reh sakte hain */}
        <Route path="/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
        <Route path="/doctors" element={<PrivateRoute><Doctors /></PrivateRoute>} />
        <Route path="/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;