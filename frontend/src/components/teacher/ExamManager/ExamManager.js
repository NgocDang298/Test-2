import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Table, message, Space, Select, InputNumber, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { 
  createExam, 
  updateExam, 
  deleteExam, 
  getExamsBySubject 
} from '../../../services/ExamService';
import { 
  getQuestionsByExam,
  addQuestionToExam,
  removeQuestionFromExam,
  autoGenerateExam,
  autoGenerateExamWithDifficulty
} from '../../../services/QuestionService';
import './ExamManager.css';

const { Option } = Select;
const { TextArea } = Input;

const ExamManager = ({ subjects }) => {
  const [exams, setExams] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);
  const [isAutoGenModalVisible, setIsAutoGenModalVisible] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [form] = Form.useForm();
  const [autoGenForm] = Form.useForm();

  useEffect(() => {
    if (selectedSubject) {
      fetchExams();
    }
  }, [selectedSubject]);

  const fetchExams = async () => {
    if (!selectedSubject) return;
    
    try {
      setLoading(true);
      const response = await getExamsBySubject(selectedSubject);
      setExams(response.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách đề thi');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (values) => {
    try {
      setLoading(true);
      const examData = {
        ...values,
        subjectId: selectedSubject
      };
      
      if (editingExam) {
        await updateExam(editingExam.id, examData);
        message.success('Cập nhật đề thi thành công!');
      } else {
        await createExam(examData);
        message.success('Tạo đề thi thành công!');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingExam(null);
      fetchExams();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleEditExam = (exam) => {
    setEditingExam(exam);
    form.setFieldsValue(exam);
    setIsModalVisible(true);
  };

  const handleDeleteExam = async (examId) => {
    try {
      setLoading(true);
      await deleteExam(examId);
      message.success('Xóa đề thi thành công!');
      fetchExams();
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa đề thi');
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuestions = async (exam) => {
    try {
      setSelectedExam(exam);
      setLoading(true);
      const response = await getQuestionsByExam(exam.id);
      setQuestions(response.data || []);
      setIsQuestionModalVisible(true);
    } catch (error) {
      message.error('Không thể tải danh sách câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoGenerate = async (values) => {
    try {
      setLoading(true);
      if (values.type === 'simple') {
        await autoGenerateExam(selectedExam.id, values.numberOfQuestions);
      } else {
        const difficultyMap = {
          1: values.easy || 0,
          2: values.medium || 0,
          3: values.hard || 0
        };
        await autoGenerateExamWithDifficulty(selectedExam.id, difficultyMap);
      }
      
      message.success('Tạo đề thi tự động thành công!');
      setIsAutoGenModalVisible(false);
      autoGenForm.resetFields();
      
      // Refresh questions
      const response = await getQuestionsByExam(selectedExam.id);
      setQuestions(response.data || []);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo đề thi tự động');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveQuestion = async (questionId) => {
    try {
      setLoading(true);
      await removeQuestionFromExam(selectedExam.id, questionId);
      message.success('Xóa câu hỏi thành công!');
      
      // Refresh questions
      const response = await getQuestionsByExam(selectedExam.id);
      setQuestions(response.data || []);
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const examColumns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'duration',
      key: 'duration',
      width: 120
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditExam(record)}
          >
            Sửa
          </Button>
          <Button
            type="default"
            icon={<QuestionCircleOutlined />}
            size="small"
            onClick={() => handleViewQuestions(record)}
          >
            Câu hỏi
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đề thi này?"
            onConfirm={() => handleDeleteExam(record.id)}
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

  const questionColumns = [
    {
      title: 'Câu hỏi',
      dataIndex: ['questionBank', 'questionText'],
      key: 'questionText',
      ellipsis: true
    },
    {
      title: 'Loại',
      dataIndex: ['questionBank', 'questionType'],
      key: 'questionType',
      width: 120,
      render: (type) => {
        const typeMap = {
          1: 'Trắc nghiệm',
          2: 'Nhiều lựa chọn',
          3: 'Đúng/Sai',
          4: 'Tự luận'
        };
        return typeMap[type] || 'Không xác định';
      }
    },
    {
      title: 'Độ khó',
      dataIndex: ['questionBank', 'difficulty'],
      key: 'difficulty',
      width: 100,
      render: (difficulty) => {
        const difficultyMap = {
          1: { text: 'Dễ', color: 'green' },
          2: { text: 'Trung bình', color: 'orange' },
          3: { text: 'Khó', color: 'red' }
        };
        const diffInfo = difficultyMap[difficulty] || { text: 'Không xác định', color: 'gray' };
        return (
          <span style={{ color: diffInfo.color, fontWeight: 'bold' }}>
            {diffInfo.text}
          </span>
        );
      }
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa câu hỏi này khỏi đề thi?"
          onConfirm={() => handleRemoveQuestion(record.id)}
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
      )
    }
  ];

  return (
    <div className="exam-manager">
      <div className="manager-header">
        <h2>Quản lý đề thi</h2>
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            disabled={!selectedSubject}
          >
            Tạo đề thi mới
          </Button>
        </Space>
      </div>

      {selectedSubject ? (
        <Table
          columns={examColumns}
          dataSource={exams}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} đề thi`
          }}
        />
      ) : (
        <div className="no-subject-selected">
          <p>Vui lòng chọn môn học để xem danh sách đề thi</p>
        </div>
      )}

      {/* Create/Edit Exam Modal */}
      <Modal
        title={editingExam ? 'Chỉnh sửa đề thi' : 'Tạo đề thi mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingExam(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateExam}
        >
          <Form.Item
            name="title"
            label="Tiêu đề đề thi"
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề!' },
              { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự!' }
            ]}
          >
            <Input placeholder="Nhập tiêu đề đề thi" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả!' }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Nhập mô tả đề thi"
            />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời gian làm bài (phút)"
            rules={[
              { required: true, message: 'Vui lòng nhập thời gian!' },
              { type: 'number', min: 1, message: 'Thời gian phải lớn hơn 0!' }
            ]}
          >
            <InputNumber 
              min={1} 
              max={300} 
              placeholder="Nhập thời gian (phút)"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item className="form-actions">
            <Space>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingExam(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingExam ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Questions Modal */}
      <Modal
        title={`Câu hỏi trong đề thi: ${selectedExam?.title}`}
        open={isQuestionModalVisible}
        onCancel={() => {
          setIsQuestionModalVisible(false);
          setSelectedExam(null);
          setQuestions([]);
        }}
        footer={null}
        width={1000}
      >
        <div className="questions-section">
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              onClick={() => setIsAutoGenModalVisible(true)}
            >
              Tạo đề tự động
            </Button>
          </div>

          <Table
            columns={questionColumns}
            dataSource={questions}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Tổng ${total} câu hỏi`
            }}
          />
        </div>
      </Modal>

      {/* Auto Generate Modal */}
      <Modal
        title="Tạo đề thi tự động"
        open={isAutoGenModalVisible}
        onCancel={() => {
          setIsAutoGenModalVisible(false);
          autoGenForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={autoGenForm}
          layout="vertical"
          onFinish={handleAutoGenerate}
          initialValues={{ type: 'simple' }}
        >
          <Form.Item
            name="type"
            label="Loại tạo đề"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="simple">Tạo đơn giản</Option>
              <Option value="difficulty">Theo độ khó</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.type !== currentValues.type
            }
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              
              if (type === 'simple') {
                return (
                  <Form.Item
                    name="numberOfQuestions"
                    label="Số câu hỏi"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số câu hỏi!' },
                      { type: 'number', min: 1, max: 100, message: 'Số câu hỏi từ 1-100!' }
                    ]}
                  >
                    <InputNumber 
                      min={1} 
                      max={100} 
                      placeholder="Nhập số câu hỏi"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                );
              }
              
              return (
                <>
                  <Form.Item
                    name="easy"
                    label="Số câu dễ"
                    rules={[{ type: 'number', min: 0 }]}
                  >
                    <InputNumber 
                      min={0} 
                      placeholder="Số câu dễ"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="medium"
                    label="Số câu trung bình"
                    rules={[{ type: 'number', min: 0 }]}
                  >
                    <InputNumber 
                      min={0} 
                      placeholder="Số câu trung bình"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="hard"
                    label="Số câu khó"
                    rules={[{ type: 'number', min: 0 }]}
                  >
                    <InputNumber 
                      min={0} 
                      placeholder="Số câu khó"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </>
              );
            }}
          </Form.Item>

          <Form.Item className="form-actions">
            <Space>
              <Button onClick={() => {
                setIsAutoGenModalVisible(false);
                autoGenForm.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Tạo đề
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExamManager; 