// frontend/src/components/user/axiosInstance.js
// This file is imported by HomePage, UserComplaints, AgentHome, AdminHome
// It attaches the JWT token to EVERY request automatically

import axios from 'axios';

const API_BASE = process.env.REACT_APP_API || 'https://resolve-complaint.onrender.com';

const instance = axios.create({
  baseURL: API_BASE,
});

// ── Attach JWT token to every request ──
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Handle 401 globally — token expired or missing ──
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/Login';
    }
    return Promise.reject(error);
  }
);

export default instance;