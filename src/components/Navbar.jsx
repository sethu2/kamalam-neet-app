
// src/components/Navbar.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

const Navbar = () => {
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav style={{
      background: "linear-gradient(to right, #4f46e5, #3b82f6)",
      color: "white",
      padding: "16px 32px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>⚛ Kamalam NEET App</div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Link to="/quiz" style={{ color: "white", textDecoration: "underline" }}>Quiz</Link>
        <Link to="/dashboard" style={{ color: "white", textDecoration: "underline" }}>Dashboard</Link>
        <Link to="/result" style={{ color: "white", textDecoration: "underline" }}>Result</Link>
        <span style={{ fontSize: "14px" }}>Hi, {userEmail}</span>
        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
