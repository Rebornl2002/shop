import axios from 'axios';
import { Toast } from '../components/Toast/Toast.js';
import { convertToISODate } from '@/calculate/calculate.js';

// Action types
export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';
export const SET_LOGIN_MESSAGE = 'SET_LOGIN_MESSAGE';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const SET_ROLE = 'SET_ROLE';
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

export const setRole = (role) => {
    return {
        type: SET_ROLE,
        payload: role,
    };
};

export const logout = () => {
    return {
        type: LOGOUT,
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
            .post(`http://localhost:4000/api/data/users/login`, { username, password }, { withCredentials: true })
            .then((response) => {
                const message = response.data.message;
                if (response.status === 200) {
                    dispatch(setMessage(message));
                    dispatch(loginSuccess());
                    dispatch(setRole(response.data.role));
                    Toast.success(message);
                } else {
                    dispatch(fetchUsersFailure(message));
                    Toast.error(message);
                }
            })
            .catch((error) => {
                const errorMsg =
                    error.response?.data?.message || error.message || 'Tài khoản hoặc mật khẩu không chính xác!';
                dispatch(fetchUsersFailure(errorMsg));
                dispatch(setMessage(errorMsg));
                Toast.error(errorMsg);
            });
    };
};

export const fetchLogout = () => async (dispatch) => {
    try {
        await axios.post('http://localhost:4000/api/data/logout', undefined, { withCredentials: true });
        dispatch(logout());
    } catch (error) {
        console.error('Logout failed', error);
    }
};

export const checkStatus = () => async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:4000/api/data/status', { withCredentials: true });
        if (response.data.loggedIn) {
            dispatch(loginSuccess());
        }
    } catch (error) {
        console.error('Failed to check status', error);
    }
};

export const createUser = (username, password) => {
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

export const fetchDetailUser = () => {
    return (dispatch) => {
        return axios
            .get('http://localhost:4000/api/data/detailUser', { withCredentials: true })
            .then((response) => {
                const user = response.data;
                if (Array.isArray(user)) {
                    dispatch(detailUser(user));
                } else {
                    dispatch(fetchUsersFailure(user));
                }
                return Promise.resolve();
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchUsersFailure(errorMsg));
            });
    };
};

export const fetchUpdateDetailUser = (data) => {
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
                    withCredentials: true,
                },
            )
            .then(() => Toast.success('Cập nhật dữ liệu thành công!'))
            .catch((error) => Toast.error(error.message));
    };
};
