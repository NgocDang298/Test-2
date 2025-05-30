import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';

const AuthRoutes = ({ user, onLogin }) => {
    // Nếu đã đăng nhập, chuyển hướng theo role
    if (user) {
        let decoded = user;
        if (typeof user === 'string') {
            try {
                decoded = JSON.parse(user);
            } catch (e) {
                // Nếu không phải JSON, bỏ qua parse
                decoded = { roles: [user] };
            }
        }
        const role = decoded.roles ? decoded.roles[0] : null;
        if (role === 'TEACHER') return [<Route path="*" element={<Navigate to="/teacher" />} key="teacher-redirect" />];
        if (role === 'ADMIN') return [<Route path="*" element={<Navigate to="/admin" />} key="admin-redirect" />];
        if (role === 'STUDENT') return [<Route path="*" element={<Navigate to="/student" />} key="student-redirect" />];
    }
    // Nếu chưa đăng nhập, hiển thị login/register
    return [
        <Route path="/" element={<Navigate to="/login" />} key="root-redirect" />,
        <Route path="/login" element={<LoginPage onLogin={onLogin} />} key="login" />,
        <Route path="/register" element={<RegisterPage />} key="register" />,
    ];
};
export default AuthRoutes;