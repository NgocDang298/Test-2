import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import { useUser } from '../contexts/UserContext';

const AuthRoutes = () => {
    const { isAuthenticated } = useUser();
    
    // If already logged in, redirect to home page
    if (isAuthenticated) {
        return [<Route path="*" element={<Navigate to="/home" />} key="home-redirect" />];
    }
    // If not logged in, show login/register
    return [
        <Route path="/" element={<Navigate to="/login" />} key="root-redirect" />,
        <Route path="/login" element={<LoginPage />} key="login" />,
        <Route path="/register" element={<RegisterPage />} key="register" />,
    ];
};
export default AuthRoutes;