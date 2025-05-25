import React from 'react';
import { Route } from 'react-router-dom';
import ExamPage from '../pages/ExamPage/ExamPage';
import TakeExamPage from '../pages/TakeExamPage/TakeExamPage';
import StatisticsPage from '../pages/StatisticsPage/StatisticsPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import ProtectedRoute from './ProtectedRoute';

const ExamRoutes = ({ user, onLogout }) => (
    <>
        <Route path="/" element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                <ExamPage user={user} />
            </ProtectedRoute>
        } />
        <Route path="/exam/:id" element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                <TakeExamPage user={user} />
            </ProtectedRoute>
        } />
        <Route path="/statistics" element={
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <StatisticsPage user={user} />
            </ProtectedRoute>
        } />
        <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                <ProfilePage user={user} onLogout={onLogout} />
            </ProtectedRoute>
        } />
    </>
);

export default ExamRoutes;
