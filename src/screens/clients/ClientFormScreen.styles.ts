/**
 * @file ClientFormScreen.styles.ts
 * @description Styles du formulaire de création / modification d'un client.
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

    // ── Header ───────────────────────────────────────────────
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

    headerTitle: {
      flex:       1,
      fontSize:   theme.typography.size.lg,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },

    // ── Contenu ──────────────────────────────────────────────
    scroll: { flex: 1 },

    content: {
      flexGrow:          1,
      paddingHorizontal: layout.screenPadding,
      paddingVertical:   theme.spacing[5],
      paddingBottom:     theme.spacing[10],
    },

    // ── Bouton import contacts ───────────────────────────────
    importBtn: {
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'center',
      columnGap:       theme.spacing[2],
      paddingVertical: theme.spacing[3],
      borderRadius:    theme.radius.md,
      borderWidth:     1.5,
      borderStyle:     'dashed',
      borderColor:     theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
      marginBottom:    theme.spacing[5],
    },

    importBtnText: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.primary,
    },

    // ── Sélecteur type ───────────────────────────────────────
    typeRow: {
      flexDirection: 'row',
      columnGap:     theme.spacing[3],
      marginBottom:  theme.spacing[5],
    },

    typeBtn: {
      flex:            1,
      paddingVertical: theme.spacing[3],
      borderRadius:    theme.radius.md,
      borderWidth:     1.5,
      borderColor:     theme.colors.border,
      backgroundColor: theme.colors.bgSurface,
      alignItems:      'center',
    },

    typeBtnActive: {
      borderColor:     theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
    },

    typeBtnText: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textSecondary,
    },

    typeBtnTextActive: {
      color: theme.colors.primary,
    },

    // ── Carte ────────────────────────────────────────────────
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

    // ── Alerte erreur ────────────────────────────────────────
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

    // ── Bouton ───────────────────────────────────────────────
    btnSubmit: { marginTop: theme.spacing[2] },

    // ── Row 2 colonnes ───────────────────────────────────────
    row:     { flexDirection: 'row', columnGap: theme.spacing[3] },
    rowItem: { flex: 1 },
  });