import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
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
    onLogout();
    navigate('/login');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="logo" >
          <i className="fas fa-graduation-cap"></i>
          <span>Test4U</span>
        </div>

        {/* Mobile menu button */}
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <div className="navbar-slogan">
          <i className="fas fa-lightbulb slogan-icon"></i>
          Nền tảng thi trắc nghiệm thông minh
        </div>
        {/* Navigation links */}
        {/*<div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>*/}
        {/*  <Link to="/exams" className={location.pathname === '/exams' ? 'active' : ''}>*/}
        {/*    <i className="fas fa-file-alt"></i>*/}
        {/*    <span>Danh sách bài thi</span>*/}
        {/*  </Link>*/}
        {/*  <Link to="/statistics" className={location.pathname === '/statistics' ? 'active' : ''}>*/}
        {/*    <i className="fas fa-chart-bar"></i>*/}
        {/*    <span>Thống kê</span>*/}
        {/*  </Link>*/}
        {/*  {user?.role === 'admin' && (*/}
        {/*    <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>*/}
        {/*      <i className="fas fa-cog"></i>*/}
        {/*      <span>Quản lý</span>*/}
        {/*    </Link>*/}
        {/*  )}*/}
        {/*</div>*/}

        {/* User menu */}
        <div className="user-menu">
          {user ? (
            <div className="user-menu-container">
              <button className="user-menu-button" onClick={toggleUserMenu}>
                <div className="user-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <span className="user-name">{user.name}</span>
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