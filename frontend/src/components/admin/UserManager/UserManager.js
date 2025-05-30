import React, { useState } from 'react';
import './UserManager.css';
import axios from 'axios';
import { addNewTeacher } from '../../../services/AdminService';

const UserManager = ({ users, loading, error, refreshUsers }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    password: ''
  });

  // Filter users based on search term
  const filteredUsers = users?.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // Only send the fields that RegisterRequest expects
      const requestData = {
        username: formData.username,
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password
      };
      
      const response = await addNewTeacher(requestData);
      console.log('check add teacher', response)
      refreshUsers();
      resetForm();
      alert('Thêm giáo viên thành công!');
    } catch (err) {
      console.error('Error adding user:', err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Lỗi: ${err.response.data.message}`);
      } else {
        alert('Không thể thêm người dùng. Vui lòng thử lại sau.');
      }
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      await axios.put(`http://localhost:5000/api/users/${selectedUser._id}`, formData);
      refreshUsers();
      setIsEditing(false);
      setSelectedUser(null);
      resetForm();
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Không thể cập nhật người dùng. Vui lòng thử lại sau.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      refreshUsers();
      if (selectedUser?._id === userId) {
        setSelectedUser(null);
        resetForm();
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Không thể xóa người dùng. Vui lòng thử lại sau.');
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      fullname: user.fullname || '',
      email: user.email || '',
      password: ''
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      fullname: '',
      email: '',
      password: ''
    });
    setIsEditing(false);
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'TEACHER':
        return 'Giáo viên';
      case 'STUDENT':
      default:
        return 'Học sinh';
    }
  };
  
  return (
    <div className="user-manager">
      <div className="user-manager-header">
        <h2>Quản lý người dùng</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>
      </div>

      <div className="user-content">
        <div className="user-list-container">
          <div className="user-list-header">
            <h3>Danh sách người dùng</h3>
            <button className="btn-add" onClick={() => { resetForm(); setIsEditing(false); }}>
              <i className="fas fa-plus"></i> Thêm mới
            </button>
          </div>

          {loading ? (
            <div className="loading-message">Đang tải danh sách người dùng...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="user-list">
              <table>
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="no-data">Không có dữ liệu người dùng</td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user._id}>
                        <td>{user.fullname}</td>
                        <td>{user.email}</td>
                        <td>{getRoleLabel(user.roles?.[0]?.name)}</td>

                        <td className="actions">
                          <button onClick={() => handleSelectUser(user)} className="btn-edit">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button onClick={() => handleDeleteUser(user._id)} className="btn-delete">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="user-form-container">
          <h3>{isEditing ? 'Cập nhật người dùng' : 'Thêm giáo viên mới'}</h3>
          <form className="user-form">
            <div className="form-group">
              <label>Tên người dùng</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Nhập tên đăng nhập"
              />
            </div>
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                placeholder="Nhập họ và tên đầy đủ"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Nhập địa chỉ email"
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                minLength="6"
              />
            </div>
            <div className="form-actions">
              {isEditing ? (
                <>
                  <button type="button" onClick={handleUpdateUser} className="btn-save">
                    Cập nhật
                  </button>
                  <button type="button" onClick={resetForm} className="btn-cancel">
                    Hủy
                  </button>
                </>
              ) : (
                <button type="button" onClick={handleAddUser} className="btn-save">
                  Thêm giáo viên
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserManager;