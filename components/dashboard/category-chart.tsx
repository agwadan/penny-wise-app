import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CategorySpending } from '@/types';
import { getCategorySpending } from '@/utils/api';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

interface CategoryChartProps {
    refreshTrigger?: boolean;
}

export function CategoryChart({ refreshTrigger = false }: CategoryChartProps) {
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
                setData(spendingData.results || spendingData);
            } catch (error) {
                console.error('Failed to load category spending:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSpending();
    }, [refreshTrigger]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Prepare data for PieChart
    const chartData = data.map((item) => ({
        name: item.category,
        amount: item.amount,
        color: item.color,
        legendFontColor: colors.text,
        legendFontSize: 12,
    }));

    const chartConfig = {
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

    if (isLoading) {
        return (
            <ThemedView style={[styles.container, { backgroundColor: colors.cardBackground }]}>
                <ThemedText style={styles.title}>Spending by Category</ThemedText>
                <View style={styles.emptyContainer}>
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
                        No spending data for this month
                    </ThemedText>
                </View>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={[styles.container, { backgroundColor: colors.cardBackground }]}>
            <ThemedText style={styles.title}>Spending by Category</ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                This month
            </ThemedText>

            <View style={styles.chartContainer}>
                <PieChart
                    data={chartData}
                    width={screenWidth - 64}
                    height={200}
                    chartConfig={chartConfig}
                    accessor="amount"
                    backgroundColor="transparent"
                    paddingLeft="0"
                    center={[0, 0]}
                    hasLegend={false}
                />
            </View>

            <View style={styles.legendContainer}>
                {data.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={styles.legendLeft}>
                            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                            <ThemedText style={styles.legendCategory}>{item.category}</ThemedText>
                        </View>
                        <View style={styles.legendRight}>
                            <ThemedText style={styles.legendAmount}>
                                {formatCurrency(item.amount)}
                            </ThemedText>
                            <ThemedText style={[styles.legendPercentage, { color: colors.textMuted }]}>
                                {item.percentage.toFixed(1)}%
                            </ThemedText>
                        </View>
                    </View>
                ))}
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 16,
    },
    chartContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    legendContainer: {
        marginTop: 16,
    },
    legendItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    legendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendCategory: {
        fontSize: 14,
        fontWeight: '500',
    },
    legendRight: {
        alignItems: 'flex-end',
    },
    legendAmount: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    legendPercentage: {
        fontSize: 12,
    },
    emptyContainer: {
        paddingVertical: 48,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
    },
});
