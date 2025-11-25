export interface User {
  id: string;
  email: string;
  contactPerson: string;        // Backend uses contactPerson, not fullName
  phoneNumber: string;          // Backend uses phoneNumber, not contactNumber
  businessName?: string;
  businessAddress?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  contactNumber: string;
  businessName?: string;
  businessAddress?: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success?: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface UpdateProfileData {
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  businessName?: string;
  businessAddress?: string;
  password?: string;
}

export interface SettingsFormData {
  fullName: string;
  email: string;
  contactNumber: string;
  businessName: string;
  businessAddress: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SettingsUpdateResponse {
  message: string;
  user: User;
}

export interface Reservation {
  id: number;
  userId: number;
  hallId: number;
  stallIds: number[];
  fullName: string;
  contactNumber: string;
  email: string;
  businessName?: string;
  businessAddress?: string | null;
  note?: string;
  price?: string;
  isPaid?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReservationStep1 {
  userId: string;
  hallId: string;
}

export interface ReservationStep2 {
  stallIds: number[];
}

export interface ReservationStep3 {
  fullName: string;
  contactNumber: string;
  email: string;
  businessName: string;
  businesAddress: string;
  note: string;
}
