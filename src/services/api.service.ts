import axios, { AxiosRequestConfig } from 'axios';
import { localStorageGet } from '../utils/localStorage';

// const baseURL = 'http://10.157.246.116:3003';
const baseURL = process.env.REACT_APP_API_URL;

const api = () => {
  const defaultOptions = {
    baseURL,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    },
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(function (config: AxiosRequestConfig | undefined) {
    const sessionParsed = localStorageGet('user') as any;
    if (sessionParsed) {
      if (sessionParsed?.token && config?.headers) {
        // eslint-disable-next-line no-param-reassign
        // config.headers.Authorization = `Bearer ${sessionParsed.token}`;
      }
    }

    return config;
  });

  instance.interceptors.response.use(
    function (config) {
      return config;
    }
    // function (error) {
    //   // // let status = error?.response?.status;
    //   // if (error.response.status === 403) {
    //   //   // redirect to 403 page
    //   //   return Promise.reject({ redirectTo: '/no-access' });
    //   // }
    //   // if (error.response.status === 401) {
    //   //   return Promise.reject({ redirectTo: '/login' });
    //   // }
    //   Promise.reject(error);
    // }
  );

  return instance;
};

export default api();
