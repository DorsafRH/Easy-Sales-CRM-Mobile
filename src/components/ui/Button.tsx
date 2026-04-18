/**
 * @file Button.tsx
 * @description Composant bouton générique supportant plusieurs variantes visuelles,
 *              tailles, état de chargement et largeur adaptative.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './Button.styles';

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

/**
 * Bouton générique de l'application.
 * Supporte 5 variantes visuelles (primary, secondary, outline, danger, ghost),
 * 3 tailles (sm, md, lg), un état de chargement avec spinner et une largeur pleine.
 *
 * @param label     - Texte affiché dans le bouton
 * @param onPress   - Callback déclenché au clic
 * @param variant   - Style visuel du bouton (défaut : 'primary')
 * @param size      - Taille du bouton (défaut : 'md')
 * @param loading   - Si true, affiche un spinner et désactive le bouton
 * @param disabled  - Si true, désactive le bouton
 * @param fullWidth - Si true, le bouton occupe toute la largeur disponible
 * @param style     - Styles additionnels appliqués au conteneur
 * @author Riahi Dorsaf
 */
export const Button: React.FC<ButtonProps> = ({
  label, onPress, variant = 'primary', size = 'md',
  loading = false, disabled = false, fullWidth = false, style,
}) => {
  const styles = useStyles(makeStyles);
  const theme  = useTheme();
  const isDisabled = disabled || loading;

  const containerStyle: StyleProp<ViewStyle> = [
    styles.base,
    styles[variant] as ViewStyle,
    styles[`size_${size}` as keyof typeof styles] as ViewStyle,
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  const textStyle: StyleProp<TextStyle> = [
    styles.label as TextStyle,
    styles[`label_${variant}` as keyof typeof styles] as TextStyle,
    styles[`labelSize_${size}` as keyof typeof styles] as TextStyle,
  ];

  const spinnerColor = (variant === 'primary' || variant === 'danger')
    ? theme.colors.white
    : theme.colors.primary;

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator size="small" color={spinnerColor} />
        : <Text style={textStyle}>{label}</Text>
      }
    </TouchableOpacity>
  );
};
