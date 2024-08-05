import { useState } from 'react';
import Cookies from 'js-cookie';

const useAuth = () => {
    const [role] = useState(Cookies.get('role') || null);

    return { role };
};

export default useAuth;
