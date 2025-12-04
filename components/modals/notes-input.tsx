import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface NotesInputProps {
    value: string;
    onChange: (value: string) => void;
}

export function NotesInput({ value, onChange }: NotesInputProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
                Notes <Text style={{ color: colors.textMuted }}>(Optional)</Text>
            </Text>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.cardBorder,
                        color: colors.text,
                    },
                ]}
                value={value}
                onChangeText={onChange}
                placeholder="Add a note about this transaction..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                maxLength={200}
                selectionColor={colors.primary}
            />
            <Text style={[styles.charCount, { color: colors.textMuted }]}>
                {value.length}/200
            </Text>
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
    input: {
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        minHeight: 80,
    },
    charCount: {
        fontSize: 12,
        textAlign: 'right',
        marginTop: 4,
    },
});
