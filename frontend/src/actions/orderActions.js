import axios from 'axios';
import { Toast } from '../components/Toast/Toast.js';

export const GET_ORDER = 'GET_ORDER';
export const ERROR = 'ERROR';

export const getOrder = (order) => {
    return {
        type: GET_ORDER,
        payload: order,
    };
};

export const error = (err) => {
    return {
        type: ERROR,
        payload: err,
    };
};

export const fetchAddOrder = (orderData, productData) => {
    return () => {
        return axios
            .post(
                'http://localhost:4000/api/data/order',
                {
                    order: orderData,
                    products: productData,
                },
                { withCredentials: true },
            )
            .then((response) => {
                const message = response.data.message;
                Toast.success(message);
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                Toast.error(errorMsg);
            });
    };
};

export const fetchGetAllOrder = () => {
    return (dispatch) => {
        return axios
            .get('http://localhost:4000/api/data/orders', { withCredentials: true })
            .then((response) => {
                const orderData = response.data;
                dispatch(getOrder(orderData));
            })
            .catch((error) => {
                console.error(error);
            });
    };
};
