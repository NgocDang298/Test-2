import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Layout/Navbar/Navbar';
import Footer from './components/Layout/Footer/Footer';
import AppRoutes from './routes/Index';
import useAuthStore from './stores/authStore';
import './App.css';

function App() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    initializeAuth, 
    logout 
  } = useAuthStore();

  useEffect(() => {
    // Khởi tạo auth khi app load
    initializeAuth();
  }, [initializeAuth]);

  const handleLogout = () => {
    logout();
  };

  // Hiển thị loading khi đang khởi tạo auth
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="mb-4 animate-spin">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
        </div>
        <div className="text-lg text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar onLogout={handleLogout} />
        <main className="main-content">
          <AppRoutes user={user} isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
