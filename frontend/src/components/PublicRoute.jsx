import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    // Agar already logged in hai, to home page pe redirect
    return <Navigate to="/" replace />;
  }

  return children;
}
