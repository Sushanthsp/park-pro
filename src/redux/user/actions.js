const actions = {
    SET_USER: 'SET_USER',
    SET_TOKEN: 'SET_TOKEN',
    SET_LOADING:"SET_LOADING",
    SET_LOGGEDIN:"SET_LOGGEDIN",
    setUser: (data) => {
        return {
            type: actions.SET_USER,
            data,
        };
    },
    setToken: (data) => {
        return {
            type: actions.SET_TOKEN,
            data,
        };
    },
    setLoading: (data) => {
        return {
            type: actions.SET_LOADING,
            data,
        };
    },
    setLoggedIn: (data) => {
        return {
            type: actions.SET_LOGGEDIN,
            data,
        };
    },
};

export default actions;
