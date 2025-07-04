// axiosInstance.js
import axios from 'axios';
import { message } from 'antd';

const instance = axios.create({
  baseURL: 'http://localhost:9999',
});

instance.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response?.data?.message === 'Invalid token' ||
      error.response?.data?.message === 'Token expired'
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      message.error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
