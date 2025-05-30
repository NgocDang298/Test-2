import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      </div>
    </Router>
  );
}

export default App;
