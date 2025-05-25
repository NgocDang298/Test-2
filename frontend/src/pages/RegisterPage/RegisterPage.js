import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.css';
import { handleRegister } from '../../services/AuthService';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.name = 'Vui lòng nhập họ tên';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        console.log('check username', formData.username)
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await handleRegister({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (response.success) {
                setSuccess(true);
                // Hiển thị thông báo thành công
                setErrors({});
                // Chuyển hướng sau 2 giây
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            // Xử lý lỗi từ server
            if (error.response) {
                const { data } = error.response;
                if (data.error === 'EMAIL_EXISTS') {
                    setErrors({
                        email: 'Email đã được sử dụng. Vui lòng chọn email khác.'
                    });
                } else {
                    setErrors({
                        submit: data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.'
                    });
                }
            } else {
                setErrors({
                    submit: 'Không thể kết nối đến server. Vui lòng thử lại sau.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-header">
                    <h1 className="register-title">Đăng ký tài khoản</h1>
                    <p className="register-subtitle">Tạo tài khoản để bắt đầu học tập</p>
                </div>

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="username"
                            className="form-input"
                            placeholder=" "
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <label className="form-label">Tên Đăng Nhập</label>
                        {errors.name && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-circle"></i>
                                {errors.name}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder=" "
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <label className="form-label">Email</label>
                        {errors.email && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-circle"></i>
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder=" "
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <label className="form-label">Mật khẩu</label>
                        <i className="fas fa-eye password-toggle"></i>
                        {errors.password && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-circle"></i>
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-input"
                            placeholder=" "
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        <label className="form-label">Xác nhận mật khẩu</label>
                        <i className="fas fa-eye password-toggle"></i>
                        {errors.confirmPassword && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-circle"></i>
                                {errors.confirmPassword}
                            </div>
                        )}
                    </div>

                    {errors.submit && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i>
                            {errors.submit}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            <i className="fas fa-check-circle"></i>
                            Đăng ký thành công! Đang chuyển hướng...
                        </div>
                    )}

                    <button
                        type="submit"
                        className="register-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="loading">
                                <i className="fas fa-spinner fa-spin"></i>
                                Đang xử lý...
                            </div>
                        ) : (
                            'Đăng ký'
                        )}
                    </button>
                </form>

                <div className="register-footer">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="login-link">
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage; 