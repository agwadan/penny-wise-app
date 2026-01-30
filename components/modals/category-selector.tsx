import { CategoryIcon } from '@/components/category-icon';
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
                        const categoryColor = category.color || colors.primary;
                        return (
                            <Pressable
                                key={category.id}
                                style={styles.categoryItem}
                                onPress={() => onChange(category.id.toString())}
                            >
                                <View
                                    style={[
                                        styles.iconCircle,
                                        {
                                            backgroundColor: isSelected ? categoryColor : `${categoryColor}15`,
                                            borderColor: categoryColor,
                                            borderWidth: isSelected ? 0 : 1,
                                        },
                                    ]}
                                >
                                    <CategoryIcon
                                        name={category.icon}
                                        color={isSelected ? '#FFFFFF' : categoryColor}
                                        size={24}
                                    />
                                </View>
                                <Text
                                    style={[
                                        styles.categoryName,
                                        { color: isSelected ? colors.text : colors.textSecondary, fontWeight: isSelected ? '700' : '500' },
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
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    scrollContent: {
        paddingVertical: 4,
        gap: 16,
    },
    categoryItem: {
        alignItems: 'center',
        width: 80,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryName: {
        fontSize: 12,
        textAlign: 'center',
    },
    error: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});
