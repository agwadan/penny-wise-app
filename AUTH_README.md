# Authentication UI Documentation

This documentation covers the authentication pages created for the PennyWise app, designed to work with a Django backend.

## 📁 Files Created

### Screens
- **`app/welcome.tsx`** - Onboarding/welcome screen with app features
- **`app/login.tsx`** - Login screen for returning users
- **`app/signup.tsx`** - Registration screen for new users

### Components
- **`components/auth/auth-input.tsx`** - Reusable input component with validation
- **`components/auth/auth-button.tsx`** - Reusable button component with loading states

### Utilities & Types
- **`types/auth.ts`** - TypeScript types for authentication
- **`utils/api.ts`** - API configuration and axios setup for Django

## 🎨 Features

### Welcome Screen (`/welcome`)
- Beautiful gradient hero section with app branding
- Feature highlights showcasing app capabilities
- Clear CTAs for login and signup
- Responsive design with smooth scrolling

### Login Screen (`/login`)
- Email and password inputs with validation
- Password visibility toggle
- "Forgot Password" link
- Social login options (Google, Apple)
- Link to signup page
- Form validation with error messages
- Loading states during authentication

### Signup Screen (`/signup`)
- Full name, email, password, and confirm password fields
- Comprehensive form validation:
  - Email format validation
  - Password strength requirements (8+ chars, uppercase, lowercase, number)
  - Password confirmation matching
- Terms & conditions checkbox
- Social signup options (Google, Apple)
- Link to login page
- Form validation with error messages
- Loading states during registration

## 🔧 Django Backend Integration

### Step 1: Configure API URL

Create or update your `.env` file in the project root:

```env
EXPO_PUBLIC_API_URL=http://your-django-server:8000/api
```

**For local development:**
- **Android Emulator:** `http://10.0.2.2:8000/api`
- **iOS Simulator:** `http://localhost:8000/api`
- **Physical Device:** `http://YOUR_LOCAL_IP:8000/api` (e.g., `http://192.168.1.100:8000/api`)

### Step 2: Install Required Package

If not already installed, add expo-secure-store for token storage:

```bash
npx expo install expo-secure-store
```

### Step 3: Django Backend Requirements

Your Django backend should have these endpoints:

#### Authentication Endpoints
```python
# Expected Django REST Framework endpoints:
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/logout/
POST /api/auth/token/refresh/
POST /api/auth/password/reset/
POST /api/auth/password/reset/confirm/
```

#### Expected Request/Response Formats

**Registration (POST /api/auth/register/)**
```json
// Request
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

// Response
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "full_name": "John Doe",
    "is_active": true,
    "date_joined": "2024-01-20T10:30:00Z"
  }
}
```

**Login (POST /api/auth/login/)**
```json
// Request
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

// Response (same as registration)
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": { ... }
}
```

### Step 4: Implement Authentication Service

Create `utils/auth-service.ts`:

```typescript
import * as SecureStore from 'expo-secure-store';
import { apiClient, API_ENDPOINTS, handleApiError } from './api';
import { AuthResponse, LoginData, SignupData } from '@/types/auth';

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, data);
      await this.storeTokens(response.data.access, response.data.refresh);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REGISTER, data);
      await this.storeTokens(response.data.access, response.data.refresh);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } finally {
      await this.clearTokens();
    }
  },

  async storeTokens(access: string, refresh: string): Promise<void> {
    await SecureStore.setItemAsync('access_token', access);
    await SecureStore.setItemAsync('refresh_token', refresh);
  },

  async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('access_token');
  },

  async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
  },
};
```

### Step 5: Update Login Screen

In `app/login.tsx`, replace the TODO comment in `handleLogin`:

```typescript
const handleLogin = async () => {
  if (!validateForm()) {
    return;
  }

  setLoading(true);
  
  try {
    const response = await authService.login({
      email: formData.email,
      password: formData.password,
    });
    
    // Navigate to dashboard
    router.replace('/(tabs)');
  } catch (error: any) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Step 6: Update Signup Screen

In `app/signup.tsx`, replace the TODO comment in `handleSignup`:

```typescript
const handleSignup = async () => {
  if (!validateForm()) {
    return;
  }

  if (!acceptedTerms) {
    alert('Please accept the terms and conditions');
    return;
  }

  setLoading(true);

  try {
    const response = await authService.signup({
      full_name: formData.fullName,
      email: formData.email,
      password: formData.password,
    });
    
    // Navigate to dashboard
    router.replace('/(tabs)');
  } catch (error: any) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};
```

## 🎨 Customization

### Colors
All colors are defined in `constants/theme.ts`. The authentication screens use:
- `primary` - Main brand color (green by default)
- `secondary` - Secondary actions
- `error` - Error messages
- `gradientStart` / `gradientEnd` - Header gradients

### Validation Rules
Validation logic is in each screen's `validateForm()` function. Current rules:

**Login:**
- Email: Required, valid email format
- Password: Required, min 6 characters

**Signup:**
- Full Name: Required, min 2 characters
- Email: Required, valid email format
- Password: Required, min 8 characters, must contain uppercase, lowercase, and number
- Confirm Password: Must match password

### Social Authentication
Social login buttons are included but not yet functional. To implement:

1. Install required packages (e.g., `expo-auth-session`, `expo-google-app-auth`)
2. Configure OAuth credentials in Django
3. Implement OAuth flow in the button handlers

## 🚀 Navigation Setup

To make the authentication flow work, you may need to update your app's navigation structure:

1. Check if users are authenticated on app launch
2. Show welcome screen for new users
3. Show login screen for returning users without tokens
4. Show dashboard for authenticated users

Example in `app/_layout.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { authService } from '@/utils/auth-service';

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await authService.getAccessToken();
    setIsAuthenticated(!!token);
  };

  if (isAuthenticated === null) {
    // Show loading screen
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // Show welcome/auth screens
    return <WelcomeScreen />;
  }

  // Show main app
  return <MainApp />;
}
```

## 📱 Testing

### Test the UI
```bash
npm start
# or
yarn start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- Scan QR code for physical device

### Navigate to screens:
- Welcome: `/welcome`
- Login: `/login`
- Signup: `/signup`

## 🔒 Security Best Practices

1. **Never log passwords** - The current console.log statements are for development only
2. **Use HTTPS in production** - Update API_URL to use https://
3. **Implement token refresh** - Uncomment and complete the refresh logic in `utils/api.ts`
4. **Validate on backend** - Client-side validation is for UX; always validate on Django
5. **Use secure storage** - Tokens are stored in expo-secure-store (encrypted)

## 🎯 Next Steps

1. Set up your Django backend with the required endpoints
2. Configure the API URL in `.env`
3. Install expo-secure-store
4. Create the auth service (`utils/auth-service.ts`)
5. Update the login and signup handlers
6. Implement navigation logic based on auth state
7. Add password reset functionality
8. Implement social authentication (optional)
9. Add email verification (optional)

## 📝 Notes

- All screens support both light and dark mode
- Forms include keyboard handling for better mobile UX
- Loading states prevent multiple submissions
- Error messages are user-friendly
- The UI follows modern mobile design patterns
- All components are fully typed with TypeScript
