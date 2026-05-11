/**
 * @file SmartActionSheet.styles.ts
 * @description Styles du popup de smart automation.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    overlay: {
      flex:            1,
      backgroundColor: theme.colors.overlay,
      justifyContent:  'flex-end',
    },
    sheet: {
      backgroundColor:      theme.colors.bgSurface,
      borderTopLeftRadius:  theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      padding:              theme.spacing[5],
      paddingBottom:        theme.spacing[8],
    },
    handle: {
      alignSelf:       'center',
      width:           40,
      height:          4,
      borderRadius:    2,
      backgroundColor: theme.colors.border,
      marginBottom:    theme.spacing[4],
    },
    iconWrapper: {
      width:           56,
      height:          56,
      borderRadius:    28,
      alignSelf:       'center',
      alignItems:      'center',
      justifyContent:  'center',
      marginBottom:    theme.spacing[3],
    },
    title: {
      fontSize:     theme.typography.size.lg,
      fontWeight:   '700',
      color:        theme.colors.textPrimary,
      textAlign:    'center',
      marginBottom: theme.spacing[2],
    },
    subtitle: {
      fontSize:     theme.typography.size.sm,
      color:        theme.colors.textSecondary,
      textAlign:    'center',
      lineHeight:   theme.typography.size.sm * 1.6,
      marginBottom: theme.spacing[5],
    },
    btnPrimary: {
      backgroundColor: theme.colors.primary,
      borderRadius:    theme.radius.lg,
      paddingVertical: theme.spacing[4],
      alignItems:      'center',
      marginBottom:    theme.spacing[3],
    },
    btnPrimaryText: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      theme.colors.white,
    },
    btnSecondary: {
      borderRadius:    theme.radius.lg,
      paddingVertical: theme.spacing[3],
      alignItems:      'center',
    },
    btnSecondaryText: {
      fontSize:   theme.typography.size.sm,
      color:      theme.colors.textSecondary,
    },
  });