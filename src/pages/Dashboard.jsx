// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchUserAndResults = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email);

        const { data, error } = await supabase
          .from("results")
          .select("*")
          .eq("user_email", user.email)
          .order("submitted_at", { ascending: false });

        if (error) {
          console.error("Error fetching results:", error.message);
        } else {
          setResults(data);
        }
      }
    };

    fetchUserAndResults();
  }, []);

  return (
    <div style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px", color: "#2563eb" }}>
        🎯 Kamalam NEET Dashboard
      </h1>

      <p style={{ fontSize: "16px" }}>
        Welcome <strong>{userEmail}</strong>! Below is your quiz attempt history.
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "24px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "2px solid #ccc" }}>
            <th style={{ padding: "10px", textAlign: "left" }}>📅 Date</th>
            <th style={{ padding: "10px", textAlign: "left" }}>🎓 Score</th>
            <th style={{ padding: "10px", textAlign: "left" }}>📖 Answers (JSON)</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ padding: "16px", textAlign: "center" }}>
                No results found.
              </td>
            </tr>
          ) : (
            results.map((result) => (
              <tr key={result.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "10px" }}>{new Date(result.submitted_at).toLocaleString()}</td>
                <td style={{ padding: "10px" }}>{result.score} / 720</td>
                <td style={{ padding: "10px", fontFamily: "monospace", fontSize: "14px" }}>
                  <pre style={{
                    whiteSpace: "pre-wrap",
                    backgroundColor: "#f9fafb",
                    padding: "8px",
                    borderRadius: "6px",
                    overflowX: "auto"
                  }}>
                    {JSON.stringify(result.answers, null, 2)}
                  </pre>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
