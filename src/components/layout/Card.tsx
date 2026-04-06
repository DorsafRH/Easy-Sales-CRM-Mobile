import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, radius } from '../../theme';

interface CardProps {
  children: ReactNode;
  style?:   ViewStyle;
  padded?:  boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, padded = true }) => (
  <View style={[styles.card, padded && styles.padded, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgSurface,
    borderRadius:    radius.lg,
    borderWidth:     1,
    borderColor:     colors.border,
    shadowColor:     colors.black,
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.06,
    shadowRadius:    4,
    elevation:       2,
  },
  padded: { padding: spacing[5] },
});