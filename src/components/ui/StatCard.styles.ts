/**
 * @file StatCard.styles.ts
 * @description Styles du composant StatCard pour les KPIs du dashboard.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      flex:            1,
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      borderWidth:     1,
      borderColor:     theme.colors.border,
      shadowColor:     theme.colors.black,
      shadowOffset:    { width: 0, height: 2 },
      shadowOpacity:   0.06,
      shadowRadius:    4,
      elevation:       2,
      rowGap:          theme.spacing[1],
    },
    iconWrapper: {
      width:           36,
      height:          36,
      borderRadius:    theme.radius.md,
      alignItems:      'center',
      justifyContent:  'center',
      marginBottom:    theme.spacing[2],
    },
    value: {
      fontSize:   theme.typography.size.xl,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },
    label: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },
  });