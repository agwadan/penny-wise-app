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
    const sliderWidth = (toggleWidth - 8) / 3; // 4px padding on each side of slider, now 3 options

    const getPositionIndex = (type: TransactionType) => {
        switch (type) {
            case 'expense': return 0;
            case 'income': return 1;
            case 'transfer': return 2;
            default: return 0;
        }
    };

    const slidePosition = useSharedValue(getPositionIndex(value));

    React.useEffect(() => {
        slidePosition.value = withSpring(getPositionIndex(value), {
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

    const getSliderColor = () => {
        switch (value) {
            case 'expense': return '#FF4F6E';
            case 'income': return '#27CDA1';
            case 'transfer': return colors.primary;
            default: return '#FF4F6E';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
            <Animated.View
                style={[
                    styles.slider,
                    {
                        backgroundColor: getSliderColor(),
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

            <Pressable style={styles.option} onPress={() => handlePress('transfer')}>
                <Text style={[styles.optionText, { color: value === 'transfer' ? '#FFFFFF' : colors.textSecondary }]}>
                    Transfer
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
