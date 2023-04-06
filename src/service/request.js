 import axios from 'axios';
import { SERVER_URL } from '../config/index';
import store from '../redux/store';
import actions from '../redux/user/actions';
const request = axios.create({
    baseURL: SERVER_URL,
    timeout: 1000000,
});
let requests = [];

request.interceptors.request.use(
    (config ) => {
        if (store.getState().user?.token) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual LOgin
            config.headers.Authorization = `${store.getState().user?.token}`;
            // config.headers['host'] = localStorage.getItem('user');
        }
        store.dispatch(actions.setLoading(true));

        requests.push(config);
        return config;
    },
    (error ) => {
        console.log(error);
        return Promise.reject(error);
    },
);
request.interceptors.response.use(
    function (response) {
        store.dispatch(actions.setLoading(false));
        return response;
    },
    function (error) {
        store.dispatch(actions.setLoading(false));
        return Promise.reject(error);
    },
);
export default request;
