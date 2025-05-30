import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import axiosInstance from '../../services/axiosInstance';
import './UserManagement.css';

const { Option } = Select;

const UserManagement = () => {
    console.log("UserManagement");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/admin/users');
            if (response.data.success) {
                setUsers(response.data.data);
            } else {
                message.error('Không thể tải danh sách người dùng');
            }
        } catch (error) {
            console.error('Fetch users error:', error);
            message.error('Lỗi khi tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await axiosInstance.delete(`/api/admin/teacher/delete/${userId}`);
            if (response.data.success) {
                message.success('Xóa giáo viên thành công');
                fetchUsers();
            } else {
                message.error('Không thể xóa giáo viên');
            }
        } catch (error) {
            console.error('Delete user error:', error);
            message.error('Lỗi khi xóa giáo viên');
        }
    };

    const handleAddUser = async (values) => {
        try {
            if (editingUser) {
                // Update teacher
                const response = await axiosInstance.put(`/api/admin/teachers/update/${editingUser.id}`, {
                    username: values.username,
                    fullname: values.fullname,
                    email: values.email,
                    password: values.password
                });
                
                if (response.data.success) {
                    message.success('Cập nhật giáo viên thành công');
                } else {
                    message.error('Không thể cập nhật giáo viên');
                }
            } else {
                // Add new teacher - use the correct endpoint
                const response = await axiosInstance.post('/api/admin/teachers/register', {
                    username: values.username,
                    fullname: values.fullname,
                    email: values.email,
                    password: values.password
                });
                
                if (response.data.success) {
                    message.success('Thêm giáo viên thành công');
                } else {
                    message.error(response.data.message || 'Không thể thêm giáo viên');
                }
            }
            
            setIsModalVisible(false);
            form.resetFields();
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Save user error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error(editingUser ? 'Lỗi khi cập nhật giáo viên' : 'Lỗi khi thêm giáo viên');
            }
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        form.setFieldsValue({
            username: user.username,
            email: user.email,
            fullname: user.fullname
        });
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingUser(null);
        form.resetFields();
    };

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin': return 'red';
            case 'teacher': return 'blue';
            case 'student': return 'green';
            default: return 'default';
        }
    };

    const columns = [
        {
            title: 'Họ và tên',
            dataIndex: 'fullname',
            key: 'fullname',
            render: (text) => (
                <Space>
                    <UserOutlined />
                    {text}
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Vai trò',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles) => {
                // Handle case where roles is undefined or empty
                const roleName = roles && roles.length > 0 ? roles[0].name : 'TEACHER';
                return (
                    <Tag color={getRoleColor(roleName)}>
                        {roleName.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />} 
                        size="small"
                        onClick={() => handleEditUser(record)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa giáo viên này?"
                        onConfirm={() => handleDeleteUser(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button 
                            type="primary" 
                            danger 
                            icon={<DeleteOutlined />} 
                            size="small"
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Quản lý giáo viên</h1>
                <p className="page-subtitle">Quản lý tài khoản giáo viên trong hệ thống</p>
            </div>

            <div className="user-management">
                <div className="user-management-header">
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalVisible(true)}
                        size="large"
                    >
                        Thêm giáo viên
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={users}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} của ${total} giáo viên`,
                    }}
                    className="user-table"
                />

                <Modal
                    title={editingUser ? "Sửa thông tin giáo viên" : "Thêm giáo viên mới"}
                    open={isModalVisible}
                    onCancel={handleModalCancel}
                    footer={null}
                    width={600}
                >
                    <Form 
                        form={form} 
                        onFinish={handleAddUser}
                        layout="vertical"
                        className="user-form"
                    >
                        <Form.Item
                            name="username"
                            label="Tên đăng nhập"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                                { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' }
                            ]}
                        >
                            <Input 
                                placeholder="Nhập tên đăng nhập"
                                disabled={editingUser}
                            />
                        </Form.Item>

                        <Form.Item
                            name="fullname"
                            label="Họ và tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                        >
                            <Input placeholder="Nhập họ và tên đầy đủ" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input placeholder="Nhập địa chỉ email" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                                { required: !editingUser, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                        >
                            <Input.Password placeholder={editingUser ? "Để trống nếu không muốn đổi mật khẩu" : "Nhập mật khẩu"} />
                        </Form.Item>

                        <Form.Item className="form-actions">
                            <Space>
                                <Button onClick={handleModalCancel}>
                                    Hủy
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    {editingUser ? 'Cập nhật' : 'Thêm giáo viên'}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default UserManagement; 