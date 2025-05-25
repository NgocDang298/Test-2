import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const ExamManagement = () => {
    const [exams, setExams] = useState();
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/exams');
            setExams(response.data);
        } catch (error) {
            message.error('Failed to fetch exams');
        } finally {
            setLoading(false);
        }
    };

    const handleAddExam = async (values) => {
        try {
            await axios.post('http://localhost:5000/api/exams', values);
            message.success('Exam added successfully');
            setIsModalVisible(false);
            form.resetFields();
            fetchExams();
        } catch (error) {
            message.error('Failed to add exam');
        }
    };
    const handleEditExam = ()=>{

    }
    const handleDeleteExam =()=>{

    }
    const columns = [
        {
            title: 'Exam Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Duration (minutes)',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Total Questions',
            dataIndex: 'totalQuestions',
            key: 'totalQuestions',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <Button type="link" onClick={() => handleEditExam(record.id)}>
                        Edit
                    </Button>
                    <Button type="link" onClick={() => handleDeleteExam(record.id)}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="exam-management">
            <div className="header">
                <h1>Exam Management</h1>
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                    Add Exam
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={exams}
                loading={loading}
                rowKey="id"
            />

            <Modal
                title="Add New Exam"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleAddExam}>
                    <Form.Item
                        name="name"
                        label="Exam Name"
                        rules={[{ required: true, message: 'Please input exam name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="duration"
                        label="Duration (minutes)"
                        rules={[{ required: true, message: 'Please input duration!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="totalQuestions"
                        label="Total Questions"
                        rules={[{ required: true, message: 'Please input total questions!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Exam
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ExamManagement; 