import React from 'react';
import {
  TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle,
} from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label:      string;
  onPress:    () => void;
  variant?:   Variant;
  size?:      Size;
  loading?:   boolean;
  disabled?:  boolean;
  fullWidth?: boolean;
  style?:     ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label, onPress, variant = 'primary', size = 'md',
  loading = false, disabled = false, fullWidth = false, style,
}) => {
  const isDisabled = disabled || loading;

  const containerStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.label,
    styles[`label_${variant}`],
    styles[`labelSize_${size}`],
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger'
            ? colors.white : colors.primary}
        />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: radius.md },
  fullWidth: { width: '100%' },
  disabled:  { opacity: 0.55 },

  primary:   { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.bgHover, borderWidth: 1, borderColor: colors.border },
  outline:   { backgroundColor: colors.transparent, borderWidth: 1.5, borderColor: colors.primary },
  danger:    { backgroundColor: colors.danger },
  ghost:     { backgroundColor: colors.transparent },

  size_sm: { paddingVertical: spacing[2], paddingHorizontal: spacing[3] },
  size_md: { paddingVertical: spacing[3], paddingHorizontal: spacing[5] },
  size_lg: { paddingVertical: spacing[4], paddingHorizontal: spacing[6] },

  label:         { fontWeight: '600' },
  label_primary:   { color: colors.white },
  label_secondary: { color: colors.textPrimary },
  label_outline:   { color: colors.primary },
  label_danger:    { color: colors.white },
  label_ghost:     { color: colors.primary },

  labelSize_sm: { fontSize: typography.size.sm },
  labelSize_md: { fontSize: typography.size.base },
  labelSize_lg: { fontSize: typography.size.md },
});