import {
    FETCH_CARTS_REQUEST,
    FETCH_CARTS_SUCCESS,
    FETCH_CARTS_FAILURE,
    SET_MESSAGE,
    ADD_CART_REQUEST,
    ADD_CART_SUCCESS,
    ADD_CART_FAILURE,
} from '../actions/cartActions';

const initialState = {
    carts: [],
    loading: false,
    error: null,
    message: '',
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CARTS_REQUEST:
        case ADD_CART_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_CARTS_SUCCESS:
            return {
                ...state,
                loading: false,
                carts: action.payload,
                error: null,
            };
        case FETCH_CARTS_FAILURE:
        case ADD_CART_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case ADD_CART_SUCCESS:
            return {
                ...state,
                loading: false,
                carts: [...state.carts, action.payload],
                error: null,
            };
        case SET_MESSAGE:
            return {
                ...state,
                message: action.payload,
            };
        default:
            return state;
    }
};

export default cartReducer;
