import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherDashboard.css';
import SubjectManager from '../../components/teacher/SubjectManager/SubjectManager';
import ExamManager from '../../components/teacher/ExamManager/ExamManager';
import QuestionBankManager from '../../components/teacher/QuestionBankManager/QuestionBankManager';
import SubmissionManager from '../../components/teacher/SubmissionManager/SubmissionManager';
import { getSubjectsByTeacher } from '../../services/SubjectService';
import useAuth from '../../hooks/useAuth';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalExams: 0,
    totalQuestions: 0,
    totalSubmissions: 0
  });
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    setLoading(true);
    try {
      const subjectsData = await getSubjectsByTeacher();
      setSubjects(subjectsData.data || []);
      
      // Calculate stats
      setStats({
        totalSubjects: subjectsData.data?.length || 0,
        totalExams: 0, // Will be calculated from exams
        totalQuestions: 0, // Will be calculated from questions
        totalSubmissions: 0 // Will be calculated from submissions
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching teacher data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon subjects">
                  <i className="fas fa-book"></i>
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
                  <div className="stat-label">Đề thi đã tạo</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon questions">
                  <i className="fas fa-question-circle"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{stats.totalQuestions}</div>
                  <div className="stat-label">Câu hỏi trong ngân hàng</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon submissions">
                  <i className="fas fa-clipboard-check"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{stats.totalSubmissions}</div>
                  <div className="stat-label">Bài thi đã chấm</div>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <div className="section-header">
                <h3 className="section-title">Môn học đang dạy</h3>
              </div>
              <div className="subjects-grid">
                {subjects.map(subject => (
                  <div key={subject.id} className="subject-card">
                    <h4>{subject.name}</h4>
                    <p>{subject.description}</p>
                    <div className="subject-actions">
                      <button 
                        className="btn-primary"
                        onClick={() => setActiveMenu('exams')}
                      >
                        Quản lý đề thi
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => setActiveMenu('questions')}
                      >
                        Ngân hàng câu hỏi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case 'subjects':
        return <SubjectManager subjects={subjects} refreshSubjects={fetchTeacherData} />;
      case 'exams':
        return <ExamManager subjects={subjects} />;
      case 'questions':
        return <QuestionBankManager subjects={subjects} />;
      case 'submissions':
        return <SubmissionManager />;
      default:
        return null;
    }
  };

  return (
    <div className="teacher-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Teacher Panel</h2>
          <p>Quản lý giảng dạy</p>
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
            className={`menu-item ${activeMenu === 'subjects' ? 'active' : ''}`}
            onClick={() => handleMenuClick('subjects')}
          >
            <i className="fas fa-book"></i>
            Quản lý môn học
          </li>
          <li
            className={`menu-item ${activeMenu === 'exams' ? 'active' : ''}`}
            onClick={() => handleMenuClick('exams')}
          >
            <i className="fas fa-file-alt"></i>
            Quản lý đề thi
          </li>
          <li
            className={`menu-item ${activeMenu === 'questions' ? 'active' : ''}`}
            onClick={() => handleMenuClick('questions')}
          >
            <i className="fas fa-question-circle"></i>
            Ngân hàng câu hỏi
          </li>
          <li
            className={`menu-item ${activeMenu === 'submissions' ? 'active' : ''}`}
            onClick={() => handleMenuClick('submissions')}
          >
            <i className="fas fa-clipboard-check"></i>
            Chấm bài
          </li>
        </ul>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h1>Teacher Dashboard</h1>
        </div>
        <div className="header-right">
          <div className="user-menu" onClick={handleLogout}>
            <div className="user-avatar">
              {user?.fullname?.charAt(0) || user?.username?.charAt(0) || 'T'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.fullname || user?.username || 'Teacher'}</span>
              <span className="user-role">Giáo viên</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <p className="error-message">{error}</p>
            <button className="btn-retry" onClick={fetchTeacherData}>
              Thử lại
            </button>
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard; 