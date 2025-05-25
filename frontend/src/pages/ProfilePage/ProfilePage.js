import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = ({ user, onLogout }) => {
    const [userData, setUserData] = useState(user || null);
    const [loading, setLoading] = useState(!user);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        birthday: user?.birthday ? user.birthday.substring(0, 10) : '',
        address: user?.address || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState('');

    useEffect(() => {
        // Nếu không có user props, thì mới gọi API
        if (!user) {
            fetchUserProfile();
        }
    }, [user]);

    // Cập nhật formData khi user props thay đổi
    useEffect(() => {
        if (user) {
            setUserData(user);
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                birthday: user.birthday ? user.birthday.substring(0, 10) : '',
                address: user.address || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [user]);

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Bạn chưa đăng nhập');
            }

            const response = await axios.get('/api/student', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUserData(response.data);
            setFormData({
                name: response.data.name || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
                birthday: response.data.birthday ? response.data.birthday.substring(0, 10) : '',
                address: response.data.address || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setError(null);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.');

            // Nếu lỗi là do token không hợp lệ thì logout
            if (err.response && err.response.status === 401) {
                if (onLogout) onLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Reset error messages when typing a new password
        if (['currentPassword', 'newPassword', 'confirmPassword'].includes(name)) {
            setPasswordError('');
        }

        // Reset success message when making changes
        setUpdateSuccess('');
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);

        // Reset password fields and error when toggling edit mode
        if (!isEditing) {
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
            setPasswordError('');
            setUpdateSuccess('');
        }
    };

    const validatePasswordChange = () => {
        // Kiểm tra nếu người dùng muốn đổi mật khẩu
        if (formData.newPassword || formData.confirmPassword) {
            // Kiểm tra mật khẩu hiện tại đã được nhập
            if (!formData.currentPassword) {
                setPasswordError('Vui lòng nhập mật khẩu hiện tại');
                return false;
            }

            // Kiểm tra mật khẩu mới đã được nhập
            if (!formData.newPassword) {
                setPasswordError('Vui lòng nhập mật khẩu mới');
                return false;
            }

            // Kiểm tra xác nhận mật khẩu đã được nhập
            if (!formData.confirmPassword) {
                setPasswordError('Vui lòng xác nhận mật khẩu mới');
                return false;
            }

            // Kiểm tra mật khẩu mới và xác nhận mật khẩu có trùng khớp
            if (formData.newPassword !== formData.confirmPassword) {
                setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp');
                return false;
            }

            // Kiểm tra độ dài mật khẩu mới (ít nhất 6 ký tự)
            if (formData.newPassword.length < 6) {
                setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password if user is changing it
        if (!validatePasswordChange()) {
            return;
        }

        setLoading(true);
        setUpdateSuccess('');

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Bạn chưa đăng nhập');
            }

            // Create data object to send to server
            const updateData = {
                name: formData.name,
                phone: formData.phone,
                birthday: formData.birthday,
                address: formData.address
            };

            // Add password fields if the user is changing password
            if (formData.currentPassword && formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            // Update profile on server
            await axios.put('/api/student/update-info', updateData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Refresh user data after update
            await fetchUserProfile();

            setUpdateSuccess('Cập nhật thông tin thành công!');
            setIsEditing(false);

            // Reset password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));

        } catch (err) {
            console.error('Error updating profile:', err);

            if (err.response && err.response.data && err.response.data.message) {
                // Show server error message
                if (err.response.data.message.includes('password')) {
                    setPasswordError(err.response.data.message);
                } else {
                    setError(err.response.data.message);
                }
            } else {
                setError('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading && !userData) {
        return (
            <div className="profile-page loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải thông tin...</p>
            </div>
        );
    }

    if (error && !userData) {
        return (
            <div className="profile-page error-container">
                <div className="error-icon">
                    <i className="fas fa-exclamation-circle"></i>
                </div>
                <p className="error-message">{error}</p>
                <button className="btn-retry" onClick={fetchUserProfile}>
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h1>Thông tin cá nhân</h1>
                    <button
                        className={`btn-edit-profile ${isEditing ? 'btn-cancel' : ''}`}
                        onClick={toggleEditMode}
                    >
                        {isEditing ? (
                            <>
                                <i className="fas fa-times"></i> Hủy
                            </>
                        ) : (
                            <>
                                <i className="fas fa-edit"></i> Chỉnh sửa
                            </>
                        )}
                    </button>
                </div>

                {updateSuccess && (
                    <div className="success-message">
                        <i className="fas fa-check-circle"></i> {updateSuccess}
                    </div>
                )}

                {error && (
                    <div className="error-banner">
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}

                <div className="profile-content">
                    <div className="profile-avatar">
                        <div className="avatar-circle">
                            {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <h2 className="user-name">{userData?.name}</h2>
                        <p className="user-role">{userData?.role === 'admin' ? 'Quản trị viên' : 'Học sinh'}</p>
                    </div>

                    <div className="profile-details">
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Họ và tên</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    ) : (
                                        <p className="profile-info">{userData?.name || '(Chưa cập nhật)'}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <p className="profile-info">{userData?.email}</p>
                                    <small className="info-note">Email không thể thay đổi</small>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Số điện thoại</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Nhập số điện thoại"
                                        />
                                    ) : (
                                        <p className="profile-info">{userData?.phone || '(Chưa cập nhật)'}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Ngày sinh</label>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            name="birthday"
                                            value={formData.birthday}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="profile-info">
                                            {userData?.birthday
                                                ? new Date(userData.birthday).toLocaleDateString('vi-VN')
                                                : '(Chưa cập nhật)'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Địa chỉ</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Nhập địa chỉ"
                                    />
                                ) : (
                                    <p className="profile-info">{userData?.address || '(Chưa cập nhật)'}</p>
                                )}
                            </div>

                            {isEditing && (
                                <div className="password-section">
                                    <h3>Đổi mật khẩu</h3>
                                    <p className="password-note">Để trống nếu bạn không muốn thay đổi mật khẩu</p>

                                    {passwordError && (
                                        <div className="password-error">
                                            <i className="fas fa-exclamation-triangle"></i> {passwordError}
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label>Mật khẩu hiện tại</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            placeholder="Nhập mật khẩu hiện tại"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Mật khẩu mới</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                placeholder="Nhập mật khẩu mới"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Xác nhận mật khẩu mới</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Nhập lại mật khẩu mới"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isEditing && (
                                <div className="form-actions">
                                    <button type="submit" className="btn-save" disabled={loading}>
                                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                <div className="profile-stats">
                    <h3>Thống kê hoạt động</h3>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon exams">
                                <i className="fas fa-file-alt"></i>
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{userData?.examsTaken || 0}</div>
                                <div className="stat-label">Bài thi đã làm</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon results">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{userData?.averageScore || 0}</div>
                                <div className="stat-label">Điểm trung bình</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon date">
                                <i className="fas fa-calendar-check"></i>
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">
                                    {userData?.lastActive
                                        ? new Date(userData.lastActive).toLocaleDateString('vi-VN')
                                        : 'Chưa có'}
                                </div>
                                <div className="stat-label">Hoạt động gần đây</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="recent-exams">
                    <h3>Bài thi gần đây</h3>
                    {userData?.recentExams && userData.recentExams.length > 0 ? (
                        <table className="exam-table">
                            <thead>
                                <tr>
                                    <th>Tên bài thi</th>
                                    <th>Ngày làm</th>
                                    <th>Điểm</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userData.recentExams.map((exam, index) => (
                                    <tr key={index}>
                                        <td>{exam.examName}</td>
                                        <td>{new Date(exam.date).toLocaleDateString('vi-VN')}</td>
                                        <td className="exam-score">{exam.score}/{exam.totalScore}</td>
                                        <td>
                                            <span className={`status-badge ${exam.passed ? 'passed' : 'failed'}`}>
                                                {exam.passed ? 'Đạt' : 'Chưa đạt'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-exams">Bạn chưa làm bài thi nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; 