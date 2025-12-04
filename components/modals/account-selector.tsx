import { Colors } from '@/constants/theme';
import { mockAccounts } from '@/data/mock-data';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Account } from '@/types';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface AccountSelectorProps {
    value: string;
    onChange: (accountId: string) => void;
    error?: string;
}

export function AccountSelector({ value, onChange, error }: AccountSelectorProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const selectedAccount = mockAccounts.find((acc) => acc.id === value);

    const getAccountIcon = (type: Account['type']) => {
        switch (type) {
            case 'checking':
                return '🏦';
            case 'savings':
                return '💰';
            case 'credit_card':
                return '💳';
            case 'cash':
                return '💵';
            default:
        }
    };

    const formatBalance = (balance: number, currency: string) => {
        const currencySymbols: Record<string, string> = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            KES: 'KSh',
            UGX: 'UGX',
        };
        return `${currencySymbols[currency]} ${Math.abs(balance).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Account</Text>
            <View style={styles.accountList}>
                {mockAccounts.map((account) => {
                    const isSelected = value === account.id;
                    return (
                        <Pressable
                            key={account.id}
                            style={[
                                styles.accountItem,
                                {
                                    backgroundColor: colors.cardBackground,
                                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                                    borderWidth: isSelected ? 2 : 1,
                                },
                            ]}
                            onPress={() => onChange(account.id)}
                        >
                            <View style={styles.accountLeft}>
                                <Text style={styles.accountIcon}>{getAccountIcon(account.type)}</Text>
                                <View>
                                    <Text style={[styles.accountName, { color: colors.text }]}>
                                        {account.name}
                                    </Text>
                                    <Text style={[styles.accountType, { color: colors.textMuted }]}>
                                        {account.type.replace('_', ' ')}
                                    </Text>
                                </View>
                            </View>
                            <Text
                                style={[
                                    styles.accountBalance,
                                    { color: account.balance >= 0 ? colors.success : colors.error },
                                ]}
                            >
                                {formatBalance(account.balance, account.currency)}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
            {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    accountList: {
        gap: 8,
    },
    accountItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 12,
    },
    accountLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    accountIcon: {
        fontSize: 24,
    },
    accountName: {
        fontSize: 16,
        fontWeight: '600',
    },
    accountType: {
        fontSize: 12,
        textTransform: 'capitalize',
        marginTop: 2,
    },
    accountBalance: {
        fontSize: 16,
        fontWeight: '700',
    },
    error: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});
