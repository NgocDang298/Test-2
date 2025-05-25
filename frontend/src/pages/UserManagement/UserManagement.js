import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/users');
            setUsers(response.data);
        } catch (error) {
            message.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteUser = () => {

    }
    const handleAddUser = async (values) => {
        try {
            await axios.post('http://localhost:5000/api/users', values);
            message.success('User added successfully');
            setIsModalVisible(false);
            form.resetFields();
            fetchUsers();
        } catch (error) {
            message.error('Failed to add user');
        }
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="link" onClick={() => handleDeleteUser(record.id)}>
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div className="user-management">
            <div className="header">
                <h1>User Management</h1>
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                    Add User
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                loading={loading}
                rowKey="id"
            />

            <Modal
                title="Add New User"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleAddUser}>
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: 'Please input username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please input email!' },
                            { type: 'email', message: 'Please input valid email!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please input password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add User
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement; 