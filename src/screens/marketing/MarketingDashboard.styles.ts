/**
 * @file MarketingDashboard.styles.ts
 * @description Styles du tableau de bord statistiques marketing.
 *              Aligné sur le langage visuel du dashboard Ventes (cartes à accent,
 *              ombres douces, sections aérées).
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    content: {
      padding: theme.spacing[4],
      paddingBottom: theme.spacing[10],
      rowGap: theme.spacing[2],
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing[8],
    },

    // ── Titres de section ────────────────────────────────────────
    sectionTitle: {
      fontSize: theme.typography.size.base,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginTop: theme.spacing[3],
      marginBottom: theme.spacing[1],
    },
    sectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 6,
      marginTop: theme.spacing[3],
      marginBottom: theme.spacing[1],
    },
    sectionTitleInline: {
      fontSize: theme.typography.size.base,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },

    // ── Carte générique (état vide, besoins IA) ───────────────────
    card: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    vide: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.textTertiary,
      textAlign: 'center',
      paddingVertical: theme.spacing[4],
    },

    // ── Grille KPI (2×2, accent coloré à gauche) ─────────────────
    kpiGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: theme.spacing[3],
      rowGap: theme.spacing[3],
    },
    kpiCard: {
      width: '47%',
      backgroundColor: theme.colors.bgSurface,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderLeftWidth: 3,
      padding: theme.spacing[4],
      rowGap: theme.spacing[1],
      minHeight: 92,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    kpiValue: {
      fontSize: 22,
      fontWeight: '700',
      marginTop: theme.spacing[1],
    },
    kpiLabel: {
      fontSize: theme.typography.size.xs,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },

    // ── Publications (une carte, 3 colonnes) ─────────────────────
    pubCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.bgSurface,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: theme.spacing[4],
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    pubStat: {
      flex: 1,
      alignItems: 'center',
      rowGap: 2,
    },
    pubStatValue: {
      fontSize: theme.typography.size.xl,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    pubStatLabel: {
      fontSize: theme.typography.size.xs,
      color: theme.colors.textSecondary,
    },
    pubDivider: {
      width: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing[1],
    },

    // ── Réactions par publication (cartes individuelles) ─────────
    reactionsList: {
      rowGap: theme.spacing[3],
    },
    reactionCard: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius: theme.radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      padding: theme.spacing[4],
      rowGap: theme.spacing[2],
    },
    engHead: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      columnGap: theme.spacing[3],
    },
    engLabel: {
      flex: 1,
      fontSize: theme.typography.size.sm,
      fontWeight: '500',
      color: theme.colors.textPrimary,
      lineHeight: 18,
    },
    engTotalBox: {
      alignItems: 'flex-end',
    },
    engTotalValue: {
      fontSize: 20,
      fontWeight: '500',
      color: theme.colors.textPrimary,
    },
    engTotalLabel: {
      fontSize: 11,
      color: theme.colors.textTertiary,
      marginTop: -2,
    },
    barRow: {
      flexDirection: 'row',
    },
    bar: {
      height: 8,
      flexDirection: 'row',
      borderRadius: 4,
      overflow: 'hidden',
      backgroundColor: theme.colors.bgApp,
    },
    engChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: theme.spacing[4],
      rowGap: theme.spacing[1],
    },
    engChip: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 3,
    },
    engChipNum: {
      fontSize: theme.typography.size.xs,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },

    // ── Derniers besoins ─────────────────────────────────────────
    besoinRow: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.bgApp,
      paddingTop: theme.spacing[3],
      marginTop: theme.spacing[3],
      rowGap: 3,
    },
    besoinRowFirst: {
      borderTopWidth: 0,
      paddingTop: 0,
      marginTop: 0,
    },
    besoinHead: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      columnGap: theme.spacing[2],
    },
    besoinNom: {
      flex: 1,
      fontSize: theme.typography.size.sm,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    scoreBadge: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical: 2,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.successLight,
    },
    scoreText: {
      fontSize: theme.typography.size.xs,
      fontWeight: '700',
      color: theme.colors.successText,
    },
    besoinTexte: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.textSecondary,
    },
    besoinDate: {
      fontSize: theme.typography.size.xs,
      color: theme.colors.textTertiary,
    },
  });