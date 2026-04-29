/**
 * @file FilterChips.styles.ts
 * @description Styles du composant FilterChips.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

/**
 * @param theme - Thème courant injecté par useStyles()
 * @author Riahi Dorsaf
 */
export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    scrollContent: {
      paddingHorizontal: theme.spacing[5],
      columnGap:         theme.spacing[2],
      flexDirection:     'row',
      alignItems:        'center',
    },
    chip: {
      paddingVertical:   theme.spacing[2],
      paddingHorizontal: theme.spacing[4],
      borderRadius:      theme.radius.full,
      borderWidth:       1.5,
      borderColor:       theme.colors.border,
      backgroundColor:   theme.colors.bgSurface,
    },
    chipLabel: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textSecondary,
    },
  });