import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import '../../services/AuthService'
import { handleLogin } from '../../services/AuthService';
import { jwtDecode } from 'jwt-decode';
const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    // Xóa thông báo lỗi khi người dùng bắt đầu nhập
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await handleLogin(credentials);
      console.log(response);
      if (response.success === true) {

        await localStorage.setItem('accessToken', response.data.token);
        const decodedToken = jwtDecode(response.data.token);
        localStorage.setItem('user', JSON.stringify(decodedToken));
        onLogin(response.data.token);
        // if (decodedToken.roles[0] === 'ADMIN') {
        //   navigate('/admin')
        // } else if (decodedToken.roles[0] === 'TEACHER') {
        //   navigate('/teacher')
        // } else if (decodedToken.roles[0] === 'STUDENT') {
        //   navigate('/')
        // }
      }
      navigate('/')
    } catch (err) {
      console.log(err)
      setError(err.response?.message || 'username hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Chào mừng trở lại!</h1>
          <p>Đăng nhập để tiếp tục học tập</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">username</label>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input
                type="text"
                id="username"
                name="username"
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
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
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

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
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