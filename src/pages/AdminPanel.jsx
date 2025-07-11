// src/pages/AdminPanel.jsx

import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const AdminPanel = () => {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "",
    subject: "",
    topic: "",
    explanation: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setQuestions(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.text || !form.correct_answer || !form.subject) return alert("Fill required fields");

    if (editId) {
      await supabase.from("questions").update(form).eq("id", editId);
      setEditId(null);
    } else {
      await supabase.from("questions").insert([form]);
    }

    setForm({
      text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "",
      subject: "",
      topic: "",
      explanation: "",
    });

    fetchQuestions();
  };

  const handleEdit = (q) => {
    setEditId(q.id);
    setForm(q);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this question?")) {
      await supabase.from("questions").delete().eq("id", id);
      fetchQuestions();
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "auto", fontFamily: "Arial" }}>
      <h2 style={{ fontSize: 26, marginBottom: 12, color: "#2563eb" }}>
        🛠️ Admin Panel – Kamalam NEET MCQ Bank
      </h2>

      <div style={{ marginBottom: 30, padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
        <h3>{editId ? "✏️ Edit Question" : "➕ Add New Question"}</h3>

        <input name="text" value={form.text} onChange={handleChange} placeholder="Question Text"
          style={{ width: "100%", marginBottom: 10, padding: 8 }} />

        <input name="option_a" value={form.option_a} onChange={handleChange} placeholder="Option A"
          style={{ width: "100%", marginBottom: 10, padding: 8 }} />
        <input name="option_b" value={form.option_b} onChange={handleChange} placeholder="Option B"
          style={{ width: "100%", marginBottom: 10, padding: 8 }} />
        <input name="option_c" value={form.option_c} onChange={handleChange} placeholder="Option C"
          style={{ width: "100%", marginBottom: 10, padding: 8 }} />
        <input name="option_d" value={form.option_d} onChange={handleChange} placeholder="Option D"
          style={{ width: "100%", marginBottom: 10, padding: 8 }} />

        <input name="correct_answer" value={form.correct_answer} onChange={handleChange} placeholder="Correct Answer (exact match)"
          style={{ width: "100%", marginBottom: 10, padding: 8 }} />
        <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject (Physics/Chem/Bio)"
          style={{ width: "100%", marginBottom: 10, padding: 8 }} />
        <input name="topic" value={form.topic} onChange={handleChange} placeholder="Topic (Optional)"
          style={{ width: "100%", marginBottom: 10, padding: 8 }} />
        <textarea name="explanation" value={form.explanation} onChange={handleChange} placeholder="Explanation"
          style={{ width: "100%", marginBottom: 10, padding: 8 }} />

        <button onClick={handleSubmit} style={{
          backgroundColor: "#10b981", color: "white", padding: "10px 20px", border: "none", borderRadius: 6, cursor: "pointer"
        }}>
          {editId ? "✅ Update Question" : "➕ Add Question"}
        </button>
      </div>

      <h3 style={{ marginBottom: 10 }}>📚 Question Bank ({questions.length})</h3>

      {questions.map((q) => (
        <div key={q.id} style={{
          border: "1px solid #e5e7eb",
          padding: 16,
          marginBottom: 10,
          borderRadius: 6,
          backgroundColor: "#f9fafb"
        }}>
          <strong>ID {q.id}</strong>: {q.text} <br />
          <em>Options:</em> [A] {q.option_a}, [B] {q.option_b}, [C] {q.option_c}, [D] {q.option_d}<br />
          <span>✅ <b>Answer:</b> {q.correct_answer}</span> | 📘 <b>Subject:</b> {q.subject} | 🧪 <b>Topic:</b> {q.topic}<br />
          <b>📖 Explanation:</b> {q.explanation}<br />

          <div style={{ marginTop: 10 }}>
            <button onClick={() => handleEdit(q)} style={{ marginRight: 10, padding: "4px 12px", background: "#3b82f6", color: "white", border: "none", borderRadius: 4 }}>
              Edit
            </button>
            <button onClick={() => handleDelete(q.id)} style={{ padding: "4px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: 4 }}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
