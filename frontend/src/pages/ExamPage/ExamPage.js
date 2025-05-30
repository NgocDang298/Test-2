import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import useAuth from '../../hooks/useAuth';
import './ExamPage.css';

const ExamPage = () => {
    const { user, accessToken } = useAuth();
    const [subjects, setSubjects] = useState([]);
    const [exams, setExams] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && accessToken) {
            fetchSubjects();
        }
    }, [user, accessToken]);

    useEffect(() => {
        if (selectedSubject) {
            fetchExamsBySubject(selectedSubject);
        }
    }, [selectedSubject]);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/student/subjects');
            if (response.data.success) {
                setSubjects(response.data.data);
                if (response.data.data.length > 0) {
                    setSelectedSubject(response.data.data[0].id);
                }
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchExamsBySubject = async (subjectId) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/api/teacher/exams/subject/${subjectId}`);
            setExams(response.data);
        } catch (error) {
            console.error('Error fetching exams:', error);
            setExams([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };

    const isExamAvailable = (exam) => {
        const now = new Date();
        const startTime = exam.startTime ? new Date(exam.startTime) : null;
        const endTime = exam.endTime ? new Date(exam.endTime) : null;

        if (startTime && now < startTime) return false;
        if (endTime && now > endTime) return false;
        return true;
    };

    if (loading && subjects.length === 0) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>
                <p>Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="exam-page">
            <div className="page-header">
                <h1>
                    <i className="fas fa-file-alt"></i>
                    Danh sách bài thi
                </h1>
                <div className="user-info">
                    <span>Xin chào, {user?.fullname || user?.username}</span>
                </div>
            </div>

            {subjects.length === 0 ? (
                <div className="empty-state">
                    <i className="fas fa-book"></i>
                    <h3>Chưa có môn học nào</h3>
                    <p>Bạn chưa được đăng ký vào môn học nào. Vui lòng liên hệ giáo viên để được thêm vào lớp.</p>
                </div>
            ) : (
                <>
                    {/* Subject Filter */}
                    <div className="subject-filter">
                        <label htmlFor="subject-select">Chọn môn học:</label>
                        <select 
                            id="subject-select"
                            value={selectedSubject} 
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="form-select"
                        >
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Exams List */}
                    <div className="exams-container">
                        {loading ? (
                            <div className="loading-container">
                                <i className="fas fa-spinner fa-spin"></i>
                                <p>Đang tải danh sách bài thi...</p>
                            </div>
                        ) : exams.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-file-alt"></i>
                                <h3>Chưa có bài thi nào</h3>
                                <p>Môn học này chưa có bài thi nào được tạo.</p>
                            </div>
                        ) : (
                            <div className="exams-grid">
                                {exams.map(exam => {
                                    const available = isExamAvailable(exam);
                                    return (
                                        <div key={exam.id} className={`exam-card ${!available ? 'disabled' : ''}`}>
                                            <div className="exam-header">
                                                <h3>{exam.title}</h3>
                                                {!available && (
                                                    <span className="exam-status unavailable">
                                                        Không khả dụng
                                                    </span>
                                                )}
                                                {available && (
                                                    <span className="exam-status available">
                                                        Có thể làm bài
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="exam-info">
                                                <p className="exam-description">{exam.description}</p>
                                                <div className="exam-details">
                                                    <div className="detail-item">
                                                        <i className="fas fa-clock"></i>
                                                        <span>Thời gian: {exam.duration} phút</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <i className="fas fa-question-circle"></i>
                                                        <span>Số câu hỏi: {exam.questions?.length || 0}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <i className="fas fa-redo"></i>
                                                        <span>Số lần làm: {exam.maxAttempts}</span>
                                                    </div>
                                                    {exam.startTime && (
                                                        <div className="detail-item">
                                                            <i className="fas fa-calendar-alt"></i>
                                                            <span>Bắt đầu: {formatDateTime(exam.startTime)}</span>
                                                        </div>
                                                    )}
                                                    {exam.endTime && (
                                                        <div className="detail-item">
                                                            <i className="fas fa-calendar-times"></i>
                                                            <span>Kết thúc: {formatDateTime(exam.endTime)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="exam-footer">
                                                {available ? (
                                                    <Link 
                                                        to={`/exam/${exam.id}`}
                                                        className="btn btn-primary"
                                                    >
                                                        <i className="fas fa-play"></i>
                                                        Bắt đầu làm bài
                                                    </Link>
                                                ) : (
                                                    <button className="btn btn-disabled" disabled>
                                                        <i className="fas fa-lock"></i>
                                                        Chưa thể làm bài
                                                    </button>
                                                )}
                                                <Link 
                                                    to={`/my-exams?examId=${exam.id}`}
                                                    className="btn btn-outline"
                                                >
                                                    <i className="fas fa-history"></i>
                                                    Lịch sử làm bài
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ExamPage;