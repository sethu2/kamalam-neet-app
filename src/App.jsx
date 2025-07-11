import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel"; // ✅ NEW import
import Navbar from "./components/Navbar";

const Layout = ({ children }) => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/";

  return (
    <div>
      {showNavbar && <Navbar />}
      <div>{children}</div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} /> {/* ✅ Admin route */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
