import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface CategoryIconProps {
  name: string;
  color: string;
  size?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

export function CategoryIcon({ name, color, size = 20, containerStyle }: CategoryIconProps) {
  // Map database icon names to vector icon components and names
  // This is a flexible mapping that can be expanded
  const getIcon = () => {
    const iconName = name?.toLowerCase() || 'help-circle';

    // Check if the name is an emoji
    const isEmoji = /\p{Emoji}/u.test(name);
    if (isEmoji) {
      return <ThemedText style={{ fontSize: size }}>{name}</ThemedText>;
    }

    // specific mapping for database icons
    switch (iconName) {
      case 'heart':
        return <Ionicons name="heart" size={size} color={color} />;
      case 'film':
        return <Ionicons name="film" size={size} color={color} />;
      case 'restaurant':
      case 'utensils':
      case 'food':
      case 'dining':
      case 'groceries':
        return <Ionicons name="restaurant" size={size} color={color} />;
      case 'fitness':
      case 'heart-pulse':
      case 'health':
      case 'medical':
        return <Ionicons name="fitness" size={size} color={color} />;
      case 'close-circle':
      case 'lost':
        return <Ionicons name="close-circle" size={size} color={color} />;
      case 'help-circle':
      case 'other':
        return <Ionicons name="help-circle" size={size} color={color} />;
      case 'home':
      case 'housing':
        return <Ionicons name="home" size={size} color={color} />;
      case 'cash':
      case 'salary':
      case 'income':
      case 'money':
        return <Ionicons name="cash" size={size} color={color} />;
      case 'cart':
      case 'shopping':
        return <Ionicons name="cart" size={size} color={color} />;
      case 'bus':
      case 'transportation':
      case 'car':
        return <Ionicons name="bus" size={size} color={color} />;
      case 'plus':
      case 'add':
        return <Ionicons name="add" size={size} color={color} />;
      case 'minus':
      case 'expense':
        return <Ionicons name="remove" size={size} color={color} />;
      case 'transactions':
      case 'list':
      case 'chart':
        return <Ionicons name="list" size={size} color={color} />;
      case 'bank':
      case 'accounts':
        return <Ionicons name="business" size={size} color={color} />;
      case 'insurance':
      case 'shield':
        return <Ionicons name="shield-checkmark" size={size} color={color} />;
      case 'education':
      case 'learning':
      case 'school':
      case 'book':
        return <Ionicons name="book" size={size} color={color} />;
      case 'gift':
      case 'present':
        return <Ionicons name="gift" size={size} color={color} />;
      case 'travel':
      case 'airplane':
      case 'flight':
        return <Ionicons name="airplane" size={size} color={color} />;
      case 'utilities':
      case 'bill':
      case 'flash':
        return <Ionicons name="flash" size={size} color={color} />;
      case 'rent':
      case 'lease':
      case 'key':
        return <Ionicons name="key" size={size} color={color} />;
      case 'maintenance':
      case 'repair':
      case 'hammer':
        return <Ionicons name="hammer" size={size} color={color} />;
      case 'investment':
      case 'stock':
      case 'trending-up':
        return <Ionicons name="trending-up" size={size} color={color} />;
      case 'tax':
      case 'receipt':
        return <Ionicons name="receipt" size={size} color={color} />;
      case 'debt':
      case 'loan':
      case 'card':
        return <Ionicons name="card" size={size} color={color} />;
      case 'subscription':
      case 'renew':
      case 'refresh':
        return <Ionicons name="refresh" size={size} color={color} />;
      case 'pets':
      case 'dog':
      case 'paw':
        return <Ionicons name="paw" size={size} color={color} />;
      case 'personal':
      case 'self-care':
      case 'person':
        return <Ionicons name="person" size={size} color={color} />;
      case 'clothing':
      case 'shirt':
        return <Ionicons name="shirt" size={size} color={color} />;
      default:
        // Default to help-circle for anything unmapped
        return <Ionicons name="help-circle" size={size} color={color} />;
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {getIcon()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
