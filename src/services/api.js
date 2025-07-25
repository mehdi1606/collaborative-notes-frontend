import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Notes API
export const notesAPI = {
  create: (noteData) => api.post('/notes', noteData),
  getAll: (params = {}) => api.get('/notes', { params }),
  getById: (id) => api.get(`/notes/${id}`),
  update: (id, noteData) => api.put(`/notes/${id}`, noteData),
  delete: (id) => api.delete(`/notes/${id}`),
  search: (params = {}) => api.get('/notes/search', { params }),
  getShared: (params = {}) => api.get('/notes/shared', { params }),
  getPublic: (token) => api.get(`/notes/public/${token}`),
};

// Share API
export const shareAPI = {
  shareNote: (noteId, shareData) => api.post(`/share/${noteId}`, shareData),
  getSharedUsers: (noteId) => api.get(`/share/note/${noteId}`),
  revokeShare: (shareId) => api.delete(`/share/${shareId}`),
  getReceivedShares: () => api.get('/share/received'),
};

export default api;