import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authAPI } from '../services/api';
import type { Admin, LoginCredentials } from '../types';
import { AxiosError } from 'axios';

interface AuthContextType {
  admin: Admin | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Token validation interval: check every 5 minutes
const ACCESS_TOKEN_CHECK_INTERVAL = 5 * 60 * 1000;
// Refresh token before expiry: refresh when 2 minutes remaining
const REFRESH_BEFORE_EXPIRY = 1 * 60 * 1000;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const validateToken = useCallback((token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      return currentTime < expirationTime;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }, []);

  const getTimeUntilExpiry = useCallback((token: string): number => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      return Math.max(0, expirationTime - currentTime);
    } catch (error) {
      return 0;
    }
  }, []);

  const clearAuthData = useCallback(() => {
    setAdmin(null);
    setAccessToken(null);
    setRefreshToken(null);
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('admin');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('admin');
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = refreshToken ||
        sessionStorage.getItem('refreshToken') ||
        localStorage.getItem('refreshToken');

      if (token) {
        await authAPI.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      window.location.href = '/login';
    }
  }, [refreshToken, clearAuthData]);

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const storedRefreshToken = sessionStorage.getItem('refreshToken') ||
        localStorage.getItem('refreshToken');

      if (!storedRefreshToken) {
        console.warn('No refresh token available');
        clearAuthData();
        return false;
      }

      console.log('Refreshing access token...');
      const response = await authAPI.refresh(storedRefreshToken);

      const { accessToken: newAccessToken, refreshToken: newRefreshToken, admin: adminData } = response.data;

      if (!newAccessToken || !newRefreshToken) {
        throw new Error('Invalid refresh response from server');
      }

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setAdmin(adminData);

      const useSessionStorage = !!sessionStorage.getItem('accessToken');
      if (useSessionStorage) {
        sessionStorage.setItem('accessToken', newAccessToken);
        sessionStorage.setItem('refreshToken', newRefreshToken);
        sessionStorage.setItem('admin', JSON.stringify(adminData));
      } else {
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        localStorage.setItem('admin', JSON.stringify(adminData));
      }

      console.log('Token refresh successful');
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuthData();
      return false;
    }
  }, [clearAuthData]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedAccessToken = sessionStorage.getItem('accessToken') ||
          localStorage.getItem('accessToken');
        const storedRefreshToken = sessionStorage.getItem('refreshToken') ||
          localStorage.getItem('refreshToken');
        const storedAdmin = sessionStorage.getItem('admin') ||
          localStorage.getItem('admin');

        if (storedAccessToken && storedRefreshToken && storedAdmin) {
          const isAccessTokenValid = validateToken(storedAccessToken);

          if (isAccessTokenValid) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setAdmin(JSON.parse(storedAdmin));
            console.log('Auth restored from storage');
          } else {
            console.log('Access token expired, refreshing...');
            const refreshed = await refreshAccessToken();
            if (!refreshed) {
              console.log('Refresh failed, clearing auth data');
            }
          }
        } else {
          console.log('No auth data in storage');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [validateToken, refreshAccessToken, clearAuthData]);


  useEffect(() => {
    if (!accessToken || !refreshToken) return;

    const checkAndRefreshToken = async () => {
      const timeRemaining = getTimeUntilExpiry(accessToken);

      if (timeRemaining > 0 && timeRemaining < REFRESH_BEFORE_EXPIRY) {
        console.log(`Token expiring in ${Math.round(timeRemaining / 1000)}s, refreshing proactively...`);
        await refreshAccessToken();
      } else if (timeRemaining === 0) {
        console.log('Token expired, refreshing...');
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          await logout();
        }
      }
    };

    checkAndRefreshToken();

    const interval = setInterval(checkAndRefreshToken, ACCESS_TOKEN_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [accessToken, refreshToken, getTimeUntilExpiry, refreshAccessToken, logout]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { accessToken: authAccessToken, refreshToken: authRefreshToken, admin: adminData } = response.data;

      if (!authAccessToken || !authRefreshToken || !adminData) {
        throw new Error('Invalid response from server');
      }

      setAccessToken(authAccessToken);
      setRefreshToken(authRefreshToken);
      setAdmin(adminData);

      sessionStorage.setItem('accessToken', authAccessToken);
      sessionStorage.setItem('refreshToken', authRefreshToken);
      sessionStorage.setItem('admin', JSON.stringify(adminData));

      console.log('Login successful');
    } catch (error) {
      clearAuthData();

      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || 'Login failed';
        throw new Error(message);
      }
      throw new Error('An unexpected error occurred');
    }
  };

  const value = {
    admin,
    accessToken,
    refreshToken,
    login,
    logout,
    isAuthenticated: !!accessToken && !!admin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};