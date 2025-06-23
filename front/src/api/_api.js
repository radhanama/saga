import axios from 'axios';

const env = process.env;
const api = axios.create({ baseURL: env.REACT_APP_BASE_URL });

api.interceptors.request.use(
  (config) => {
    config.headers.set('Access-Control-Allow-Origin', '*');
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
      const data = error.response.data;
      if (typeof data === 'string') {
        return Promise.reject({ message: data });
      }
      return Promise.reject({ message: data?.message || 'Request failed' });
    }
    return Promise.reject({ message: error.message });
  }
);

api.postWithoutToken = (url, data, config) => {
  return axios.post(env.REACT_APP_BASE_URL + '/' + url, data, config);
};

export default api;



