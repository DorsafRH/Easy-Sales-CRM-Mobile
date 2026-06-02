/**
 * @file ExportContactModal.styles.ts
 * @description Styles de la feuille d'action d'export (mail / WhatsApp).
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
      textAlign:    'center',
      marginBottom: theme.spacing[5],
    },

    // ── Menu d'options ────────────────────────────────────────
    options: {
      rowGap: theme.spacing[3],
    },
    optionBtn: {
      flexDirection:   'row',
      alignItems:      'center',
      columnGap:       theme.spacing[3],
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[4],
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      backgroundColor: theme.colors.bgSurface,
    },
    optionText: {
      fontSize:   theme.typography.size.base,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },

    // ── Saisie manuelle ───────────────────────────────────────
    saisieZone: {
      rowGap: theme.spacing[3],
    },
    saisieLabel: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '500',
      color:      theme.colors.textSecondary,
    },
    input: {
      borderWidth:       1.5,
      borderColor:       theme.colors.border,
      borderRadius:      theme.radius.md,
      backgroundColor:   theme.colors.bgSurface,
      paddingHorizontal: theme.spacing[4],
      paddingVertical:   theme.spacing[3],
      fontSize:          theme.typography.size.base,
      color:             theme.colors.textPrimary,
    },
    inputError: {
      borderColor: theme.colors.danger,
    },
    errorText: {
      fontSize:  theme.typography.size.xs,
      color:     theme.colors.danger,
      marginTop: -theme.spacing[1],
    },

    // ── Boutons ───────────────────────────────────────────────
    primaryBtn: {
      backgroundColor: theme.colors.primary,
      borderRadius:    theme.radius.lg,
      paddingVertical: theme.spacing[4],
      alignItems:      'center',
    },
    primaryText: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      theme.colors.white,
    },
    cancelBtn: {
      borderRadius:    theme.radius.lg,
      paddingVertical: theme.spacing[3],
      alignItems:      'center',
    },
    cancelText: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
    },
  });
