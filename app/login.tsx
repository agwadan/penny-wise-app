import { AuthButton } from '@/components/auth/auth-button';
import { AuthInput } from '@/components/auth/auth-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { API_ENDPOINTS, handleApiError, postData, saveAuthData, validateLoginData } from '@/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  /* ==== Form data and errors ==== */
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  /* ==== Form validation ==== */
  const validateForm = () => {
    const { isValid, errors: newErrors } = validateLoginData(formData);
    setErrors(newErrors as typeof errors);
    return isValid;
  };

  /* ==== Function to handle login ==== */
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await postData(API_ENDPOINTS.LOGIN, {
        email: formData.email,
        password: formData.password,
      });



      // Store auth data securely
      if (response.access && response.refresh && response.user) {
        await saveAuthData(response.access, response.refresh, response.user);
      }

      router.replace('/');
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /* ==== Function to handle signup navigation ==== */
  const handleSignupNavigation = () => {
    router.push('/signup');
  };

  /* ==== Function to handle forgot password ==== */
  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    console.log('Forgot password');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with gradient */}
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <ThemedText style={styles.headerTitle}>Welcome Back! 👋</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Sign in to continue managing your finances
            </ThemedText>
          </LinearGradient>

          {/* Form */}
          <View style={styles.formContainer}>
            <AuthInput
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => {
                setFormData({ ...formData, email: text });
                setErrors({ ...errors, email: '' });
              }}
              error={errors.email}
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <AuthInput
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(text) => {
                setFormData({ ...formData, password: text });
                setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
              icon="lock-closed-outline"
              isPassword
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPassword}
            >
              <ThemedText style={[styles.forgotPasswordText, { color: colors.primary }]}>
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>

            <AuthButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              icon="log-in-outline"
            />

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: colors.divider }]} />
              <ThemedText style={[styles.dividerText, { color: colors.textSecondary }]}>
                OR
              </ThemedText>
              <View style={[styles.divider, { backgroundColor: colors.divider }]} />
            </View>

            {/* Social Login Buttons */}
            <AuthButton
              title="Continue with Google"
              variant="outline"
              icon="logo-google"
              onPress={() => console.log('Google login')}
              style={styles.socialButton}
            />

            <AuthButton
              title="Continue with Apple"
              variant="outline"
              icon="logo-apple"
              onPress={() => console.log('Apple login')}
            />

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <ThemedText style={[styles.signupText, { color: colors.textSecondary }]}>
                Don't have an account?{' '}
              </ThemedText>
              <TouchableOpacity onPress={handleSignupNavigation}>
                <ThemedText style={[styles.signupLink, { color: colors.primary }]}>
                  Sign Up
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  formContainer: {
    padding: 24,
    paddingTop: 32,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  socialButton: {
    marginBottom: 12,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
