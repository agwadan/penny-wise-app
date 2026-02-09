import { AuthButton } from '@/components/auth/auth-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  const features = [
    {
      icon: 'wallet-outline' as const,
      title: 'Track Expenses',
      description: 'Monitor your spending habits and stay on budget',
    },
    {
      icon: 'analytics-outline' as const,
      title: 'Smart Insights',
      description: 'Get personalized financial insights and recommendations',
    },
    {
      icon: 'shield-checkmark-outline' as const,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and protected',
    },
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Gradient */}
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.logoContainer}>
            <Ionicons name="wallet" size={80} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.appName}>PennyWise</ThemedText>
          <ThemedText style={styles.tagline}>
            Your Smart Financial Companion
          </ThemedText>
        </LinearGradient>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <ThemedText style={styles.featuresTitle}>
            Everything you need to manage your money
          </ThemedText>

          {features.map((feature, index) => (
            <View
              key={index}
              style={[
                styles.featureCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: `${colors.primary}15` },
                ]}
              >
                <Ionicons
                  name={feature.icon}
                  size={28}
                  color={colors.primary}
                />
              </View>
              <View style={styles.featureContent}>
                <ThemedText style={styles.featureTitle}>
                  {feature.title}
                </ThemedText>
                <ThemedText
                  style={[styles.featureDescription, { color: colors.textSecondary }]}
                >
                  {feature.description}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaContainer}>
          <AuthButton
            title="Get Started"
            onPress={handleSignup}
            icon="arrow-forward-outline"
          />

          <AuthButton
            title="I Already Have an Account"
            variant="outline"
            onPress={handleLogin}
            style={styles.loginButton}
          />

          <ThemedText style={[styles.disclaimer, { color: colors.textMuted }]}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  featuresContainer: {
    padding: 20,
    paddingTop: 32,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  ctaContainer: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  loginButton: {
    marginTop: 8,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
});
