import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { mockCategories } from '@/data/mock-data';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Transaction } from '@/types';
import { fetchData } from '@/utils';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

interface RecentTransactionsListProps {
    onViewAll?: () => void;
}

export function RecentTransactionsList({ onViewAll }: RecentTransactionsListProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const endpoint = 'auth/transactions/';
                const data = await fetchData(endpoint);
                console.log('Data from server (raw):', data);
                setTransactions(data.results || data);
            } catch (error) {
                console.error('Failed to load transactions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTransactions();
    }, []);

    const formatCurrency = (amount: number) => {
        return `UGX ${amount.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };

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
        const category = mockCategories.find(c => c.name === categoryName);
        return category?.icon || '📌';
    };

    const getCategoryColor = (categoryName: string) => {
        const category = mockCategories.find(c => c.name === categoryName);
        return category?.color || '#999999';
    };

    const renderTransactionItem = ({ item }: { item: any }) => {
        const isIncome = item.transaction_type === 'income';
        const amountColor = isIncome ? colors.success || '#4caf50' : colors.error;
        const sign = isIncome ? '+' : '-';

        return (
            <View style={[styles.transactionItem, { borderBottomColor: colors.divider }]}>
                <View style={styles.transactionLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(item.category_name) + '20' }]}>
                        <ThemedText style={styles.icon}>{getCategoryIcon(item.category_name)}</ThemedText>
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
                        {sign}{formatCurrency(parseFloat(item.amount) || 0)}
                    </ThemedText>
                    <ThemedText style={[styles.date, { color: colors.textMuted }]}>
                        {formatDate(item.date || item.created_at || item.timestamp || new Date())}
                    </ThemedText>
                </View>
            </View>
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
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
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
