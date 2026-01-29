import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
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
        return <Ionicons name="restaurant" size={size} color={color} />;
      case 'fitness':
      case 'heart-pulse':
      case 'health':
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
