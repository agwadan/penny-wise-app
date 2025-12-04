import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface DatePickerFieldProps {
    value: Date;
    onChange: (date: Date) => void;
}

export function DatePickerField({ value, onChange }: DatePickerFieldProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // For now, just display the date. Full date picker can be added later
    const handlePress = () => {
        // TODO: Implement date picker modal or native picker
        console.log('Date picker pressed');
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Date</Text>
            <Pressable
                style={[styles.dateButton, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
                onPress={handlePress}
            >
                <Text style={styles.icon}>📅</Text>
                <Text style={[styles.dateText, { color: colors.text }]}>{formatDate(value)}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        gap: 12,
    },
    icon: {
        fontSize: 20,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
