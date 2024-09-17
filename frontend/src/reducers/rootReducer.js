// reducers/rootReducer.js
import { combineReducers } from 'redux';
// Import các reducer con của bạn
import blogReducer from './blogReducers';
import productReducer from './productReducers';
import userReducer from './userReducers';
import cartReducer from './cartReduces';
import creditReducer from './creditReducers';
import orderReducer from './orderReducers';

// Kết hợp các reducer con thành một root reducer
const rootReducer = combineReducers({
    blog: blogReducer,
    product: productReducer,
    user: userReducer,
    cart: cartReducer,
    credit: creditReducer,
    order: orderReducer,
});

export default rootReducer;
