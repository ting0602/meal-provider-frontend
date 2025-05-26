// src/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8888/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: 攔截器（例如加上 token）
axiosInstance.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token');
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
