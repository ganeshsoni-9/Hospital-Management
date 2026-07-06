import { createContext, useContext, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [staff, setStaff] = useState(
    JSON.parse(localStorage.getItem("staff")) || null
  );

  // Corresponds to the "Login" diamond in the flowchart
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("staff", JSON.stringify(data));
    setStaff(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("staff");
    setStaff(null);
  };

  return (
    <AuthContext.Provider value={{ staff, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
