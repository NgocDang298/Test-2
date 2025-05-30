import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
  const { user, isAuthenticated, isAdmin, isTeacher, isStudent, logout } = useAuth();
  console.log('Navbar received user:', user);
  console.log('User role:', user?.role);
  console.log('Is authenticated:', isAuthenticated);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Xử lý scroll để thay đổi style của navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout();
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="logo">
          <i className="fas fa-graduation-cap"></i>
          <span>Test4U</span>
        </Link>

        {/* Mobile menu button */}
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        {/* Navigation links */}
        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          {isAuthenticated && (
            <>
              {/* Student navigation */}
              {isStudent() && (
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                  <i className="fas fa-file-alt"></i>
                  <span>Danh sách bài thi</span>
                </Link>
              )}
              
              {/* Teacher navigation */}
              {(isTeacher() || isAdmin()) && (
                <Link to="/exams" className={location.pathname === '/exams' ? 'active' : ''}>
                  <i className="fas fa-file-alt"></i>
                  <span>Quản lý bài thi</span>
                </Link>
              )}
              
              {/* Statistics for teachers and admins */}
              {(isTeacher() || isAdmin()) && (
                <Link to="/statistics" className={location.pathname === '/statistics' ? 'active' : ''}>
                  <i className="fas fa-chart-bar"></i>
                  <span>Thống kê</span>
                </Link>
              )}
              
              {/* Admin panel */}
              {isAdmin() && (
                <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                  <i className="fas fa-cog"></i>
                  <span>Quản lý Admin</span>
                </Link>
              )}
              
              {/* Teacher panel */}
              {isTeacher() && (
                <Link to="/teacher" className={location.pathname === '/teacher' ? 'active' : ''}>
                  <i className="fas fa-chalkboard-teacher"></i>
                  <span>Quản lý Giáo viên</span>
                </Link>
              )}
            </>
          )}
        </div>

        {/* User menu */}
        <div className="user-menu">
          {isAuthenticated && user ? (
            <div className="user-menu-container">
              <button className="user-menu-button" onClick={toggleUserMenu}>
                <div className="user-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <span className="user-name">
                  {user.name || user.username || 'User'}
                  <small className="user-role">({user.role || 'student'})</small>
                </span>
                <i className={`fas fa-chevron-down ${isUserMenuOpen ? 'up' : ''}`}></i>
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item">
                    <i className="fas fa-user-circle"></i>
                    <span>Thông tin cá nhân</span>
                  </Link>
                  <Link to="/my-exams" className="dropdown-item">
                    <i className="fas fa-history"></i>
                    <span>Lịch sử bài thi</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-button">
              <i className="fas fa-sign-in-alt"></i>
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;