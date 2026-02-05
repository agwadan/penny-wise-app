import { AddTransactionModal } from '@/components/modals/add-transaction-modal';
import { TransactionFormData } from '@/types';
import { addTransaction, handleApiError } from '@/utils/api';
import { router } from 'expo-router';
import { Alert, StyleSheet } from 'react-native';

export default function ModalScreen() {
  const handleSubmit = async (data: TransactionFormData) => {
    try {
      // Format date as YYYY-MM-DD
      const date = new Date(data.date);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      // Convert IDs to numbers
      const accountId = parseInt(data.accountId, 10);
      const categoryId = data.categoryId ? parseInt(data.categoryId, 10) : null;
      const toAccountId = data.toAccountId ? parseInt(data.toAccountId, 10) : null;

      if (isNaN(accountId)) {
        Alert.alert('Error', 'Invalid account ID');
        return;
      }

      if (data.type !== 'transfer' && (categoryId === null || isNaN(categoryId))) {
        Alert.alert('Error', 'Invalid category ID');
        return;
      }

      // Prepare request body matching the API endpoint format
      const requestData: any = {
        account: accountId,
        category: data.type === 'transfer' ? null : categoryId,
        transaction_type: data.type,
        amount: data.amount.toString(), // API example shows string
        description: data.notes || '',
        date: formattedDate,
        currency: data.currency,
      };

      if (data.type === 'transfer' && toAccountId) {
        requestData.to_account = toAccountId;
      }

      await addTransaction(requestData);
      Alert.alert('Success', 'Transaction added successfully');
      router.back();
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Error', errorMessage);
    }
  };

  return <AddTransactionModal onSubmit={handleSubmit} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
