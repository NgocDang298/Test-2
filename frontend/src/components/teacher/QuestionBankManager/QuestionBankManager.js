import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Table, message, Space, Select, Radio, Popconfirm, Tag, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { 
  createQuestion, 
  updateQuestion, 
  deleteQuestion, 
  getQuestionsBySubject,
  importQuestionsFromFile,
  exportQuestionsToFile
} from '../../../services/QuestionService';
import './QuestionBankManager.css';

const { Option } = Select;
const { TextArea } = Input;

const QuestionBankManager = ({ subjects }) => {
  const [questions, setQuestions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [viewingQuestion, setViewingQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [form] = Form.useForm();
  const [answers, setAnswers] = useState([{ text: '', isCorrect: false }]);

  useEffect(() => {
    if (selectedSubject) {
      fetchQuestions();
    }
  }, [selectedSubject]);

  const fetchQuestions = async () => {
    if (!selectedSubject) return;
    
    try {
      setLoading(true);
      const response = await getQuestionsBySubject(selectedSubject);
      setQuestions(response.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (values) => {
    try {
      setLoading(true);
      const questionData = {
        ...values,
        subjectId: selectedSubject,
        answers: answers.filter(answer => answer.text.trim() !== '')
      };
      
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, questionData);
        message.success('Cập nhật câu hỏi thành công!');
      } else {
        await createQuestion(questionData);
        message.success('Tạo câu hỏi thành công!');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingQuestion(null);
      setAnswers([{ text: '', isCorrect: false }]);
      fetchQuestions();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    form.setFieldsValue({
      questionText: question.questionText,
      questionType: question.questionType,
      difficulty: question.difficulty,
      explanation: question.explanation
    });
    setAnswers(question.answers || [{ text: '', isCorrect: false }]);
    setIsModalVisible(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      setLoading(true);
      await deleteQuestion(questionId);
      message.success('Xóa câu hỏi thành công!');
      fetchQuestions();
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuestion = (question) => {
    setViewingQuestion(question);
    setIsViewModalVisible(true);
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, { text: '', isCorrect: false }]);
  };

  const handleRemoveAnswer = (index) => {
    if (answers.length > 1) {
      const newAnswers = answers.filter((_, i) => i !== index);
      setAnswers(newAnswers);
    }
  };

  const handleAnswerChange = (index, field, value) => {
    const newAnswers = [...answers];
    newAnswers[index][field] = value;
    
    // For single choice questions, ensure only one correct answer
    if (field === 'isCorrect' && value && form.getFieldValue('questionType') === 1) {
      newAnswers.forEach((answer, i) => {
        if (i !== index) answer.isCorrect = false;
      });
    }
    
    setAnswers(newAnswers);
  };

  const handleImport = async (file) => {
    try {
      setLoading(true);
      await importQuestionsFromFile(selectedSubject, file);
      message.success('Import câu hỏi thành công!');
      fetchQuestions();
    } catch (error) {
      message.error('Có lỗi xảy ra khi import câu hỏi');
    } finally {
      setLoading(false);
    }
    return false; // Prevent default upload behavior
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      await exportQuestionsToFile(selectedSubject);
      message.success('Export câu hỏi thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi export câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Câu hỏi',
      dataIndex: 'questionText',
      key: 'questionText',
      ellipsis: true,
      render: (text) => (
        <div className="question-text" title={text}>
          {text}
        </div>
      )
    },
    {
      title: 'Loại',
      dataIndex: 'questionType',
      key: 'questionType',
      width: 120,
      render: (type) => {
        const typeMap = {
          1: { text: 'Trắc nghiệm', color: 'blue' },
          2: { text: 'Nhiều lựa chọn', color: 'green' },
          3: { text: 'Đúng/Sai', color: 'orange' },
          4: { text: 'Tự luận', color: 'purple' }
        };
        const typeInfo = typeMap[type] || { text: 'Không xác định', color: 'gray' };
        return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
      }
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
      render: (difficulty) => {
        const difficultyMap = {
          1: { text: 'Dễ', color: 'success' },
          2: { text: 'Trung bình', color: 'warning' },
          3: { text: 'Khó', color: 'error' }
        };
        const diffInfo = difficultyMap[difficulty] || { text: 'Không xác định', color: 'default' };
        return <Tag color={diffInfo.color}>{diffInfo.text}</Tag>;
      }
    },
    {
      title: 'Số đáp án',
      key: 'answersCount',
      width: 100,
      render: (_, record) => (
        <span>{record.answers ? record.answers.length : 0}</span>
      )
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewQuestion(record)}
          >
            Xem
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditQuestion(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa câu hỏi này?"
            onConfirm={() => handleDeleteQuestion(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const renderAnswerInputs = () => {
    const questionType = form.getFieldValue('questionType');
    
    if (questionType === 4) { // Essay question
      return null;
    }

    return (
      <Form.Item label="Đáp án" required>
        {answers.map((answer, index) => (
          <div key={index} className="answer-input-group">
            <Input
              placeholder={`Đáp án ${index + 1}`}
              value={answer.text}
              onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
              style={{ flex: 1 }}
            />
            {questionType === 3 ? ( // True/False
              <Select
                value={answer.isCorrect}
                onChange={(value) => handleAnswerChange(index, 'isCorrect', value)}
                style={{ width: 100, marginLeft: 8 }}
              >
                <Option value={true}>Đúng</Option>
                <Option value={false}>Sai</Option>
              </Select>
            ) : (
              <Radio
                checked={answer.isCorrect}
                onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                style={{ marginLeft: 8 }}
              >
                Đúng
              </Radio>
            )}
            {answers.length > 1 && (
              <Button
                type="danger"
                size="small"
                onClick={() => handleRemoveAnswer(index)}
                style={{ marginLeft: 8 }}
              >
                Xóa
              </Button>
            )}
          </div>
        ))}
        {questionType !== 3 && (
          <Button
            type="dashed"
            onClick={handleAddAnswer}
            style={{ width: '100%', marginTop: 8 }}
          >
            Thêm đáp án
          </Button>
        )}
      </Form.Item>
    );
  };

  return (
    <div className="question-bank-manager">
      <div className="manager-header">
        <h2>Ngân hàng câu hỏi</h2>
        <Space>
          <Select
            placeholder="Chọn môn học"
            style={{ width: 200 }}
            onChange={setSelectedSubject}
            value={selectedSubject}
          >
            {subjects.map(subject => (
              <Option key={subject.id} value={subject.id}>
                {subject.name}
              </Option>
            ))}
          </Select>
          <Upload
            beforeUpload={handleImport}
            showUploadList={false}
            accept=".xlsx,.xls,.csv"
            disabled={!selectedSubject}
          >
            <Button icon={<UploadOutlined />} disabled={!selectedSubject}>
              Import
            </Button>
          </Upload>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            disabled={!selectedSubject || questions.length === 0}
          >
            Export
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            disabled={!selectedSubject}
          >
            Tạo câu hỏi mới
          </Button>
        </Space>
      </div>

      {selectedSubject ? (
        <Table
          columns={columns}
          dataSource={questions}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} câu hỏi`
          }}
        />
      ) : (
        <div className="no-subject-selected">
          <p>Vui lòng chọn môn học để xem ngân hàng câu hỏi</p>
        </div>
      )}

      {/* Create/Edit Question Modal */}
      <Modal
        title={editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Tạo câu hỏi mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingQuestion(null);
          setAnswers([{ text: '', isCorrect: false }]);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateQuestion}
          initialValues={{ questionType: 1, difficulty: 1 }}
        >
          <Form.Item
            name="questionText"
            label="Nội dung câu hỏi"
            rules={[
              { required: true, message: 'Vui lòng nhập nội dung câu hỏi!' },
              { min: 10, message: 'Câu hỏi phải có ít nhất 10 ký tự!' }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Nhập nội dung câu hỏi"
            />
          </Form.Item>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="questionType"
              label="Loại câu hỏi"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Select
                onChange={(value) => {
                  if (value === 3) { // True/False
                    setAnswers([
                      { text: 'Đúng', isCorrect: true },
                      { text: 'Sai', isCorrect: false }
                    ]);
                  } else if (value === 4) { // Essay
                    setAnswers([]);
                  } else {
                    setAnswers([{ text: '', isCorrect: false }]);
                  }
                }}
              >
                <Option value={1}>Trắc nghiệm (1 đáp án đúng)</Option>
                <Option value={2}>Nhiều lựa chọn (nhiều đáp án đúng)</Option>
                <Option value={3}>Đúng/Sai</Option>
                <Option value={4}>Tự luận</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="difficulty"
              label="Độ khó"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Select>
                <Option value={1}>Dễ</Option>
                <Option value={2}>Trung bình</Option>
                <Option value={3}>Khó</Option>
              </Select>
            </Form.Item>
          </Space>

          {renderAnswerInputs()}

          <Form.Item
            name="explanation"
            label="Giải thích (tùy chọn)"
          >
            <TextArea 
              rows={3} 
              placeholder="Nhập giải thích cho câu hỏi"
            />
          </Form.Item>

          <Form.Item className="form-actions">
            <Space>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingQuestion(null);
                setAnswers([{ text: '', isCorrect: false }]);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingQuestion ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Question Modal */}
      <Modal
        title="Chi tiết câu hỏi"
        open={isViewModalVisible}
        onCancel={() => {
          setIsViewModalVisible(false);
          setViewingQuestion(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsViewModalVisible(false);
            setViewingQuestion(null);
          }}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {viewingQuestion && (
          <div className="question-detail">
            <div className="question-info">
              <h3>Nội dung câu hỏi:</h3>
              <p className="question-text">{viewingQuestion.questionText}</p>
              
              <div className="question-meta">
                <Space size="large">
                  <div>
                    <strong>Loại: </strong>
                    {(() => {
                      const typeMap = {
                        1: 'Trắc nghiệm',
                        2: 'Nhiều lựa chọn',
                        3: 'Đúng/Sai',
                        4: 'Tự luận'
                      };
                      return typeMap[viewingQuestion.questionType] || 'Không xác định';
                    })()}
                  </div>
                  <div>
                    <strong>Độ khó: </strong>
                    {(() => {
                      const difficultyMap = {
                        1: 'Dễ',
                        2: 'Trung bình',
                        3: 'Khó'
                      };
                      return difficultyMap[viewingQuestion.difficulty] || 'Không xác định';
                    })()}
                  </div>
                </Space>
              </div>
            </div>

            {viewingQuestion.answers && viewingQuestion.answers.length > 0 && (
              <div className="answers-section">
                <h3>Đáp án:</h3>
                <div className="answers-list">
                  {viewingQuestion.answers.map((answer, index) => (
                    <div 
                      key={index} 
                      className={`answer-item ${answer.isCorrect ? 'correct' : ''}`}
                    >
                      <span className="answer-label">{String.fromCharCode(65 + index)}.</span>
                      <span className="answer-text">{answer.text}</span>
                      {answer.isCorrect && (
                        <Tag color="success" style={{ marginLeft: 8 }}>
                          Đúng
                        </Tag>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewingQuestion.explanation && (
              <div className="explanation-section">
                <h3>Giải thích:</h3>
                <p className="explanation-text">{viewingQuestion.explanation}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuestionBankManager; 