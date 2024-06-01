// reducers/rootReducer.js
import { combineReducers } from 'redux';
// Import các reducer con của bạn
import blogReducer from './blogReducers';
import productReducer from './productReducers';

// Kết hợp các reducer con thành một root reducer
const rootReducer = combineReducers({
    blog: blogReducer,
    product: productReducer,
    // thêm các reducer khác ở đây nếu có
});

export default rootReducer;
