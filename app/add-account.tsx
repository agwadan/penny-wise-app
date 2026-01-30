import { AddAccountModal } from '@/components/modals/add-account-modal';
import { AccountFormData } from '@/types';
import { addAccount, handleApiError } from '@/utils/api';
import { router } from 'expo-router';
import { Alert } from 'react-native';

export default function AddAccountScreen() {
  const handleSubmit = async (data: AccountFormData) => {
    try {
      await addAccount(data);
      Alert.alert('Success', 'Account created successfully');
      router.back();
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Error', errorMessage);
    }
  };

  return <AddAccountModal onSubmit={handleSubmit} />;
}
