import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined,EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Table, Button, Popconfirm, Modal, Form, Input, Select, message,Tooltip } from 'antd';
import './QuestionPage.css';
import axiosInstance from "../../services/axiosInstance";
const { Option } = Select;

const difficultyMap = {
    1: 'Easy',
    2: 'Moderate',
    3: 'Difficult'
};

const questionTypeMap = {
    1: 'Single Choice',
    2: 'Multiple Choice',
    3: 'True/False',

};

const QuestionPage = () => {
    const { subjectId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [form] = Form.useForm();
    const [isAddMode, setIsAddMode] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [questionDetail, setQuestionDetail] = useState(null);
    const [choices, setChoices] = useState([]);
    const [choiceForm] = Form.useForm();
    const [editingChoice, setEditingChoice] = useState(null);
    const navigate = useNavigate();

    const fetchQuestions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axiosInstance.get(`/api/teacher/question-bank/subject/${subjectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setQuestions(res.data);
        } catch (error) {
            // handle error
        }
    };


    useEffect(() => {
        fetchQuestions();
    }, [subjectId]);

    const handleEdit = (record) => {
        setIsAddMode(false);
        setEditingQuestion(record);
        form.resetFields();
        form.setFieldsValue({
            questionText: record.questionText,
            questionType: record.questionType,
            difficulty: record.difficulty,
            subject: record.subject?.id,
        });
        setEditModalVisible(true);

    };

    const handleAdd = () => {
        setIsAddMode(true);
        setEditingQuestion(null);
        form.resetFields();
        form.setFieldsValue({
            questionText: '',
            questionType: undefined,
            difficulty: undefined,
            subject: Number(subjectId),
        });
        setEditModalVisible(true);

    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const token = localStorage.getItem('token');
            if (isAddMode) {
                await axiosInstance.post(
                    `/api/teacher/question-bank`,
                    {
                        questionText: values.questionText,
                        questionType: values.questionType,
                        difficulty: values.difficulty,
                        subject: { id: values.subject },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                message.success('Thêm thành công!');
            } else {
                await axiosInstance.put(
                    `/api/teacher/question-bank/${editingQuestion.id}`,
                    {
                        questionText: values.questionText,
                        questionType: values.questionType,
                        difficulty: values.difficulty,
                        subject: { id: values.subject },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                message.success('Sửa thành công!');
            }
            setEditModalVisible(false);
            setEditingQuestion(null);
            fetchQuestions();
        } catch (error) {
            message.error(isAddMode ? 'Có lỗi khi thêm!' : 'Có lỗi xảy ra khi sửa!');
        }
    };

    const handleModalCancel = () => {
        setEditModalVisible(false);
        setEditingQuestion(null);
        form.resetFields();
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axiosInstance.delete(`/api/teacher/question-bank/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            message.success('Xoá thành công!');
            fetchQuestions();
        } catch (error) {
            message.error('Có lỗi xảy ra khi xoá!');
        }
    };

    const fetchChoices = async (questionId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axiosInstance.get(`/api/teacher/choices/question/${questionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setChoices(res.data);
        } catch (error) {
            message.error('Không lấy được đáp án!');
        }
    };

    const handleViewDetail = async (record) => {
        setQuestionDetail(record);
        setDetailModalVisible(true);
        await fetchChoices(record.id);
    };
    const handleAddChoice = () => {
        setEditingChoice(null);
        choiceForm.resetFields();
    };

    const handleEditChoice = (choice) => {
        setEditingChoice(choice);
        choiceForm.setFieldsValue({
            choiceText: choice.choiceText,
            isCorrect: choice.isCorrect,
        });
    };

    const handleDeleteChoice = async (choiceId) => {
        try {
            const token = localStorage.getItem('token');
            await axiosInstance.delete(`/api/teacher/choices/${choiceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            message.success('Xoá đáp án thành công!');
            fetchChoices(questionDetail.id);
        } catch (error) {
            message.error('Xoá đáp án thất bại!');
        }
    };

    const handleChoiceFormFinish = async (values) => {
        const token = localStorage.getItem('token');
        try {
            if (editingChoice) {
                // Sửa đáp án
                await axiosInstance.put(`/api/teacher/choices/${editingChoice.id}`, {
                    choiceText: values.choiceText,
                    isCorrect: values.isCorrect,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                message.success('Sửa đáp án thành công!');
            } else {
                // Thêm đáp án
                await axiosInstance.post(`/api/teacher/choices/question/${questionDetail.id}`, {
                    choiceText: values.choiceText,
                    isCorrect: values.isCorrect,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                message.success('Thêm đáp án thành công!');
            }
            fetchChoices(questionDetail.id);
            choiceForm.resetFields();
            setEditingChoice(null);
        } catch (error) {
            message.error('Có lỗi khi lưu đáp án!');
        }
    };
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
            align: 'center',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Nội dung câu hỏi',
            dataIndex: 'questionText',
            key: 'questionText',
            width: 420,
            align: 'left',
            sorter: (a, b) => a.questionText.localeCompare(b.questionText),
            render: (text) => (
                <div className="question-content" title={text}>{text}</div>
            ),
        },
        {
            title: 'Kiểu câu hỏi',
            dataIndex: 'questionType',
            key: 'questionType',
            width: 150,
            align: 'center',
            sorter: (a, b) => a.questionType.localeCompare(b.questionType),
            render: (type) => (
                <span className={`type-tag type-${type}`}>{questionTypeMap[type] || type}</span>
            ),
        },
        {
            title: 'Độ khó',
            dataIndex: 'difficulty',
            key: 'difficulty',
            width: 120,
            align: 'center',
            sorter: (a, b) => a.difficulty - b.difficulty,
            render: (value) => (
                <span className={`difficulty-tag difficulty-${value}`}>{difficultyMap[value] || value}</span>
            ),
        },
        {
            title: 'Người thêm',
            dataIndex: ['createdBy', 'fullname'],
            key: 'createdBy',
            width: 160,
            align: 'center',
            sorter: (a, b) => a.createdBy?.fullname.localeCompare(b.createdBy?.fullname),
            render: (_, record) => record.createdBy?.fullname || '---',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>

                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined style={{ color: '#1890ff', fontSize: 18 }} />}
                            onClick={() => handleViewDetail(record)}
                            title="Xem chi tiết"
                        />
                    </Tooltip>
                    <Button
                        type="text"
                        icon={<EditOutlined style={{ color: '#1890ff', fontSize: 18 }} />}
                        onClick={() => handleEdit(record)}
                        title="Sửa"
                    />
                    <Popconfirm
                        title="Bạn chắc chắn muốn xoá?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xoá"
                        cancelText="Huỷ"
                    >
                        <Button
                            type="text"
                            icon={<DeleteOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />}
                            danger
                            title="Xoá"
                        />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="question-page-container">
            <h2>Ngân hàng câu hỏi</h2>
            <div className="question-action-bar">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    style={{ fontWeight: 500, minWidth: 140 }}
                >
                    Thêm câu hỏi
                </Button>
            </div>
            <div className="question-table-wrapper">
                <Table
                    className="question-table"
                    columns={columns}
                    dataSource={questions}
                    rowKey="id"
                    bordered
                    size="large"
                    pagination={{ pageSize: 8, showSizeChanger: false }}
                    scroll={false}
                />
            </div>
            <Modal
                title={isAddMode ? "Thêm câu hỏi" : "Sửa câu hỏi"}
                open={editModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText={isAddMode ? "Thêm" : "Xác nhận"}
                cancelText="Huỷ"
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    // key={editingQuestion?.id || 'add'}
                    // initialValues={
                    //     isAddMode
                    //         ? {
                    //             questionText: '',
                    //             questionType: undefined,
                    //             difficulty: undefined,
                    //             subject: Number(subjectId),
                    //         }
                    //         : {
                    //             questionText: editingQuestion?.questionText,
                    //             questionType: editingQuestion?.questionType,
                    //             difficulty: editingQuestion?.difficulty,
                    //             subject: editingQuestion?.subject?.id,
                    //         }
                    // }
                    destroyOnClose
                >
                    <Form.Item
                        label="Nội dung câu hỏi"
                        name="questionText"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Loại câu hỏi"
                        name="questionType"
                        rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi!' }]}
                    >
                        <Select>
                            <Option value="1">Single Choice</Option>
                            <Option value="2">Mutiple Choice</Option>
                            <Option value="3">True/False</Option>
                            {/*<Option value="short_answer">Short Answer</Option>*/}
                            {/*<Option value="single_choice">Single_Choice</Option>*/}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Độ khó"
                        name="difficulty"
                        rules={[{ required: true, message: 'Vui lòng chọn độ khó!' }]}
                    >
                        <Select>
                            <Option value={1}>Easy</Option>
                            <Option value={2}>Moderate</Option>
                            <Option value={3}>Difficult</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Môn học (ID)"
                        name="subject"
                        rules={[{ required: true, message: 'Vui lòng nhập ID môn học!' }]}
                    >
                        <Input type="number" disabled />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Chi tiết câu hỏi"
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={null}
                width={600}
                destroyOnClose
            >
                {questionDetail && (
                    <div>
                        <div style={{ marginBottom: 12 }}>
                            <b>Nội dung:</b> {questionDetail.questionText}
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <b>Loại:</b> {questionTypeMap[questionDetail.questionType] || questionDetail.questionType}
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <b>Độ khó:</b> {difficultyMap[questionDetail.difficulty] || questionDetail.difficulty}
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <b>Đáp án:</b>
                            <Table
                                dataSource={choices}
                                rowKey="id"
                                pagination={false}
                                size="small"
                                style={{ marginTop: 8 }}
                                columns={[
                                    {
                                        title: 'Nội dung đáp án',
                                        dataIndex: 'choiceText',
                                        key: 'choiceText',
                                    },
                                    {
                                        title: 'Đúng?',
                                        dataIndex: 'isCorrect',
                                        key: 'isCorrect',
                                        render: (val) => val ? '✔️' : '',
                                        align: 'center',
                                    },
                                    {
                                        title: 'Thao tác',
                                        key: 'actions',
                                        align: 'center',
                                        render: (_, choice) => (
                                            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                                <Button
                                                    type="link"
                                                    onClick={() => handleEditChoice(choice)}
                                                >Sửa</Button>
                                                <Popconfirm
                                                    title="Xoá đáp án này?"
                                                    onConfirm={() => handleDeleteChoice(choice.id)}
                                                >
                                                    <Button type="link" danger>Xoá</Button>
                                                </Popconfirm>
                                            </div>
                                        ),
                                    }
                                ]}
                            />
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <b>{editingChoice ? 'Sửa đáp án' : 'Thêm đáp án mới'}</b>
                            <Form
                                form={choiceForm}
                                layout="inline"
                                style={{ marginTop: 8 }}
                                onFinish={handleChoiceFormFinish}
                                initialValues={{ isCorrect: false }}
                            >
                                <Form.Item
                                    name="choiceText"
                                    rules={[{ required: true, message: 'Nhập nội dung đáp án' }]}
                                >
                                    <Input placeholder="Nội dung đáp án" />
                                </Form.Item>
                                <Form.Item name="isCorrect" valuePropName="checked">
                                    <Select style={{ width: 120 }}>
                                        <Option value={true}>Đúng</Option>
                                        <Option value={false}>Sai</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        {editingChoice ? 'Lưu' : 'Thêm'}
                                    </Button>
                                    {editingChoice && (
                                        <Button
                                            style={{ marginLeft: 8 }}
                                            onClick={() => {
                                                setEditingChoice(null);
                                                choiceForm.resetFields();
                                            }}
                                        >
                                            Huỷ
                                        </Button>
                                    )}
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default QuestionPage;