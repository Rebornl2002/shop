// actions/userActions.js
import axios from 'axios';
import { Toast } from '../components/Toast/Toast.js';

// Action types
export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';
export const SEARCH_PRODUCTS = 'SEARCH_PRODUCTS';
export const SELECT_PRODUCT = 'SELECT_PRODUCT';
export const DETAIL_PRODUCT = 'DETAIL_PRODUCT';
export const DISCOUNT_PRODUCT = 'DISCOUNT_PRODUCT';
export const ALL_DETAIL_PRODUCTS = 'ALL_DETAIL_PRODUCTS';

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

export const selectProduct = (product) => {
    return {
        type: SELECT_PRODUCT,
        payload: product,
    };
};

export const detailProduct = (product) => {
    return {
        type: DETAIL_PRODUCT,
        payload: product,
    };
};

export const searchProducts = (product) => {
    return {
        type: SEARCH_PRODUCTS,
        payload: product,
    };
};

export const discountProduct = (product) => {
    return {
        type: DISCOUNT_PRODUCT,
        payload: product,
    };
};

export const allDetailProducts = (product) => {
    return {
        type: ALL_DETAIL_PRODUCTS,
        payload: product,
    };
};

// Async action creator using thunk
export const fetchProducts = () => {
    return (dispatch) => {
        dispatch(fetchProductsRequest());
        return axios
            .get('http://localhost:4000/api/data/products')
            .then((response) => {
                const products = response.data;
                if (Array.isArray(products)) {
                    // Kiểm tra dữ liệu trả về có phải là mảng không
                    dispatch(fetchProductsSuccess(products));
                } else {
                    dispatch(fetchProductsFailure('Invalid data format')); // Xử lý dữ liệu không hợp lệ
                }
            })
            .catch((error) => {
                const errorMsg = error.message;
                dispatch(fetchProductsFailure(errorMsg));
            });
    };
};

export const fetchDiscountProducts = () => {
    return (dispatch) => {
        return axios
            .get('http://localhost:4000/api/data/products/discount')
            .then((response) => {
                const products = response.data;
                if (Array.isArray(products)) {
                    // Kiểm tra dữ liệu trả về có phải là mảng không
                    dispatch(discountProduct(products));
                } else {
                    dispatch(fetchProductsFailure('Invalid data format')); // Xử lý dữ liệu không hợp lệ
                }
                return Promise.resolve();
            })
            .catch((error) => {
                const errorMsg = error.message;
                dispatch(fetchProductsFailure(errorMsg));
            });
    };
};

export const fetchSearchProducts = (value) => {
    return (dispatch) => {
        return axios
            .get(`http://localhost:4000/api/data/products/search?productName=${value}`)
            .then((response) => {
                const products = response.data;
                if (Array.isArray(products)) {
                    // Kiểm tra dữ liệu trả về có phải là mảng không
                    dispatch(searchProducts(products));
                } else {
                    dispatch(fetchProductsFailure('Invalid data format')); // Xử lý dữ liệu không hợp lệ
                }
                return Promise.resolve();
            })
            .catch((error) => {
                const errorMsg = error.message;
                dispatch(fetchProductsFailure(errorMsg));
            });
    };
};

export const fetchDetailProducts = (id) => {
    return (dispatch) => {
        return axios
            .get(`http://localhost:4000/api/data/products/details?id=${id}`)
            .then((response) => {
                const products = response.data;
                if (Array.isArray(products)) {
                    // Kiểm tra dữ liệu trả về có phải là mảng không
                    dispatch(detailProduct(products));
                } else {
                    dispatch(fetchProductsFailure('Invalid data format')); // Xử lý dữ liệu không hợp lệ
                }
                return Promise.resolve();
            })
            .catch((error) => {
                const errorMsg = error.message;
                dispatch(fetchProductsFailure(errorMsg));
            });
    };
};

export const fetchAllDetailProducts = () => {
    return (dispatch) => {
        return axios
            .get(`http://localhost:4000/api/data/allDetailProducts`, { withCredentials: true })
            .then((response) => {
                const products = response.data;

                if (Array.isArray(products)) {
                    // Kiểm tra dữ liệu trả về có phải là mảng không
                    dispatch(allDetailProducts(products));
                } else {
                    dispatch(fetchProductsFailure('Invalid data format')); // Xử lý dữ liệu không hợp lệ
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
};

export const fetchAddProduct = (currentProduct) => {
    return (dispatch) => {
        return axios
            .post('http://localhost:4000/api/data/products', currentProduct, { withCredentials: true })
            .then((response) => {
                console.log(response);
                Toast.success(response.data.message);
                return Promise.resolve();
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                console.log(error);
                Toast.error(errorMsg);
            });
    };
};

export const fetchUpdateProduct = (data) => {
    return (dispatch) => {
        return axios
            .put('http://localhost:4000/api/data/updateProduct', data, { withCredentials: true })
            .then((response) => {
                Toast.success(response.data.message);
                return Promise.resolve();
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                console.log(error);
                Toast.error(errorMsg);
            });
    };
};

export const fetchDeleteProduct = (id) => {
    return (dispatch) => {
        return axios
            .delete('http://localhost:4000/api/data/product', {
                withCredentials: true, // Cho phép axios gửi cookies cùng với request
                data: {
                    id, // Gửi dữ liệu id trong phần body của yêu cầu
                },
            })
            .then((response) => {
                Toast.success(response.data.message);
                return Promise.resolve();
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                console.log(error);
                Toast.error(errorMsg);
            });
    };
};
