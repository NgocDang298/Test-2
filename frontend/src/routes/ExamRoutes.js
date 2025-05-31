import React from 'react';
import { Route } from 'react-router-dom';
import ExamPage from '../pages/ExamPage/ExamPage';
import TakeExamPage from '../pages/TakeExamPage/TakeExamPage';
import StatisticsPage from '../pages/StatisticsPage/StatisticsPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import ProtectedRoute from './ProtectedRoute';
import ExamManagement from '../pages/ExamManagement/ExamManagement';
import QuestionPage from '../pages/QuestionPage/QuestionPage';
import ContestPage from '../pages/ContestPage/ContestPage';
import HsSubjectPage from "../pages/HsSubjectPage/HsSubjectPage";
import HsExamPage from "../pages/HsExamPage/HsExamPage";
import HsTakeExamPage from "../pages/HsTakeExamPage/HsTakeExamPage";
import HsTakeScorePage from "../pages/HsTakeScorePage/HsTakeScorePage";
import HsReadyPage from "../pages/HsReadyPage/HsReadyPage";
const ExamRoutes = ({ user, onLogout }) => ([

    <Route path="/teacher" element={
        <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
            <ExamPage user={user} />
        </ProtectedRoute>
    } key="exam-home" />,
    <Route path="/exam/:id" element={
        <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
            <TakeExamPage user={user} />
        </ProtectedRoute>
    } key="take-exam" />,
    <Route path="/statistics" element={
        <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <StatisticsPage user={user} />
        </ProtectedRoute>
    } key="statistics" />,
    <Route path="/profile" element={
        <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
            <ProfilePage user={user} onLogout={onLogout} />
        </ProtectedRoute>
    } key="profile" />,
    <Route path="/exams/subject/:subjectId" element={
        <ProtectedRoute allowedRoles={['teacher', 'admin', 'student']}>
            <ExamManagement />
        </ProtectedRoute>
    } key="exam-management" />,
    <Route path="/question-bank/:subjectId" element={
        <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <QuestionPage/>
        </ProtectedRoute>
    } key="question-bank" />,
    <Route path="/contest/:examId/:subjectId" element={
        <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <ContestPage />
        </ProtectedRoute>
    } key="contest" />,
    <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}>
            <HsSubjectPage />
        </ProtectedRoute>
    } key="student" />,
    <Route path="/student/subject/:subjectId/exams" element={
        <ProtectedRoute allowedRoles={['student']}>
            <HsExamPage />
        </ProtectedRoute>
    } key="student-exam" />,
    <Route path="/student/question/exam/:examId" element={
        <ProtectedRoute allowedRoles={['student']}>
            <HsTakeExamPage />
        </ProtectedRoute>
    } key="student-take-exam" />,
    <Route path="/student/question/exam/:examId/score" element={
        <ProtectedRoute allowedRoles={['student']}>
            <HsTakeScorePage />
        </ProtectedRoute>
    } key="student-take-score" />,
    <Route path="/student/question/exam/:examId/ready" element={
        <ProtectedRoute allowedRoles={['student']}>
            <HsReadyPage />
        </ProtectedRoute>
    } key="student-ready" />,

]);

export default ExamRoutes;