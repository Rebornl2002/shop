// reducers/userReducer.js
import {
    FETCH_PRODUCTS_REQUEST,
    FETCH_PRODUCTS_SUCCESS,
    FETCH_PRODUCTS_FAILURE,
    SELECT_PRODUCT,
    SEARCH_PRODUCTS,
    DETAIL_PRODUCT,
    DISCOUNT_PRODUCT,
    ALL_DETAIL_PRODUCTS,
    PRODUCT_T0_PURCHASE,
} from '../actions/productActions.js';

const initialState = {
    loading: false,
    products: [],
    discountProducts: [],
    searchs: [],
    details: [],
    allDetails: [],
    productToPurchase: [],
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
                ...state,
                loading: false,
                products: action.payload,
                error: '',
            };
        case FETCH_PRODUCTS_FAILURE:
            return {
                ...state,
                loading: false,
                products: [],
                error: action.payload,
            };
        case SELECT_PRODUCT:
            return {
                ...state,
                selectedProduct: action.payload,
            };
        case SEARCH_PRODUCTS:
            return {
                ...state,
                searchs: action.payload,
            };
        case DETAIL_PRODUCT:
            return {
                ...state,
                details: action.payload,
            };
        case DISCOUNT_PRODUCT:
            return {
                ...state,
                discountProducts: action.payload,
            };
        case ALL_DETAIL_PRODUCTS:
            return {
                ...state,
                allDetails: action.payload,
            };
        case PRODUCT_T0_PURCHASE:
            return {
                ...state,
                productToPurchase: action.payload,
            };
        default:
            return state;
    }
};

export default productReducer;
