/**
 * @file Badge.styles.ts
 * @description Styles du composant Badge.
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
    badge: {
      flexDirection:     'row',
      alignItems:        'center',
      alignSelf:         'flex-start',
      columnGap:         theme.spacing[1],
      paddingVertical:   theme.spacing[1],
      paddingHorizontal: theme.spacing[2] + 2,
      borderRadius:      theme.radius.full,
    },
    dot: {
      width:        6,
      height:       6,
      borderRadius: 3,
    },
    label: {
      fontSize:    theme.typography.size.xs,
      fontWeight:  '600',
      letterSpacing: 0.2,
    },
  });