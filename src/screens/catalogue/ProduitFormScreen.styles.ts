/**
 * @file ProduitFormScreen.styles.ts
 * @description Styles du formulaire de création / modification d'un produit.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme }   from '../../theme';
import { layout }     from '../../theme/dimensions';

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
      rowGap:          theme.spacing[1],
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

    typeBtnTextActive: { color: theme.colors.primary },

    typeBtnSub: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textTertiary,
    },

    typeBtnSubActive: { color: theme.colors.primary },

    // ── Cartes ────────────────────────────────────────────────
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

    // ── Ligne 2 colonnes ─────────────────────────────────────
    row:     { flexDirection: 'row', columnGap: theme.spacing[3] },
    rowItem: { flex: 1 },

    // ── Sélecteur catégorie / unité ───────────────────────────
    categorieSelector: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      paddingVertical:   theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      borderWidth:       1,
      borderColor:       theme.colors.border,
      borderRadius:      theme.radius.md,
      backgroundColor:   theme.colors.bgSurface,
      marginBottom:      theme.spacing[4],
    },

    categorieLabel: {
      fontSize: theme.typography.size.base,
      color:    theme.colors.textPlaceholder,
    },

    categorieLabelSelected: {
      color:      theme.colors.textPrimary,
      fontWeight: '500',
    },

    // ── Hint sous le champ stock minimum ─────────────────────
    stockHint: {
      fontSize:   theme.typography.size.xs,
      color:      theme.colors.textTertiary,
      marginTop:  theme.spacing[2],
      lineHeight: theme.typography.size.xs * 1.5,
    },

    // ── Sélecteur statut ──────────────────────────────────────
    statutRow: {
      flexDirection: 'row',
      columnGap:     theme.spacing[3],
    },

    statutBtn: {
      flex:            1,
      paddingVertical: theme.spacing[2] + 2,
      borderRadius:    theme.radius.full,
      borderWidth:     1.5,
      borderColor:     theme.colors.border,
      backgroundColor: theme.colors.bgApp,
      alignItems:      'center',
    },

    statutBtnActive: {
      borderColor:     theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
    },

    statutBtnText: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textSecondary,
    },

    statutBtnTextActive: { color: theme.colors.primary },

    // ── Alerte erreur API ────────────────────────────────────
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

    // ── Modal catégorie / unité ───────────────────────────────
    modalOverlay: {
      flex:            1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent:  'flex-end',
    },

    modalSheet: {
      backgroundColor:      theme.colors.bgSurface,
      borderTopLeftRadius:  theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      paddingBottom:        theme.spacing[8],
      maxHeight:            '70%',
    },

    modalHandle: {
      alignSelf:       'center',
      width:           40,
      height:          4,
      borderRadius:    2,
      backgroundColor: theme.colors.border,
      marginVertical:  theme.spacing[3],
    },

    modalTitle: {
      fontSize:          theme.typography.size.base,
      fontWeight:        '700',
      color:             theme.colors.textPrimary,
      paddingHorizontal: layout.screenPadding,
      marginBottom:      theme.spacing[3],
    },

    modalItem: {
      flexDirection:     'row',
      alignItems:        'center',
      paddingVertical:   theme.spacing[4],
      paddingHorizontal: layout.screenPadding,
      columnGap:         theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },

    modalItemText: {
      flex:     1,
      fontSize: theme.typography.size.base,
      color:    theme.colors.textPrimary,
    },

    modalItemTextSelected: {
      color:      theme.colors.primary,
      fontWeight: '600',
    },

    // ── Bouton créer une catégorie (dans le modal) ────────────
    modalCreateBtn: {
      flexDirection:     'row',
      alignItems:        'center',
      columnGap:         theme.spacing[3],
      paddingVertical:   theme.spacing[4],
      paddingHorizontal: layout.screenPadding,
      borderTopWidth:    1,
      borderTopColor:    theme.colors.border,
      marginTop:         theme.spacing[2],
    },

    modalCreateBtnIconWrapper: {
      width:           36,
      height:          36,
      borderRadius:    18,
      backgroundColor: theme.colors.primaryLight,
      alignItems:      'center',
      justifyContent:  'center',
    },

    modalCreateBtnText: {
      fontSize:   theme.typography.size.base,
      fontWeight: '600',
      color:      theme.colors.primary,
    },
  });