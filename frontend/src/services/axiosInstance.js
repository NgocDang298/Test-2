// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '', // ✅ Cần thêm dòng này để proxy hoạt động
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
