import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { useUser } from '../../contexts/UserContext';
import { updateStudentProfile, updateTeacherProfile, changePassword, getUserStats } from '../../services/UserService';

const ProfilePage = () => {
    const { user, userProfile, fetchUserProfile, loading, error } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [userStats, setUserStats] = useState({
        examsTaken: 0,
        averageScore: 0,
        lastActive: null,
        recentExams: []
    });

    // Combine user from JWT and userProfile from API
    const combinedUserData = {
        ...user, // JWT data (has roles, username)
        ...userProfile // API data (has id, fullname, email)
    };

    // Initialize form data when userProfile changes
    useEffect(() => {
        if (userProfile) {
            setFormData({
                fullname: userProfile.fullname || '',
                email: userProfile.email || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [userProfile]);

    // Fetch user stats on component mount
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const stats = await getUserStats();
                setUserStats(stats);
            } catch (error) {
                console.error('Error fetching user stats:', error);
            }
        };

        if (userProfile) {
            fetchStats();
        }
    }, [userProfile]);

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
        // Check if user wants to change password
        if (formData.newPassword || formData.confirmPassword) {
            // Check if current password is entered
            if (!formData.currentPassword) {
                setPasswordError('Vui lòng nhập mật khẩu hiện tại');
                return false;
            }

            // Check if new password is entered
            if (!formData.newPassword) {
                setPasswordError('Vui lòng nhập mật khẩu mới');
                return false;
            }

            // Check if confirm password is entered
            if (!formData.confirmPassword) {
                setPasswordError('Vui lòng xác nhận mật khẩu mới');
                return false;
            }

            // Check if new password and confirm password match
            if (formData.newPassword !== formData.confirmPassword) {
                setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp');
                return false;
            }

            // Check new password length (at least 6 characters)
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

        setUpdateLoading(true);
        setUpdateSuccess('');

        try {
            // Update profile information based on user role
            const profileUpdateData = {
                fullname: formData.fullname,
                email: formData.email
            };

            // Use role-specific update endpoints based on JWT roles
            if (combinedUserData.roles && combinedUserData.roles.includes('STUDENT')) {
                await updateStudentProfile(profileUpdateData);
            } else if (combinedUserData.roles && combinedUserData.roles.includes('TEACHER')) {
                await updateTeacherProfile(profileUpdateData);
            }

            // Change password if provided
            if (formData.currentPassword && formData.newPassword) {
                const passwordData = {
                    oldPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                };
                await changePassword(passwordData);
            }

            // Refresh user profile
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
                if (err.response.data.message.includes('password') || err.response.data.message.includes('mật khẩu')) {
                    setPasswordError(err.response.data.message);
                } else {
                    setUpdateSuccess(''); // Clear success message
                    // You might want to show a general error message here
                }
            } else {
                setUpdateSuccess(''); // Clear success message
                // You might want to show a general error message here
            }
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading && !userProfile) {
        return (
            <div className="profile-page loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải thông tin...</p>
            </div>
        );
    }

    if (error && !userProfile) {
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

    const getUserRole = () => {
        console.log('getUserRole - combinedUserData:', combinedUserData); // Debug log
        
        // Use roles from JWT token (user)
        if (!combinedUserData?.roles || combinedUserData.roles.length === 0) {
            console.log('No roles found in combined data'); // Debug log
            return 'Người dùng';
        }
        
        console.log('User roles from JWT:', combinedUserData.roles); // Debug log
        
        if (combinedUserData.roles.includes('ADMIN')) return 'Quản trị viên';
        if (combinedUserData.roles.includes('TEACHER')) return 'Giáo viên';
        if (combinedUserData.roles.includes('STUDENT')) return 'Học sinh';
        return 'Người dùng';
    };

    // Check if user can edit (not ADMIN) - use JWT roles
    const canEdit = () => {
        if (!combinedUserData?.roles || combinedUserData.roles.length === 0) {
            console.log('canEdit: No roles in combined data'); // Debug log
            return false;
        }
        
        const hasRoles = combinedUserData.roles.length > 0;
        const isNotAdmin = !combinedUserData.roles.includes('ADMIN');
        const result = hasRoles && isNotAdmin;
        
        console.log('canEdit - roles:', combinedUserData.roles, 'result:', result); // Debug log
        return result;
    };
    
    console.log('ProfilePage - user (JWT):', user); // Debug log
    console.log('ProfilePage - userProfile (API):', userProfile); // Debug log
    console.log('ProfilePage - combinedUserData:', combinedUserData); // Debug log

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h1>Thông tin cá nhân</h1>
                    {canEdit() && (
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
                    )}
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
                            {combinedUserData?.fullname ? combinedUserData.fullname.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <h2 className="user-name">{combinedUserData?.fullname}</h2>
                        <p className="user-role">{getUserRole()}</p>
                    </div>

                    <div className="profile-details">
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tên đăng nhập</label>
                                    <p className="profile-info">{combinedUserData?.sub || combinedUserData?.username}</p>
                                    <small className="info-note">Tên đăng nhập không thể thay đổi</small>
                                </div>

                                <div className="form-group">
                                    <label>Họ và tên</label>
                                    {isEditing && canEdit() ? (
                                        <input
                                            type="text"
                                            name="fullname"
                                            value={formData.fullname}
                                            onChange={handleChange}
                                            required
                                        />
                                    ) : (
                                        <p className="profile-info">{combinedUserData?.fullname || '(Chưa cập nhật)'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email</label>
                                    {isEditing && canEdit() ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    ) : (
                                        <p className="profile-info">{combinedUserData?.email}</p>
                                    )}
                                </div>
                            </div>

                            {isEditing && canEdit() && (
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

                            {isEditing && canEdit() && (
                                <div className="form-actions">
                                    <button type="submit" className="btn-save" disabled={updateLoading}>
                                        {updateLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
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
                                <div className="stat-value">{userStats.examsTaken || 0}</div>
                                <div className="stat-label">Bài thi đã làm</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon results">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{userStats.averageScore || 0}</div>
                                <div className="stat-label">Điểm trung bình</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon date">
                                <i className="fas fa-calendar-check"></i>
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">
                                    {userStats.lastActive
                                        ? new Date(userStats.lastActive).toLocaleDateString('vi-VN')
                                        : 'Chưa có'}
                                </div>
                                <div className="stat-label">Hoạt động gần đây</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="recent-exams">
                    <h3>Bài thi gần đây</h3>
                    {userStats.recentExams && userStats.recentExams.length > 0 ? (
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
                                {userStats.recentExams.map((exam, index) => (
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