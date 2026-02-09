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

export default function TermsScreen() {
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
        <ThemedText style={styles.headerTitle}>Terms & Conditions</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Last updated: February 2026
        </ThemedText>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>1. Acceptance of Terms</ThemedText>
          <ThemedText style={styles.text}>
            By accessing and using PennyWise, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the application.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>2. Use of the Service</ThemedText>
          <ThemedText style={styles.text}>
            PennyWise is a personal finance management tool. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>3. User Data</ThemedText>
          <ThemedText style={styles.text}>
            Your financial data is stored securely. However, you acknowledge that you are providing this information voluntarily for the purpose of tracking your finances. We do not provide financial advice.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>4. Prohibited Conduct</ThemedText>
          <ThemedText style={styles.text}>
            You agree not to use the service for any illegal purposes, or to interfere with the proper functioning of the application.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>5. Limitation of Liability</ThemedText>
          <ThemedText style={styles.text}>
            PennyWise is provided "as is" without any warranties. We are not liable for any financial losses or damages resulting from the use of our services.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>6. Changes to Terms</ThemedText>
          <ThemedText style={styles.text}>
            We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms.
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            If you have any questions, please contact us at support@pennywise.com
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
