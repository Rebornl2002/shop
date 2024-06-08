// components/Toast.js
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Toast = {
    success: (message) => {
        toast.success(message, {
            position: 'top-right',
            autoClose: 5000,
        });
    },
    error: (message) => {
        toast.error(message, {
            position: 'top-right',
            autoClose: 5000,
        });
    },
};
