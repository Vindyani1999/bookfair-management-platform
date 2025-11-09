import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authAPI } from '../services/api';
import type { User, LoginCredentials, RegisterData } from '../types';
import { AxiosError } from 'axios';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
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

const REMEMBER_ME_DURATION = 10 * 60 * 1000;
const INACTIVITY_DURATION = 6 * 60 * 1000;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
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

  const isRememberMeExpired = useCallback((): boolean => {
    const loginTime = localStorage.getItem('loginTime');
    if (!loginTime) return false;

    const currentTime = Date.now();
    const elapsedTime = currentTime - parseInt(loginTime, 10);

    return elapsedTime > REMEMBER_ME_DURATION;
  }, []);

  const clearAuthData = useCallback(() => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
  }, []);

  const logout = useCallback(() => {
    clearAuthData();
    window.location.href = '/';
  }, [clearAuthData]);

  const updateLastActivity = useCallback(() => {
    if (localStorage.getItem('token')) {
      localStorage.setItem('lastActivity', Date.now().toString());
    }
  }, []);

  const checkInactivity = useCallback((): boolean => {
    const lastActivity = localStorage.getItem('lastActivity');
    if (!lastActivity) return false;

    const currentTime = Date.now();
    const inactiveTime = currentTime - parseInt(lastActivity, 10);

    return inactiveTime > INACTIVITY_DURATION;
  }, []);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedTokenLocal = localStorage.getItem('token');
        const storedUserLocal = localStorage.getItem('user');
        const storedTokenSession = sessionStorage.getItem('token');
        const storedUserSession = sessionStorage.getItem('user');

        if (storedTokenLocal && storedUserLocal) {
          if (isRememberMeExpired()) {
            console.log('Remember Me session expired (30 minutes)');
            clearAuthData();
            alert('Your session has expired. Please login again.');
            setLoading(false);
            return;
          }

          if (checkInactivity()) {
            console.log('Session expired due to inactivity');
            clearAuthData();
            alert('You have been logged out due to inactivity.');
            setLoading(false);
            return;
          }

          const isTokenValid = validateToken(storedTokenLocal);

          if (isTokenValid) {
            setToken(storedTokenLocal);
            setUser(JSON.parse(storedUserLocal));
            updateLastActivity();
          } else {
            console.log('Token validation failed');
            clearAuthData();
          }
        } else if (storedTokenSession && storedUserSession) {
          const isTokenValid = validateToken(storedTokenSession);

          if (isTokenValid) {
            setToken(storedTokenSession);
            setUser(JSON.parse(storedUserSession));
          } else {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [validateToken, isRememberMeExpired, checkInactivity, clearAuthData, updateLastActivity]);

  useEffect(() => {
    if (!user || !token) return;

    let inactivityTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);

      updateLastActivity();

      inactivityTimer = setTimeout(() => {
        logout();
        alert('You have been logged out due to inactivity');
      }, INACTIVITY_DURATION);
    };

    const events = ['mousemove', 'keypress', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user, token, logout, updateLastActivity]);

  useEffect(() => {
    if (!user || !token || !localStorage.getItem('token')) return;

    const checkExpiration = setInterval(() => {
      if (isRememberMeExpired()) {
        clearAuthData();
        alert('Your session has expired (30 minutes). Please login again.');
        window.location.href = '/';
      } else if (checkInactivity()) {
        clearAuthData();
        alert('You have been logged out due to inactivity.');
        window.location.href = '/';
      }
    }, 60 * 1000);

    return () => clearInterval(checkExpiration);
  }, [user, token, isRememberMeExpired, checkInactivity, clearAuthData]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token: authToken, user: userData } = response.data;

      if (!authToken || !userData) {
        throw new Error('Invalid response from server');
      }

      setToken(authToken);
      setUser(userData);

      const currentTime = Date.now();

      if (credentials.rememberMe) {
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('loginTime', currentTime.toString());
        localStorage.setItem('lastActivity', currentTime.toString());
      } else {
        sessionStorage.setItem('token', authToken);
        sessionStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      clearAuthData();

      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || 'Login failed';
        throw new Error(message);
      }
      throw new Error('An unexpected error occurred');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      await authAPI.register(data);

    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || 'Registration failed';
        const errors = error.response?.data?.errors;

        if (status === 400 && errors && Array.isArray(errors)) {
          const errorMessages = errors.map(err => err.msg).join(', ');
          throw new Error(errorMessages);
        }

        if (status === 400 && message?.toLowerCase().includes('email')) {
          throw new Error(message || 'Email already registered. Please login instead.');
        }

        throw new Error(message || 'Registration failed. Please try again.');
      }
      throw error;
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};