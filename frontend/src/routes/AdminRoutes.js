import React from 'react';
import { Route } from 'react-router-dom';
import UserManagement from '../pages/UserManagement/UserManagement';
import ExamManagement from '../pages/ExamManagement/ExamManagement';
import ProtectedRoute from './ProtectedRoute';
import AdminDashBoard from '../pages/AdminDashboard/AdminDashboard';
import ProfilePage from '../pages/ProfilePage/ProfilePage';

const AdminRoutes = ({ onLogout }) => ([
    // Route cha: /admin (render AdminDashboard)
    <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashBoard />
        </ProtectedRoute>
    } key="admin-dashboard" />,

    // Các route con
    <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <UserManagement />
        </ProtectedRoute>
    } key="admin-users" />,
    <Route path="/admin/exams" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <ExamManagement />
        </ProtectedRoute>
    } key="admin-exams" />,
    <Route path="/admin/profile" element={
        <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
            <ProfilePage />
        </ProtectedRoute>
    } key="admin-profile" />,
]);

export default AdminRoutes;