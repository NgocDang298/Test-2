import React, { useState } from 'react';
import './UserManager.css';
import { 
  addNewTeacher, 
  addNewStudent,
  updateStudentByAdmin, 
  updateTeacherByAdmin, 
  deleteStudentById, 
  deleteTeacherById,
  searchUsers 
} from '../../../services/AdminService';

const UserManager = ({ users, loading, error, refreshUsers }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [addingUserType, setAddingUserType] = useState(null); // 'teacher' or 'student'
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    phone: '',
    password: ''
  });

  // Filter users based on search term and active tab
  const getFilteredUsers = () => {
    let filteredUsers = searchResults.length > 0 ? searchResults : users || [];
    
    if (activeTab !== 'all') {
      filteredUsers = filteredUsers.filter(user => {
        const userRole = user.roles?.[0]?.name?.toLowerCase();
        return userRole === activeTab;
      });
    }

    if (searchTerm && searchResults.length === 0) {
      filteredUsers = filteredUsers.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredUsers;
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchUsers({ 
        fullname: searchTerm,
        email: searchTerm 
      });
      setSearchResults(response.data || []);
    } catch (err) {
      console.error('Error searching users:', err);
      alert('Không thể tìm kiếm người dùng. Vui lòng thử lại.');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!addingUserType) return;

    try {
      const requestData = {
        username: formData.username,
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };
      
      let response;
      if (addingUserType === 'teacher') {
        response = await addNewTeacher(requestData);
        console.log('Teacher added successfully:', response);
        alert('Thêm giáo viên thành công!');
      } else if (addingUserType === 'student') {
        response = await addNewStudent(requestData);
        console.log('Student added successfully:', response);
        alert('Thêm học sinh thành công!');
      }
      
      refreshUsers();
      resetForm();
    } catch (err) {
      console.error(`Error adding ${addingUserType}:`, err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Lỗi: ${err.response.data.message}`);
      } else {
        alert(`Không thể thêm ${addingUserType === 'teacher' ? 'giáo viên' : 'học sinh'}. Vui lòng thử lại sau.`);
      }
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const updateData = {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone
      };

      const userRole = selectedUser.roles?.[0]?.name?.toLowerCase();
      
      if (userRole === 'student') {
        await updateStudentByAdmin(selectedUser.id, updateData);
      } else if (userRole === 'teacher') {
        await updateTeacherByAdmin(selectedUser.id, updateData);
      }

      refreshUsers();
      setIsEditing(false);
      setSelectedUser(null);
      resetForm();
      alert('Cập nhật thông tin người dùng thành công!');
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Không thể cập nhật người dùng. Vui lòng thử lại sau.');
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${user.fullname}?`)) return;

    try {
      const userRole = user.roles?.[0]?.name?.toLowerCase();
      
      if (userRole === 'student') {
        await deleteStudentById(user.id);
      } else if (userRole === 'teacher') {
        await deleteTeacherById(user.id);
      }

      refreshUsers();
      if (selectedUser?.id === user.id) {
        setSelectedUser(null);
        resetForm();
      }
      alert('Xóa người dùng thành công!');
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
      phone: user.phone || '',
      password: ''
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      fullname: '',
      email: '',
      phone: '',
      password: ''
    });
    setIsEditing(false);
    setSelectedUser(null);
    setAddingUserType(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const getRoleLabel = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'TEACHER':
        return 'Giáo viên';
      case 'STUDENT':
      default:
        return 'Học sinh';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'role-badge admin';
      case 'TEACHER':
        return 'role-badge teacher';
      case 'STUDENT':
      default:
        return 'role-badge student';
    }
  };

  const getUserCounts = () => {
    const allUsers = users || [];
    return {
      all: allUsers.length,
      student: allUsers.filter(u => u.roles?.[0]?.name?.toLowerCase() === 'student').length,
      teacher: allUsers.filter(u => u.roles?.[0]?.name?.toLowerCase() === 'teacher').length
    };
  };

  const counts = getUserCounts();
  const filteredUsers = getFilteredUsers();
  
  return (
    <div className="user-manager">
      <div className="user-manager-header">
        <h2>Quản lý người dùng</h2>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="search-input"
            />
            <button 
              className="search-btn" 
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-search"></i>
              )}
            </button>
            {(searchTerm || searchResults.length > 0) && (
              <button className="clear-search-btn" onClick={clearSearch}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          <button className="btn-add" onClick={() => { resetForm(); setIsEditing(false); setAddingUserType('teacher'); }}>
            <i className="fas fa-plus"></i> Thêm giáo viên
          </button>
          <button className="btn-add" onClick={() => { resetForm(); setIsEditing(false); setAddingUserType('student'); }}>
            <i className="fas fa-plus"></i> Thêm học sinh
          </button>
        </div>
      </div>

      <div className="user-tabs">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Tất cả ({counts.all})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'student' ? 'active' : ''}`}
          onClick={() => setActiveTab('student')}
        >
          Học sinh ({counts.student})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'teacher' ? 'active' : ''}`}
          onClick={() => setActiveTab('teacher')}
        >
          Giáo viên ({counts.teacher})
        </button>
      </div>

      <div className="user-content">
        <div className="user-list-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tải danh sách người dùng...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
            </div>
          ) : (
            <div className="user-list">
              <div className="user-grid">
                {filteredUsers.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-users"></i>
                    <p>Không có người dùng nào</p>
                  </div>
                ) : (
                  filteredUsers.map(user => (
                    <div key={user.id} className="user-card">
                      <div className="user-avatar">
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="user-info">
                        <h4>{user.fullname}</h4>
                        <p className="user-email">{user.email}</p>
                        <p className="user-username">@{user.username}</p>
                        {user.phone && <p className="user-phone">{user.phone}</p>}
                        <span className={getRoleBadgeClass(user.roles?.[0]?.name)}>
                          {getRoleLabel(user.roles?.[0]?.name)}
                        </span>
                      </div>
                      <div className="user-actions">
                        <button 
                          onClick={() => handleSelectUser(user)} 
                          className="btn-edit"
                          title="Chỉnh sửa"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user)} 
                          className="btn-delete"
                          title="Xóa"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="user-form-container">
          <div className="form-header">
            <h3>
              {isEditing 
                ? 'Cập nhật thông tin người dùng' 
                : addingUserType 
                  ? `Thêm ${addingUserType === 'teacher' ? 'giáo viên' : 'học sinh'} mới`
                  : 'Chọn loại người dùng để thêm'
              }
            </h3>
            {(isEditing || addingUserType) && (
              <button className="close-form-btn" onClick={resetForm}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          
          {(isEditing || addingUserType) && (
            <form className="user-form" onSubmit={isEditing ? (e) => { e.preventDefault(); handleUpdateUser(); } : handleAddUser}>
              {!isEditing && (
                <div className="form-group">
                  <label>Tên đăng nhập *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>Họ và tên *</label>
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
                <label>Email *</label>
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
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              
              {!isEditing && (
                <div className="form-group">
                  <label>Mật khẩu *</label>
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
              )}
              
              <div className="form-actions">
                <button type="submit" className="btn-save">
                  {isEditing ? (
                    <>
                      <i className="fas fa-save"></i> Cập nhật
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus"></i> Thêm {addingUserType === 'teacher' ? 'giáo viên' : 'học sinh'}
                    </>
                  )}
                </button>
                {(isEditing || addingUserType) && (
                  <button type="button" onClick={resetForm} className="btn-cancel">
                    <i className="fas fa-times"></i> Hủy
                  </button>
                )}
              </div>
            </form>
          )}
          
          {!isEditing && !addingUserType && (
            <div className="empty-form-state">
              <i className="fas fa-user-plus"></i>
              <p>Chọn "Thêm giáo viên" hoặc "Thêm học sinh" để bắt đầu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManager;