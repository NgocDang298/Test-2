import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import '../../services/AuthService'
import { handleLogin } from '../../services/AuthService';
import { jwtDecode } from 'jwt-decode';
import Footer from '../../components/Layout/Footer/Footer';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await handleLogin(credentials);
      if (response.success === true) {
        localStorage.setItem('token', response.data.accessToken);
        const decodedToken = jwtDecode(response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(decodedToken));
        onLogin(response.data.accessToken);
        if (decodedToken.roles[0] === 'ADMIN') {
          navigate('/admin')
        } else if (decodedToken.roles[0] === 'TEACHER') {
          navigate('/teacher')
        } else if (decodedToken.roles[0] === 'STUDENT') {
          navigate('/student')
        }
      }
    } catch (err) {
      setError(err.response?.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
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
              <label htmlFor="username">Tên đăng nhập</label>
              <div className="input-group">
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Nhập tên đăng nhập"
                    required
                    autoComplete="username"
                />
                {/*<i className="fas fa-envelope input-icon-right"></i>*/}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="input-group">
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
                    tabIndex={-1}
                    aria-label="Hiện/ẩn mật khẩu"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
                {/*<i className="fas fa-lock input-icon-right"></i>*/}
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
        <Footer />
      </div>
  );
};

export default LoginPage;