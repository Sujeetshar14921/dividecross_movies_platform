import axios from 'axios';

const backendURL = 'http://localhost:8000';

const api = axios.create({
  baseURL: backendURL,
});

// Automatically attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
