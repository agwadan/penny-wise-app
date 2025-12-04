import { Colors } from '@/constants/theme';
import { mockCategories } from '@/data/mock-data';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface CategorySelectorProps {
    value: string;
    onChange: (categoryId: string) => void;
    error?: string;
}

export function CategorySelector({ value, onChange, error }: CategorySelectorProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {mockCategories.map((category) => {
                    const isSelected = value === category.id;
                    return (
                        <Pressable
                            key={category.id}
                            style={[
                                styles.categoryItem,
                                {
                                    backgroundColor: isSelected ? category.color : colors.cardBackground,
                                    borderColor: isSelected ? category.color : colors.cardBorder,
                                },
                            ]}
                            onPress={() => onChange(category.id)}
                        >
                            <Text style={styles.categoryIcon}>{category.icon}</Text>
                            <Text
                                style={[
                                    styles.categoryName,
                                    { color: isSelected ? '#FFFFFF' : colors.text },
                                ]}
                                numberOfLines={1}
                            >
                                {category.name}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
            {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
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
    scrollContent: {
        paddingVertical: 4,
        gap: 8,
    },
    categoryItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        minWidth: 100,
    },
    categoryIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    categoryName: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    error: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});
