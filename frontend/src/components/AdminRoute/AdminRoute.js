import React from 'react';
import { Navigate } from 'react-router-dom';
import config from '@/config';
import Cookies from 'js-cookie';

const AdminRoute = ({ element: Element, ...rest }) => {
    const isAuthenticated = Cookies.get('role');

    return isAuthenticated && isAuthenticated === 'admin' ? Element : <Navigate to={config.routes.home} />;
};

export default AdminRoute;
