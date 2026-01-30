import { AddTransactionModal } from '@/components/modals/add-transaction-modal';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TransactionFormData } from '@/types';
import { deleteTransaction, getTransaction, handleApiError, updateTransaction } from '@/utils/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<TransactionFormData | null>(null);

  useEffect(() => {
    const loadTransaction = async () => {
      if (!id) return;
      try {
        const data = await getTransaction(parseInt(id, 10));

        // Map API response to TransactionFormData
        setInitialData({
          type: data.transaction_type,
          amount: parseFloat(data.amount),
          categoryId: data.category.toString(),
          accountId: data.account.toString(),
          date: new Date(data.date),
          notes: data.description || '',
        });
      } catch (error) {
        const errorMessage = handleApiError(error);
        Alert.alert('Error', 'Failed to load transaction: ' + errorMessage);
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadTransaction();
  }, [id]);

  const handleSubmit = async (data: TransactionFormData) => {
    if (!id) return;
    try {
      const date = new Date(data.date);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      const requestData = {
        account: parseInt(data.accountId, 10),
        category: parseInt(data.categoryId, 10),
        transaction_type: data.type,
        amount: data.amount,
        description: data.notes || '',
        date: formattedDate,
      };

      await updateTransaction(parseInt(id, 10), requestData);
      Alert.alert('Success', 'Transaction updated successfully');
      router.back();
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Error', errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(parseInt(id, 10));
              Alert.alert('Success', 'Transaction deleted successfully');
              router.back();
            } catch (error) {
              const errorMessage = handleApiError(error);
              Alert.alert('Error', errorMessage);
            }
          }
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!initialData) return null;

  return (
    <AddTransactionModal
      onSubmit={handleSubmit}
      initialData={initialData}
      onDelete={handleDelete}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
