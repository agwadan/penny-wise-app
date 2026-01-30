import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BalanceHistoryItem } from '@/types';
import { formatCompactNumber } from '@/utils';
import { getBalanceHistory } from '@/utils/api';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface BalanceHistoryChartProps {
    refreshTrigger?: boolean;
}

export function BalanceHistoryChart({ refreshTrigger = false }: BalanceHistoryChartProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const screenWidth = Dimensions.get('window').width;
    const [data, setData] = useState<BalanceHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                if (data.length === 0) setIsLoading(true);
                const historyData = await getBalanceHistory();
                setData(historyData);
            } catch (error) {
                console.error('Failed to load balance history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [refreshTrigger]);

    const formatCurrency = (amount: number) => {
        return formatCompactNumber(amount);
    };

    // Calculate today's balance (last item in history)
    const currentBalance = data.length > 0 ? data[data.length - 1].balance : 0;

    // Prepare data for LineChart
    const chartLabels = data.length > 0
        ? data.filter((_, index) => index % 5 === 0).map(item => {
            const date = new Date(item.date);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        })
        : [];

    // We need to ensure labels align with data points if providing labels manually
    // But react-native-chart-kit treats labels as X-axis labels.
    // Ideally we pass specific labels. 
    // To make it look good, we might want to just show a few labels.
    // However, chart-kit expects labels array length to match data length OR it just spreads them?
    // Actually, LineChart takes `labels` in `data` prop. If `labels` length != data points, it might look weird.
    // standard approach: pass all labels but hide some using `formatXLabel` or accept clutter.
    // OR: Only pass a subset of labels if the library distributes them evenly? No, usually it maps index to index.

    // Let's rely on `formatXLabel` or just pass a simplified label set if the library supports it.
    // Checking docs (mental): `labels` array length should usually match data points or be subset.
    // Let's pass empty strings for intermediate labels to avoid clutter.

    // Calculate indices to show (First, Last, and 2 evenly spaced in between)
    const indicesToShow = new Set([
        0,
        Math.floor((data.length - 1) * 0.33),
        Math.floor((data.length - 1) * 0.66),
        data.length - 1
    ]);

    const preparedLabels = data.map((item, index) => {
        if (indicesToShow.has(index)) {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        }
        return '';
    });

    const chartData = {
        labels: preparedLabels,
        datasets: [
            {
                data: data.map(item => item.balance),
                color: (opacity = 1) => colors.primary, // optional
                strokeWidth: 2
            }
        ],
        legend: ["Balance History"] // optional
    };

    const chartConfig = {
        backgroundColor: colors.cardBackground,
        backgroundGradientFrom: colors.cardBackground,
        backgroundGradientTo: colors.cardBackground,
        decimalPlaces: 0,
        color: (opacity = 1) => colors.primary,
        labelColor: (opacity = 1) => colors.text,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: colors.background
        },
        propsForBackgroundLines: {
            strokeDasharray: "", // solid lines
            stroke: colors.divider,
            strokeOpacity: 0.2
        }
    };

    if (isLoading) {
        return (
            <ThemedView style={[styles.container, { backgroundColor: colors.cardBackground }]}>
                <ThemedText style={styles.title}>Balance History</ThemedText>
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                </View>
            </ThemedView>
        );
    }

    if (data.length === 0) {
        return (
            <ThemedView style={[styles.container, { backgroundColor: colors.cardBackground }]}>
                <ThemedText style={styles.title}>Balance History</ThemedText>
                <View style={styles.emptyContainer}>
                    <ThemedText style={[styles.emptyText, { color: colors.textMuted }]}>
                        No balance history available
                    </ThemedText>
                </View>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={[styles.container, { backgroundColor: colors.cardBackground }]}>
            <ThemedText style={styles.title}>Balance History</ThemedText>
            <View style={styles.balanceContainer}>
                <ThemedText style={styles.currencyPrefix}>UGX</ThemedText>
                <ThemedText style={styles.balanceAmount}>{currentBalance.toLocaleString()}</ThemedText>
            </View>
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                Last 30 Days
            </ThemedText>

            <View style={styles.chartContainer}>
                <LineChart
                    data={chartData}
                    width={screenWidth - 32} // container padding 16*2 + margin 16*2 = 64
                    height={200}
                    chartConfig={chartConfig}
                    bezier
                    withDots={false}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                        overflow: 'visible'
                    }}
                    withInnerLines={true}
                    withOuterLines={false}
                    withVerticalLines={false}
                    withHorizontalLines={true}
                    withVerticalLabels={true}
                    withHorizontalLabels={true}
                    yAxisLabel=""
                    yAxisSuffix=""
                    formatYLabel={(yValue: string) => formatCompactNumber(parseFloat(yValue))}
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
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    currencyPrefix: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 4,
    },
    balanceAmount: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 16,
    },
    chartContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    emptyContainer: {
        paddingVertical: 48,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
    },
});
