/**
 * @file Card.styles.ts
 * @description Styles du composant Card, définis via makeStyles
 *              pour un accès complet au thème (couleurs, spacing, radius).
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

/**
 * Fabrique de styles pour le composant Card.
 *
 * @param theme - Thème courant injecté par useStyles()
 * @returns StyleSheet mémoïsé avec tous les styles de la carte
 * @author Riahi Dorsaf
 */
export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      shadowColor:     theme.colors.black,
      shadowOffset:    { width: 0, height: 1 },
      shadowOpacity:   0.06,
      shadowRadius:    4,
      elevation:       2,
    },
    padded: {
      padding: theme.spacing[5],
    },
  });
