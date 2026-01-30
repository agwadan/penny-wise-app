import { AddAccountModal } from '@/components/modals/add-account-modal';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AccountFormData } from '@/types';
import { deleteAccount, getAccount, handleApiError, updateAccount } from '@/utils/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

export default function EditAccountScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<AccountFormData | null>(null);

  useEffect(() => {
    const loadAccount = async () => {
      if (!id) return;
      try {
        const data = await getAccount(parseInt(id, 10));
        setInitialData({
          name: data.name,
          account_type: data.account_type,
          initial_balance: parseFloat(data.balance),
          currency: data.currency,
        });
      } catch (error) {
        const errorMessage = handleApiError(error);
        Alert.alert('Error', 'Failed to load account: ' + errorMessage);
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadAccount();
  }, [id]);

  const handleSubmit = async (data: AccountFormData) => {
    if (!id) return;
    try {
      await updateAccount(parseInt(id, 10), data);
      Alert.alert('Success', 'Account updated successfully');
      router.back();
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Error', errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete this account? This will also delete all associated transactions.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount(parseInt(id, 10));
              Alert.alert('Success', 'Account deleted successfully');
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
    <AddAccountModal
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
