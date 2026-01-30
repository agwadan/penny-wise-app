import { CategoryIcon } from '@/components/category-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { API_ENDPOINTS, apiClient, getCategories, handleApiError } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

interface Transaction {
  id: number;
  amount: string;
  description: string;
  date: string;
  transaction_type: 'income' | 'expense';
  category_name: string;
  account_name: string;
  currency: string;
}

interface TransactionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Transaction[];
}

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const [transResponse, catsData] = await Promise.all([
        apiClient.get<TransactionsResponse>(API_ENDPOINTS.TRANSACTIONS),
        getCategories()
      ]);
      setTransactions(transResponse.data.results);
      setCategories(catsData.results || catsData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const formatCurrency = (amount: string, currency: string = 'UGX') => {
    const val = parseFloat(amount);
    const currencySymbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      KES: 'KSh',
      UGX: 'UGX',
    };
    const symbol = currencySymbols[currency] || currency;
    return `${symbol} ${val.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.icon || '📌';
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || colors.primary;
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const isIncome = item.transaction_type === 'income';
    const amountColor = isIncome ? colors.success : colors.error;

    return (
      <TouchableOpacity
        style={[styles.transactionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
        activeOpacity={0.7}
        onPress={() => router.push({ pathname: '/edit-transaction/[id]', params: { id: item.id } })}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${getCategoryColor(item.category_name)}15` }]}>
          <CategoryIcon name={getCategoryIcon(item.category_name)} color={getCategoryColor(item.category_name)} size={24} />
        </View>
        <View style={styles.transactionInfo}>
          <ThemedText style={styles.categoryName}>{item.category_name}</ThemedText>
          <ThemedText style={[styles.accountName, { color: colors.textSecondary }]}>
            {item.account_name} • {item.description || 'No description'}
          </ThemedText>
        </View>
        <View style={styles.amountContainer}>
          <ThemedText style={[styles.amountText, { color: amountColor }]}>
            {isIncome ? '+' : '-'}{formatCurrency(item.amount, item.currency)}
          </ThemedText>
          <ThemedText style={[styles.dateText, { color: colors.textMuted }]}>
            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Transactions</ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/modal')}>
          <Ionicons name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={() => fetchData()}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="list-outline" size={64} color={colors.textMuted} />
          <ThemedText style={styles.emptyText}>No transactions found</ThemedText>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={() => router.push('/modal')}>
            <ThemedText style={styles.retryButtonText}>Add your first transaction</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchData(true)}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  addButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  accountName: {
    fontSize: 13,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
    opacity: 0.7,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    opacity: 0.6,
  },
});
