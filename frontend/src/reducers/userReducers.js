import {
    FETCH_USERS_REQUEST,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAILURE,
    SET_LOGIN_MESSAGE,
    LOGIN_SUCCESS,
    LOGOUT,
    SET_ROLE,
    DETAIL_USER,
} from '../actions/userActions';

const initialState = {
    loading: false,
    users: [],
    detail: [],
    error: '',
    loginMessage: '',
    isLoggedIn: false, // Khởi tạo isLoggedIn là false
    role: '',
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
                role: '',
            };
        case SET_ROLE:
            return {
                ...state,
                role: action.payload,
            };
        case DETAIL_USER:
            return {
                ...state,
                detail: action.payload,
            };
        default:
            return state;
    }
};

export default userReducer;
