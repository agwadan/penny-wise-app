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
    const [allCategories, setAllCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Hierarchy Navigation State
    const [currentView, setCurrentView] = useState<'parents' | 'subcategories'>('parents');
    const [selectedParent, setSelectedParent] = useState<any>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch all categories (hierarchy included)
                const data = await getCategories();
                const flattenedOrNested = data.results || data;
                setAllCategories(flattenedOrNested);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Helper to find selected category in the tree
    const findCategory = (id: string, searchList: any[]): any => {
        for (const cat of searchList) {
            if (cat.id.toString() === id) return cat;
            if (cat.subcategories && cat.subcategories.length > 0) {
                const found = findCategory(id, cat.subcategories);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedCategory = value ? findCategory(value, allCategories) : null;

    const handleSelect = (category: any) => {
        // If it's a parent and has subcategories, drill down
        if (!selectedParent && category.subcategories && category.subcategories.length > 0) {
            setSelectedParent(category);
            setCurrentView('subcategories');
        } else {
            // It's a subcategory or a parent without subs, so select it
            onChange(category.id.toString());
            setIsModalVisible(false);
            // Reset view for next time
            setTimeout(() => {
                setCurrentView('parents');
                setSelectedParent(null);
            }, 300);
        }
    };

    const handleBack = () => {
        setCurrentView('parents');
        setSelectedParent(null);
    };

    const displayedCategories = currentView === 'parents'
        ? allCategories.filter(c => !c.parent) // Only root parents
        : selectedParent?.subcategories || [];

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
                            <Text style={[styles.selectedName, { color: colors.text }]} numberOfLines={1}>
                                {selectedCategory.full_name || selectedCategory.name}
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
                            <View style={styles.modalHeaderLeft}>
                                {currentView === 'subcategories' && (
                                    <Pressable onPress={handleBack} style={styles.backButton}>
                                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                                    </Pressable>
                                )}
                                <Text style={[styles.modalTitle, { color: colors.text }]}>
                                    {currentView === 'parents' ? 'Select Category' : selectedParent?.name}
                                </Text>
                            </View>
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
                                {currentView === 'subcategories' && (
                                    <Pressable
                                        style={[
                                            styles.categoryItem,
                                            {
                                                backgroundColor: value === selectedParent.id.toString() ? `${selectedParent.color}15` : 'transparent',
                                                borderColor: value === selectedParent.id.toString() ? selectedParent.color : 'transparent',
                                                borderWidth: 1,
                                            },
                                        ]}
                                        onPress={() => handleSelect(selectedParent)}
                                    >
                                        <View style={[styles.iconCircle, { backgroundColor: `${selectedParent.color}10` }]}>
                                            <Ionicons name="ellipsis-horizontal" size={24} color={selectedParent.color} />
                                        </View>
                                        <Text style={[styles.categoryName, { color: colors.textSecondary }]}>
                                            General {selectedParent.name}
                                        </Text>
                                    </Pressable>
                                )}

                                {displayedCategories.map((category: any) => {
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
                                            onPress={() => handleSelect(category)}
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
                                            {currentView === 'parents' && category.subcategories?.length > 0 && (
                                                <View style={styles.badge}>
                                                    <Text style={styles.badgeText}>{category.subcategories.length}</Text>
                                                </View>
                                            )}
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
    modalHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 12,
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
    badge: {
        position: 'absolute',
        top: 4,
        right: 12,
        backgroundColor: '#6366f1',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
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
