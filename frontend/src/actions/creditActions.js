import axios from 'axios';
import { Toast } from '../components/Toast/Toast.js';

export const GET_CREDIT = 'GET_CREDIT';
export const ERROR = 'ERROR';

export const getCredit = (credits) => {
    return {
        type: GET_CREDIT,
        payload: credits,
    };
};

export const error = (err) => {
    return { type: ERROR, payload: err };
};

export const fetchAddCredit = (data) => {
    return () => {
        return axios
            .post('http://localhost:4000/api/data/credit', data, { withCredentials: true })
            .then((response) => {
                const message = response.data.message;
                Toast.success(message);
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                Toast.error(errorMsg);
                throw error;
            });
    };
};

export const fetchGetCredit = () => {
    return (dispatch) => {
        return axios
            .get('http://localhost:4000/api/data/credit', { withCredentials: true })
            .then((response) => {
                const data = response.data;
                dispatch(getCredit(data));
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(error(errorMsg));
                throw error;
            });
    };
};
