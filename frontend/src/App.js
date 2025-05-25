import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from './components/Layout/Navbar/Navbar';
import Footer from './components/Layout/Footer/Footer';
import AppRoutes from './routes/Index';


function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('check navbar decode', decoded)
        setUser(decoded.sub || decoded);
        console.log('check navbar user', user)
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const onLogin = (token) => {
    localStorage.setItem('token', token);
    try {
      const decoded = jwtDecode(token);
      setUser(decoded.sub || decoded); // Cập nhật user đúng
    } catch (error) {
      console.error('Invalid token');
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
      <Navbar user={user} onLogout={handleLogout} />
      <main className="content">
        <AppRoutes user={user} onLogin={onLogin} onLogout={handleLogout} />
      </main>
      <Footer />
    </Router>
  );
}

export default App;
