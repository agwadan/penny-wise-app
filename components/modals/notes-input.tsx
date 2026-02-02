import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface NotesInputProps {
    value: string;
    onChange: (value: string) => void;
}

export function NotesInput({ value, onChange }: NotesInputProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <View style={[styles.container, { borderBottomColor: colors.divider }]}>
            <View style={styles.topRow}>
                <View style={styles.left}>
                    <Ionicons name="document-text-outline" size={20} color={colors.textSecondary} />
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Notes</Text>
                </View>
                <Text style={[styles.charCount, { color: colors.textMuted }]}>
                    {value.length}/100
                </Text>
            </View>
            <TextInput
                style={[styles.input, { color: colors.text }]}
                value={value}
                onChangeText={onChange}
                placeholder="What was this for?"
                placeholderTextColor={colors.textMuted}
                multiline
                maxLength={100}
                selectionColor={colors.primary}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        marginBottom: 24,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    input: {
        fontSize: 15,
        fontWeight: '500',
        padding: 0,
        marginLeft: 32,
    },
    charCount: {
        fontSize: 12,
    },
});
