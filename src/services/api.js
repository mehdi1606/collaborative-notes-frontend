import axios from 'axios';

// Base URL for API
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };

    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          localStorage.removeItem('token');
          delete apiClient.defaults.headers.common['Authorization'];
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Forbidden: Insufficient permissions');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 429:
          console.error('Rate limit exceeded');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error(`API Error ${status}:`, data);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
    } else {
      console.error('API Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  // Set auth token
  setAuthToken: (token) => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  },

  // Remove auth token
  removeAuthToken: () => {
    delete apiClient.defaults.headers.common['Authorization'];
  },

  // Register
  register: (userData) => apiClient.post('/auth/register', userData),

  // Login
  login: (credentials) => apiClient.post('/auth/login', credentials),

  // Logout
  logout: () => apiClient.post('/auth/logout'),

  // Get current user
  getCurrentUser: () => apiClient.get('/auth/me'),

  // Update profile
  updateProfile: (profileData) => apiClient.put('/auth/profile', profileData),

  // Change password
  changePassword: (passwordData) => apiClient.put('/auth/password', passwordData),

  // Refresh token
  refreshToken: () => apiClient.post('/auth/refresh'),

  // Get user stats
  getUserStats: () => apiClient.get('/auth/stats')
};

// Notes service
export const notesService = {
  // Get all notes
  getNotes: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    return apiClient.get(`/notes?${queryParams.toString()}`);
  },

  // Get note by ID
  getNote: (id) => apiClient.get(`/notes/${id}`),

  // Create note
  createNote: (noteData) => apiClient.post('/notes', noteData),

  // Update note
  updateNote: (id, noteData) => apiClient.put(`/notes/${id}`, noteData),

  // Delete note
  deleteNote: (id) => apiClient.delete(`/notes/${id}`),

  // Search notes
  searchNotes: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    return apiClient.get(`/notes/search?${queryParams.toString()}`);
  },

  // Get shared notes
  getSharedNotes: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    return apiClient.get(`/notes/shared?${queryParams.toString()}`);
  },

  // Get public note
  getPublicNote: (token) => apiClient.get(`/notes/public/${token}`),

  // Get note stats
  getNoteStats: () => apiClient.get('/notes/stats'),

  // Duplicate note
  duplicateNote: (id) => apiClient.post(`/notes/${id}/duplicate`),

  // Export note
  exportNote: (id, format = 'json') => apiClient.get(`/notes/${id}/export?format=${format}`, {
    responseType: format === 'json' ? 'json' : 'blob'
  }),

  // Get recent notes
  getRecentNotes: (limit = 10) => apiClient.get(`/notes/recent?limit=${limit}`)
};

// Share service
export const shareService = {
  // Share note
  shareNote: (noteId, shareData) => apiClient.post(`/share/${noteId}`, shareData),

  // Get shared users for a note
  getSharedUsers: (noteId) => apiClient.get(`/share/note/${noteId}`),

  // Revoke share
  revokeShare: (shareId) => apiClient.delete(`/share/${shareId}`),

  // Get received shares
  getReceivedShares: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    return apiClient.get(`/share/received?${queryParams.toString()}`);
  },

  // Update share permission
  updateSharePermission: (shareId, permission) => 
    apiClient.put(`/share/${shareId}`, { permission }),

  // Search users
  searchUsers: (query) => apiClient.get(`/share/users/search?q=${encodeURIComponent(query)}`),

  // Get sharing stats
  getSharingStats: () => apiClient.get('/share/stats')
};

// Health check
export const healthService = {
  check: () => apiClient.get('/health')
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      return error.response.data?.error || 'An error occurred';
    } else if (error.request) {
      return 'Network error. Please check your connection.';
    } else {
      return 'An unexpected error occurred';
    }
  },

  // Format pagination params
  formatPaginationParams: (page = 1, limit = 20) => ({
    offset: (page - 1) * limit,
    limit
  }),

  // Create download from blob
  downloadBlob: (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Parse error message
  parseErrorMessage: (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.error) return error.response.data.error;
    return 'An unexpected error occurred';
  },

  // Check if error is network related
  isNetworkError: (error) => {
    return !error.response && error.request;
  },

  // Check if error is authorization related
  isAuthError: (error) => {
    return error.response && [401, 403].includes(error.response.status);
  },

  // Retry function for failed requests
  retry: async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        if (!apiUtils.isNetworkError(error)) throw error;
        
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
};

// Export default api client
export default apiClient;