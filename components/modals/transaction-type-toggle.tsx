import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TransactionType } from '@/types';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface TransactionTypeToggleProps {
    value: TransactionType;
    onChange: (type: TransactionType) => void;
}

export function TransactionTypeToggle({ value, onChange }: TransactionTypeToggleProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const slidePosition = useSharedValue(value === 'expense' ? 0 : 1);

    React.useEffect(() => {
        slidePosition.value = withSpring(value === 'expense' ? 0 : 1, {
            damping: 15,
            stiffness: 150,
        });
    }, [value]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: slidePosition.value * 170 }],
    }));

    const handlePress = (type: TransactionType) => {
        if (type !== value) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onChange(type);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <Animated.View
                style={[
                    styles.slider,
                    { backgroundColor: value === 'expense' ? colors.error : colors.success },
                    animatedStyle,
                ]}
            />
            <Pressable
                style={styles.option}
                onPress={() => handlePress('expense')}
            >
                <Text
                    style={[
                        styles.optionText,
                        { color: value === 'expense' ? '#FFFFFF' : colors.textSecondary },
                    ]}
                >
                    💸 Expense
                </Text>
            </Pressable>
            <Pressable
                style={styles.option}
                onPress={() => handlePress('income')}
            >
                <Text
                    style={[
                        styles.optionText,
                        { color: value === 'income' ? '#FFFFFF' : colors.textSecondary },
                    ]}
                >
                    💰 Income
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 12,
        borderWidth: 1,
        padding: 4,
        position: 'relative',
    },
    slider: {
        position: 'absolute',
        top: 4,
        left: 4,
        width: 170,
        height: 44,
        borderRadius: 10,
        zIndex: 0,
    },
    option: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
