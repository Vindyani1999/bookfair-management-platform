export interface Admin {
  id: number;
  adminName: string;
  role?: string;
}

export interface LoginCredentials {
  adminName: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  admin: Admin;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  admin: Admin;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}