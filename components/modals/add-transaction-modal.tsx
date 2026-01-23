import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TransactionFormData } from '@/types';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { AccountSelector } from './account-selector';
import { AmountInput } from './amount-input';
import { CategorySelector } from './category-selector';
import { DatePickerField } from './date-picker-field';
import { NotesInput } from './notes-input';
import { TransactionTypeToggle } from './transaction-type-toggle';

interface AddTransactionModalProps {
    onSubmit: (data: TransactionFormData) => void;
}

export function AddTransactionModal({ onSubmit }: AddTransactionModalProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [formData, setFormData] = React.useState<TransactionFormData>({
        type: 'expense',
        amount: 0,
        categoryId: '',
        accountId: '',
        date: new Date(),
        notes: '',
    });

    const [errors, setErrors] = React.useState<Partial<Record<keyof TransactionFormData, string>>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof TransactionFormData, string>> = {};

        if (!formData.amount || formData.amount <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Please select a category';
        }

        if (!formData.accountId) {
            newErrors.accountId = 'Please select an account';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {

        console.log(`formData: ${JSON.stringify(formData)}`);

        if (validateForm()) {
            onSubmit(formData);
            router.back();
        } else {
            Alert.alert('Validation Error', 'Please fill in all required fields');
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        >
            <View style={[styles.header, { borderBottomColor: colors.divider }]}>
                <Pressable onPress={handleCancel} style={styles.headerButton}>
                    <Text style={[styles.headerButtonText, { color: colors.textSecondary }]}>Cancel</Text>
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Add Transaction</Text>
                <Pressable
                    onPress={() => {
                        handleSubmit();
                    }}
                    style={styles.headerButton}
                >
                    <Text style={[styles.headerButtonText, { color: colors.primary }]}>Save</Text>
                </Pressable>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <TransactionTypeToggle
                    value={formData.type}
                    onChange={(type) => setFormData({ ...formData, type })}
                />

                <AmountInput
                    value={formData.amount}
                    onChange={(amount) => setFormData({ ...formData, amount })}
                    error={errors.amount}
                />

                <CategorySelector
                    value={formData.categoryId}
                    onChange={(categoryId) => setFormData({ ...formData, categoryId })}
                    error={errors.categoryId}
                />

                <AccountSelector
                    value={formData.accountId}
                    onChange={(accountId) => setFormData({ ...formData, accountId })}
                    error={errors.accountId}
                />

                <DatePickerField
                    value={formData.date}
                    onChange={(date) => setFormData({ ...formData, date })}
                />

                <NotesInput
                    value={formData.notes}
                    onChange={(notes) => setFormData({ ...formData, notes })}
                />

                <Pressable
                    style={[
                        styles.submitButton,
                        { backgroundColor: formData.type === 'expense' ? colors.error : colors.success },
                    ]}
                    onPress={() => {
                        console.log('Button pressed!');
                        handleSubmit();
                    }}
                >
                    <Text style={styles.submitButtonText}>
                        {formData.type === 'expense' ? '💸 Add Expense' : '💰 Add Income'}
                    </Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    headerButton: {
        paddingVertical: 8,
        paddingHorizontal: 4,
        minWidth: 60,
    },
    headerButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    submitButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
