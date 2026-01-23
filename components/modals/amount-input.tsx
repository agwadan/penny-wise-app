import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface AmountInputProps {
    value: number;
    onChange: (value: number) => void;
    error?: string;
    currency?: string;
}

export function AmountInput({ value, onChange, error, currency = 'UGX' }: AmountInputProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const currencySymbols: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        KES: 'KSh',
        UGX: 'UGX',
    };

    const formatWithSeparators = (val: number | string) => {
        const stringVal = val.toString();
        if (!stringVal || stringVal === '0') return '';
        const [integer, decimal] = stringVal.split('.');
        const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return stringVal.includes('.') ? `${formattedInteger}.${decimal}` : formattedInteger;
    };

    const handleChange = (text: string) => {
        // Strip commas for internal logic
        const rawValue = text.replace(/,/g, '');

        // Allow only numbers and decimal point
        const cleaned = rawValue.replace(/[^0-9.]/g, '');

        // Ensure only one decimal point
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            return;
        }

        // Limit decimal places to 2
        if (parts[1] && parts[1].length > 2) {
            return;
        }

        const numericValue = cleaned === '' ? 0 : parseFloat(cleaned);
        onChange(numericValue);
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Amount</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground, borderColor: error ? colors.error : colors.cardBorder }]}>
                <Text style={[styles.currencySymbol, { color: colors.text }]}>
                    {currencySymbols[currency]}
                </Text>
                <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={formatWithSeparators(value)}
                    onChangeText={handleChange}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={colors.textMuted}
                    selectionColor={colors.primary}
                />
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    currencySymbol: {
        fontSize: 32,
        fontWeight: 'bold',
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 32,
        fontWeight: 'bold',
        paddingVertical: 12,
    },
    error: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});
