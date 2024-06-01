
// actions/userActions.js
import axios from 'axios';

// Action types
export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

// Action creators
export const fetchProductsRequest = () => {
  return {
    type: FETCH_PRODUCTS_REQUEST,
  };
};

export const fetchProductsSuccess = (products) => {
  return {
    type: FETCH_PRODUCTS_SUCCESS,
    payload: products,
  };
};

export const fetchProductsFailure = (error) => {
  return {
    type: FETCH_PRODUCTS_FAILURE,
    payload: error,
  };
};

// Async action creator using thunk
export const fetchProducts = () => {
  return (dispatch) => {
    dispatch(fetchProductsRequest());
    axios.get('http://localhost:4000/api/data/product')
      .then(response => {
        const products = response.data;
        dispatch(fetchProductsSuccess(products));
      })
      .catch(error => {
        const errorMsg = error.message;
        dispatch(fetchProductsFailure(errorMsg));
      });
  };
  
};
