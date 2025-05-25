import React from 'react';
import { Routes } from 'react-router-dom';
import AuthRoutes from './AuthRoutes';
import ExamRoutes from './ExamRoutes';
import AdminRoutes from './AdminRoutes';

const AppRoutes = ({ user, onLogin, onLogout }) => {
    return (
        <Routes>
            {/** Sử dụng gọi hàm component như JSX */}
            <>{AuthRoutes({ user, onLogin })}</>
            <>{ExamRoutes({ user, onLogout })}</>
            <>{AdminRoutes({ onLogout })}</>
        </Routes>
    );
};

export default AppRoutes;
