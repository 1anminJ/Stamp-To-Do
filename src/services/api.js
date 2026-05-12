import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5001' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  verify: () => api.get('/auth/verify'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
};

export const todoAPI = {
  getAll: (params) => api.get('/api/todos', { params }),
  getOne: (id) => api.get(`/api/todos/${id}`),
  create: (data) => api.post('/api/todos', data),
  update: (id, data) => api.put(`/api/todos/${id}`, data),
  delete: (id) => api.delete(`/api/todos/${id}`),
  complete: (id) => api.patch(`/api/todos/${id}/complete`),
};

export const stampAPI = {
  getCurrent: () => api.get('/api/stamps/current'),
  getHistory: () => api.get('/api/stamps/history'),
};

export const hallOfFameAPI = {
  getAll: () => api.get('/api/hall-of-fame'),
  getMe: () => api.get('/api/hall-of-fame/me'),
};
