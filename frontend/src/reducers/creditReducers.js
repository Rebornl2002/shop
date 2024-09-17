import { GET_CREDIT, ERROR } from '../actions/creditActions';

const initialState = {
    credits: [],
    errors: '',
};

const creditReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CREDIT:
            return {
                ...state,
                credits: action.payload,
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
