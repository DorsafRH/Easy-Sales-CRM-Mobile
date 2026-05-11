/**
 * @file FactureDetailScreen.styles.ts
 * @description Styles de la fiche detail d'une facture.
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
    headerInfo: { flex: 1 },
    headerNumero: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },
    headerDate: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
      marginTop: 2,
    },

    // ── Hero ──────────────────────────────────────────────────
    heroSection: {
      paddingHorizontal: layout.screenPadding,
      paddingVertical:   theme.spacing[5],
      alignItems:        'center',
      rowGap:            theme.spacing[1],
    },
    heroLabel: {
      fontSize:      theme.typography.size.xs,
      fontWeight:    '600',
      color:         theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    heroMontant: {
      fontSize:   theme.typography.size['3xl'],
      fontWeight: '800',
      color:      theme.colors.textPrimary,
    },
    heroStatut: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[1],
      borderRadius:      theme.radius.full,
      marginTop:         theme.spacing[1],
    },
    heroStatutText: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
    },

    // ── Sections ──────────────────────────────────────────────
    section: {
      paddingHorizontal: layout.screenPadding,
      marginTop:         theme.spacing[4],
    },
    sectionTitle: {
      fontSize:      theme.typography.size.xs,
      fontWeight:    '700',
      color:         theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom:  theme.spacing[2],
    },
    card: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      overflow:        'hidden',
    },
    infoRow: {
      flexDirection:     'row',
      justifyContent:    'space-between',
      alignItems:        'center',
      paddingHorizontal: theme.spacing[4],
      paddingVertical:   theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },
    infoRowLast:  { borderBottomWidth: 0 },
    infoLabel:    { fontSize: theme.typography.size.sm, color: theme.colors.textSecondary },
    infoValue: {
      flex: 1, fontSize: theme.typography.size.sm, fontWeight: '500',
      color: theme.colors.textPrimary, textAlign: 'right', marginLeft: theme.spacing[4],
    },

    // ── Lignes ────────────────────────────────────────────────
    ligneItem: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical:   theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },
    ligneTopRow: {
      flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2,
    },
    ligneNom: {
      flex: 1, fontSize: theme.typography.size.sm, fontWeight: '600',
      color: theme.colors.textPrimary, marginRight: theme.spacing[2],
    },
    ligneMontant: {
      fontSize: theme.typography.size.sm, fontWeight: '700', color: theme.colors.primary,
    },
    ligneSub: { fontSize: theme.typography.size.xs, color: theme.colors.textSecondary },

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
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },
    totalLabel: { fontSize: theme.typography.size.sm, color: theme.colors.textSecondary },
    totalValue: {
      fontSize: theme.typography.size.sm, fontWeight: '500', color: theme.colors.textPrimary,
    },
    totalTtcRow: {
      flexDirection:     'row',
      justifyContent:    'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical:   theme.spacing[4],
      backgroundColor:   theme.colors.primary,
    },
    totalTtcLabel: {
      fontSize: theme.typography.size.base, fontWeight: '700', color: theme.colors.white,
    },
    totalTtcValue: {
      fontSize: theme.typography.size.lg, fontWeight: '800', color: theme.colors.white,
    },

    // ── Alertes echeance ──────────────────────────────────────
    echeanceAlert: {
      flexDirection:     'row',
      alignItems:        'center',
      columnGap:         theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      paddingVertical:   theme.spacing[3],
      borderRadius:      theme.radius.lg,
      borderWidth:       1,
    },
    echeanceText: {
      flex:       1,
      fontSize:   theme.typography.size.sm,
      fontWeight: '500',
    },

    // ── Actions ───────────────────────────────────────────────
    actionsSection: {
      paddingHorizontal: layout.screenPadding,
      marginTop:         theme.spacing[4],
      rowGap:            theme.spacing[3],
    },
    primaryBtn: {
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'center', columnGap: theme.spacing[2],
      paddingVertical: theme.spacing[4], borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.primary,
    },
    primaryBtnText: {
      fontSize: theme.typography.size.base, fontWeight: '700', color: theme.colors.white,
    },
    successBtn: {
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'center', columnGap: theme.spacing[2],
      paddingVertical: theme.spacing[4], borderRadius: theme.radius.xl,
      backgroundColor: '#16A34A',
    },
    successBtnText: {
      fontSize: theme.typography.size.base, fontWeight: '700', color: theme.colors.white,
    },
    dangerBtn: {
      alignItems: 'center', paddingVertical: theme.spacing[3],
      borderRadius: theme.radius.xl, borderWidth: 1, borderColor: theme.colors.danger,
    },
    dangerBtnText: {
      fontSize: theme.typography.size.sm, fontWeight: '600', color: theme.colors.danger,
    },
    pdfBtn: {
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'center', columnGap: theme.spacing[2],
      paddingVertical: theme.spacing[3], borderRadius: theme.radius.xl,
      borderWidth: 1, borderColor: theme.colors.border,
      backgroundColor: theme.colors.bgSurface,
    },
    pdfBtnText: {
      fontSize: theme.typography.size.sm, fontWeight: '600', color: theme.colors.textSecondary,
    },

    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  });
