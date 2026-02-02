import { CategoryIcon } from '@/components/category-icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getCategories } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

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
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();

                console.log('Categories:', JSON.stringify(data, null, 2));

                setCategories(data.results || data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const selectedCategory = categories.find((cat) => cat.id.toString() === value);

    const handleSelect = (categoryId: string) => {
        onChange(categoryId);
        setIsModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>

            <Pressable
                style={[
                    styles.dropdownTrigger,
                    {
                        backgroundColor: colors.cardBackground,
                        borderColor: error ? colors.error : colors.cardBorder,
                    },
                ]}
                onPress={() => setIsModalVisible(true)}
            >
                <View style={styles.selectedInfo}>
                    {selectedCategory ? (
                        <>
                            <View
                                style={[
                                    styles.iconCircleSmall,
                                    { backgroundColor: `${selectedCategory.color || colors.primary}15` },
                                ]}
                            >
                                <CategoryIcon
                                    name={selectedCategory.icon}
                                    color={selectedCategory.color || colors.primary}
                                    size={18}
                                />
                            </View>
                            <Text style={[styles.selectedName, { color: colors.text }]}>
                                {selectedCategory.name}
                            </Text>
                        </>
                    ) : (
                        <Text style={[styles.placeholder, { color: colors.textMuted }]}>
                            Select a category
                        </Text>
                    )}
                </View>
                <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </Pressable>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={styles.modalBackdrop}
                        onPress={() => setIsModalVisible(false)}
                    />
                    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.divider }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Category</Text>
                            <Pressable onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </Pressable>
                        </View>

                        {isLoading ? (
                            <View style={styles.centered}>
                                <ActivityIndicator size="large" color={colors.primary} />
                            </View>
                        ) : (
                            <ScrollView
                                contentContainerStyle={styles.gridContent}
                                showsVerticalScrollIndicator={false}
                            >
                                {categories.map((category) => {
                                    const isSelected = value === category.id.toString();
                                    const categoryColor = category.color || colors.primary;
                                    return (
                                        <Pressable
                                            key={category.id}
                                            style={[
                                                styles.categoryItem,
                                                {
                                                    backgroundColor: isSelected ? `${categoryColor}15` : 'transparent',
                                                    borderColor: isSelected ? categoryColor : 'transparent',
                                                    borderWidth: 1,
                                                },
                                            ]}
                                            onPress={() => handleSelect(category.id.toString())}
                                        >
                                            <View
                                                style={[
                                                    styles.iconCircle,
                                                    {
                                                        backgroundColor: isSelected ? categoryColor : `${categoryColor}10`,
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
                                                    {
                                                        color: isSelected ? colors.text : colors.textSecondary,
                                                        fontWeight: isSelected ? '700' : '500',
                                                    },
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {category.name}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

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
        paddingHorizontal: 4,
    },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    selectedInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconCircleSmall: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    selectedName: {
        fontSize: 15,
        fontWeight: '600',
    },
    placeholder: {
        fontSize: 15,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '70%',
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    gridContent: {
        padding: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 12,
    },
    categoryItem: {
        alignItems: 'center',
        width: '30%',
        padding: 10,
        borderRadius: 16,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryName: {
        fontSize: 12,
        textAlign: 'center',
    },
    centered: {
        padding: 40,
        alignItems: 'center',
    },
    error: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});
