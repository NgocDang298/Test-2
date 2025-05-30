import React from 'react';
import { Routes } from 'react-router-dom';
import AuthRoutes from './AuthRoutes';
import ExamRoutes from './ExamRoutes';
import AdminRoutes from './AdminRoutes';
import TeacherRoutes from './TeacherRoutes';

const AppRoutes = ({ user, isAuthenticated, onLogout }) => {
    return (
        <Routes>
            {/** Sử dụng gọi hàm component như JSX */}
            <>{AuthRoutes({ user, isAuthenticated })}</>
            <>{ExamRoutes({ user, onLogout })}</>
            <>{AdminRoutes({ onLogout })}</>
            <>{TeacherRoutes({ user, onLogout })}</>
        </Routes>
    );
};

export default AppRoutes;
