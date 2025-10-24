import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
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

// Handle 401 errors (token expired)
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

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get user info');
    }
  },

  // Update profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  },

  // Change password
  changePassword: async (passwords) => {
    try {
      const response = await api.put('/auth/change-password', passwords);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to change password');
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// API endpoints
export const lectureAPI = {
  // Transcribe audio using Web Speech API (handled in frontend)
  // This is just for saving the transcript
  
  // Summarize transcript using Gemini AI
  summarize: async (transcript, subject) => {
    try {
      const response = await api.post('/summarize', { transcript, subject });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to summarize';
      throw new Error(errorMessage);
    }
  },

  // Save lecture
  saveLecture: async (lectureData) => {
    try {
      const response = await api.post('/lectures', lectureData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all lectures
  getAllLectures: async (category = null, tag = null) => {
    try {
      let url = '/lectures';
      const params = new URLSearchParams();
      
      if (category) params.append('category', category);
      if (tag) params.append('tag', tag);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get categories and tags
  getCategoriesAndTags: async () => {
    try {
      const response = await api.get('/lectures/stats/categories-tags');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single lecture
  getLecture: async (id) => {
    try {
      const response = await api.get(`/lectures/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete lecture
  deleteLecture: async (id) => {
    try {
      const response = await api.delete(`/lectures/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;