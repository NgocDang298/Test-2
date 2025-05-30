import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { handleLogin } from '../../services/AuthService';
import useAuthStore from '../../stores/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    // Xóa thông báo lỗi khi người dùng bắt đầu nhập
    if (localError) setLocalError('');
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      const response = await handleLogin(credentials);
      console.log('Login response:', response);
      
      if (response.success === true) {
        // Sử dụng Zustand store để login
        await login(response.data.accessToken);
        
        // Navigate dựa trên role (có thể lấy từ store sau khi login)
        navigate('/');
      } else {
        setLocalError(response.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLocalError(err.response?.data?.message || 'Username hoặc mật khẩu không đúng');
    }
  };

  const displayError = localError || error;

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Chào mừng trở lại!</h1>
          <p>Đăng nhập để tiếp tục học tập</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-group">
              <i className="fas fa-user !pl-2"></i>
              <input
                type="text"
                id="username"
                name="username"
                className="!pl-10"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Nhập username của bạn"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-group">
              <i className="fas fa-lock !pl-2"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className="!pl-10"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Quên mật khẩu?
            </Link>
          </div>

          {displayError && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {displayError}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>Đang đăng nhập...</span>
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                <span>Đăng nhập</span>
              </>
            )}
          </button>

          <div className="register-link">
            <p>
              Chưa có tài khoản?{' '}
              <Link to="/register">Đăng ký ngay</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;