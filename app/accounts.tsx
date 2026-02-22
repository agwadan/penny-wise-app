import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatAmount } from '@/utils';
import { API_ENDPOINTS, apiClient, handleApiError } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

interface Account {
  id: number;
  user: number;
  name: string;
  account_type: string;
  balance: string;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AccountsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  data: Account[];
}

export default function AccountsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await apiClient.get<AccountsResponse>(API_ENDPOINTS.ACCOUNTS);

      setAccounts(response.data.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, [])
  );

  const getAccountIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'savings':
        return 'wallet-outline';
      case 'cash':
        return 'cash-outline';
      case 'card':
        return 'card-outline';
      case 'investment':
        return 'trending-up-outline';
      default:
        return 'briefcase-outline';
    }
  };

  const getAccountColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'savings':
        return '#10B981';
      case 'cash':
        return '#F59E0B';
      case 'card':
        return '#3B82F6';
      case 'investment':
        return '#8B5CF6';
      default:
        return colors.primary;
    }
  };


  const renderAccountItem = ({ item }: { item: Account }) => (
    <TouchableOpacity
      style={[styles.accountCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: '/edit-account/[id]', params: { id: item.id } })}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${getAccountColor(item.account_type)}15` }]}>
        <Ionicons name={getAccountIcon(item.account_type)} size={24} color={getAccountColor(item.account_type)} />
      </View>
      <View style={styles.accountInfo}>
        <ThemedText style={styles.accountName}>{item.name}</ThemedText>
        <ThemedText style={[styles.accountType, { color: colors.textSecondary }]}>
          {item.account_type.charAt(0).toUpperCase() + item.account_type.slice(1)}
        </ThemedText>
      </View>
      <View style={styles.balanceContainer}>
        <ThemedText style={styles.balanceText}>
          {formatAmount(item.balance, item.currency)}
        </ThemedText>
        {item.is_active && (
          <View style={styles.activeBadge}>
            <View style={[styles.activeDot, { backgroundColor: colors.success }]} />
            <ThemedText style={[styles.activeText, { color: colors.success }]}>Active</ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>My Accounts</ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-account')}>
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
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={() => fetchAccounts()}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      ) : accounts?.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="wallet-outline" size={64} color={colors.textMuted} />
          <ThemedText style={styles.emptyText}>No accounts found</ThemedText>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={() => router.push('/add-account')}>
            <ThemedText style={styles.retryButtonText}>Add your first account</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={accounts}
          renderItem={renderAccountItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchAccounts(true)}
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
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
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
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  accountType: {
    fontSize: 14,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  activeText: {
    fontSize: 10,
    fontWeight: '600',
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
