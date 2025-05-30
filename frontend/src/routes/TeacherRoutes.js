import React from 'react';
import { Route } from 'react-router-dom';
import TeacherDashboard from '../pages/TeacherDashboard/TeacherDashboard';
import TeacherExamPage from '../pages/TeacherExamPage/TeacherExamPage';
import ProtectedRoute from './ProtectedRoute';

const TeacherRoutes = ({ user, onLogout }) => (
    <>
        {/* Teacher Dashboard */}
        <Route path="/teacher" element={
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <TeacherDashboard user={user} />
            </ProtectedRoute>
        } />
        
        {/* Teacher Exam Management - Alternative route */}
        <Route path="/teacher/exams" element={
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <TeacherExamPage user={user} />
            </ProtectedRoute>
        } />
    </>
);

export default TeacherRoutes; 