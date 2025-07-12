import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState([]);
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 3 hours
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [questionTimes, setQuestionTimes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      localStorage.removeItem("kamalam_questions"); // clear old cache
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("id", { ascending: true })
        .limit(280); // increased from 180
      if (!error) {
        setQuestions(data);
        setCurrentIndex(0);
        setQuestionStartTime(Date.now());
      } else {
        console.error("Error fetching questions:", error.message);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (questions.length === 0) return <p>⚠️ Loading questions...</p>;

  const currentQ = questions[currentIndex];
  const selected = answers[currentQ.id];

  const recordTime = () => {
    const now = Date.now();
    const timeSpent = Math.floor((now - questionStartTime) / 1000);
    setQuestionTimes((prev) => ({
      ...prev,
      [currentQ.id]: (prev[currentQ.id] || 0) + timeSpent,
    }));
    setQuestionStartTime(now);
  };

  const handleOptionClick = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  const handleMarkForLater = () => {
    if (!marked.includes(currentIndex)) {
      setMarked([...marked, currentIndex]);
    }
    recordTime();
    handleNext();
  };

  const handleNext = () => {
    recordTime();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    recordTime();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    recordTime();
    localStorage.setItem("kamalam_answers", JSON.stringify(answers));
    localStorage.setItem("kamalam_timings", JSON.stringify(questionTimes));
    localStorage.setItem("quiz_submitted", true);
    localStorage.setItem("kamalam_questions", JSON.stringify(questions));
    navigate("/result");
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Q{currentIndex + 1}: {currentQ.question}</h2>
        <div style={{ color: "red", fontWeight: "bold" }}>
          ⏰ {formatTime(timeLeft)}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        {[currentQ.option_a, currentQ.option_b, currentQ.option_c, currentQ.option_d].map((opt, i) => (
          <button
            key={i}
            onClick={() => handleOptionClick(opt)}
            style={{
              backgroundColor: selected === opt ? "#007bff" : "#fff",
              color: selected === opt ? "#fff" : "#000",
              border: `2px solid ${selected === opt ? "#0056b3" : "#ccc"}`,
              padding: "12px 16px",
              marginBottom: "10px",
              borderRadius: "6px",
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
          >
            <span style={{ fontWeight: "bold", minWidth: "24px" }}>
              {String.fromCharCode(65 + i)}.
            </span>
            <span>{opt}</span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", gap: "10px" }}>
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{
            padding: "10px 16px",
            borderRadius: "4px",
            backgroundColor: "#ccc",
            cursor: "pointer",
          }}
        >
          ⬅️ Previous
        </button>

        <button
          onClick={handleMarkForLater}
          style={{
            padding: "10px 16px",
            borderRadius: "4px",
            backgroundColor: "#ffc107",
            cursor: "pointer",
          }}
        >
          ⭐ Mark for Later
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          style={{
            padding: "10px 16px",
            borderRadius: "4px",
            backgroundColor: "#ccc",
            cursor: "pointer",
          }}
        >
          Next ➡️
        </button>
      </div>

      {/* Navigator */}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <h4 style={{ marginBottom: "10px" }}>📚 Navigate Questions</h4>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
          {questions.map((q, index) => {
            const isAnswered = answers[q.id];
            const isMarked = marked.includes(index);
            return (
              <button
                key={q.id}
                onClick={() => {
                  recordTime();
                  setCurrentIndex(index);
                }}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: "bold",
                  backgroundColor:
                    currentIndex === index
                      ? "#2563eb"           // current
                      : isMarked
                        ? "#f97316"           // orange
                        : isAnswered
                          ? "#10b981"           // green
                          : "#facc15",          // yellow
                  color: currentIndex === index ? "white" : "#000",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={handleSubmit}
          style={{
            padding: "12px 24px",
            backgroundColor: "green",
            color: "white",
            fontSize: "16px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✅ Submit Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizPage;
