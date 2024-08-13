import axios from 'axios';
import { Toast } from '../components/Toast/Toast.js';

// Action types
export const FETCH_CARTS_REQUEST = 'FETCH_CARTS_REQUEST';
export const FETCH_CARTS_SUCCESS = 'FETCH_CARTS_SUCCESS';
export const FETCH_CARTS_FAILURE = 'FETCH_CARTS_FAILURE';
export const SET_MESSAGE = 'SET_MESSAGE';
export const ADD_CART_REQUEST = 'ADD_CART_REQUEST';
export const ADD_CART_SUCCESS = 'ADD_CART_SUCCESS';
export const ADD_CART_FAILURE = 'ADD_CART_FAILURE';

// Action creators
export const fetchCartsRequest = () => {
    return {
        type: FETCH_CARTS_REQUEST,
    };
};

export const fetchCartsSuccess = (carts) => {
    return {
        type: FETCH_CARTS_SUCCESS,
        payload: carts,
    };
};

export const fetchCartsFailure = (error) => {
    return {
        type: FETCH_CARTS_FAILURE,
        payload: error,
    };
};

export const setMessage = (message) => {
    return {
        type: SET_MESSAGE,
        payload: message,
    };
};

export const addCartRequest = () => {
    return {
        type: ADD_CART_REQUEST,
    };
};

export const addCartSuccess = (cart) => {
    return {
        type: ADD_CART_SUCCESS,
        payload: cart,
    };
};

export const addCartFailure = (error) => {
    return {
        type: ADD_CART_FAILURE,
        payload: error,
    };
};

export const getCartData = () => {
    return (dispatch) => {
        dispatch(fetchCartsRequest());
        return axios
            .get('http://localhost:4000/api/data/carts', {
                withCredentials: true, // Cho phép axios gửi cookies cùng với request
            })
            .then((response) => {
                const message = response.data.message;
                const data = response.data;
                if (Array.isArray(data)) {
                    dispatch(fetchCartsSuccess(data));
                    dispatch(setMessage(message));
                    Toast.success(message);
                } else {
                    dispatch(fetchCartsFailure(message));
                    dispatch(setMessage(message));
                    Toast.error(message);
                }
                return Promise.resolve();
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchCartsFailure(errorMsg));
                dispatch(setMessage(errorMsg));
                Toast.error(errorMsg);
            });
    };
};

export const addCart = (id, quantity) => {
    return (dispatch) => {
        dispatch(addCartRequest());
        return axios
            .post(
                'http://localhost:4000/api/data/carts',
                { id, quantity },
                {
                    withCredentials: true, // Cho phép axios gửi cookies cùng với request
                },
            )
            .then((response) => {
                const message = response.data.message;
                const cart = response.data.cart;
                dispatch(addCartSuccess(cart));
                dispatch(setMessage(message));
                Toast.success(message);
                return Promise.resolve(); // Trả về Promise.resolve() để cho biết đã hoàn thành
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(addCartFailure(errorMsg));
                dispatch(setMessage(errorMsg));
                Toast.error(errorMsg);
                // Trả về Promise.reject() để cho biết có lỗi xảy ra
            });
    };
};

export const updateCartQuantity = (id, quantity) => {
    return () => {
        return axios
            .put(
                'http://localhost:4000/api/data/updateCartQuantity',
                { id, quantity },
                {
                    withCredentials: true, // Cho phép axios gửi cookies cùng với request
                },
            )
            .then((response) => {
                Toast.success(response);
                return Promise.resolve();
            })
            .catch((error) => {
                Toast.error(error);
            });
    };
};

export const deleteCart = (id) => {
    return () => {
        return axios
            .delete('http://localhost:4000/api/data/carts', {
                withCredentials: true, // Cho phép axios gửi cookies cùng với request
                data: {
                    id, // Gửi dữ liệu id trong phần body của yêu cầu
                },
            })
            .then((response) => {
                Toast.success(response.data.message);
                return Promise.resolve();
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                Toast.error(errorMsg);
            });
    };
};
