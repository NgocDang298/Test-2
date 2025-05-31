import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosInstance from "../../services/axiosInstance";
import { useParams, useNavigate } from 'react-router-dom';
import { UserAddOutlined } from '@ant-design/icons';
import './HsExamPage.css';

const ExamManagement = () => {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [isAddStudentModal, setIsAddStudentModal] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [isStudentListModal, setIsStudentListModal] = useState(false);
    const [studentList, setStudentList] = useState([]);
    const [loadingStudentList, setLoadingStudentList] = useState(false);
    const [editingExam, setEditingExam] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editForm] = Form.useForm();
    const [deleteExamId, setDeleteExamId] = useState(null);
    useEffect(() => {
        fetchExams();
        // eslint-disable-next-line
    }, [subjectId]);

    const fetchExams = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axiosInstance.get(`/api/student/subject/${subjectId}/exams`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setExams(response.data);
        } catch (error) {
            message.error('Không thể tải danh sách đề thi');
        } finally {
            setLoading(false);
        }
    };
    
   

    const columns = [
        {
            title: 'Tên đề thi',
            dataIndex: 'title',
            key: 'title',
        
            render: (text, record) => (
            <a
                style={{ cursor: 'pointer', color: '#1677ff' }}
                onClick={() => navigate(`/student/question/exam/${record.id}/ready`, { state: { examInfo: record } })}
            >
                {text}
            </a>
            ),

        },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        { title: 'Thời gian (phút)', dataIndex: 'duration', key: 'duration', align: 'center' },
        {
            title: 'Người tạo',
            dataIndex: ['createdBy', 'fullname'],
            key: 'createdBy',
            render: (_, record) => record.createdBy?.fullname || '---',
            align: 'center'
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => new Date(text).toLocaleDateString('vi-VN'),
            align: 'center'
        },
    ];





    return (
        <div className="exam-management">
            <div className="header">
                <h1>Quản lý đề thi môn học</h1>

            </div>
            <div className="table-container">
                <Table
                    columns={columns}
                    dataSource={exams}
                    loading={loading}
                    rowKey="id"
                    bordered
                    pagination={{ pageSize: 5 , showSizeChanger: false}}
                />
            </div>

        </div>
    );
};

export default ExamManagement;