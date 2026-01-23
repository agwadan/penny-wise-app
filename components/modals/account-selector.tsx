import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getAccounts } from '@/utils/api';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

interface AccountSelectorProps {
    value: string;
    onChange: (accountId: string) => void;
    error?: string;
}

export function AccountSelector({ value, onChange, error }: AccountSelectorProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [accounts, setAccounts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const data = await getAccounts();
                // The API might return { results: [] } or just []
                setAccounts(data.results || data);
            } catch (error) {
                console.error('Failed to fetch accounts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const selectedAccount = accounts.find((acc) => acc.id === value);

    const getAccountIcon = (type: string) => {
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
                return '🏦';
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
                {isLoading ? (
                    <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
                ) : accounts.length === 0 ? (
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No accounts found. Please add an account first.</Text>
                ) : (
                    accounts.map((account) => {
                        const isSelected = value === account.id.toString();
                        const balance = parseFloat(account.balance) || 0;
                        const accountType = account.account_type || account.type || 'checking';

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
                                onPress={() => onChange(account.id.toString())}
                            >
                                <View style={styles.accountLeft}>
                                    <Text style={styles.accountIcon}>{getAccountIcon(accountType)}</Text>
                                    <View>
                                        <Text style={[styles.accountName, { color: colors.text }]}>
                                            {account.name}
                                        </Text>
                                        <Text style={[styles.accountType, { color: colors.textMuted }]}>
                                            {accountType.replace('_', ' ')}
                                        </Text>
                                    </View>
                                </View>
                                <Text
                                    style={[
                                        styles.accountBalance,
                                        { color: balance >= 0 ? colors.success : colors.error },
                                    ]}
                                >
                                    {formatBalance(balance, account.currency)}
                                </Text>
                            </Pressable>
                        );
                    })
                )}
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
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 10,
    },
});
