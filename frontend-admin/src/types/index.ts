import type { JSX } from "react";

export interface Admin {
  id: number;
  adminName: string;
  role?: string;
}

export interface User {
  id: number;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  businessName?: string;
  businessAddress?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersResponse {
  message: string;
  data: User[];
  success: boolean;
}

export interface UserResponse {
  message: string;
  data: User;
  success: boolean;
}

export interface AdminCreateData {
  adminName: string;
  password: string;
  role?: 'admin' | 'superadmin' | 'moderator';
}

export interface AdminResponse {
  message: string;
  admin: Admin;
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

export type DrawerItem = {
  name: string;
  icon: JSX.Element;
  navPath: string;
};

export type LogoutConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
};