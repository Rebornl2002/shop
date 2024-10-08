// actions/userActions.js
import axios from 'axios';
import { Toast } from '../components/Toast/Toast.js';

// Action types
export const FETCH_PRODUCTS = 'FETCH_PRODUCTS';
export const FETCH_FAILURE = 'FETCH_FAILURE';
export const SEARCH_PRODUCTS = 'SEARCH_PRODUCTS';
export const SELECT_PRODUCT = 'SELECT_PRODUCT';
export const DETAIL_PRODUCT = 'DETAIL_PRODUCT';
export const DISCOUNT_PRODUCT = 'DISCOUNT_PRODUCT';
export const ALL_DETAIL_PRODUCTS = 'ALL_DETAIL_PRODUCTS';
export const PRODUCT_T0_PURCHASE = 'PRODUCT_T0_PURCHASE';
export const HAS_MORE_PRODUCTS = 'HAS_MORE_PRODUCTS';
export const REFRESH_PRODUCT = 'REFRESH_PRODUCT';
export const VARIATION_PRODUCT = 'VARIATION_PRODUCT';
export const SET_LOADING_STATE = 'SET_LOADING_STATE';

export const setLoadingState = (key, isLoading) => {
    return {
        type: SET_LOADING_STATE,
        payload: { key, isLoading },
    };
};

export const fetchProductsSuccess = (products) => {
    return {
        type: FETCH_PRODUCTS,
        payload: products,
    };
};

export const fetchFailure = (error) => {
    return {
        type: FETCH_FAILURE,
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

export const getProductToPurchase = (product) => {
    localStorage.setItem('productToPurchase', JSON.stringify(product));
    return {
        type: PRODUCT_T0_PURCHASE,
        payload: product,
    };
};

export const hasMoreProduct = (data) => {
    return {
        type: HAS_MORE_PRODUCTS,
        payload: data,
    };
};

export const refreshProduct = () => {
    return { type: REFRESH_PRODUCT };
};

export const getVariationProduct = (data) => {
    return {
        type: VARIATION_PRODUCT,
        payload: data,
    };
};

// Async action creator using thunk
export const fetchProducts = (page) => {
    return (dispatch) => {
        const limit = 4;
        const loadingKey = 'fetchProducts';
        dispatch(setLoadingState(loadingKey, true));

        return axios
            .get(`http://localhost:4000/api/data/products?page=${page}&limit=${limit}`)
            .then((response) => {
                const products = response.data.products;
                if (Array.isArray(products)) {
                    if (page === 1) {
                        dispatch(refreshProduct());
                    }
                    dispatch(fetchProductsSuccess(products));
                    dispatch(hasMoreProduct(response.data.products.length === limit));
                } else {
                    dispatch(fetchFailure('Invalid data format'));
                }
            })
            .catch((error) => {
                const errorMsg = error.message;
                dispatch(fetchFailure(errorMsg));
                throw error;
            })
            .finally(() => {
                dispatch(setLoadingState(loadingKey, false));
            });
    };
};

export const fetchDiscountProducts = () => {
    return (dispatch) => {
        const loadingKey = 'fetchDiscountProducts';
        dispatch(setLoadingState(loadingKey, true));

        return axios
            .get('http://localhost:4000/api/data/products/discount')
            .then((response) => {
                const products = response.data;
                if (Array.isArray(products)) {
                    // Kiểm tra dữ liệu trả về có phải là mảng không
                    dispatch(discountProduct(products));
                } else {
                    dispatch(fetchFailure('Invalid data format')); // Xử lý dữ liệu không hợp lệ
                }
                return Promise.resolve();
            })
            .catch((error) => {
                const errorMsg = error.message;
                dispatch(fetchFailure(errorMsg));
            })
            .finally(() => {
                dispatch(setLoadingState(loadingKey, false));
            });
    };
};

export const fetchSearchProducts = (value) => {
    return (dispatch) => {
        const loadingKey = 'fetchSearchProducts';
        dispatch(setLoadingState(loadingKey, true));

        return axios
            .get(`http://localhost:4000/api/data/products/search?productName=${value}`)
            .then((response) => {
                const products = response.data;
                if (Array.isArray(products)) {
                    // Kiểm tra dữ liệu trả về có phải là mảng không
                    dispatch(searchProducts(products));
                } else {
                    dispatch(fetchFailure('Invalid data format')); // Xử lý dữ liệu không hợp lệ
                }
                return Promise.resolve();
            })
            .catch((error) => {
                const errorMsg = error.message;
                dispatch(fetchFailure(errorMsg));
            })
            .finally(() => {
                dispatch(setLoadingState(loadingKey, false));
            });
    };
};

export const fetchDetailProducts = (id) => {
    return (dispatch) => {
        const loadingKey = 'fetchDetailProducts';
        dispatch(setLoadingState(loadingKey, true));

        return axios
            .get(`http://localhost:4000/api/data/products/details?id=${id}`)
            .then((response) => {
                const products = response.data;
                dispatch(detailProduct(products));
            })
            .catch((error) => {
                const errorMsg = error.message;
                dispatch(fetchFailure(errorMsg));
            })
            .finally(() => {
                dispatch(setLoadingState(loadingKey, false));
            });
    };
};

export const fetchAllDetailProducts = () => {
    return (dispatch) => {
        const loadingKey = 'fetchAllDetailProducts';
        dispatch(setLoadingState(loadingKey, true));
        return axios
            .get(`http://localhost:4000/api/data/allDetailProducts`, { withCredentials: true })
            .then((response) => {
                const products = response.data;

                if (Array.isArray(products)) {
                    // Kiểm tra dữ liệu trả về có phải là mảng không
                    dispatch(allDetailProducts(products));
                } else {
                    dispatch(fetchFailure('Invalid data format')); // Xử lý dữ liệu không hợp lệ
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                dispatch(setLoadingState(loadingKey, false));
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
            .patch('http://localhost:4000/api/data/updateProduct', data, { withCredentials: true })
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
    return () => {
        return axios
            .patch(`http://localhost:4000/api/data/product?id=${id}`, undefined, { withCredentials: true })
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

export const fetchGetVariation = (id) => {
    return (dispatch) => {
        const loadingKey = 'fetchGetVariation';
        dispatch(setLoadingState(loadingKey, true));

        return axios
            .get(`http://localhost:4000/api/data/variations?id=${id}`)
            .then((response) => {
                const data = response.data;
                dispatch(getVariationProduct(data));
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                console.log(error);
                Toast.error(errorMsg);
                throw error;
            })
            .finally(() => {
                dispatch(setLoadingState(loadingKey, false));
            });
    };
};

export const fetchAddVariation = (data) => {
    return () => {
        return axios
            .post('http://localhost:4000/api/data/variations', data, { withCredentials: true })
            .then((response) => Toast.success(response.data.message))
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                console.log(error);
                Toast.error(errorMsg);
                throw error;
            });
    };
};

export const fetchDeleteVariation = (id) => {
    return () => {
        return axios
            .delete(`http://localhost:4000/api/data/variations?id=${id}`, { withCredentials: true })
            .then((response) => Toast.success(response.data.message))
            .catch((error) => {
                const errorMsg = error.response?.data?.message || error.message;
                console.log(error);
                Toast.error(errorMsg);
                throw error;
            });
    };
};
