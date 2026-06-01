/**
 * @file DevisFormScreen.styles.ts
 * @description Styles du formulaire creation/edition d'un devis avec lignes produits.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';
import { layout } from '../../theme/dimensions';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safe:    { flex: 1, backgroundColor: theme.colors.bgApp },
    scroll:  { flex: 1 },
    content: { flexGrow: 1, paddingBottom: theme.spacing[12] },

    // ── Header ────────────────────────────────────────────────
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
      width:           40,
      height:          40,
      borderRadius:    20,
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

    // ── Sections ──────────────────────────────────────────────
    section: {
      paddingHorizontal: layout.screenPadding,
      marginTop:         theme.spacing[5],
    },
    sectionTitle: {
      fontSize:      theme.typography.size.xs,
      fontWeight:    '700',
      color:         theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom:  theme.spacing[3],
    },
    fieldGroup: { rowGap: theme.spacing[4] },

    // ── Lignes produits ───────────────────────────────────────
    lignesCard: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      overflow:        'hidden',
    },
    ligneItem: {
      padding:           theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },
    ligneHeader: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginBottom:   theme.spacing[3],
    },
    ligneNumero: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },
    ligneDeleteBtn: {
      width:           30,
      height:          30,
      borderRadius:    15,
      backgroundColor: '#FEF2F2',
      alignItems:      'center',
      justifyContent:  'center',
    },
    ligneFields: { rowGap: theme.spacing[3] },
    ligneRow: {
      flexDirection: 'row',
      columnGap:     theme.spacing[3],
    },
    ligneFieldHalf: { flex: 1 },

    // ── Produit selecteur ─────────────────────────────────────
    produitSelectBtn: {
      borderWidth:   1,
      borderColor:   theme.colors.border,
      borderRadius:  theme.radius.md,
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[3],
      backgroundColor: theme.colors.bgSurface,
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
    },
    produitSelectLabel: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
      marginBottom: theme.spacing[1],
    },
    produitSelectText: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
    },
    produitSelectTextActif: {
      color:      theme.colors.textPrimary,
      fontWeight: '500',
    },

    // ── Total recap ───────────────────────────────────────────
    totalRecap: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      overflow:        'hidden',
    },
    totalRow: {
      flexDirection:     'row',
      justifyContent:    'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical:   theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },
    totalLabel: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
    },
    totalValue: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '500',
      color:      theme.colors.textPrimary,
    },
    totalTtcRow: {
      flexDirection:     'row',
      justifyContent:    'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical:   theme.spacing[4],
      backgroundColor:   theme.colors.primary,
    },
    totalTtcLabel: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      theme.colors.white,
    },
    totalTtcValue: {
      fontSize:   theme.typography.size.lg,
      fontWeight: '800',
      color:      theme.colors.white,
    },

    // ── Ajouter ligne ─────────────────────────────────────────
    addLigneBtn: {
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'center',
      columnGap:       theme.spacing[2],
      paddingVertical: theme.spacing[3],
      margin:          theme.spacing[2],
      borderRadius:    theme.radius.md,
      borderWidth:     1,
      borderStyle:     'dashed',
      borderColor:     theme.colors.primary,
    },
    addLigneBtnText: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.primary,
    },

    // ── Picker produits ───────────────────────────────────────
    pickerOverlay: {
      flex:            1,
      backgroundColor: theme.colors.overlay,
      justifyContent:  'flex-end',
    },
    pickerSheet: {
      backgroundColor:      theme.colors.bgSurface,
      borderTopLeftRadius:  theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      maxHeight:            '70%',
    },
    pickerHeader: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      paddingHorizontal: theme.spacing[5],
      paddingVertical:   theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    pickerTitle: {
      fontSize:   theme.typography.size.lg,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },
    pickerCloseBtn: {
      width:           36,
      height:          36,
      borderRadius:    18,
      backgroundColor: theme.colors.bgApp,
      alignItems:      'center',
      justifyContent:  'center',
    },
    pickerItem: {
      flexDirection:     'row',
      alignItems:        'center',
      paddingHorizontal: theme.spacing[5],
      paddingVertical:   theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
      columnGap:         theme.spacing[3],
    },
    pickerItemNom: {
      flex:       1,
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },
    pickerItemPrix: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.primary,
    },

    // ── Warnings inline ───────────────────────────────────────
    stockRuptureWarning: {
      flexDirection:     'row',
      alignItems:        'center',
      columnGap:         4,
      backgroundColor:   theme.colors.warningLight,
      borderRadius:      theme.radius.md,
      paddingHorizontal: theme.spacing[2],
      paddingVertical:   theme.spacing[1],
      marginTop:         theme.spacing[1],
    },
    stockRuptureText: {
      flex:       1,
      fontSize:   theme.typography.size.xs,
      color:      theme.colors.warning,
      fontWeight: '600',
    },
    doublonWarningText: {
      fontSize:   theme.typography.size.xs,
      color:      theme.colors.warning,
      marginTop:  theme.spacing[1],
    },

    // ── Actions ───────────────────────────────────────────────
    submitSection: {
      paddingHorizontal: layout.screenPadding,
      marginTop:         theme.spacing[6],
      rowGap:            theme.spacing[3],
    },
    submitBtn: {
      backgroundColor: theme.colors.primary,
      borderRadius:    theme.radius.xl,
      paddingVertical: theme.spacing[4],
      alignItems:      'center',
    },
    submitBtnDisabled: { opacity: 0.5 },
    submitBtnText: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      theme.colors.white,
    },
    cancelBtn: {
      alignItems:      'center',
      paddingVertical: theme.spacing[3],
    },
    cancelBtnText: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
    },

    // ── Client pré-sélectionné ────────────────────────────────
    clientFixeBanner: {
      flexDirection:     'row',
      alignItems:        'center',
      columnGap:         theme.spacing[2],
      backgroundColor:   theme.colors.primaryLight,
      borderRadius:      theme.radius.md,
      paddingHorizontal: theme.spacing[4],
      paddingVertical:   theme.spacing[3],
      marginHorizontal:  layout.screenPadding,
      marginBottom:      theme.spacing[2],
      borderWidth:       1,
      borderColor:       theme.colors.primary,
    },
    clientFixeText: {
      flex:       1,
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.primary,
    },
  });
