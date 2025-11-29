import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface QuickActionsProps {
    onAddExpense?: () => void;
    onAddIncome?: () => void;
    onViewTransactions?: () => void;
    onManageAccounts?: () => void;
}

export function QuickActions({
    onAddExpense,
    onAddIncome,
    onViewTransactions,
    onManageAccounts,
}: QuickActionsProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const ActionButton = ({
        icon,
        label,
        onPress,
        isPrimary = false,
    }: {
        icon: string;
        label: string;
        onPress?: () => void;
        isPrimary?: boolean;
    }) => (
        <TouchableOpacity
            style={[
                styles.actionButton,
                {
                    backgroundColor: isPrimary ? colors.primary : colors.cardBackground,
                    borderColor: colors.cardBorder,
                },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <ThemedText style={[styles.icon, isPrimary && styles.iconPrimary]}>
                {icon}
            </ThemedText>
            <ThemedText
                style={[
                    styles.label,
                    { color: isPrimary ? '#FFFFFF' : colors.text },
                ]}
            >
                {label}
            </ThemedText>
        </TouchableOpacity>
    );

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>Quick Actions</ThemedText>
            <View style={styles.grid}>
                <ActionButton
                    icon="➕"
                    label="Add Expense"
                    onPress={onAddExpense}
                    isPrimary
                />
                <ActionButton
                    icon="💰"
                    label="Add Income"
                    onPress={onAddIncome}
                />
                <ActionButton
                    icon="📊"
                    label="Transactions"
                    onPress={onViewTransactions}
                />
                <ActionButton
                    icon="🏦"
                    label="Accounts"
                    onPress={onManageAccounts}
                />
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        minWidth: '47%',
        aspectRatio: 1.5,
        borderRadius: 16,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    icon: {
        fontSize: 32,
        marginBottom: 8,
    },
    iconPrimary: {
        opacity: 0.9,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});
