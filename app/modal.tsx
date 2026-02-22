import { AddTransactionModal } from '@/components/modals/add-transaction-modal';
import { TransactionFormData } from '@/types';
import { addTransaction, handleApiError, getBalanceHistory, getCategorySpending, getTotalBalance } from '@/utils/api';
import { fetchData as fetchApiData } from '@/utils';
import { addIncome, addExpense, setBalanceHistory, setCategorySpending, setBalance, setTransactions } from '@/store/finance';
import { router } from 'expo-router';
import { Alert, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

export default function ModalScreen() {
  const dispatch = useDispatch();
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

      // Update balance in store
      const amount = data.amount;
      if (data.type === 'expense') {
        dispatch(addExpense(amount));
      } else if (data.type === 'income') {
        dispatch(addIncome(amount));
      }
      // Transfers don't change total balance

      // Proactively refresh history and spending from API
      try {
        const [historyData, spendingData, balanceData, transactionsData] = await Promise.all([
          getBalanceHistory(),
          getCategorySpending(),
          getTotalBalance(),
          fetchApiData('auth/transactions/')
        ]);

        const spendingResults = Array.isArray(spendingData) ? spendingData : (spendingData.results || []);

        dispatch(setBalanceHistory(historyData));
        dispatch(setCategorySpending(spendingResults));
        dispatch(setBalance({
          totalBalance: balanceData.total_balance || 0,
          accountCount: balanceData.number_of_accounts || 0
        }));
        dispatch(setTransactions(transactionsData.results || transactionsData));
      } catch (refreshError) {
        console.error('Failed to refresh financial stats:', refreshError);
        // We don't block the user if refresh fails, as the transaction was successful
      }

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
