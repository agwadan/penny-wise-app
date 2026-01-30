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
      const categoryId = parseInt(data.categoryId, 10);

      if (isNaN(accountId) || isNaN(categoryId)) {
        Alert.alert('Error', 'Invalid account or category ID');
        return;
      }

      // Prepare request body matching the API endpoint format
      const requestData = {
        account: accountId,
        category: categoryId,
        transaction_type: data.type,
        amount: data.amount,
        description: data.notes || '',
        date: formattedDate,
        currency: data.currency,
      };

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
