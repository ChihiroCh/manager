import axios from 'axios';
import router from '../router';
import config from '../config';
import { ElMessage } from 'element-plus';
import storage from './storage';

const TOKEN_ERROR = 'Token认证失败，请重新登录';
const NETWORK_ERROR = '网络请求异常，请稍后重试';

const service = axios.create({
  baseURL: config.baseApi,
  timeout: 1000
});
service.interceptors.request.use(req => {
  const headers = req.headers;
  const { token = '' } = storage.getItem('userInfo') || {};
  if (!headers.Authorization) headers.Authorization = 'Bearer ' + token;
  return req;
});

service.interceptors.response.use(res => {
  const { code, data } = res.data;
  if (code === 200) {
    return data;
  } else if (code === 50001) {
    ElMessage(TOKEN_ERROR);
    setTimeout(() => {
      router.push('/login');
    }, 1500);
    return Promise.reject(TOKEN_INVALID);
  } else {
    ElMessage(NETWORK_ERROR);
    return Promise.reject(NETWORK_ERROR);
  }
});

function request(options) {
  options.method = options.method || 'get';
  if (options.method.toLowerCase() === 'get') {
    options.param = options.data;
  }
  let isMock = config.baseApi;
  if (typeof options.mock != 'undefined') {
    isMock = options.mock;
  }
  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi;
  } else {
    service.defaults.baseURL =
      options.mock || isMock ? config.mockApi : config.baseApi;
  }
  return service(options);
}

// ['get','post','put','delete','patch'].forEach(item => {
//   return (options) => {
//     request({...options,method: item})
//   }
// })

export default request;
