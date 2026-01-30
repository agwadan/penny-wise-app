import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TransactionType } from '@/types';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
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
    const { width: windowWidth } = useWindowDimensions();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    // Adjust container width to 32px padding (16 on each side)
    const toggleWidth = windowWidth - 32;
    const sliderWidth = (toggleWidth - 8) / 2; // 4px padding on each side of slider

    const slidePosition = useSharedValue(value === 'expense' ? 0 : 1);

    React.useEffect(() => {
        slidePosition.value = withSpring(value === 'expense' ? 0 : 1, {
            damping: 25,
            stiffness: 200,
        });
    }, [value]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: slidePosition.value * sliderWidth }],
    }));

    const handlePress = (type: TransactionType) => {
        if (type !== value) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onChange(type);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
            <Animated.View
                style={[
                    styles.slider,
                    {
                        backgroundColor: value === 'expense' ? '#FF4F6E' : '#27CDA1',
                        width: sliderWidth
                    },
                    animatedStyle,
                ]}
            />

            <Pressable style={styles.option} onPress={() => handlePress('expense')}>
                <Text style={[styles.optionText, { color: value === 'expense' ? '#FFFFFF' : colors.textSecondary }]}>
                    Expense
                </Text>
            </Pressable>

            <Pressable style={styles.option} onPress={() => handlePress('income')}>
                <Text style={[styles.optionText, { color: value === 'income' ? '#FFFFFF' : colors.textSecondary }]}>
                    Income
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 25,
        padding: 4,
        position: 'relative',
        height: 50,
        marginBottom: 24,
    },
    slider: {
        position: 'absolute',
        top: 4,
        left: 4,
        height: 42,
        borderRadius: 21,
        zIndex: 0,
    },
    option: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    optionText: {
        fontSize: 15,
        fontWeight: '700',
    },
});
