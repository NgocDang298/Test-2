import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from './components/Layout/Navbar/Navbar';
import Footer from './components/Layout/Footer/Footer';
import AppRoutes from './routes/Index';
import 'antd/dist/reset.css';

function AppContent({ user, onLogin, onLogout }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return isAdminPage ? (
      <Routes>
        {AppRoutes({ user, onLogin, onLogout })}
      </Routes>
  ) : (
      <div className="page-layout">
        <Navbar user={user} onLogout={onLogout} />
        <main className="content">
          <Routes>
            {AppRoutes({ user, onLogin, onLogout })}
          </Routes>
        </main>
        {/*<Footer />*/}
      </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded.sub || decoded);
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const onLogin = (token) => {
    localStorage.setItem('token', token);
    try {
      const decoded = jwtDecode(token);
      setUser(decoded.sub || decoded);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
      <Router>
        <AppContent user={user} onLogin={onLogin} onLogout={handleLogout} />
      </Router>
  );
}

export default App;