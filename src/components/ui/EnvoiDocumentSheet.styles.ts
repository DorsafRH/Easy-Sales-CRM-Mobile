/**
 * @file EnvoiDocumentSheet.styles.ts
 * @description Styles de la feuille de partage d'un document.
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
    title: {
      fontSize:     theme.typography.size.lg,
      fontWeight:   '700',
      color:        theme.colors.textPrimary,
      marginBottom: theme.spacing[4],
    },
    row: {
      flexDirection:   'row',
      alignItems:      'center',
      paddingVertical: theme.spacing[3],
    },
    iconCircle: {
      width:          44,
      height:         44,
      borderRadius:   22,
      alignItems:     'center',
      justifyContent: 'center',
      marginRight:    theme.spacing[3],
    },
    iconCircleNeutral: {
      backgroundColor: theme.colors.bgApp,
    },
    rowTextWrap: {
      flex: 1,
    },
    rowLabel: {
      fontSize:   theme.typography.size.base,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },
    rowSub: {
      fontSize:  theme.typography.size.xs,
      color:     theme.colors.textTertiary,
      marginTop: 2,
    },
    cancelBtn: {
      marginTop:       theme.spacing[3],
      borderRadius:    theme.radius.lg,
      paddingVertical: theme.spacing[3],
      alignItems:      'center',
      backgroundColor: theme.colors.bgHover,
    },
    cancelText: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textSecondary,
    },
  });
