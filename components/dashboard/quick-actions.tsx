import { CategoryIcon } from '@/components/category-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface QuickActionsProps {
    onAddTransaction?: () => void;
    onViewTransactions?: () => void;
    onManageAccounts?: () => void;
}

export function QuickActions({
    onAddTransaction,
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
            <CategoryIcon
                name={icon}
                color={isPrimary ? '#FFFFFF' : colors.primary}
                size={24}
                containerStyle={[styles.icon, isPrimary && styles.iconPrimary]}
            />
            <ThemedText
                style={[
                    styles.label,
                    { color: isPrimary ? '#FFFFFF' : colors.text },
                ]}
                numberOfLines={1}
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
                    icon="plus"
                    label="Add Transaction"
                    onPress={onAddTransaction}
                    isPrimary
                />
                <ActionButton
                    icon="transactions"
                    label="Transactions"
                    onPress={onViewTransactions}
                />
                <ActionButton
                    icon="bank"
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
        gap: 8,
    },
    actionButton: {
        flex: 1,
        height: 85,
        borderRadius: 12,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    icon: {
        marginBottom: 4,
    },
    iconPrimary: {
        opacity: 0.9,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
});
