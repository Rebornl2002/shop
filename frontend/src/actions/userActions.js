import axios from 'axios';
import { Toast } from '../components/Toast/Toast.js';
import { convertToISODate } from '@/calculate/calculate.js';

// Action types
export const FETCH_ERROR = 'FETCH_ERROR';
export const SET_LOGIN_MESSAGE = 'SET_LOGIN_MESSAGE';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const SET_ROLE = 'SET_ROLE';
export const DETAIL_USER = 'DETAIL_USER';
export const ALL_DETAIL_USERS = 'ALL_DETAIL_USERS';

// Action creators

export const fetchError = (error) => {
    return {
        type: FETCH_ERROR,
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

export const allDetailUsers = (users) => {
    return {
        type: ALL_DETAIL_USERS,
        payload: users,
    };
};

// Async action creator using thunk
export const checkUser = (username, password) => {
    return (dispatch) => {
        return axios
            .post(`http://localhost:4000/api/data/users/login`, { username, password }, { withCredentials: true })
            .then((response) => {
                const message = response.data.message;
                if (response.status === 200) {
                    dispatch(setMessage(message));
                    dispatch(loginSuccess());
                    dispatch(setRole(response.data));
                    Toast.success(message);
                } else {
                    dispatch(fetchError(message));
                    Toast.error(message);
                }
            })
            .catch((error) => {
                const errorMsg =
                    error.response?.data?.message || error.message || 'Tài khoản hoặc mật khẩu không chính xác!';
                dispatch(fetchError(errorMsg));
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

export const createUser = (data) => {
    return (dispatch) => {
        return axios
            .post(`http://localhost:4000/api/data/users`, data, { withCredentials: true })
            .then((response) => {
                const message = response.data.message;
                dispatch(setMessage(message));
                Toast.success(message);
                return Promise.resolve();
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchError(errorMsg));
                dispatch(setMessage(errorMsg));
                Toast.error(errorMsg);
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
                    dispatch(fetchError(user));
                }
                return Promise.resolve();
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchError(errorMsg));
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

export const fetchAllDetailUsers = () => {
    return (dispatch) => {
        return axios
            .get('http://localhost:4000/api/data/allDetailUsers', { withCredentials: true })
            .then((response) => {
                const user = response.data;
                if (Array.isArray(user)) {
                    dispatch(allDetailUsers(user));
                } else {
                    dispatch(fetchError(user));
                }
                return Promise.resolve();
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchError(errorMsg));
            });
    };
};

export const fetchToggerStatus = (username) => {
    return (dispatch) => {
        return axios
            .patch('http://localhost:4000/api/data/toggerStatus', { username: username }, { withCredentials: true })
            .then((response) => {
                const message = response.data.message;
                Toast.success(message);
                return Promise.resolve();
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                Toast.error(errorMsg);
            });
    };
};
