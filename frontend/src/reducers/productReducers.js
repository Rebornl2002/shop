// reducers/userReducer.js
import {
    FETCH_PRODUCTS,
    FETCH_FAILURE,
    SELECT_PRODUCT,
    SEARCH_PRODUCTS,
    DETAIL_PRODUCT,
    DISCOUNT_PRODUCT,
    ALL_DETAIL_PRODUCTS,
    PRODUCT_T0_PURCHASE,
    HAS_MORE_PRODUCTS,
    REFRESH_PRODUCT,
    VARIATION_PRODUCT,
    SET_LOADING_STATE,
} from '../actions/productActions.js';

const initialState = {
    loadingStates: {},
    products: [],
    currentPage: 1,
    hasMore: true,
    discountProducts: [],
    searchs: [],
    details: {},
    allDetails: [],
    variations: [],
    productToPurchase: JSON.parse(localStorage.getItem('productToPurchase')) || [],
    error: '',
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOADING_STATE:
            return {
                ...state,
                loadingStates: {
                    ...state.loadingStates,
                    [action.payload.key]: action.payload.isLoading,
                },
            };
        case FETCH_PRODUCTS:
            return {
                ...state,
                loading: false,
                products: [...state.products, ...action.payload],
                currentPage: state.currentPage + 1,
                error: '',
            };
        case FETCH_FAILURE:
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
        case HAS_MORE_PRODUCTS:
            return {
                ...state,
                hasMore: action.payload,
            };
        case REFRESH_PRODUCT:
            return {
                ...state,
                products: [],
                currentPage: 1,
            };
        case VARIATION_PRODUCT:
            return {
                ...state,
                variations: action.payload,
            };
        default:
            return state;
    }
};

export default productReducer;
