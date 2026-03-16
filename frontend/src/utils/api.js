import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to include token in all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add interceptor to handle 401 responses (token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only reload if it's a 401 on a protected endpoint, not on auth endpoints (login/register)
    if (error.response?.status === 401 && !error.config.url.includes('/auth/')) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  clearAll: (confirmToken) => api.delete('/products/clear-all/confirm', {
    data: { confirmToken }
  }),
  getStats: () => api.get('/products/stats/summary')
};

// Upload API
export const uploadAPI = {
  uploadExcel: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

// Auth API
export const authAPI = {
  register: (username, password) => 
    api.post('/auth/register', { username, password }),
  login: (username, password) => 
    api.post('/auth/login', { username, password }),
  verify: () => 
    api.get('/auth/verify'),
  me: () => 
    api.get('/auth/me'),
  promote: (userId) => 
    api.post(`/auth/promote/${userId}`)
};

export default api;
