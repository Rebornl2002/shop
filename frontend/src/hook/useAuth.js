import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authCookie = Cookies.get('authToken'); // Giả sử bạn lưu trữ token đăng nhập trong cookie
        if (authCookie) {
            setIsAuthenticated(true);
        }
    }, []);

    return { isAuthenticated };
};

export default useAuth;
