import { CategoryIcon } from '@/components/category-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Transaction } from '@/types';
import { fetchData, formatAmount, getCategories } from '@/utils';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setTransactions, setCategories, setLoading as setFinanceLoading } from '@/store/finance';

interface RecentTransactionsListProps {
    onViewAll?: () => void;
    refreshTrigger?: boolean;
}

export function RecentTransactionsList({ onViewAll, refreshTrigger = false }: RecentTransactionsListProps) {
    const dispatch = useDispatch();
    const { transactions, categories, isLoading } = useSelector((state: RootState) => state.finance);
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    useEffect(() => {
        const loadData = async () => {
            try {
                // Keep loading state if it's the first load
                if (transactions.length === 0) dispatch(setFinanceLoading(true));

                const [transactionsData, categoriesData] = await Promise.all([
                    fetchData('auth/transactions/'),
                    getCategories()
                ]);
                dispatch(setTransactions(transactionsData.results || transactionsData));
                dispatch(setCategories(categoriesData.results || categoriesData));
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                dispatch(setFinanceLoading(false));
            }
        };

        loadData();
    }, [refreshTrigger]);


    const formatDate = (date: Date) => {
        const today = new Date();
        const transactionDate = new Date(date);
        const diffTime = Math.abs(today.getTime() - transactionDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return transactionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getCategoryIcon = (categoryName: string) => {
        const category = categories.find(c => c.name === categoryName);
        return category?.icon || '📌';
    };

    const getCategoryColor = (categoryName: string) => {
        const category = categories.find(c => c.name === categoryName);
        return category?.color || '#999999';
    };

    const renderTransactionItem = ({ item }: { item: any }) => {
        const isIncome = item.transaction_type === 'income';
        const amountColor = isIncome ? colors.success || '#4caf50' : colors.error;
        const sign = isIncome ? '+' : '-';

        return (
            <TouchableOpacity
                style={[styles.transactionItem, { borderBottomColor: colors.divider }]}
                onPress={() => router.push({ pathname: '/edit-transaction/[id]', params: { id: item.id } })}
            >
                <View style={styles.transactionLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(item.category_name) + '20' }]}>
                        <CategoryIcon
                            name={getCategoryIcon(item.category_name)}
                            color={getCategoryColor(item.category_name)}
                            size={20}
                        />
                    </View>
                    <View style={styles.transactionDetails}>
                        <ThemedText style={styles.category}>{item.category_name}</ThemedText>
                        <ThemedText style={[styles.notes, { color: colors.textSecondary }]}>
                            {item.description || 'No notes'}
                        </ThemedText>
                    </View>
                </View>
                <View style={styles.transactionRight}>
                    <ThemedText style={[styles.amount, { color: amountColor }]}>
                        {sign}{formatAmount(item.amount, item.currency)}
                    </ThemedText>
                    <ThemedText style={[styles.date, { color: colors.textMuted }]}>
                        {formatDate(item.date || item.created_at || item.timestamp || new Date())}
                    </ThemedText>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.header}>
                <ThemedText style={styles.title}>Recent Transactions</ThemedText>
                {onViewAll && (
                    <TouchableOpacity onPress={onViewAll}>
                        <ThemedText style={[styles.viewAll, { color: colors.primary }]}>
                            View All
                        </ThemedText>
                    </TouchableOpacity>
                )}
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    renderItem={renderTransactionItem}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <ThemedText style={[styles.emptyText, { color: colors.textMuted }]}>
                                No transactions yet
                            </ThemedText>
                        </View>
                    }
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    loadingContainer: {
        paddingVertical: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    viewAll: {
        fontSize: 14,
        fontWeight: '600',
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 20,
    },
    transactionDetails: {
        flex: 1,
    },
    category: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    notes: {
        fontSize: 13,
    },
    transactionRight: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    date: {
        fontSize: 12,
    },
    emptyContainer: {
        paddingVertical: 32,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
    },
});
