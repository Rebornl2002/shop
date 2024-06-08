// reducers/userReducer.js
import {
    FETCH_USERS_REQUEST,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAILURE,
    SET_LOGIN_MESSAGE,
    LOGIN_SUCCESS,
    LOGOUT,
    SET_CURRENT_USER,
} from '../actions/userActions';

const initialState = {
    loading: false,
    users: [],
    error: '',
    loginMessage: '',
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true', // Kiểm tra trạng thái đăng nhập từ localStorage
    currentUser: JSON.parse(localStorage.getItem('currentUser')),
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USERS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload,
                error: '',
            };
        case FETCH_USERS_FAILURE:
            return {
                ...state,
                loading: false,
                users: [],
                error: action.payload,
            };
        case SET_LOGIN_MESSAGE:
            return {
                ...state,
                loginMessage: action.payload,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                users: [],
                error: '',
                loginMessage: '',
                currentUser: null,
            };
        case SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload,
            };
        default:
            return state;
    }
};

export default userReducer;
