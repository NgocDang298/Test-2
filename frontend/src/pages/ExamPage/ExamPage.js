import React, { useState, useEffect, useCallback } from 'react';
import './ExamPage.css';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input } from 'antd';
import axiosInstance from "../../services/axiosInstance";

const { TextArea } = Input;

// Hàm lấy đường dẫn ảnh từ thư mục public/images
const getSubjectImage = (name) => {
  const key = name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
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

  return images[key] || './images/default.jpg';
};

const ExamPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editSubject, setEditSubject] = useState(null);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  // Đưa fetchSubjects ra ngoài useEffect để có thể gọi lại sau khi thêm/sửa
  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/api/teacher/subjects', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setSubjects(response.data);
    } catch (err) {
      setError(
          err.response?.data?.message ||
          err.message ||
          'Đã xảy ra lỗi khi tải dữ liệu.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const openAddForm = () => {
    setEditSubject(null);
    form.resetFields();
    setShowModal(true);
  };

  const openEditForm = (subject) => {
    setEditSubject(subject);
    form.setFieldsValue({
      name: subject.name,
      description: subject.description
    });
    setShowModal(true);
  };

  const handleSubmit = async (values) => {
    const token = localStorage.getItem('token');
    try {
      if (editSubject) {
        await axiosInstance.put(
            `/api/teacher/subjects/${editSubject.id}`,
            values,
            { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axiosInstance.post(
            '/api/teacher/subjects',
            values,
            { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setShowModal(false);
      form.resetFields();
      fetchSubjects(); // Làm mới danh sách sau khi thêm/sửa
    } catch (err) {
      alert('Lưu thất bại!');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    form.resetFields();
  };

  if (loading) return <p className="loading">Đang tải dữ liệu...</p>;
  if (error) return <p className="error">Lỗi: {error}</p>;

  return (
      <div className="exam-container main-content ep">
        <h1 className="subject-title">Danh sách môn học của tôi</h1>
        <Button
            onClick={openAddForm}
            className="add-subject-btn"
            icon={<PlusOutlined />}
            type="primary"
        >
          Đăng ký môn học
        </Button>

        {/* Modal sử dụng Ant Design */}
        <Modal
          title={editSubject ? 'Sửa môn học' : 'Đăng ký môn học'}
          open={showModal}
          onCancel={closeModal}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Tên môn học"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
            >
              <Input placeholder="Nhập tên môn học" />
            </Form.Item>
            
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
            >
              <TextArea
                rows={4}
                placeholder="Nhập mô tả môn học"
              />
            </Form.Item>
            
            <Form.Item className="modal-actions">
              <Button onClick={closeModal} style={{ marginRight: 8 }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" icon={editSubject ? <EditOutlined /> : <PlusOutlined />}>
                {editSubject ? 'Cập nhật' : 'Đăng ký'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {subjects.length === 0 ? (
            <p className="no-subjects">Không có môn học nào.</p>
        ) : (
            <div className="subject-list">
              {subjects
                  .slice() // tạo bản sao để không thay đổi state gốc
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
                            navigate(`/exams/subject/${subject.id}`);
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
                            <EditOutlined
                                className="edit-icon"
                                style={{ color: '#1890ff', fontSize: 18, marginLeft: 8, cursor: 'pointer' }}
                                title="Sửa môn học"
                                onClick={e => {
                                  e.stopPropagation();
                                  openEditForm(subject);
                                }}
                            />
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