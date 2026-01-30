import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CategorySpending } from '@/types';
import { getCategorySpending } from '@/utils/api';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

interface CategorySpendingChartProps {
  refreshTrigger?: boolean;
}

export function CategorySpendingChart({ refreshTrigger = false }: CategorySpendingChartProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const screenWidth = Dimensions.get('window').width;
  const [data, setData] = useState<CategorySpending[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpending = async () => {
      try {
        if (data.length === 0) setIsLoading(true);
        const spendingData = await getCategorySpending();
        // Ensure we have an array
        const results = Array.isArray(spendingData) ? spendingData : (spendingData.results || []);
        setData(results);
      } catch (error) {
        console.error('Failed to load category spending:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpending();
  }, [refreshTrigger]);

  const totalSpending = data.reduce((sum, item) => sum + item.amount, 0);

  const chartData = data.map(item => {
    return {
      name: item.category,
      amount: item.amount,
      color: item.color || colors.primary,
      legendFontColor: colors.text,
      legendFontSize: 12
    };
  });

  const chartConfig = {
    color: (opacity = 1) => colors.primary,
    labelColor: (opacity = 1) => colors.text,
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.cardBackground }]}>
        <ThemedText style={styles.title}>Spending by Category</ThemedText>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </ThemedView>
    );
  }

  if (data.length === 0) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.cardBackground }]}>
        <ThemedText style={styles.title}>Spending by Category</ThemedText>
        <View style={styles.emptyContainer}>
          <ThemedText style={[styles.emptyText, { color: colors.textMuted }]}>
            No spending data available
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <ThemedText style={styles.title}>Spending by Category</ThemedText>
      <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
        Past 30 Days (Total: UGX {totalSpending.toLocaleString()})
      </ThemedText>

      <View style={styles.chartContainer}>
        <PieChart
          data={chartData.map(d => ({
            ...d,
            population: d.amount,
          }))}
          width={screenWidth - 64}
          height={180}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute={false} // This will show percentage instead of the absolute amount
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
