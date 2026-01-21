/**
 * Validation utility functions for forms
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Standard email validation regex
 */
export const isValidEmail = (email: string): boolean => {
  return /^\S+@\S+\.\S+$/.test(email);
};

/**
 * Password strength validation
 * At least 8 characters, one uppercase, one lowercase, and one number
 */
export const isStrongPassword = (password: string): boolean => {
  return password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
};

/**
 * Validates signup form data
 */
export const validateSignupData = (data: Record<string, string>): ValidationResult => {
  let isValid = true;
  const errors: Record<string, string> = {
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  // Full name validation
  if (!data.fullName?.trim()) {
    errors.fullName = 'Full name is required';
    isValid = false;
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Name must be at least 2 characters';
    isValid = false;
  }

  // Username validation
  if (!data.username?.trim()) {
    errors.username = 'Username is required';
    isValid = false;
  } else if (data.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters';
    isValid = false;
  }

  // Email validation
  if (!data.email) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email';
    isValid = false;
  }

  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (!isStrongPassword(data.password)) {
    if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }
    isValid = false;
  }

  // Confirm password validation
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
    isValid = false;
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
    isValid = false;
  }

  return { isValid, errors };
};

/**
 * Validates login form data
 */
export const validateLoginData = (data: Record<string, string>): ValidationResult => {
  let isValid = true;
  const errors: Record<string, string> = {
    email: '',
    password: '',
  };

  if (!data.email) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email';
    isValid = false;
  }

  if (!data.password) {
    errors.password = 'Password is required';
    isValid = false;
  }

  return { isValid, errors };
};
