import React from 'react';
import { Route } from 'react-router-dom';
import UserManagement from '../pages/UserManagement/UserManagement';
import ExamManagement from '../pages/ExamManagement/ExamManagement';
import ProtectedRoute from './ProtectedRoute';
import AdminDashBoard from '../pages/AdminDashboard/AdminDashboard'
import ProfilePage from '../pages/ProfilePage/ProfilePage';
const AdminRoutes = ({ onLogout }) => (
    <>
        {/* Route cha: /admin (render AdminDashboard) */}
        <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashBoard />
            </ProtectedRoute>
        } />

        {/* Các route con */}
        <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
                <UserManagement />
            </ProtectedRoute>
        } />
        <Route path="/admin/exams" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
                <ExamManagement />
            </ProtectedRoute>
        } />
        <Route path="/admin/profile" element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                <ProfilePage />
            </ProtectedRoute>
        } />
    </>
);

export default AdminRoutes;
