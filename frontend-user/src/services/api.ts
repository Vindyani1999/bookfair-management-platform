import axios, { AxiosError } from "axios";
import type { LoginCredentials, RegisterData, AuthResponse, UpdateProfileData, SettingsUpdateResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    try {
      // ✅ Ensure we only send email and password (no extra fields)
      const response = await api.post<AuthResponse>("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      // ✅ Log response for debugging
      console.log('Login response:', response.data);

      if (!response.data.token || !response.data.user) {
        throw new Error('Invalid response from server');
      }

      return response;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  register: async (userData: RegisterData) => {
    const backendData = {
      contactPerson: userData.fullName,
      email: userData.email,
      phoneNumber: userData.contactNumber,
      businessName: userData.businessName || undefined,
      businessAddress: userData.businessAddress || undefined,
      password: userData.password,
    };

    try {
      const response = await api.post<AuthResponse>("/auth/register", backendData);
      console.log('Register response:', response.data);
      return response;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  },

  requestPasswordReset: async (email: string) => {
    return api.post("/auth/forgot", { email });
  },

  verifyOtp: async (email: string, otp: string) => {
    return api.post("/auth/verify-otp", { email, otp });
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    return api.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
  },
};

export const userAPI = {
  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    return response;
  },

  // updateOwnProfile: async (userData: UpdateProfileData) => {
  //   return api.put<SettingsUpdateResponse>("/users/profile/me", userData);
  // },

  updateOwnProfile: async (userData: UpdateProfileData) => {
    const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");

    if (!userStr) {
      throw new Error("User not found. Please login again.");
    }

    const user = JSON.parse(userStr);
    const userId = user.id;

    if (!userId) {
      throw new Error("User ID not found. Please login again.");
    }
    return api.put<SettingsUpdateResponse>(`/users/${userId}`, userData);
  },

  changePassword: async ( newPassword: string) => {
    const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");

    if (!userStr) {
      throw new Error("User not found. Please login again.");
    }

    const user = JSON.parse(userStr);
    const userId = user.id;

    if (!userId) {
      throw new Error("User ID not found. Please login again.");
    }

    return api.put<SettingsUpdateResponse>(`/users/${userId}`, {
      password: newPassword,
    });
  },

  updateProfile: async (userData: Partial<RegisterData>) => {
    const response = await api.put("/users/profile", userData);
    return response;
  },

};

export default api;
