import React, { useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import axiosInstance from "../../services/axiosInstance";
import './ContestPage.css';
import { DeleteOutlined, PlusCircleOutlined, DatabaseOutlined } from '@ant-design/icons';
import { message, Table, Button, Pagination, Tooltip } from "antd";


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

const ContestPage = () => {
    const { examId,subjectId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [questionIdInput, setQuestionIdInput] = useState('');
    const [randomCount, setRandomCount] = useState(1);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showRandomForm, setShowRandomForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 8;
    const navigate = useNavigate();
    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axiosInstance.get(`/api/teacher/questions/exam/${examId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setQuestions(res.data);
        } catch (error) {
            // Xử lý lỗi nếu cần
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
        // eslint-disable-next-line
    }, [subjectId, examId]);

    const handleAddQuestion = async () => {
        if (!questionIdInput) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axiosInstance.post(
                `/api/teacher/questions/exam/${examId}/question-bank/${questionIdInput}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setQuestions(prev => [...prev, res.data]);
            setQuestionIdInput('');
            setShowAddForm(false);
            message.success('Thêm câu hỏi thành công');
        } catch (error) {
            message.error('Thêm câu hỏi thất bại');
        }
    };

    const handleAddRandomQuestions = async () => {
        if (!randomCount || randomCount < 1) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axiosInstance.post(
                `/api/teacher/questions/exam/${examId}/auto-generate?numberOfQuestions=${randomCount}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (Array.isArray(res.data)) {
                setQuestions(prev => [...prev, ...res.data]);
            } else {
                fetchQuestions();
            }
            setRandomCount(1);
            setShowRandomForm(false);
            message.success('Thêm ngẫu nhiên thành công');
        } catch (error) {
            message.error('Thêm ngẫu nhiên thất bại');
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        try {
            const token = localStorage.getItem('token');
            await axiosInstance.delete(
                `/api/teacher/questions/exam/${examId}/question/${questionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setQuestions(prev => prev.filter(q => q.questionBank.id !== questionId));
            message.success('Xoá thành công');
        } catch (error) {
            message.error('Xoá thất bại');
        }
    };

    // Table columns
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_, __, idx) => (questionsPerPage * (currentPage - 1)) + idx + 1,
            width: 70,
        },
        {
            title: 'Câu hỏi',
            dataIndex: ['questionBank', 'questionText'],
            key: 'questionText',
            render: (_, record) => record.questionBank?.questionText,
        },
        {
            title: 'Loại',
            dataIndex: ['questionBank', 'questionType'],
            key: 'questionType',
            render: (_, record) => questionTypeMap[record.questionBank?.questionType] || 'Khác',
            width: 140,
        },
        {
            title: 'Độ khó',
            dataIndex: ['questionBank', 'difficulty'],
            key: 'difficulty',
            render: (_, record) => difficultyMap[record.questionBank?.difficulty] || record.questionBank?.difficulty,
            width: 120,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 90,
            render: (_, record) => (
                <Button
                    type="text"
                    icon={<DeleteOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />}
                    onClick={() => handleDeleteQuestion(record.questionBank.id)}
                    danger
                />
            ),
        },
    ];

    // Pagination data
    const paginatedQuestions = questions.slice(
        (currentPage - 1) * questionsPerPage,
        currentPage * questionsPerPage
    );

    return (
        <div className="contest-page">
            <div className="contest-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
                <h2 className="contest-title" style={{ marginBottom: 0 }}>Danh sách câu hỏi của đề thi</h2>
                <div className="actions-bar" style={{ marginTop: 8 }}>
                    <Button
                        type="primary"
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            setShowRandomForm(false);
                        }}
                        style={{ marginRight: 8 }}
                    >
                        Thêm câu hỏi
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            setShowRandomForm(!showRandomForm);
                            setShowAddForm(false);
                        }}
                    >
                        Tạo đề thi ngẫu nhiên
                    </Button>
                    <Button
                        type="default"
                        icon={<DatabaseOutlined />}
                        onClick={() => navigate(`/question-bank/${subjectId}`)}
                        style={{ marginRight: 8 }}
                    >
                        Ngân hàng câu hỏi
                    </Button>


                </div>
            </div>
            {showAddForm && (
                <div className="add-form">
                    <input
                        type="number"
                        placeholder="Nhập ID câu hỏi"
                        value={questionIdInput}
                        onChange={e => setQuestionIdInput(e.target.value)}
                        min={1}
                    />
                    <Button type="primary" onClick={handleAddQuestion}>Xác nhận</Button>
                    <Button onClick={() => setShowAddForm(false)} style={{ background: '#aaa', color: '#fff' }}>Huỷ</Button>
                </div>
            )}
            {showRandomForm && (
                <div className="add-form">
                    <input
                        type="number"
                        placeholder="Số lượng ngẫu nhiên"
                        value={randomCount}
                        onChange={e => setRandomCount(e.target.value)}
                        min={1}
                    />
                    <Button type="primary" onClick={handleAddRandomQuestions}>Xác nhận</Button>
                    <Button onClick={() => setShowRandomForm(false)} style={{ background: '#aaa', color: '#fff' }}>Huỷ</Button>
                </div>
            )}

            <div className="table-contest">
                <Table
                    columns={columns}
                    dataSource={paginatedQuestions}
                    rowKey={record => record.id}
                    loading={loading}
                    pagination={false}
                    locale={{
                        emptyText: 'Chưa có câu hỏi nào trong đề thi này.',
                    }}
                    style={{ marginTop: 32 }}
                />
            </div>

            {questions.length > questionsPerPage && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
                    <Pagination
                        current={currentPage}
                        pageSize={questionsPerPage}
                        total={questions.length}
                        onChange={page => setCurrentPage(page)}
                        showSizeChanger={false}
                    />
                </div>
            )}
        </div>
    );
};

export default ContestPage;