import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TransactionFormData } from '@/types';
import { Ionicons } from '@expo/vector-icons';
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
    onSubmit: (data: TransactionFormData) => Promise<void> | void;
    initialData?: TransactionFormData;
    onDelete?: () => void;
}

export function AddTransactionModal({ onSubmit, initialData, onDelete }: AddTransactionModalProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [formData, setFormData] = React.useState<TransactionFormData>(initialData || {
        type: 'expense',
        amount: 0,
        categoryId: '',
        accountId: '',
        date: new Date(),
        notes: '',
        currency: 'UGX',
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
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

    const handleSubmit = async () => {
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                await onSubmit(formData);
                // Navigation is handled by the parent on success
            } catch (error) {
                // Error handling is managed by the parent via alerts
            } finally {
                setIsSubmitting(false);
            }
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
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >

            {/* ==== Header Section ==== */}
            <View style={[styles.header, { borderBottomColor: colors.divider }]}>
                <Pressable onPress={handleCancel} style={styles.headerButton}>
                    <Text style={[styles.headerButtonText, { color: colors.textSecondary }]}>Cancel</Text>
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{initialData ? 'Edit Transaction' : 'Add Transaction'}</Text>
                <Pressable
                    onPress={handleSubmit}
                    style={styles.headerButton}
                    disabled={isSubmitting}
                >
                    <Text style={[styles.headerButtonText, { color: isSubmitting ? colors.textMuted : colors.primary }]}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Text>
                </Pressable>
            </View>

            {/* ==== Form Section ==== */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* 1.  Amount Input */}
                <AmountInput
                    value={formData.amount}
                    onChange={(amount) => setFormData({ ...formData, amount })}
                    error={errors.amount}
                    currency={formData.currency}
                    type={formData.type}
                />

                {/* 2. Type Toggle */}
                <TransactionTypeToggle
                    value={formData.type}
                    onChange={(type) => setFormData({ ...formData, type })}
                />

                {/* 3. Account Selector */}
                <AccountSelector
                    value={formData.accountId}
                    onChange={(account) => setFormData({ ...formData, accountId: account.id.toString(), currency: account.currency })}
                    error={errors.accountId}
                />

                {/* 4. Category Selector */}
                <CategorySelector
                    value={formData.categoryId}
                    onChange={(categoryId) => setFormData({ ...formData, categoryId })}
                    error={errors.categoryId}
                />

                {/* 5. Date and Notes (integrated rows) */}
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
                        { backgroundColor: formData.type === 'expense' ? '#FF4F6E' : '#27CDA1', opacity: isSubmitting ? 0.7 : 1 },
                    ]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    <Text style={styles.submitButtonText}>
                        {isSubmitting ? 'Saving...' : (initialData ? 'Update Transaction' : 'Save Transaction')}
                    </Text>
                </Pressable>

                {onDelete && (
                    <Pressable
                        style={[styles.deleteButton, { borderColor: colors.error }]}
                        onPress={onDelete}
                    >
                        <View style={styles.deleteButtonContent}>
                            <Ionicons name="trash-outline" size={20} color={colors.error} style={{ marginRight: 8 }} />
                            <Text style={[styles.deleteButtonText, { color: colors.error }]}>
                                Delete Transaction
                            </Text>
                        </View>
                    </Pressable>
                )}
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
        paddingVertical: 20,
        marginTop: 20,
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
        paddingVertical: 18,
        borderRadius: 24,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    deleteButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
        borderWidth: 1,
    },
    deleteButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    currencyList: {
        gap: 8,
        paddingBottom: 4,
    },
    currencyBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    currencyText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
