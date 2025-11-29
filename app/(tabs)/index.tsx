import { AccountSummaryCard } from '@/components/dashboard/account-summary-card';
import { CategoryChart } from '@/components/dashboard/category-chart';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentExpensesList } from '@/components/dashboard/recent-expenses-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import {
  getCategorySpending,
  getRecentExpenses,
  getTotalBalance,
  mockAccounts
} from '@/data/mock-data';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [refreshing, setRefreshing] = React.useState(false);

  const totalBalance = getTotalBalance();
  const recentExpenses = getRecentExpenses(6);
  const categorySpending = getCategorySpending();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleAddExpense = () => {
    // TODO: Navigate to add expense screen
    console.log('Add expense');
  };

  const handleAddIncome = () => {
    // TODO: Navigate to add income screen
    console.log('Add income');
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
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.greeting}>Welcome back! 👋</ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            Here's your financial overview
          </ThemedText>
        </ThemedView>

        {/* Account Summary */}
        <AccountSummaryCard
          totalBalance={totalBalance}
          accountCount={mockAccounts.length}
        />

        {/* Quick Actions */}
        <QuickActions
          onAddExpense={handleAddExpense}
          onAddIncome={handleAddIncome}
          onViewTransactions={handleViewTransactions}
          onManageAccounts={handleManageAccounts}
        />

        {/* Category Spending Chart */}
        <CategoryChart data={categorySpending} />

        {/* Recent Expenses */}
        <RecentExpensesList
          expenses={recentExpenses}
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
    paddingTop: 16,
    paddingBottom: 8,
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
