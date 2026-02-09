import { AuthButton } from '@/components/auth/auth-button';
import { AuthInput } from '@/components/auth/auth-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { API_ENDPOINTS, handleApiError, postData, saveAuthData, validateSignupData } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
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

      const response = await postData(API_ENDPOINTS.REGISTER, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
        first_name: first_name,
        last_name: last_name,
      });

      /* ===== Store auth data securely if tokens are returned ===== */
      if (response.tokens.access && response.tokens.refresh && response.user) {
        await saveAuthData(response.tokens.access, response.tokens.refresh, response.user);
      }

      Alert.alert('Success', 'Account created successfully!');
      router.replace('/');
    } catch (error) {
      const errorMessage = handleApiError(error);

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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
            <View style={styles.headerTitleRow}>
              <ThemedText style={styles.headerTitle}>Create Account</ThemedText>
              <Ionicons name="sparkles-outline" size={24} color="#FFFFFF" style={styles.headerIcon} />
            </View>
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
                <ThemedText
                  style={[styles.termsLink, { color: colors.primary }]}
                  onPress={() => router.push('/terms')}
                >
                  Terms & Conditions
                </ThemedText>{' '}
                and{' '}
                <ThemedText
                  style={[styles.termsLink, { color: colors.primary }]}
                  onPress={() => router.push('/privacy')}
                >
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
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  headerIcon: {
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  formContainer: {
    padding: 20,
    paddingTop: 12,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    marginTop: -4,
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
    fontSize: 14,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
