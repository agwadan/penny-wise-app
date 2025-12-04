import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { mockCategories } from '@/data/mock-data';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Expense } from '@/types';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

interface RecentExpensesListProps {
    expenses: Expense[];
    onViewAll?: () => void;
}

export function RecentExpensesList({ expenses, onViewAll }: RecentExpensesListProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const formatCurrency = (amount: number) => {
        return `UGX ${amount.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };

    const formatDate = (date: Date) => {
        const today = new Date();
        const expenseDate = new Date(date);
        const diffTime = Math.abs(today.getTime() - expenseDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return expenseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getCategoryIcon = (categoryName: string) => {
        const category = mockCategories.find(c => c.name === categoryName);
        return category?.icon || '📌';
    };

    const getCategoryColor = (categoryName: string) => {
        const category = mockCategories.find(c => c.name === categoryName);
        return category?.color || '#999999';
    };

    const renderExpenseItem = ({ item }: { item: Expense }) => (
        <View style={[styles.expenseItem, { borderBottomColor: colors.divider }]}>
            <View style={styles.expenseLeft}>
                <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(item.category) + '20' }]}>
                    <ThemedText style={styles.icon}>{getCategoryIcon(item.category)}</ThemedText>
                </View>
                <View style={styles.expenseDetails}>
                    <ThemedText style={styles.category}>{item.category}</ThemedText>
                    <ThemedText style={[styles.notes, { color: colors.textSecondary }]}>
                        {item.notes || 'No notes'}
                    </ThemedText>
                </View>
            </View>
            <View style={styles.expenseRight}>
                <ThemedText style={[styles.amount, { color: colors.error }]}>
                    -{formatCurrency(item.amount)}
                </ThemedText>
                <ThemedText style={[styles.date, { color: colors.textMuted }]}>
                    {formatDate(item.date)}
                </ThemedText>
            </View>
        </View>
    );

    return (
        <ThemedView style={[styles.container, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.header}>
                <ThemedText style={styles.title}>Recent Expenses</ThemedText>
                {onViewAll && (
                    <TouchableOpacity onPress={onViewAll}>
                        <ThemedText style={[styles.viewAll, { color: colors.primary }]}>
                            View All
                        </ThemedText>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={expenses}
                renderItem={renderExpenseItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <ThemedText style={[styles.emptyText, { color: colors.textMuted }]}>
                            No expenses yet
                        </ThemedText>
                    </View>
                }
            />
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    viewAll: {
        fontSize: 14,
        fontWeight: '600',
    },
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    expenseLeft: {
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
    expenseDetails: {
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
    expenseRight: {
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
