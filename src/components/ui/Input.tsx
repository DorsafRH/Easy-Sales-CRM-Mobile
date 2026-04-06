import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, TextInputProps, ViewStyle,
} from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';

interface InputProps extends TextInputProps {
  label?:          string;
  error?:          string;
  required?:       boolean;
  isPassword?:     boolean;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label, error, required = false, isPassword = false,
  containerStyle, ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textPlaceholder}
          secureTextEntry={isPassword ? !showPassword : rest.secureTextEntry}
          autoCapitalize="none"
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword(v => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container:    { marginBottom: spacing[4] },
  label:        { fontSize: typography.size.sm, fontWeight: '500', color: colors.textPrimary, marginBottom: spacing[2] },
  required:     { color: colors.danger },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.bgSurface, paddingHorizontal: spacing[4] },
  inputError:   { borderColor: colors.danger },
  input:        { flex: 1, paddingVertical: spacing[3], fontSize: typography.size.base, color: colors.textPrimary },
  eyeBtn:       { padding: spacing[1], marginLeft: spacing[2] },
  eyeIcon:      { fontSize: 16 },
  errorText:    { fontSize: typography.size.xs, color: colors.danger, marginTop: spacing[1] },
});