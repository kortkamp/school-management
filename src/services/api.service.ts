import axios, { AxiosRequestConfig } from 'axios';
import { useHistory } from 'react-router';
import { localStorageGet } from '../utils/localStorage';

const api = () => {

  const defaultOptions = {
    baseURL: 'http://localhost:3003',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    },
  };

  let instance = axios.create(defaultOptions);

  instance.interceptors.request.use(function (config: AxiosRequestConfig | undefined) {
    const sessionParsed = localStorageGet('user') as any;
    if (sessionParsed) {
      if (sessionParsed?.token && config?.headers) {
        config.headers.Authorization = `Bearer ${sessionParsed.token}`;
      }
    }

    return config;
  });

  instance.interceptors.response.use(
    function (config) {
      return config;
    },
    function (error) {
      // let status = error?.response?.status;
      if (error.response.status === 403 ){
        // redirect to 403 page
        return Promise.reject({ redirectTo: '/no-access' });
      }
      if (error.response.status === 401 ){
        return Promise.reject({ redirectTo: '/login' });
      }
      Promise.reject(error)
    }
  );

  return instance;
};

export default api();
