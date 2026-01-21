import { AuthButton } from '@/components/auth/auth-button';
import { AuthInput } from '@/components/auth/auth-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { API_ENDPOINTS, handleApiError, postData, validateSignupData } from '@/utils';
import Constants from 'expo-constants';
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

export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const validateForm = () => {
    const { isValid, errors: newErrors } = validateSignupData(formData);
    setErrors(newErrors as typeof errors);
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    if (!acceptedTerms) {
      Alert.alert('Terms and Conditions', 'Please accept the terms and conditions to continue.');
      return;
    }

    setLoading(true);

    try {
      const nameParts = formData.fullName.trim().split(' ');
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';

      const API_URL = Constants.expoConfig?.extra?.apiUrl ||
        process.env.EXPO_PUBLIC_API_URL ||
        'http://localhost:8000/api';

      console.log('API_URL', API_URL);

      const response = await postData(API_ENDPOINTS.REGISTER, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
        first_name: first_name,
        last_name: last_name,
      });

      console.log('Signup response:', response);
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(tabs)');
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.log(error);

      Alert.alert('Signup Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginNavigation = () => {
    router.back();
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
            <ThemedText style={styles.headerTitle}>Create Account 🎉</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Join us to start your financial journey
            </ThemedText>
          </LinearGradient>

          {/* Form */}
          <View style={styles.formContainer}>
            <AuthInput
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) => {
                setFormData({ ...formData, fullName: text });
                setErrors({ ...errors, fullName: '' });
              }}
              error={errors.fullName}
              icon="person-outline"
              autoCapitalize="words"
              autoComplete="name"
            />

            <AuthInput
              label="Username"
              placeholder="Choose a unique username"
              value={formData.username}
              onChangeText={(text) => {
                setFormData({ ...formData, username: text });
                setErrors({ ...errors, username: '' });
              }}
              error={errors.username}
              icon="at-outline"
              autoCapitalize="none"
            />

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
              placeholder="Create a strong password"
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

            <AuthInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChangeText={(text) => {
                setFormData({ ...formData, confirmPassword: text });
                setErrors({ ...errors, confirmPassword: '' });
              }}
              error={errors.confirmPassword}
              icon="lock-closed-outline"
              isPassword
              autoCapitalize="none"
            />

            {/* Terms and Conditions */}
            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: acceptedTerms ? colors.primary : colors.cardBorder,
                    backgroundColor: acceptedTerms ? colors.primary : 'transparent',
                  },
                ]}
              >
                {acceptedTerms && (
                  <ThemedText style={styles.checkmark}>✓</ThemedText>
                )}
              </View>
              <ThemedText style={[styles.termsText, { color: colors.textSecondary }]}>
                I agree to the{' '}
                <ThemedText style={[styles.termsLink, { color: colors.primary }]}>
                  Terms & Conditions
                </ThemedText>{' '}
                and{' '}
                <ThemedText style={[styles.termsLink, { color: colors.primary }]}>
                  Privacy Policy
                </ThemedText>
              </ThemedText>
            </TouchableOpacity>

            <AuthButton
              title="Create Account"
              onPress={handleSignup}
              loading={loading}
              icon="person-add-outline"
            />

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: colors.divider }]} />
              <ThemedText style={[styles.dividerText, { color: colors.textSecondary }]}>
                OR
              </ThemedText>
              <View style={[styles.divider, { backgroundColor: colors.divider }]} />
            </View>

            {/* Social Signup Buttons */}
            <AuthButton
              title="Sign up with Google"
              variant="outline"
              icon="logo-google"
              onPress={() => console.log('Google signup')}
              style={styles.socialButton}
            />

            <AuthButton
              title="Sign up with Apple"
              variant="outline"
              icon="logo-apple"
              onPress={() => console.log('Apple signup')}
            />

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <ThemedText style={[styles.loginText, { color: colors.textSecondary }]}>
                Already have an account?{' '}
              </ThemedText>
              <TouchableOpacity onPress={handleLoginNavigation}>
                <ThemedText style={[styles.loginLink, { color: colors.primary }]}>
                  Sign In
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: -8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
