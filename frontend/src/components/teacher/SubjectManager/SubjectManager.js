import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Table, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { 
  createSubject, 
  updateSubject, 
  addStudentToSubject, 
  getStudentsInSubject 
} from '../../../services/SubjectService';
import './SubjectManager.css';

const SubjectManager = ({ subjects, refreshSubjects }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [studentForm] = Form.useForm();

  const handleCreateSubject = async (values) => {
    try {
      setLoading(true);
      if (editingSubject) {
        await updateSubject(editingSubject.id, values);
        message.success('Cập nhật môn học thành công!');
      } else {
        await createSubject(values);
        message.success('Tạo môn học thành công!');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingSubject(null);
      refreshSubjects();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    form.setFieldsValue(subject);
    setIsModalVisible(true);
  };

  const handleViewStudents = async (subject) => {
    try {
      setSelectedSubject(subject);
      setLoading(true);
      const response = await getStudentsInSubject(subject.id);
      setStudents(response.data || []);
      setIsStudentModalVisible(true);
    } catch (error) {
      message.error('Không thể tải danh sách học sinh');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (values) => {
    try {
      setLoading(true);
      await addStudentToSubject(selectedSubject.id, values.studentId);
      message.success('Thêm học sinh thành công!');
      studentForm.resetFields();
      // Refresh students list
      const response = await getStudentsInSubject(selectedSubject.id);
      setStudents(response.data || []);
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm học sinh');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          0: { text: 'Chờ duyệt', color: 'orange' },
          1: { text: 'Đã duyệt', color: 'green' },
          2: { text: 'Từ chối', color: 'red' }
        };
        const statusInfo = statusMap[status] || { text: 'Không xác định', color: 'gray' };
        return (
          <span style={{ color: statusInfo.color, fontWeight: 'bold' }}>
            {statusInfo.text}
          </span>
        );
      }
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditSubject(record)}
          >
            Sửa
          </Button>
          <Button
            type="default"
            icon={<UserAddOutlined />}
            size="small"
            onClick={() => handleViewStudents(record)}
          >
            Học sinh
          </Button>
        </Space>
      )
    }
  ];

  const studentColumns = [
    {
      title: 'Tên học sinh',
      dataIndex: 'fullname',
      key: 'fullname'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username'
    }
  ];

  return (
    <div className="subject-manager">
      <div className="manager-header">
        <h2>Quản lý môn học</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Tạo môn học mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={subjects}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} môn học`
        }}
      />

      {/* Create/Edit Subject Modal */}
      <Modal
        title={editingSubject ? 'Chỉnh sửa môn học' : 'Tạo môn học mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingSubject(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubject}
        >
          <Form.Item
            name="name"
            label="Tên môn học"
            rules={[
              { required: true, message: 'Vui lòng nhập tên môn học!' },
              { min: 2, message: 'Tên môn học phải có ít nhất 2 ký tự!' }
            ]}
          >
            <Input placeholder="Nhập tên môn học" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả!' }
            ]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Nhập mô tả môn học"
            />
          </Form.Item>

          <Form.Item className="form-actions">
            <Space>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingSubject(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingSubject ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Students Modal */}
      <Modal
        title={`Học sinh trong môn: ${selectedSubject?.name}`}
        open={isStudentModalVisible}
        onCancel={() => {
          setIsStudentModalVisible(false);
          setSelectedSubject(null);
          setStudents([]);
          studentForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <div className="students-section">
          <Form
            form={studentForm}
            layout="inline"
            onFinish={handleAddStudent}
            style={{ marginBottom: 16 }}
          >
            <Form.Item
              name="studentId"
              rules={[{ required: true, message: 'Vui lòng nhập ID học sinh!' }]}
            >
              <Input placeholder="Nhập ID học sinh" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Thêm học sinh
              </Button>
            </Form.Item>
          </Form>

          <Table
            columns={studentColumns}
            dataSource={students}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 5,
              showTotal: (total) => `Tổng ${total} học sinh`
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default SubjectManager; 