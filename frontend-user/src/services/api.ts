import axios, { AxiosError } from 'axios';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface BackendRegisterData {
  contactPerson: string;
  email: string;
  phoneNumber: string;
  businessName?: string;
  businessAddress?: string;
  password: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData: RegisterData) => {
    try {
      const backendData: BackendRegisterData = {
        contactPerson: userData.fullName,
        email: userData.email,
        phoneNumber: userData.contactNumber,
        businessName: userData.businessName,
        businessAddress: userData.businessAddress,
        password: userData.password,
      };

      const response = await api.post<AuthResponse>('/auth/register', backendData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  requestPasswordReset: async (email: string) => {
    try {
      const response = await api.post('/auth/forgot', { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  verifyOtp: async (email: string, otp: string) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      return response;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    try {
      const response = await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export const userAPI = {
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (userData: Partial<RegisterData>) => {
    try {
      const response = await api.put('/users/profile', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default api;