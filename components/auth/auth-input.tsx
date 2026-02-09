import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View
} from 'react-native';
import { ThemedText } from '../themed-text';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export function AuthInput({
  label,
  error,
  icon,
  isPassword = false,
  ...props
}: AuthInputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.cardBackground,
            borderColor: error
              ? colors.error
              : isFocused
                ? colors.primary
                : colors.cardBorder,
          },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? colors.primary : colors.textSecondary}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              flex: 1,
            },
          ]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <ThemedText style={[styles.errorText, { color: colors.error }]}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    fontSize: 15,
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
  },
});
