import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalExams: 0,
    completedExams: 0,
    averageScore: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Invalid token:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const getUserRole = () => {
    console.log('getUserRole - user:', user); // Debug log
    if (!user || !user.roles) return null;
    return user.roles[0];
  };

  const renderStudentDashboard = () => (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h1>Chào mừng, {user.sub}!</h1>
        <p>Hãy bắt đầu học tập và làm bài thi ngay hôm nay</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon subjects">
            <i className="fas fa-book"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalSubjects}</div>
            <div className="stat-label">Môn học đã đăng ký</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon exams">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalExams}</div>
            <div className="stat-label">Bài thi có sẵn</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.completedExams}</div>
            <div className="stat-label">Bài thi đã hoàn thành</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon score">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.averageScore}</div>
            <div className="stat-label">Điểm trung bình</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Hành động nhanh</h3>
        <div className="action-buttons">
          <button className="action-btn primary" onClick={() => navigate('/student')}>
            <i className="fas fa-book-open"></i>
            <span>Xem môn học</span>
          </button>
          <button className="action-btn secondary" onClick={() => navigate('/profile')}>
            <i className="fas fa-user-edit"></i>
            <span>Cập nhật hồ sơ</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTeacherDashboard = () => (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h1>Chào mừng Giáo viên, {user.sub}!</h1>
        <p>Quản lý môn học và tạo bài thi cho học sinh</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon subjects">
            <i className="fas fa-chalkboard-teacher"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalSubjects}</div>
            <div className="stat-label">Môn học đang dạy</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon exams">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalExams}</div>
            <div className="stat-label">Bài thi đã tạo</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon students">
            <i className="fas fa-user-graduate"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.completedExams}</div>
            <div className="stat-label">Học sinh</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon questions">
            <i className="fas fa-question-circle"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.averageScore}</div>
            <div className="stat-label">Câu hỏi đã tạo</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Hành động nhanh</h3>
        <div className="action-buttons">
          <button className="action-btn primary" onClick={() => navigate('/teacher')}>
            <i className="fas fa-book"></i>
            <span>Quản lý môn học</span>
          </button>
          <button className="action-btn secondary" onClick={() => navigate('/profile')}>
            <i className="fas fa-user-edit"></i>
            <span>Cập nhật hồ sơ</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h1>Chào mừng Quản trị viên, {user.sub}!</h1>
        <p>Quản lý toàn bộ hệ thống và người dùng</p>
      </div>

      <div className="quick-actions">
        <h3>Hành động nhanh</h3>
        <div className="action-buttons">
          <button className="action-btn primary" onClick={() => navigate('/admin')}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Bảng điều khiển Admin</span>
          </button>
          <button className="action-btn secondary" onClick={() => navigate('/profile')}>
            <i className="fas fa-user-edit"></i>
            <span>Cập nhật hồ sơ</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    const role = getUserRole();
    switch (role) {
      case 'STUDENT':
        return renderStudentDashboard();
      case 'TEACHER':
        return renderTeacherDashboard();
      case 'ADMIN':
        return renderAdminDashboard();
      default:
        return (
          <div className="dashboard-content">
            <h1>Chào mừng!</h1>
            <p>Đang tải thông tin...</p>
          </div>
        );
    }
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-container">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default HomePage; 