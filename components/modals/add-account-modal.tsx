import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AccountFormData } from '@/types';
import { getAccountMetadata } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AmountInput } from './amount-input';

interface AddAccountModalProps {
  onSubmit: (data: AccountFormData) => void;
}

const getAccountIcon = (value: string) => {
  switch (value.toLowerCase()) {
    case 'savings':
      return 'wallet-outline';
    case 'cash':
      return 'cash-outline';
    case 'card':
    case 'credit_card':
      return 'card-outline';
    case 'checking':
      return 'business-outline';
    default:
      return 'help-circle-outline';
  }
};

const currencies = [
  { label: 'KES', value: 'KES' },
  { label: 'UGX', value: 'UGX' },
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'GBP', value: 'GBP' },
];

export function AddAccountModal({ onSubmit }: AddAccountModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [dynamicAccountTypes, setDynamicAccountTypes] = useState<{ label: string; value: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = React.useState<AccountFormData>({
    name: '',
    account_type: 'savings',
    balance: 0,
    currency: 'KES',
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const metadata = await getAccountMetadata();

        // DRF metadata is usually inside actions.POST
        const accountTypeField = metadata?.actions?.POST?.account_type || metadata?.account_type;

        if (accountTypeField?.choices) {
          const types = accountTypeField.choices.map((choice: any) => ({
            label: choice.display_name,
            value: choice.value,
          }));

          setDynamicAccountTypes(types);
          if (types.length > 0 && !formData.name) {
            setFormData(prev => ({ ...prev, account_type: types[0].value }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch account metadata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, []);


  const [errors, setErrors] = React.useState<Partial<Record<keyof AccountFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AccountFormData, string>> = {};

    if (!formData.name) {
      newErrors.name = 'Please enter an account name';
    }

    if (!formData.balance || formData.balance <= 0) {
      newErrors.balance = 'Please enter an initial balance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Text style={[styles.headerButtonText, { color: colors.textSecondary }]}>Cancel</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add Account</Text>
        <Pressable onPress={handleSubmit} style={styles.headerButton}>
          <Text style={[styles.headerButtonText, { color: colors.primary }]}>Save</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Account Name */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Account Name</Text>
          <View style={[styles.textInputWrapper, { backgroundColor: colors.cardBackground, borderColor: errors.name ? colors.error : colors.cardBorder }]}>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder="e.g. KCB Savings"
              placeholderTextColor={colors.textMuted}
              value={formData.name}
              onChangeText={(name) => setFormData({ ...formData, name })}
            />
          </View>
          {errors.name && <Text style={[styles.error, { color: colors.error }]}>{errors.name}</Text>}
        </View>

        {/* ==== Account Type ==== */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Account Type</Text>
          <View style={styles.typeGrid}>
            {isLoading ? (
              <Text style={{ color: colors.textMuted }}>Loading account types...</Text>
            ) : (
              dynamicAccountTypes.map((type: { label: string; value: string }) => {
                const isSelected = formData.account_type === type.value;
                return (
                  <Pressable
                    key={type.value}
                    style={[
                      styles.typeCard,
                      {
                        backgroundColor: colors.cardBackground,
                        borderColor: isSelected ? colors.primary : colors.cardBorder,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                    onPress={() => setFormData({ ...formData, account_type: type.value })}
                  >
                    <Ionicons
                      name={getAccountIcon(type.value) as any}
                      size={24}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                    <Text style={[styles.typeLabel, { color: isSelected ? colors.primary : colors.text, fontWeight: isSelected ? '700' : '400' }]}>
                      {type.label}
                    </Text>
                  </Pressable>
                );
              })
            )}
          </View>
        </View>

        {/* ==== Balance ==== */}
        <AmountInput
          value={formData.balance}
          onChange={(balance) => setFormData({ ...formData, balance })}
          error={errors.balance}
          currency={formData.currency}
        />

        {/* Currency */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Currency</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.currencyList}>
            {currencies.map((curr) => {
              const isSelected = formData.currency === curr.value;
              return (
                <Pressable
                  key={curr.value}
                  style={[
                    styles.currencyBadge,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                      borderColor: colors.cardBorder,
                    },
                  ]}
                  onPress={() => setFormData({ ...formData, currency: curr.value })}
                >
                  <Text style={[styles.currencyText, { color: isSelected ? '#FFFFFF' : colors.text }]}>
                    {curr.value}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <Pressable
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Create Account</Text>
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
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInputWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  textInput: {
    fontSize: 16,
    paddingVertical: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  typeCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
  },
  typeLabel: {
    fontSize: 14,
  },
  currencyList: {
    gap: 10,
  },
  currencyBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  currencyText: {
    fontWeight: '600',
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
