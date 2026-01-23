import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getCategories } from '@/utils/api';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface CategorySelectorProps {
    value: string;
    onChange: (categoryId: string) => void;
    error?: string;
}

export function CategorySelector({ value, onChange, error }: CategorySelectorProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                // Handing both { results: [] } and []
                setCategories(data.results || data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color={colors.primary} style={{ marginHorizontal: 20 }} />
                ) : (
                    categories.map((category) => {
                        const isSelected = value === category.id.toString();
                        return (
                            <Pressable
                                key={category.id}
                                style={[
                                    styles.categoryItem,
                                    {
                                        backgroundColor: isSelected ? (category.color || colors.primary) : colors.cardBackground,
                                        borderColor: isSelected ? (category.color || colors.primary) : colors.cardBorder,
                                    },
                                ]}
                                onPress={() => onChange(category.id.toString())}
                            >
                                <Text style={styles.categoryIcon}>{category.icon || '📌'}</Text>
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
                    })
                )}
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
