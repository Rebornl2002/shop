import {
    FETCH_ERROR,
    SET_LOGIN_MESSAGE,
    LOGIN_SUCCESS,
    LOGOUT,
    SET_ROLE,
    DETAIL_USER,
    ALL_DETAIL_USERS,
} from '../actions/userActions';

const initialState = {
    detail: [],
    allDetails: [],
    error: '',
    loginMessage: '',
    isLoggedIn: false, // Khởi tạo isLoggedIn là false
    role: '',
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ERROR:
            return {
                ...state,
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
        case ALL_DETAIL_USERS:
            return {
                ...state,
                allDetails: action.payload,
            };
        default:
            return state;
    }
};

export default userReducer;
