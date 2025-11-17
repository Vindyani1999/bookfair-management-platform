/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import type { LoginCredentials, AuthResponse, RefreshResponse } from "../types";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) ||
  (import.meta.env.VITE_API_URL as string) ||
  "https://bookfair-management-platform-production.up.railway.app/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("accessToken") ||
      localStorage.getItem("accessToken");
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
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken =
          sessionStorage.getItem("refreshToken") ||
          localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post<RefreshResponse>(
          `${API_BASE_URL}/admins/refresh`,
          { refreshToken }
        );

        const {
          accessToken,
          refreshToken: newRefreshToken,
          admin,
        } = response.data;

        const useSessionStorage = !!sessionStorage.getItem("accessToken");
        if (useSessionStorage) {
          sessionStorage.setItem("accessToken", accessToken);
          sessionStorage.setItem("refreshToken", newRefreshToken);
          sessionStorage.setItem("admin", JSON.stringify(admin));
        } else {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          localStorage.setItem("admin", JSON.stringify(admin));
        }

        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        sessionStorage.clear();

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    return api.post<AuthResponse>("/admins/login", credentials);
  },

  refresh: async (refreshToken: string) => {
    return api.post<RefreshResponse>("/admins/refresh", { refreshToken });
  },

  logout: async (refreshToken: string) => {
    return api.post("/admins/logout", { refreshToken });
  },
};

export default api;
