/**
 * @file LanguageSelector.styles.ts
 * @description Styles du sélecteur de langue (bouton globe + bottom sheet).
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme }   from '../../theme';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({

    // ── Bouton globe (dans le hero du dashboard) ─────────────
    globeBtn: {
      width:           40,
      height:          40,
      borderRadius:    20,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems:      'center',
      justifyContent:  'center',
    },

    // ── Overlay + panneau bottom sheet ───────────────────────
    overlay: {
      flex:            1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent:  'flex-end',
    },

    sheet: {
      backgroundColor:      theme.colors.bgSurface,
      borderTopLeftRadius:  theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      paddingHorizontal:    theme.spacing[4],
      paddingTop:           theme.spacing[3],
      paddingBottom:        theme.spacing[8],
    },

    handle: {
      alignSelf:       'center',
      width:           40,
      height:          4,
      borderRadius:    theme.radius.full,
      backgroundColor: theme.colors.border,
      marginBottom:    theme.spacing[4],
    },

    title: {
      fontSize:     theme.typography.size.base,
      fontWeight:   '700',
      color:        theme.colors.textPrimary,
      textAlign:    'center',
      marginBottom: theme.spacing[4],
    },

    // ── Options de langue ─────────────────────────────────────
    option: {
      flexDirection:   'row',
      alignItems:      'center',
      columnGap:       theme.spacing[3],
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      marginBottom:    theme.spacing[3],
    },

    optionActive: {
      backgroundColor: theme.colors.primaryLight,
      borderColor:     theme.colors.primary,
    },

    optionFlag: {
      fontSize: 24,
    },

    optionLabel: {
      flex:       1,
      fontSize:   theme.typography.size.base,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },

    optionLabelActive: {
      color: theme.colors.primary,
    },
  });
