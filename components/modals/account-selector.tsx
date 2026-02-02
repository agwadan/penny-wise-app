import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getAccounts } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface AccountSelectorProps {
    value: string;
    onChange: (account: any) => void;
    error?: string;
}

export function AccountSelector({ value, onChange, error }: AccountSelectorProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [accounts, setAccounts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const data = await getAccounts();
                setAccounts(data.results || data);
            } catch (error) {
                console.error('Failed to fetch accounts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const selectedAccount = accounts.find((acc) => acc.id.toString() === value);

    const getAccountIcon = (type: string): keyof typeof Ionicons.glyphMap => {
        switch (type) {
            case 'checking':
                return 'business';
            case 'savings':
                return 'wallet';
            case 'credit_card':
                return 'card';
            case 'cash':
                return 'cash-outline';
            default:
                return 'business';
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
        return `${currencySymbols[currency] || currency} ${Math.abs(balance).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };

    const handleSelect = (account: any) => {
        onChange(account);
        setIsModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Account</Text>

            <Pressable
                style={[
                    styles.dropdownTrigger,
                    {
                        backgroundColor: colors.cardBackground,
                        borderColor: error ? colors.error : colors.cardBorder,
                    },
                ]}
                onPress={() => setIsModalVisible(true)}
            >
                <View style={styles.selectedInfo}>
                    {selectedAccount ? (
                        <>
                            <View style={[styles.iconCircleSmall, { backgroundColor: `${colors.primary}15` }]}>
                                <Ionicons
                                    name={getAccountIcon(selectedAccount.account_type || selectedAccount.type)}
                                    size={16}
                                    color={colors.primary}
                                />
                            </View>
                            <View>
                                <Text style={[styles.selectedName, { color: colors.text }]}>
                                    {selectedAccount.name}
                                </Text>
                                <Text style={[styles.selectedBalance, { color: colors.textMuted }]}>
                                    {formatBalance(parseFloat(selectedAccount.balance) || 0, selectedAccount.currency)}
                                </Text>
                            </View>
                        </>
                    ) : (
                        <Text style={[styles.placeholder, { color: colors.textMuted }]}>
                            Select an account
                        </Text>
                    )}
                </View>
                <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </Pressable>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={styles.modalBackdrop}
                        onPress={() => setIsModalVisible(false)}
                    />
                    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.divider }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Account</Text>
                            <Pressable onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </Pressable>
                        </View>

                        {isLoading ? (
                            <View style={styles.centered}>
                                <ActivityIndicator size="large" color={colors.primary} />
                            </View>
                        ) : accounts.length === 0 ? (
                            <View style={styles.centered}>
                                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                    No accounts found. Please add an account first.
                                </Text>
                            </View>
                        ) : (
                            <ScrollView style={styles.accountListScroll}>
                                {accounts.map((account) => {
                                    const isSelected = value === account.id.toString();
                                    const balance = parseFloat(account.balance) || 0;
                                    const accountType = account.account_type || account.type || 'checking';

                                    return (
                                        <Pressable
                                            key={account.id}
                                            style={[
                                                styles.accountItem,
                                                {
                                                    backgroundColor: isSelected ? `${colors.primary}10` : 'transparent',
                                                    borderBottomColor: colors.divider,
                                                },
                                            ]}
                                            onPress={() => handleSelect(account)}
                                        >
                                            <View style={styles.accountLeft}>
                                                <View style={[styles.iconCircle, { backgroundColor: isSelected ? colors.primary : `${colors.primary}15` }]}>
                                                    <Ionicons
                                                        name={getAccountIcon(accountType)}
                                                        size={22}
                                                        color={isSelected ? '#FFFFFF' : colors.primary}
                                                    />
                                                </View>
                                                <View>
                                                    <Text style={[styles.accountName, { color: isSelected ? colors.primary : colors.text }]}>
                                                        {account.name}
                                                    </Text>
                                                    <Text style={[styles.accountType, { color: colors.textMuted }]}>
                                                        {accountType.replace('_', ' ')}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.accountRight}>
                                                <Text
                                                    style={[
                                                        styles.accountBalance,
                                                        { color: balance >= 0 ? colors.success : colors.error },
                                                    ]}
                                                >
                                                    {formatBalance(balance, account.currency)}
                                                </Text>
                                                {isSelected && (
                                                    <Ionicons name="checkmark-circle" size={18} color={colors.primary} style={{ marginLeft: 8 }} />
                                                )}
                                            </View>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

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
        paddingHorizontal: 4,
    },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    selectedInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconCircleSmall: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    selectedName: {
        fontSize: 15,
        fontWeight: '600',
    },
    selectedBalance: {
        fontSize: 12,
        marginTop: 1,
    },
    placeholder: {
        fontSize: 15,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '70%',
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    accountListScroll: {
        paddingHorizontal: 16,
    },
    accountItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderRadius: 12,
        marginVertical: 4,
    },
    accountLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    accountName: {
        fontSize: 15,
        fontWeight: '600',
    },
    accountType: {
        fontSize: 12,
        textTransform: 'capitalize',
        marginTop: 2,
    },
    accountRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accountBalance: {
        fontSize: 15,
        fontWeight: '700',
    },
    centered: {
        padding: 40,
        alignItems: 'center',
    },
    error: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
    },
});
