import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../services/axiosInstance';
import './SubmissionManager.css';

const SubmissionManager = ({ user }) => {
    const [submissions, setSubmissions] = useState([]);
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchExams();
    }, []);

    useEffect(() => {
        if (selectedExam) {
            fetchSubmissions(selectedExam);
        }
    }, [selectedExam]);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/teacher/exams');
            setExams(response.data || []);
            if (response.data && response.data.length > 0) {
                setSelectedExam(response.data[0].id);
            }
        } catch (error) {
            console.error('Error fetching exams:', error);
            setError('Không thể tải danh sách bài thi');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubmissions = async (examId) => {
        try {
            setLoading(true);
            setError('');
            const response = await axiosInstance.get(`/api/teacher/submissions/exam/${examId}`);
            setSubmissions(response.data || []);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            setError('Không thể tải danh sách bài làm');
            setSubmissions([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getScoreColor = (score, totalScore) => {
        const percentage = (score / totalScore) * 100;
        if (percentage >= 80) return '#27ae60';
        if (percentage >= 60) return '#f39c12';
        return '#e74c3c';
    };

    if (loading && exams.length === 0) {
        return (
            <div className="submission-manager">
                <div className="loading-container">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="submission-manager">
            <div className="manager-header">
                <h2>
                    <i className="fas fa-file-text"></i>
                    Quản lý bài làm
                </h2>
            </div>

            {exams.length === 0 ? (
                <div className="empty-state">
                    <i className="fas fa-file-alt"></i>
                    <h3>Chưa có bài thi nào</h3>
                    <p>Hãy tạo bài thi để xem bài làm của học sinh</p>
                </div>
            ) : (
                <>
                    <div className="exam-filter">
                        <label htmlFor="exam-select">Chọn bài thi:</label>
                        <select
                            id="exam-select"
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.target.value)}
                            className="form-select"
                        >
                            {exams.map(exam => (
                                <option key={exam.id} value={exam.id}>
                                    {exam.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-triangle"></i>
                            {error}
                        </div>
                    )}

                    <div className="submissions-container">
                        {loading ? (
                            <div className="loading-container">
                                <i className="fas fa-spinner fa-spin"></i>
                                <p>Đang tải bài làm...</p>
                            </div>
                        ) : submissions.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-clipboard-list"></i>
                                <h3>Chưa có bài làm nào</h3>
                                <p>Chưa có học sinh nào làm bài thi này</p>
                            </div>
                        ) : (
                            <div className="submissions-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Học sinh</th>
                                            <th>Thời gian làm bài</th>
                                            <th>Điểm số</th>
                                            <th>Trạng thái</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submissions.map(submission => (
                                            <tr key={submission.id}>
                                                <td>
                                                    <div className="student-info">
                                                        <strong>{submission.student?.fullname || submission.student?.username}</strong>
                                                        <small>{submission.student?.email}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="time-info">
                                                        <div>Bắt đầu: {formatDateTime(submission.startTime)}</div>
                                                        <div>Kết thúc: {formatDateTime(submission.endTime)}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div 
                                                        className="score-display"
                                                        style={{ 
                                                            color: getScoreColor(submission.score, submission.totalScore) 
                                                        }}
                                                    >
                                                        <strong>{submission.score}/{submission.totalScore}</strong>
                                                        <small>({((submission.score / submission.totalScore) * 100).toFixed(1)}%)</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${submission.status?.toLowerCase()}`}>
                                                        {submission.status === 'COMPLETED' ? 'Hoàn thành' : 
                                                         submission.status === 'IN_PROGRESS' ? 'Đang làm' : 
                                                         submission.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button 
                                                            className="btn btn-sm btn-outline"
                                                            onClick={() => window.open(`/teacher/submission/${submission.id}`, '_blank')}
                                                            title="Xem chi tiết"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default SubmissionManager; 