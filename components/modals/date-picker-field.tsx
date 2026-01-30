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
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handlePress = () => {
        console.log('Date picker pressed');
    };

    return (
        <Pressable
            style={[styles.container, { borderBottomColor: colors.divider }]}
            onPress={handlePress}
        >
            <View style={styles.left}>
                <Text style={styles.icon}>📅</Text>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Date</Text>
            </View>
            <Text style={[styles.dateText, { color: colors.text }]}>{formatDate(value)}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        marginBottom: 8,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    icon: {
        fontSize: 20,
    },
    label: {
        fontSize: 15,
        fontWeight: '500',
    },
    dateText: {
        fontSize: 15,
        fontWeight: '600',
    },
});
