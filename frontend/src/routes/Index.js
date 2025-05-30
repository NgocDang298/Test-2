import React from 'react';
import AuthRoutes from './AuthRoutes';
import ExamRoutes from './ExamRoutes';
import AdminRoutes from './AdminRoutes';

const AppRoutes = ({ user, onLogin, onLogout }) => ([
    ...AuthRoutes({ user, onLogin }),
    ...ExamRoutes({ user, onLogout }),
    ...AdminRoutes({ onLogout }),
]);

export default AppRoutes;