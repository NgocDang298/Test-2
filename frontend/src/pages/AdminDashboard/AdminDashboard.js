import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import UserManager from '../../components/admin/UserManager/UserManager';
import axios from 'axios';
import { fetchListUsers } from '../../services/AdminService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExams: 0,
    totalResults: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [notifications, setNotifications] = useState(3);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch stats and activities
    fetchStats();
    fetchActivities();

    // Fetch users from database
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const responseStudents = await fetchListUsers('student');
      const responseTeachers = await fetchListUsers('teacher');
      setUsers([...responseStudents.data, ...responseTeachers.data])
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Không thể lấy danh sách người dùng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Simulate API calls
  const fetchStats = async () => {
    // Mock data
    setStats({
      totalUsers: 1250,
      totalExams: 45,
      totalResults: 3200
    });
  };

  const fetchActivities = async () => {
    // Mock data
    setRecentActivities([
      {
        id: 1,
        type: 'success',
        title: 'Người dùng mới đã đăng ký',
        time: '5 phút trước',
        icon: 'user-plus'
      },
      {
        id: 2,
        type: 'warning',
        title: 'Bài thi sắp hết hạn',
        time: '1 giờ trước',
        icon: 'clock'
      },
      {
        id: 3,
        type: 'error',
        title: 'Lỗi hệ thống đã được khắc phục',
        time: '2 giờ trước',
        icon: 'exclamation-triangle'
      }
    ]);
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon users">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{stats.totalUsers}</div>
                  <div className="stat-label">Tổng số người dùng</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon exams">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{stats.totalExams}</div>
                  <div className="stat-label">Tổng số bài thi</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon results">
                  <i className="fas fa-chart-bar"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{stats.totalResults}</div>
                  <div className="stat-label">Tổng số kết quả</div>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <div className="section-header">
                <h3 className="section-title">Hoạt động gần đây</h3>
                <span className="view-all">Xem tất cả</span>
              </div>
              <ul className="activity-list">
                {recentActivities.map(activity => (
                  <li key={activity.id} className="activity-item">
                    <div className={`activity-icon ${activity.type}`}>
                      <i className={`fas fa-${activity.icon}`}></i>
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">{activity.title}</div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        );
      case 'users':
        return <UserManager users={users} loading={loading} error={error} refreshUsers={fetchUsers} />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <p>Quản lý hệ thống</p>
        </div>
        <ul className="sidebar-menu">
          <li
            className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleMenuClick('dashboard')}
          >
            <i className="fas fa-home"></i>
            Dashboard
          </li>
          <li
            className={`menu-item ${activeMenu === 'users' ? 'active' : ''}`}
            onClick={() => handleMenuClick('users')}
          >
            <i className="fas fa-users"></i>
            Quản lý người dùng
          </li>
        </ul>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h1>Dashboard</h1>
        </div>
        <div className="header-right">
          <div className="notification-icon">
            <i className="fas fa-bell"></i>
            {notifications > 0 && (
              <span className="notification-badge">{notifications}</span>
            )}
          </div>
          <div className="user-menu" onClick={handleLogout}>
            <div className="user-avatar">A</div>
            <div className="user-info">
              <span className="user-name">Admin</span>
              <span className="user-role">Quản trị viên</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;