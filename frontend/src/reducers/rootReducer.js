// reducers/rootReducer.js
import { combineReducers } from 'redux';
// Import các reducer con của bạn
import blogReducer from './blogReducers';
import productReducer from './productReducers';
import userReducer from './userReducers';

// Kết hợp các reducer con thành một root reducer
const rootReducer = combineReducers({
    blog: blogReducer,
    product: productReducer,
    user: userReducer,
    // thêm các reducer khác ở đây nếu có
});

export default rootReducer;
