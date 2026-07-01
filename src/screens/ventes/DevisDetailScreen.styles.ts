/**
 * @file DevisDetailScreen.styles.ts
 * @description Styles de la fiche devis avec lignes produits.
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
    headerInfo: { flex: 1 },
    headerNumero: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },
    headerDate: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },

    section: {
      paddingHorizontal: layout.screenPadding,
      marginTop:         theme.spacing[4],
    },
    card: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      overflow:        'hidden',
    },
    cardTitle: {
      fontSize:          theme.typography.size.sm,
      fontWeight:        '700',
      color:             theme.colors.textSecondary,
      textTransform:     'uppercase',
      letterSpacing:     0.8,
      paddingHorizontal: theme.spacing[4],
      paddingTop:        theme.spacing[4],
      paddingBottom:     theme.spacing[3],
    },

    infoRow: {
      flexDirection:     'row',
      justifyContent:    'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical:   theme.spacing[3],
      borderTopWidth:    1,
      borderTopColor:    theme.colors.bgApp,
    },
    infoLabel: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
    },
    infoValue: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '500',
      color:      theme.colors.textPrimary,
    },

    // ── Lignes devis ──────────────────────────────────────────
    ligneItem: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical:   theme.spacing[3],
      borderTopWidth:    1,
      borderTopColor:    theme.colors.bgApp,
    },
    ligneTopRow: {
      flexDirection:  'row',
      justifyContent: 'space-between',
      marginBottom:   2,
    },
    ligneNom: {
      flex:       1,
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
      marginRight: theme.spacing[2],
    },
    ligneMontant: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.primary,
    },
    ligneSub: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },

    // ── Totaux ────────────────────────────────────────────────
    totauxCard: {
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
      borderTopWidth:    1,
      borderTopColor:    theme.colors.bgApp,
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

    // ── Actions ───────────────────────────────────────────────
    actionsSection: {
      paddingHorizontal: layout.screenPadding,
      marginTop:         theme.spacing[4],
      rowGap:            theme.spacing[3],
    },
    actionRow: {
      flexDirection: 'row',
      columnGap:     theme.spacing[3],
    },
    actionBtn: {
      flex:            1,
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'center',
      columnGap:       theme.spacing[2],
      paddingVertical: theme.spacing[3],
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      backgroundColor: theme.colors.bgSurface,
    },
    actionBtnText: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textSecondary,
    },
    btnPrimary: {
      backgroundColor: theme.colors.primary,
      borderRadius:    theme.radius.xl,
      paddingVertical: theme.spacing[4],
      alignItems:      'center',
      flexDirection:   'row',
      justifyContent:  'center',
      columnGap:       theme.spacing[2],
    },
    btnPrimaryText: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      theme.colors.white,
    },
    btnSecondary: {
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'center',
      columnGap:       theme.spacing[2],
      paddingVertical: theme.spacing[3],
      borderRadius:    theme.radius.xl,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      backgroundColor: theme.colors.bgSurface,
    },
    btnSecondaryText: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textSecondary,
    },
    btnDanger: {
      borderRadius:    theme.radius.xl,
      paddingVertical: theme.spacing[3],
      alignItems:      'center',
      borderWidth:     1,
      borderColor:     theme.colors.danger,
    },
    btnDangerText: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.danger,
    },
    infoOppRow: {
      flexDirection:   'row',
      alignItems:      'center',
      columnGap:       theme.spacing[2],
      paddingVertical: theme.spacing[1],
      paddingHorizontal: theme.spacing[1],
    },
    infoOppText: {
      flex:       1,
      fontSize:   theme.typography.size.xs,
      color:      theme.colors.textTertiary,
      lineHeight: 16,
    },
    loadingContainer: {
      flex: 1, alignItems: 'center', justifyContent: 'center',
    },
  });