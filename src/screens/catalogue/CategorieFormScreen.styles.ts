/**
 * @file CategorieFormScreen.styles.ts
 * @description Styles du formulaire de création / modification d'une catégorie.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme }   from '../../theme';
import { layout }     from '../../theme/dimensions';

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

    header: {
      flexDirection:     'row',
      alignItems:        'center',
      paddingHorizontal: layout.screenPadding,
      paddingVertical:   theme.spacing[4],
      backgroundColor:   theme.colors.bgSurface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      columnGap:         theme.spacing[3],
    },

    backBtn: {
      width:           44,
      height:          44,
      borderRadius:    22,
      backgroundColor: theme.colors.bgApp,
      alignItems:      'center',
      justifyContent:  'center',
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },

    title: {
      flex:       1,
      fontSize:   theme.typography.size.lg,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },

    scroll:  { flex: 1 },

    content: {
      flexGrow:          1,
      paddingHorizontal: layout.screenPadding,
      paddingVertical:   theme.spacing[5],
      paddingBottom:     theme.spacing[10],
    },

    card: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      padding:         theme.spacing[4],
      marginBottom:    theme.spacing[4],
    },

    cardTitle: {
      fontSize:     theme.typography.size.base,
      fontWeight:   '600',
      color:        theme.colors.textPrimary,
      marginBottom: theme.spacing[4],
    },

    iconPreviewRow: {
      flexDirection:   'row',
      alignItems:      'center',
      columnGap:       theme.spacing[3],
      marginBottom:    theme.spacing[4],
      padding:         theme.spacing[3],
      backgroundColor: theme.colors.bgApp,
      borderRadius:    theme.radius.md,
    },

    iconPreviewBox: {
      width:           48,
      height:          48,
      borderRadius:    theme.radius.md,
      backgroundColor: theme.colors.primaryLight,
      alignItems:      'center',
      justifyContent:  'center',
    },

    iconPreviewText: {
      flex:     1,
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
    },

    hint: {
      fontSize:     theme.typography.size.xs,
      color:        theme.colors.textSecondary,
      lineHeight:   theme.typography.size.xs * 1.6,
      marginBottom: theme.spacing[4],
    },

    alertError: {
      backgroundColor: theme.colors.dangerLight,
      borderWidth:     1,
      borderColor:     theme.colors.danger,
      borderRadius:    theme.radius.md,
      padding:         theme.spacing[3],
      marginBottom:    theme.spacing[4],
    },

    alertErrorText: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.dangerText,
    },

    btnSubmit: { marginTop: theme.spacing[2] },

    deleteBtn: {
      marginTop:       theme.spacing[3],
      paddingVertical: theme.spacing[3],
      borderRadius:    theme.radius.md,
      borderWidth:     1,
      borderColor:     theme.colors.danger,
      alignItems:      'center',
      backgroundColor: theme.colors.dangerLight,
    },

    deleteBtnText: {
      fontSize:   theme.typography.size.sm,
      color:      theme.colors.danger,
      fontWeight: '600',
    },
  });