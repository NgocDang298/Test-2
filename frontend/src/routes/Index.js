import React from 'react';
import AuthRoutes from './AuthRoutes';
import ExamRoutes from './ExamRoutes';
import AdminRoutes from './AdminRoutes';

const AppRoutes = () => ([
    ...AuthRoutes(),
    ...ExamRoutes(),
    ...AdminRoutes(),
]);

export default AppRoutes;