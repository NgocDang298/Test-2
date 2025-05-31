import React, { useState, useEffect } from 'react';
import axiosInstance from "../../services/axiosInstance";
import './HsSubjectPage.css';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
// Hàm lấy đường dẫn ảnh từ thư mục public/images
const getSubjectImage = (name) => {
    const key = name
        .normalize('NFD') // chuẩn hoá tổ hợp (dấu tách riêng)
        .replace(/[̀-ͯ]/g, '') // xoá dấu
        .toLowerCase()
        .trim();

    const images = {
        'toan': '/images/math.jpg',
        'vat ly': '/images/physic.jpg',
        'hoa hoc': '/images/chemis.jpg',
        'tieng anh': '/images/english.jpg',
        'sinh hoc': '/images/biology.jpg',
        'tin hoc': '/images/informatic.jpg',


    };

    // Nếu không có key, dùng ảnh mặc định
    return images[key] || './images/default.jpg';
};

const ExamPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editSubject, setEditSubject] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const navigate = useNavigate();
    const openAddForm = () => {
        setEditSubject(null);
        setFormData({ name: '', description: '' });
        setShowForm(true);
    };
    const openEditForm = (subject) => {
        setEditSubject(subject);
        setFormData({ name: subject.name, description: subject.description });
        setShowForm(true);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (editSubject) {
                
                const res = await axiosInstance.put(
                    `/api/teacher/subjects/${editSubject.id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSubjects(subjects.map(s => s.id === editSubject.id ? res.data : s));
            } else {
                
                const res = await axiosInstance.post(
                    '/api/teacher/subjects',
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSubjects([...subjects, res.data]);
            }
            setShowForm(false);
        } catch (err) {
            alert('Lưu thất bại!');
        }
    };
    const closeForm = () => setShowForm(false);

    useEffect(() => {
        let isMounted = true;

        const fetchSubjects = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const response = await axiosInstance.get('/api/student/subjects', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (isMounted) {
                    setSubjects(response.data);
                }
            } catch (err) {
                console.error('Lỗi khi fetch môn học:', err);
                if (isMounted) {
                    setError(
                        err.response?.data?.message ||
                        err.message ||
                        'Đã xảy ra lỗi khi tải dữ liệu.'
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchSubjects();
        return () => { isMounted = false; };
    }, []);

    return (
        <div className={`exam-container main-content ep${showForm ? ' modal-open' : ''}`}>
            <h1 className="subject-title">Danh sách môn học của tôi</h1>

            {subjects.length === 0 ? (
                <p className="no-subjects">Không có môn học nào.</p>
            ) : (
                <div className="subject-list">
                    {subjects
                        .slice() 
                        .sort((a, b) => {
                            const codeA = (a.code || a.id).toString();
                            const codeB = (b.code || b.id).toString();
                            return codeA.localeCompare(codeB, undefined, { numeric: true });
                        })
                        .map((subject) => (
                            <div
                                className="subject-card"
                                key={subject.id}
                                onClick={() => {
                                    navigate(`/student/subject/${subject.id}/exams`);
                                }}
                            >
                                <div className="subject-card-img">
                                    <img
                                        src={getSubjectImage(subject.name)}
                                        alt={subject.name}
                                    />
                                </div>
                                <div className="subject-card-content">
                                    <div className="subject-card-title">
                                        {subject.name}

                                    </div>
                                    <div className="subject-card-desc">{subject.description}</div>
                                    <div className="subject-card-meta">
                                        <span>Mã môn: {subject.code || subject.id}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default ExamPage;
