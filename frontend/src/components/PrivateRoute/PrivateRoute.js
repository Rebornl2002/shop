import React from 'react';
import { Navigate } from 'react-router-dom';
import config from '@/config';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element: Element, ...rest }) => {
    const isAuthenticated = useSelector((state) => state.user.isLoggedIn);

    return isAuthenticated ? Element : <Navigate to={config.routes.home} />;
};

export default PrivateRoute;
