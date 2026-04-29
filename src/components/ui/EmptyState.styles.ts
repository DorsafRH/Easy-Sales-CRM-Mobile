/**
 * @file EmptyState.styles.ts
 * @description Styles du composant EmptyState.
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
    container: {
      flex:           1,
      alignItems:     'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing[12],
      paddingHorizontal: theme.spacing[8],
    },
    iconWrapper: {
      width:           88,
      height:          88,
      borderRadius:    44,
      backgroundColor: theme.colors.bgApp,
      alignItems:      'center',
      justifyContent:  'center',
      marginBottom:    theme.spacing[5],
    },
    titre: {
      fontSize:     theme.typography.size.lg,
      fontWeight:   '600',
      color:        theme.colors.textPrimary,
      textAlign:    'center',
      marginBottom: theme.spacing[2],
    },
    soustitre: {
      fontSize:   theme.typography.size.sm,
      color:      theme.colors.textSecondary,
      textAlign:  'center',
      lineHeight: theme.typography.size.sm * 1.6,
    },
  });