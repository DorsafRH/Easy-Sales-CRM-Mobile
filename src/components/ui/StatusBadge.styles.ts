/**
 * @file StatusBadge.styles.ts
 * @description Styles du composant StatusBadge, définis via makeStyles
 *              pour un accès complet au thème (couleurs, spacing, typographie).
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

/**
 * Fabrique de styles pour le composant StatusBadge.
 *
 * @param theme - Thème courant injecté par useStyles()
 * @returns StyleSheet mémoïsé avec tous les styles du badge
 * @author Riahi Dorsaf
 */
export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: theme.spacing[1],
      rowGap: theme.spacing[1],
      paddingVertical: theme.spacing[1],
      paddingHorizontal: theme.spacing[3],
      borderRadius: theme.radius.full,
      alignSelf: 'flex-start',
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: theme.radius.full,
    },
    label: {
      fontSize: theme.typography.size.xs,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
  });
