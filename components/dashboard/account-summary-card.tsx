import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface AccountSummaryCardProps {
    totalBalance: number;
    accountCount: number;
    currency?: string;
}

export function AccountSummaryCard({
    totalBalance,
    accountCount,
    currency = 'UGX'
}: AccountSummaryCardProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const formatCurrency = (amount: number) => {
        const currencySymbols: Record<string, string> = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            KES: 'KSh',
            UGX: 'UGX',
        };
        return `${currencySymbols[currency]} ${amount.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };

    return (
        <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.content}>
                <ThemedText style={styles.label}>Total Balance</ThemedText>

                {/* ==== Total Balance Figure ===== */}
                <ThemedText style={styles.balance}>
                    {formatCurrency(totalBalance)}
                </ThemedText>
                <ThemedText style={styles.accountCount}>
                    Across {accountCount} {accountCount === 1 ? 'account' : 'accounts'}
                </ThemedText>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        padding: 24,
        marginHorizontal: 16,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    content: {
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        opacity: 0.9,
        marginBottom: 8,
    },
    balance: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        paddingBottom: 8,
    },
    accountCount: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.8,
    },
});
