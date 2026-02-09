import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootState } from '@/store';
import { toggleBalanceVisibility } from '@/store/showText';
import { getTotalBalance } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

interface AccountSummaryCardProps {
    refreshTrigger?: boolean;
    currency?: string;
}

export function AccountSummaryCard({
    refreshTrigger = false,
    currency = 'UGX'
}: AccountSummaryCardProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const dispatch = useDispatch();
    const isBalanceVisible = useSelector((state: RootState) => state.ui.isBalanceVisible);
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [accountCount, setAccountCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getTotalBalance();
            // Assuming the API returns { total_balance: number, count?: number }
            setTotalBalance(data.total_balance || 0);
            setAccountCount(data.number_of_accounts || 0);
        } catch (error) {
            console.error('Error fetching account summary:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [refreshTrigger]);

    const formatCurrency = (amount: number) => {
        const currencySymbols: Record<string, string> = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            KES: 'KSh',
            UGX: 'UGX',
        };

        if (!isBalanceVisible) {
            return `******`;
        }

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
            <TouchableOpacity
                onPress={() => dispatch(toggleBalanceVisibility())}
                style={styles.visibilityToggle}
                activeOpacity={0.7}
            >
                <Ionicons
                    name={isBalanceVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#FFFFFF"
                    style={{ opacity: 0.8 }}
                />
            </TouchableOpacity>

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
        borderRadius: 24,
        padding: 24,
        marginHorizontal: 16,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
        position: 'relative',
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
    visibilityToggle: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 8,
        zIndex: 10,
    },
    balance: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        paddingBottom: 8,
        letterSpacing: 0.5,
    },
    accountCount: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.8,
    },
});

