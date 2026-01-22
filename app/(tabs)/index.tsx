import { AccountSummaryCard } from '@/components/dashboard/account-summary-card';
import { CategoryChart } from '@/components/dashboard/category-chart';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentTransactionsList } from '@/components/dashboard/recent-transactions-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import {
  getCategorySpending,
  getTotalBalance,
  mockAccounts
} from '@/data/mock-data';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { clearAuthData } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [refreshing, setRefreshing] = React.useState(false);

  const totalBalance = getTotalBalance();
  const categorySpending = getCategorySpending();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await clearAuthData();
          router.replace('/login');
        },
      },
    ]);
  };

  const handleAddExpense = () => {
    router.push('/modal');
  };

  const handleAddIncome = () => {
    router.push('/modal');
  };

  const handleViewTransactions = () => {
    // TODO: Navigate to transactions screen
    console.log('View transactions');
  };

  const handleManageAccounts = () => {
    // TODO: Navigate to accounts screen
    console.log('Manage accounts');
  };

  const handleViewAllExpenses = () => {
    // TODO: Navigate to all expenses screen
    console.log('View all expenses');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* ==== Header ==== */}
        <ThemedView style={styles.header}>
          <View>
            <ThemedText style={styles.greeting}>Welcome back! 👋</ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
              Here's your financial overview
            </ThemedText>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </ThemedView>

        {/* ==== Account Summary ====  */}
        <AccountSummaryCard
          totalBalance={totalBalance}
          accountCount={mockAccounts.length}
        />

        {/* ==== Quick Actions ==== */}
        <QuickActions
          onAddExpense={handleAddExpense}
          onAddIncome={handleAddIncome}
          onViewTransactions={handleViewTransactions}
          onManageAccounts={handleManageAccounts}
        />

        {/* ==== Category Spending Chart ==== */}
        <CategoryChart data={categorySpending} />

        {/* ==== Recent Transactions ==== */}
        <RecentTransactionsList
          onViewAll={handleViewAllExpenses}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
});
