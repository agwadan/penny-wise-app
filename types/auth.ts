/**
 * Authentication related types for Django backend integration
 */

// User registration data (matches Django User model fields)
export interface SignupData {
  full_name: string;
  email: string;
  password: string;
}

// User login credentials
export interface LoginData {
  email: string;
  password: string;
}

// Django authentication response
export interface AuthResponse {
  access: string; // JWT access token
  refresh: string; // JWT refresh token
  user: User;
}

// User profile data (from Django)
export interface User {
  id: number;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
}

// Password reset request
export interface PasswordResetRequest {
  email: string;
}

// Password reset confirmation
export interface PasswordResetConfirm {
  token: string;
  new_password: string;
}

// Django error response format
export interface DjangoErrorResponse {
  detail?: string;
  [key: string]: string | string[] | undefined;
}

// Form validation errors
export interface FormErrors {
  [key: string]: string;
}
