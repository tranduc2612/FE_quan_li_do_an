import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
export const BASE_URL_MEDIA = 'https://jsonplaceholder.typicode.com/'

const request = axios.create({
    baseURL: BASE_URL_MEDIA,
});

// Add a request interceptor
request.interceptors.request.use(function (config) {
    console.log(config,"ádkasdlas")
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
request.interceptors.response.use(function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

  export default request
