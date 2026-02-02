import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

interface DatePickerFieldProps {
    value: Date;
    onChange: (date: Date) => void;
}

export function DatePickerField({ value, onChange }: DatePickerFieldProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [show, setShow] = useState(false);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || value;
        setShow(Platform.OS === 'ios'); // iOS stays open until done
        onChange(currentDate);
    };

    const handlePress = () => {
        setShow(true);
    };

    return (
        <View>
            <Pressable
                style={[styles.container, { borderBottomColor: colors.divider }]}
                onPress={handlePress}
            >
                <View style={styles.left}>
                    <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Date</Text>
                </View>
                <Text style={[styles.dateText, { color: colors.text }]}>{formatDate(value ?? new Date())}</Text>
            </Pressable>

            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={value || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    maximumDate={new Date()}
                />
            )}
        </View>
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
    label: {
        fontSize: 15,
        fontWeight: '500',
    },
    dateText: {
        fontSize: 15,
        fontWeight: '600',
    },
});
