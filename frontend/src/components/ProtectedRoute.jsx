import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Agar token nahi hai, login page pe redirect
    return <Navigate to="/login" replace />;
  }

  return children;
}
