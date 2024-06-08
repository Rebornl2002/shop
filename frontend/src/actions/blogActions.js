import axios from 'axios';

// Action types
export const FETCH_BLOGS_REQUEST = 'FETCH_BLOGS_REQUEST';
export const FETCH_BLOGS_SUCCESS = 'FETCH_BLOGS_SUCCESS';
export const FETCH_BLOGS_FAILURE = 'FETCH_BLOGS_FAILURE';

// Action creators
export const fetchBlogsRequest = () => {
    return {
        type: FETCH_BLOGS_REQUEST,
    };
};

export const fetchBlogsSuccess = (blogs) => {
    return {
        type: FETCH_BLOGS_SUCCESS,
        payload: blogs,
    };
};

export const fetchBlogsFailure = (error) => {
    return {
        type: FETCH_BLOGS_FAILURE,
        payload: error,
    };
};

// Async action creator using thunk
export const fetchBlogs = () => {
    return (dispatch) => {
        dispatch(fetchBlogsRequest());
        axios
            .get('http://localhost:4000/api/data/blogs')
            .then((response) => {
                const blogs = response.data;
                if (Array.isArray(blogs)) {
                    // Kiểm tra dữ liệu trả về có phải là mảng không
                    dispatch(fetchBlogsSuccess(blogs));
                } else {
                    dispatch(fetchBlogsFailure('Invalid data format')); // Xử lý dữ liệu không hợp lệ
                }
            })
            .catch((error) => {
                const errorMsg = error.message;
                dispatch(fetchBlogsFailure(errorMsg)); // Xử lý lỗi khi gọi API
            });
    };
};
