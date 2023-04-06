import actions from './actions';

const initialState = {
    user: null,
    token: null,
    loggedIn:false,
    loading:false,
};

const {
    SET_USER,
    SET_TOKEN,
    SET_LOADING,
    SET_LOGGEDIN
} = actions;
const UserReducer = (state = initialState, action) => {
    const { type, data } = action;
    switch (type) {
        case SET_USER:
            return {
                ...state,
                user: data,
            };
        case SET_TOKEN:
            return {
                ...state,
                token: data,
            };
        case SET_LOADING:
            return {
                ...state,
                loading: data,
            };
        case SET_LOGGEDIN:
            return {
                ...state,
                loggedIn: data,
            };
        default:
            return state;
    }
};

export default UserReducer;
