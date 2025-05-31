import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';

const AuthRoutes = ({ user, onLogin }) => {
    // Nếu đã đăng nhập, chuyển hướng đến trang home
    if (user) {
        return [<Route path="*" element={<Navigate to="/home" />} key="home-redirect" />];
    }
    // Nếu chưa đăng nhập, hiển thị login/register
    return [
        <Route path="/" element={<Navigate to="/login" />} key="root-redirect" />,
        <Route path="/login" element={<LoginPage onLogin={onLogin} />} key="login" />,
        <Route path="/register" element={<RegisterPage />} key="register" />,
    ];
};
export default AuthRoutes;