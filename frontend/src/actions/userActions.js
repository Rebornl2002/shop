import axios from 'axios';
import { Toast } from '../components/Toast/Toast.js';
import { convertToISODate } from '@/calculate/caculate.js';

// Action types
export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';
export const SET_LOGIN_MESSAGE = 'SET_LOGIN_MESSAGE';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const DETAIL_USER = 'DETAIL_USER';

// Action creators
export const fetchUsersRequest = () => {
    return {
        type: FETCH_USERS_REQUEST,
    };
};

export const fetchUsersSuccess = (users) => {
    return {
        type: FETCH_USERS_SUCCESS,
        payload: users,
    };
};

export const fetchUsersFailure = (error) => {
    return {
        type: FETCH_USERS_FAILURE,
        payload: error,
    };
};

export const setMessage = (message) => {
    return {
        type: SET_LOGIN_MESSAGE,
        payload: message,
    };
};

export const loginSuccess = () => {
    return {
        type: LOGIN_SUCCESS,
    };
};

export const setCurrentUser = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return {
        type: SET_CURRENT_USER,
        payload: user,
    };
};

export const logout = () => {
    return (dispatch) => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        dispatch({
            type: LOGOUT,
        });
    };
};

export const detailUser = (user) => {
    return {
        type: DETAIL_USER,
        payload: user,
    };
};

// Async action creator using thunk
export const checkUser = (username, password) => {
    return (dispatch) => {
        dispatch(fetchUsersRequest());
        return axios
            .post(`http://localhost:4000/api/data/users/login`, { username, password })
            .then((response) => {
                const message = response.data.message;
                if (response.status === 200) {
                    dispatch(setMessage(message));
                    dispatch(loginSuccess());
                    localStorage.setItem('isLoggedIn', 'true');
                    dispatch(setCurrentUser(response.data.token));
                    Toast.success(message);
                } else {
                    dispatch(fetchUsersFailure(message));
                    Toast.error(message);
                }
                return Promise.resolve();
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchUsersFailure(errorMsg));
                dispatch(setMessage(errorMsg));
                Toast.error(errorMsg);
                return Promise.reject();
            });
    };
};

export const creatUser = (username, password) => {
    return (dispatch) => {
        dispatch(fetchUsersRequest());
        return axios
            .post(`http://localhost:4000/api/data/users`, { username, password })
            .then((response) => {
                const message = response.data.message;
                dispatch(setMessage(message));
                Toast.success(message);
                return Promise.resolve();
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchUsersFailure(errorMsg));
                dispatch(setMessage(errorMsg));
                Toast.error(errorMsg);
                return Promise.reject();
            });
    };
};

export const fetchDetailUser = (token) => {
    return (dispatch) => {
        return axios
            .get('http://localhost:4000/api/data/detailUser', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                const user = response.data;
                if (Array.isArray(user)) {
                    // Kiểm tra dữ liệu trả về có phải là mảng không
                    dispatch(detailUser(user));
                } else {
                    dispatch(fetchUsersFailure(user));
                }
                return Promise.resolve();
            })
            .catch((error) => {
                console.error(error);
                return Promise.reject();
            });
    };
};

export const fetchUpdateDetailUser = (data, token) => {
    return () => {
        axios
            .put(
                'http://localhost:4000/api/data/updateDetailUser',
                {
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    sex: data.sex,
                    date: convertToISODate(data.date),
                    address: data.address,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((response) => Toast.success('Cập nhật dữ liệu thành công !'))
            .catch((error) => Toast.error(error));
    };
};
