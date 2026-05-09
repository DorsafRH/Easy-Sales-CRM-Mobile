/**
 * @file PhoneInput.styles.ts
 * @description Styles du composant PhoneInput avec sélecteur de pays.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme }   from '../../theme';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({

    wrapper: {
      marginBottom: theme.spacing[4],
    },

    label: {
      fontSize:     theme.typography.size.sm,
      fontWeight:   '600',
      color:        theme.colors.textPrimary,
      marginBottom: theme.spacing[2],
    },

    // ── Champ principal ───────────────────────────────────────
    row: {
      flexDirection:   'row',
      alignItems:      'center',
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.md,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      height:          50,
      overflow:        'hidden',
    },

    rowError: {
      borderColor: theme.colors.danger,
    },

    rowDisabled: {
      opacity: 0.5,
    },

    // ── Bouton sélection pays ─────────────────────────────────
    countryBtn: {
      flexDirection:   'row',
      alignItems:      'center',
      columnGap:       4,
      paddingLeft:     12,
      paddingRight:    8,
      height:          '100%',
    },

    flag: {
      fontSize: 20,
    },

    prefix: {
      fontSize:   14,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
      minWidth:   36,
    },

    separator: {
      width:           1,
      height:          28,
      backgroundColor: theme.colors.border,
      marginRight:     8,
    },

    // ── Champ numéro local ────────────────────────────────────
    input: {
      flex:      1,
      fontSize:  15,
      color:     theme.colors.textPrimary,
      height:    '100%',
      paddingVertical: 0,
    },

    checkIcon: {
      marginRight: 12,
    },

    // ── Texte erreur ──────────────────────────────────────────
    errorTxt: {
      fontSize:  12,
      color:     theme.colors.danger,
      marginTop: theme.spacing[1],
    },

    // ── Modal sélection pays ──────────────────────────────────
    modalOverlay: {
      flex:            1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent:  'flex-end',
    },

    modalContent: {
      backgroundColor: theme.colors.bgSurface,
      borderTopLeftRadius:  20,
      borderTopRightRadius: 20,
      maxHeight:            '70%',
    },

    modalHeader: {
      flexDirection:     'row',
      justifyContent:    'space-between',
      alignItems:        'center',
      padding:           20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    modalTitle: {
      fontSize:   16,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },

    countryItem: {
      flexDirection:     'row',
      alignItems:        'center',
      columnGap:         12,
      paddingVertical:   14,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },

    countryItemSelected: {
      backgroundColor: theme.colors.primaryLight,
    },

    countryFlag: {
      fontSize: 22,
    },

    countryName: {
      flex:       1,
      fontSize:   14,
      fontWeight: '500',
      color:      theme.colors.textPrimary,
    },

    countryPrefix: {
      fontSize:   13,
      color:      theme.colors.textSecondary,
      fontWeight: '600',
      marginRight: 8,
    },
  });