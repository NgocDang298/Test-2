import "antd/dist/reset.css";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Layout/Navbar/Navbar";
import AppRoutes from "./routes/Index";

function AppContent({ user, onLogin, onLogout }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return isAdminPage ? (
    <Routes>{AppRoutes({ user, onLogin, onLogout })}</Routes>
  ) : (
    <div className="page-layout">
      <Navbar user={user} onLogout={onLogout} />
      <main className="content">
        <Routes>{AppRoutes({ user, onLogin, onLogout })}</Routes>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/*<Footer />*/}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded.sub || decoded);
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const onLogin = (token) => {
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode(token);
      setUser(decoded.sub || decoded);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Router>
      <AppContent user={user} onLogin={onLogin} onLogout={handleLogout} />
    </Router>
  );
}

export default App;
