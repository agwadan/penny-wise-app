import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface AmountInputProps {
    value: number;
    onChange: (value: number) => void;
    error?: string;
    currency?: string;
    type?: 'expense' | 'income';
}

export function AmountInput({ value, onChange, error, currency = 'UGX', type = 'expense' }: AmountInputProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const amountColor = type === 'expense' ? '#FF4F6E' : '#27CDA1';

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
        const rawValue = text.replace(/,/g, '');
        const cleaned = rawValue.replace(/[^0-9.]/g, '');
        const parts = cleaned.split('.');
        if (parts.length > 2 || (parts[1] && parts[1].length > 2)) return;
        const numericValue = cleaned === '' ? 0 : parseFloat(cleaned);
        onChange(numericValue);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputWrapper}>
                <Text style={[styles.currencySymbol, { color: amountColor }]}>
                    {currencySymbols[currency]}
                </Text>
                <TextInput
                    style={[styles.input, { color: amountColor }]}
                    value={formatWithSeparators(value)}
                    onChangeText={handleChange}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={`${amountColor}40`}
                    selectionColor={amountColor}
                    autoFocus={!value}
                />
            </View>
            {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 32,
        alignItems: 'center',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currencySymbol: {
        fontSize: 36,
        fontWeight: '700',
        marginRight: 8,
    },
    input: {
        fontSize: 48,
        fontWeight: '800',
        paddingVertical: 10,
        minWidth: 100,
        textAlign: 'center',
    },
    error: {
        fontSize: 12,
        marginTop: 4,
    },
});
