// ✅ src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await API.get("/api/users/profile");
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      const token = localStorage.getItem("token");
      setUser({ token });
    }
  };

  // 🔹 Login (only this changes Navbar)
  const login = (token) => {
    localStorage.setItem("token", token);
    fetchUserData();
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
