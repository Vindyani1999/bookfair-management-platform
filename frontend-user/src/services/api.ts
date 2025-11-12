import axios, { AxiosError } from "axios";
import type { LoginCredentials, RegisterData, AuthResponse } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

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
    return api.post<AuthResponse>("/auth/login", credentials);
  },

  register: async (userData: RegisterData) => {
    const backendData: BackendRegisterData = {
      contactPerson: userData.fullName,
      email: userData.email,
      phoneNumber: userData.contactNumber,
      businessName: userData.businessName,
      businessAddress: userData.businessAddress,
      password: userData.password,
    };

    return api.post<AuthResponse>("/auth/register", backendData);
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

  updateProfile: async (userData: Partial<RegisterData>) => {
    const response = await api.put("/users/profile", userData);
    return response;
  },
};

export default api;
