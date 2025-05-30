import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../services/axiosInstance';
import useAuth from '../../hooks/useAuth';
import './TeacherExamPage.css';

const TeacherExamPage = () => {
    const { user, accessToken } = useAuth();
    const [exams, setExams] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingExam, setEditingExam] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: 60,
        subjectId: '',
        startTime: '',
        endTime: '',
        maxAttempts: 1,
        shuffleQuestions: false,
        showResults: true
    });

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
            const response = await axiosInstance.get('/api/teacher/subjects');
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

    const handleCreateExam = async (e) => {
        e.preventDefault();
        try {
            const examData = {
                ...formData,
                subjectId: selectedSubject
            };
            
            await axiosInstance.post('/api/teacher/exams', examData);
            
            setShowCreateModal(false);
            resetForm();
            fetchExamsBySubject(selectedSubject);
            toast.success('Tạo bài thi thành công!');
        } catch (error) {
            console.error('Error creating exam:', error);
            toast.error('Có lỗi xảy ra khi tạo bài thi');
        }
    };

    const handleUpdateExam = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/api/teacher/exams/${editingExam.id}`, formData);
            
            setEditingExam(null);
            resetForm();
            fetchExamsBySubject(selectedSubject);
            toast.success('Cập nhật bài thi thành công!');
        } catch (error) {
            console.error('Error updating exam:', error);
            toast.error('Có lỗi xảy ra khi cập nhật bài thi');
        }
    };

    const handleDeleteExam = async (examId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài thi này?')) {
            try {
                await axiosInstance.delete(`/api/teacher/exams/${examId}`);
                fetchExamsBySubject(selectedSubject);
                toast.success('Xóa bài thi thành công!');
            } catch (error) {
                console.error('Error deleting exam:', error);
                toast.error('Có lỗi xảy ra khi xóa bài thi');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            duration: 60,
            subjectId: '',
            startTime: '',
            endTime: '',
            maxAttempts: 1,
            shuffleQuestions: false,
            showResults: true
        });
    };

    const openEditModal = (exam) => {
        setEditingExam(exam);
        setFormData({
            title: exam.title || '',
            description: exam.description || '',
            duration: exam.duration || 60,
            subjectId: exam.subjectId || '',
            startTime: exam.startTime || '',
            endTime: exam.endTime || '',
            maxAttempts: exam.maxAttempts || 1,
            shuffleQuestions: exam.shuffleQuestions || false,
            showResults: exam.showResults || true
        });
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
        <div className="teacher-exam-page">
            <div className="page-header">
                <h1>
                    <i className="fas fa-file-alt"></i>
                    Quản lý Bài thi
                </h1>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    <i className="fas fa-plus"></i>
                    Tạo bài thi mới
                </button>
            </div>

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
                        <p>Hãy tạo bài thi đầu tiên cho môn học này</p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowCreateModal(true)}
                        >
                            Tạo bài thi mới
                        </button>
                    </div>
                ) : (
                    <div className="exams-grid">
                        {exams.map(exam => (
                            <div key={exam.id} className="exam-card">
                                <div className="exam-header">
                                    <h3>{exam.title}</h3>
                                    <div className="exam-actions">
                                        <button 
                                            className="btn btn-sm btn-outline"
                                            onClick={() => openEditModal(exam)}
                                            title="Chỉnh sửa"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteExam(exam.id)}
                                            title="Xóa"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="exam-info">
                                    <p className="exam-description">{exam.description}</p>
                                    <div className="exam-details">
                                        <span className="detail-item">
                                            <i className="fas fa-clock"></i>
                                            {exam.duration} phút
                                        </span>
                                        <span className="detail-item">
                                            <i className="fas fa-question-circle"></i>
                                            {exam.questions?.length || 0} câu hỏi
                                        </span>
                                        <span className="detail-item">
                                            <i className="fas fa-redo"></i>
                                            {exam.maxAttempts} lần làm
                                        </span>
                                    </div>
                                </div>

                                <div className="exam-footer">
                                    <Link 
                                        to={`/teacher/exam/${exam.id}/questions`}
                                        className="btn btn-outline"
                                    >
                                        <i className="fas fa-list"></i>
                                        Quản lý câu hỏi
                                    </Link>
                                    <Link 
                                        to={`/teacher/exam/${exam.id}/results`}
                                        className="btn btn-outline"
                                    >
                                        <i className="fas fa-chart-bar"></i>
                                        Xem kết quả
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {(showCreateModal || editingExam) && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>
                                {editingExam ? 'Chỉnh sửa bài thi' : 'Tạo bài thi mới'}
                            </h2>
                            <button 
                                className="modal-close"
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setEditingExam(null);
                                    resetForm();
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={editingExam ? handleUpdateExam : handleCreateExam}>
                            <div className="form-group">
                                <label htmlFor="title">Tên bài thi *</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required
                                    placeholder="Nhập tên bài thi"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Mô tả</label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Nhập mô tả bài thi"
                                    rows="3"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="duration">Thời gian (phút) *</label>
                                    <input
                                        type="number"
                                        id="duration"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                                        required
                                        min="1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="maxAttempts">Số lần làm tối đa</label>
                                    <input
                                        type="number"
                                        id="maxAttempts"
                                        value={formData.maxAttempts}
                                        onChange={(e) => setFormData({...formData, maxAttempts: parseInt(e.target.value)})}
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="startTime">Thời gian bắt đầu</label>
                                    <input
                                        type="datetime-local"
                                        id="startTime"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="endTime">Thời gian kết thúc</label>
                                    <input
                                        type="datetime-local"
                                        id="endTime"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.shuffleQuestions}
                                            onChange={(e) => setFormData({...formData, shuffleQuestions: e.target.checked})}
                                        />
                                        <span className="checkmark"></span>
                                        Trộn thứ tự câu hỏi
                                    </label>

                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.showResults}
                                            onChange={(e) => setFormData({...formData, showResults: e.target.checked})}
                                        />
                                        <span className="checkmark"></span>
                                        Hiển thị kết quả sau khi làm xong
                                    </label>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingExam(null);
                                        resetForm();
                                    }}
                                >
                                    Hủy
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingExam ? 'Cập nhật' : 'Tạo bài thi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherExamPage; 