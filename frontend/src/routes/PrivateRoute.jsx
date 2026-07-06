import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Guards every page after the "Login" step (No -> back to Login)
const PrivateRoute = ({ children }) => {
  const { staff } = useAuth();
  return staff ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
