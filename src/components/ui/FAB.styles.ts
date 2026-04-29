/**
 * @file FAB.styles.ts
 * @description Styles du Floating Action Button.
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
    fab: {
      position:        'absolute',
      bottom:          24,
      right:           20,
      width:           56,
      height:          56,
      borderRadius:    28,
      backgroundColor: theme.colors.primary,
      alignItems:      'center',
      justifyContent:  'center',
      // Shadow iOS
      shadowColor:     theme.colors.primary,
      shadowOffset:    { width: 0, height: 4 },
      shadowOpacity:   0.35,
      shadowRadius:    8,
      // Elevation Android
      elevation:       6,
    },
  });