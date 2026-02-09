import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

export default function PrivacyScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.headerTitle}>Privacy Policy</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Last updated: February 2026
        </ThemedText>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>1. Information We Collect</ThemedText>
          <ThemedText style={styles.text}>
            We collect information you provide directly to us when you create an account, such as your name, email address, and financial transaction details.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>2. How We Use Your Information</ThemedText>
          <ThemedText style={styles.text}>
            We use your information to provide, maintain, and improve our services, to process transactions, and to provide you with insights into your spending habits.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>3. Data Security</ThemedText>
          <ThemedText style={styles.text}>
            We take reasonable measures to help protect your information from loss, theft, misuse, and unauthorized access. Your data is encrypted and stored securely.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>4. Sharing of Information</ThemedText>
          <ThemedText style={styles.text}>
            We do not sell your personal data to third parties. We may share information only as required by law or to protect our rights.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>5. Your Choices</ThemedText>
          <ThemedText style={styles.text}>
            You may update or delete your account information at any time through the app settings. You can also request a copy of the data we have stored about you.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>6. Third-Party Services</ThemedText>
          <ThemedText style={styles.text}>
            Our services may contain links to third-party websites or services that are not owned or controlled by PennyWise.
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            For privacy-related inquiries, contact us at privacy@pennywise.com
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
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  footer: {
    marginTop: 12,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.6,
    fontStyle: 'italic',
  },
});
