import { GET_ORDER, ERROR } from '../actions/orderActions';

const initialState = {
    orders: [],
    errors: '',
};

const creditReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORDER:
            return {
                ...state,
                orders: action.payload,
            };
        case ERROR:
            return {
                ...state,
                errors: action.payload,
            };
        default:
            return state;
    }
};

export default creditReducer;
