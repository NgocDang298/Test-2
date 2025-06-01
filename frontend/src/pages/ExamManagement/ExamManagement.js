import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Tooltip, List, Avatar, Card, Row, Col } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';

import { useParams, useNavigate } from 'react-router-dom';
import { UserAddOutlined } from '@ant-design/icons';
import './ExamManagement.css';
import axiosInstance from "../../services/axiosInstance";

const ExamManagement = () => {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [isAddStudentModal, setIsAddStudentModal] = useState(false);
    const [isStudentListModal, setIsStudentListModal] = useState(false);
    const [studentList, setStudentList] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [loadingStudentList, setLoadingStudentList] = useState(false);
    const [loadingAllStudents, setLoadingAllStudents] = useState(false);
    const [editingExam, setEditingExam] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editForm] = Form.useForm();
    const [deleteExamId, setDeleteExamId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [addingStudent, setAddingStudent] = useState(null);

    useEffect(() => {
        fetchExams();
        // eslint-disable-next-line
    }, [subjectId]);

    const fetchExams = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axiosInstance.get(`/api/teacher/exams/subject/${subjectId}`, {
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

    const handleAddExam = async (values) => {
        try {
            const token = localStorage.getItem('token');
            await axiosInstance.post(
                `/api/teacher/exams`,
                {
                    ...values,
                    subject: { id: Number(subjectId) }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            message.success('Thêm đề thi thành công');
            setIsModalVisible(false);
            form.resetFields();
            fetchExams();
        } catch (error) {
            message.error('Thêm đề thi thất bại');
        }
    };

    const fetchAllStudents = async () => {
        setLoadingAllStudents(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axiosInstance.get('/api/teacher/student/findall', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setAllStudents(response.data.data || response.data);
        } catch (error) {
            message.error('Không thể tải danh sách tất cả học sinh');
        } finally {
            setLoadingAllStudents(false);
        }
    };

    const handleShowAddStudentModal = async () => {
        setIsAddStudentModal(true);
        await Promise.all([
            fetchStudentsInSubject(),
            fetchAllStudents()
        ]);
    };

    const fetchStudentsInSubject = async () => {
        setLoadingStudentList(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axiosInstance.get(`/api/teacher/subjects/${subjectId}/students`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setStudentList(response.data);
        } catch (error) {
            message.error('Không thể tải danh sách học sinh trong môn học');
        } finally {
            setLoadingStudentList(false);
        }
    };

    const handleAddStudent = async (studentId) => {
        setAddingStudent(studentId);
        try {
            const token = localStorage.getItem('token');
            await axiosInstance.post(
                `/api/teacher/subjects/${subjectId}/students/${studentId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            message.success('Thêm học sinh thành công');
            // Refresh both lists
            await fetchStudentsInSubject();
        } catch (error) {
            message.error(
                error.response?.data?.message || 'Thêm học sinh thất bại'
            );
        } finally {
            setAddingStudent(null);
        }
    };

    const handleRemoveStudent = async (studentId) => {
        try {
            const token = localStorage.getItem('token');
            await axiosInstance.delete(`/api/teacher/subjects/${subjectId}/students/${studentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            message.success('Gỡ học sinh thành công');
            await fetchStudentsInSubject();
        } catch (error) {
            message.error('Gỡ học sinh thất bại');
        }
    };

    const handleShowStudentList = async () => {
        setIsStudentListModal(true);
        await fetchStudentsInSubject();
    };

    const handleDeleteExam = (examId) => {
        setDeleteExamId(examId);
    };

    const confirmDeleteExam = async () => {
        try {
            const token = localStorage.getItem('token');
            await axiosInstance.delete(`/api/teacher/exams/${deleteExamId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            message.success('Xóa đề thi thành công');
            setDeleteExamId(null);
            fetchExams();
        } catch (error) {
            message.error('Xóa đề thi thất bại');
        }
    };

    const handleEditExam = (exam) => {
        setEditingExam(exam);
        setIsEditModalVisible(true);
        editForm.setFieldsValue({
            title: exam.title,
            description: exam.description,
            duration: exam.duration,
        });
    };

    const handleUpdateExam = async (values) => {
        try {
            const token = localStorage.getItem('token');
            await axiosInstance.put(`/api/teacher/exams/${editingExam.id}`, {
                ...values,
                subject: { id: Number(subjectId) }
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            message.success('Cập nhật đề thi thành công');
            setIsEditModalVisible(false);
            setEditingExam(null);
            fetchExams();
        } catch (error) {
            message.error('Cập nhật đề thi thất bại');
        }
    };

    const getFilteredStudents = () => {
        if (!searchTerm.trim()) return allStudents;
        
        return allStudents.filter(student => 
            student.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.username?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const getAvailableStudents = () => {
        const filteredStudents = getFilteredStudents();
        return filteredStudents.filter(student => 
            !studentList.some(enrolled => enrolled.id === student.id)
        );
    };

    const columns = [
        { title: 'Tên đề thi', dataIndex: 'title', key: 'title' },
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
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <div className="table-actions">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/contest/${record.id}/${subjectId}`)}
                        />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button
                            shape="circle"
                            icon={<EditOutlined />}
                            style={{ margin: '0 8px' }}
                            onClick={() => handleEditExam(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            shape="circle"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => handleDeleteExam(record.id)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div className="exam-management">
            <div className="header">
                <h1>Quản lý môn học</h1>
                <div>
                    <Button
                        className="add-exam-btn"
                        icon={<UserAddOutlined />}
                        type="dashed"
                        onClick={handleShowAddStudentModal}
                    >
                        Quản lý học sinh
                    </Button>
                    <Button
                        className="add-exam-btn"
                        type="default"
                        onClick={handleShowStudentList}
                        style={{ marginRight: 8 }}
                    >
                        Xem danh sách học sinh
                    </Button>
                    <Button
                        className="add-exam-btn"
                        type="primary"
                        onClick={() => setIsModalVisible(true)}
                        style={{ marginRight: 8 }}
                    >
                        Tạo đề thi
                    </Button>
                </div>
            </div>
            <div className="table-container">
                <Table
                    columns={columns}
                    dataSource={exams}
                    loading={loading}
                    rowKey="id"
                    bordered
                    pagination={{ pageSize: 5 }}
                />
            </div>

            {/* Add Exam Modal */}
            <Modal
                title="Thêm đề thi mới"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleAddExam} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Tên đề thi"
                        rules={[{ required: true, message: 'Nhập tên đề thi!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Nhập mô tả!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="duration"
                        label="Thời gian (phút)"
                        rules={[{ required: true, message: 'Nhập thời gian!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Thêm đề thi
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Student Management Modal */}
            <Modal
                title="Quản lý học sinh trong môn học"
                open={isAddStudentModal}
                onCancel={() => {
                    setIsAddStudentModal(false);
                    setSearchTerm('');
                }}
                footer={null}
                width={1000}
            >
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Card 
                            title={`Học sinh đã tham gia (${studentList.length})`} 
                            size="small"
                            loading={loadingStudentList}
                        >
                            <List
                                dataSource={studentList}
                                renderItem={(student) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                type="primary"
                                                danger
                                                size="small"
                                                onClick={() => handleRemoveStudent(student.id)}
                                            >
                                                Gỡ
                                            </Button>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar icon={<UserOutlined />} />}
                                            title={student.fullname}
                                            description={
                                                <div>
                                                    <div>{student.email}</div>
                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                        @{student.username}
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                                locale={{ emptyText: 'Chưa có học sinh nào tham gia' }}
                            />
                        </Card>
                    </Col>
                    
                    <Col span={12}>
                        <Card 
                            title="Thêm học sinh mới" 
                            size="small"
                            extra={
                                <Input
                                    placeholder="Tìm kiếm học sinh..."
                                    prefix={<SearchOutlined />}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: 200 }}
                                />
                            }
                            loading={loadingAllStudents}
                        >
                            <List
                                dataSource={getAvailableStudents()}
                                renderItem={(student) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                type="primary"
                                                size="small"
                                                loading={addingStudent === student.id}
                                                onClick={() => handleAddStudent(student.id)}
                                            >
                                                Thêm
                                            </Button>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar icon={<UserOutlined />} />}
                                            title={student.fullname}
                                            description={
                                                <div>
                                                    <div>{student.email}</div>
                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                        @{student.username}
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                                locale={{ emptyText: searchTerm ? 'Không tìm thấy học sinh nào' : 'Tất cả học sinh đã được thêm' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Modal>

            {/* Student List Modal */}
            <Modal
                title="Danh sách học sinh trong môn học"
                open={isStudentListModal}
                onCancel={() => setIsStudentListModal(false)}
                footer={null}
                width={600}
            >
                <Card loading={loadingStudentList}>
                    <List
                        dataSource={studentList}
                        renderItem={(student) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} />}
                                    title={student.fullname}
                                    description={
                                        <div>
                                            <div><strong>Email:</strong> {student.email}</div>
                                            <div><strong>Username:</strong> @{student.username}</div>
                                            {student.phone && <div><strong>SĐT:</strong> {student.phone}</div>}
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                        locale={{ emptyText: 'Chưa có học sinh nào tham gia môn học này' }}
                    />
                </Card>
            </Modal>

            {/* Edit Exam Modal */}
            <Modal
                title="Sửa đề thi"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form form={editForm} onFinish={handleUpdateExam} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Tên đề thi"
                        rules={[{ required: true, message: 'Nhập tên đề thi!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Nhập mô tả!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="duration"
                        label="Thời gian (phút)"
                        rules={[{ required: true, message: 'Nhập thời gian!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Lưu thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Xác nhận xoá"
                open={!!deleteExamId}
                onOk={confirmDeleteExam}
                onCancel={() => setDeleteExamId(null)}
                okText="Xoá"
                okType="danger"
                cancelText="Huỷ"
            >
                Bạn có chắc muốn xoá đề thi này?
            </Modal>
        </div>
    );
};

export default ExamManagement;