import React from 'react';
import { Route } from 'react-router-dom';
import ExamPage from '../pages/ExamPage/ExamPage';
import TestExamPage from '../pages/TestExamPage/TestExamPage';
import ProtectedRoute from './ProtectedRoute';

const ExamRoutes = () => {
  return (
    <>
      <Route 
        path="/exams" 
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <TestExamPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/exams" 
        element={
          <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
            <ExamPage />
          </ProtectedRoute>
        } 
      />
    </>
  );
};

export default ExamRoutes;
