/**
 * @file VentesPlaceholderScreen.styles.ts
 * @description Styles de l'écran placeholder Ventes (Sprint 3).
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme }   from '../../../theme';

/**
 * @param theme - Thème courant injecté par useStyles()
 * @author Riahi Dorsaf
 */
export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({

    safe: {
      flex:            1,
      backgroundColor: theme.colors.bgApp,
    },

    container: {
      flex:              1,
      alignItems:        'center',
      justifyContent:    'center',
      paddingHorizontal: theme.spacing[8],
    },

    iconWrapper: {
      width:           88,
      height:          88,
      borderRadius:    44,
      backgroundColor: theme.colors.bgSurface,
      alignItems:      'center',
      justifyContent:  'center',
      marginBottom:    theme.spacing[6],
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },

    titre: {
      fontSize:     theme.typography.size['2xl'],
      fontWeight:   '700',
      color:        theme.colors.textPrimary,
      textAlign:    'center',
      marginBottom: theme.spacing[2],
    },

    soustitre: {
      fontSize:     theme.typography.size.sm,
      color:        theme.colors.textSecondary,
      textAlign:    'center',
      lineHeight:   theme.typography.size.sm * 1.6,
      marginBottom: theme.spacing[5],
    },

    badge: {
      backgroundColor:   theme.colors.primaryLight,
      borderRadius:      theme.radius.full,
      paddingVertical:   theme.spacing[1] + 2,
      paddingHorizontal: theme.spacing[4],
    },

    badgeText: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.primary,
    },
  });