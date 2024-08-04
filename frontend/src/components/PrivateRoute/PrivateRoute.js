import React from 'react';
import { Navigate } from 'react-router-dom';
import config from '@/config';
import { useAuth } from '@/hook';

const PrivateRoute = ({ element: Element, ...rest }) => {
    const isAuthenticated = useAuth();

    return isAuthenticated ? Element : <Navigate to={config.routes.home} />;
};

export default PrivateRoute;
