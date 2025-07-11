// src/pages/ResultPage.jsx

import { supabase } from "../utils/supabaseClient";
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";

const ResultPage = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [resultSaved, setResultSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const saved = localStorage.getItem("kamalam_answers");
      const submitted = localStorage.getItem("quiz_submitted");

      if (!saved || !submitted) {
        window.location.href = "/quiz";
        return;
      }

      const parsedAnswers = JSON.parse(saved);
      setUserAnswers(parsedAnswers);

      const { data: questionsData, error: fetchError } = await supabase.from("questions").select("*");
      if (fetchError) {
        console.error("Error fetching questions:", fetchError);
        return;
      }
      setQuestions(questionsData);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const correct = questionsData.filter(q => parsedAnswers[q.id] === q.correct_answer).length;
      const wrong = questionsData.filter(q => parsedAnswers[q.id] && parsedAnswers[q.id] !== q.correct_answer).length;
      const score = correct * 4 - wrong;

      if (user && !resultSaved) {
        const { error } = await supabase.from("results").insert([
          {
            user_email: user.email,
            score,
            answers: parsedAnswers,
          },
        ]);
        if (!error) setResultSaved(true);
      }
    };

    fetchData();
  }, [resultSaved]);

  const correct = questions.filter(q => userAnswers[q.id] === q.correct_answer).length;
  const wrong = questions.filter(q => userAnswers[q.id] && userAnswers[q.id] !== q.correct_answer).length;
  const unanswered = questions.length - (correct + wrong);
  const score = correct * 4 - wrong;

  const chartData = [
    { name: "Correct", value: correct },
    { name: "Wrong", value: wrong },
    { name: "Unanswered", value: unanswered },
  ];

  const COLORS = ["#16a34a", "#dc2626", "#facc15"];

  const subjectScores = ["Physics", "Chemistry", "Biology"].map(subject => {
    const subjectQs = questions.filter(q => q.subject === subject);
    const correctInSubject = subjectQs.filter(q => userAnswers[q.id] === q.correct_answer).length;
    return {
      subject,
      score: correctInSubject * 4
    };
  });

  const handleDownloadPDF = async () => {
    alert("Generating PDF... Please wait.");
    try {
      const resultDiv = document.getElementById("result-content");
      const dataUrl = await domtoimage.toPng(resultDiv);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      pdf.addImage(dataUrl, "PNG", 0, 10, pdfWidth, 0);
      pdf.save("neet-result.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  if (questions.length === 0) return <p>Loading result...</p>;

  return (
    <div id="result-content" style={{ padding: 24, maxWidth: 1000, margin: "auto" }}>
      <h2 style={{ fontSize: 28, marginBottom: 12 }}>🎯 NEET Result Summary</h2>
      <p style={{ fontSize: 18 }}>✅ Correct: {correct}</p>
      <p style={{ fontSize: 18 }}>❌ Wrong: {wrong}</p>
      <p style={{ fontSize: 18 }}>⏳ Unanswered: {unanswered}</p>
      <h3 style={{ fontSize: 22, color: "#2563eb", margin: "12px 0" }}>
        🎓 NEET Score: {score} / 720
      </h3>

      <PieChart width={300} height={250}>
        <Pie data={chartData} cx={150} cy={120} outerRadius={90} label dataKey="value">
          {chartData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>

      <h3 style={{ fontSize: 22, marginTop: 40, color: "#15803d" }}>📊 Subject-wise Marks</h3>
      <BarChart width={500} height={250} data={subjectScores} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="subject" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="score" fill="#4f46e5" />
      </BarChart>

      <button onClick={handleDownloadPDF} style={{
        marginTop: 20,
        padding: '10px 20px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
      }}>
        📥 Download PDF
      </button>

      <div style={{ marginTop: 40 }}>
        <h3 style={{ fontSize: 24, marginBottom: 10 }}>📘 Answer Review with Explanations</h3>
        {questions.map((q, idx) => {
          const userAnswer = userAnswers[q.id];
          const isCorrect = userAnswer === q.correct_answer;
          return (
            <div key={q.id} style={{
              background: isCorrect ? "#ecfdf5" : "#fef2f2",
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: 12,
              marginBottom: 12
            }}>
              <strong>Q{idx + 1} ({q.subject || "General"}):</strong> {q.question}
              <div style={{ marginTop: 6 }}>
                <span>✅ Correct: <strong>{q.correct_answer}</strong></span><br />
                <span>📝 Your Answer: <strong>{userAnswer || "Not Answered"}</strong></span><br />
                <span>📖 Explanation: {q.explanation || "No explanation available."}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultPage;
