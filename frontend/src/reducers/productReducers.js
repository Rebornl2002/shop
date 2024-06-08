// reducers/userReducer.js
import {
    FETCH_PRODUCTS_REQUEST,
    FETCH_PRODUCTS_SUCCESS,
    FETCH_PRODUCTS_FAILURE,
    SELECT_PRODUCT,
} from '../actions/productActions.js';

const initialState = {
    loading: false,
    products: [],
    error: '',
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCTS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_PRODUCTS_SUCCESS:
            return {
                loading: false,
                products: action.payload,
                error: '',
            };
        case FETCH_PRODUCTS_FAILURE:
            return {
                loading: false,
                products: [],
                error: action.payload,
            };
        case SELECT_PRODUCT:
            return {
                ...state,
                selectedProduct: action.payload,
            };
        default:
            return state;
    }
};

export default productReducer;
