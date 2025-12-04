import { AddTransactionModal } from '@/components/modals/add-transaction-modal';
import { addTransaction } from '@/data/mock-data';
import { TransactionFormData } from '@/types';
import { StyleSheet } from 'react-native';

export default function ModalScreen() {
  const handleSubmit = (data: TransactionFormData) => {
    const amount = parseFloat(data.amount);

    addTransaction(
      amount,
      data.categoryId,
      data.accountId,
      data.date,
      data.notes,
      data.type
    );
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
