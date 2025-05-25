import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            console.log('decode', decoded)
            const role = decoded.roles[0] || decoded.user?.roles[0];
            setIsAuthenticated(true);
            setUserRole(role);
            console.log('check token', token, allowedRoles, "token role", role)

        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem('token');
        }

        setLoading(false);
    }, []);

    if (loading) return <div>Loading...</div>;

    if (!isAuthenticated) return <Navigate to="/login" />;

    // Kiểm tra quyền truy cập - chuyển đổi tất cả về chữ thường để so sánh
    const hasPermission = allowedRoles && allowedRoles.some(role =>
        role.toLowerCase() === userRole?.toLowerCase()
    );

    if (allowedRoles && !hasPermission) {
        // ⛔ Người dùng không có quyền → chuyển hướng về route mặc định theo role
        let redirectPath = '/';

        // Chuyển đổi userRole về chữ thường để so sánh
        const roleLower = userRole?.toLowerCase();

        switch (roleLower) {
            case 'admin':
                redirectPath = '/admin';
                break;
            case 'teacher':
                redirectPath = '/teacher';
                break;
            case 'student':
                redirectPath = '/';
                break;
            default:
                redirectPath = '/login';
        }

        return <Navigate to={redirectPath} />;
    }

    return children;
};

export default ProtectedRoute;
