/**
 * @file PublicationStatsSection.styles.ts
 * @description Styles de la section statistiques Facebook d'une publication (style Meta Business Suite).
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    // ────────────────── Conteneur général ──────────────────
    container: {
      marginTop: theme.spacing[5],
      rowGap:    theme.spacing[5],
    },
    sectionTitre: {
      fontSize:      theme.typography.size.sm,
      fontWeight:    '700',
      color:         theme.colors.textSecondary,
      textTransform: 'uppercase',
      marginBottom:  theme.spacing[3],
    },

    // ────────────────── Overview (cartes horizontales) ──────────────────
    cardsRow: {
      flexDirection: 'row',
      columnGap:     theme.spacing[3],
      paddingRight:  theme.spacing[3],
    },
    card: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    12,
      padding:         16,
      minWidth:        120,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      rowGap:          theme.spacing[2],
    },
    cardLabelRow: {
      flexDirection: 'row',
      alignItems:    'center',
      columnGap:     theme.spacing[1],
    },
    cardLabel: {
      fontSize: 12,
      color:    theme.colors.textTertiary,
    },
    cardValue: {
      fontSize:   24,
      fontWeight: 'bold',
      color:      theme.colors.textPrimary,
    },
    trendRow: {
      flexDirection: 'row',
      alignItems:    'flex-start',
      columnGap:     theme.spacing[2],
      marginTop:     theme.spacing[3],
    },
    trendText: {
      flex:       1,
      fontSize:   theme.typography.size.sm,
      lineHeight: 18,
    },

    // ────────────────── Bloc Views ──────────────────
    block: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      borderWidth:     1,
      borderColor:     theme.colors.border,
      rowGap:          theme.spacing[3],
    },
    blockTitleRow: {
      flexDirection: 'row',
      alignItems:    'center',
      columnGap:     theme.spacing[1],
    },
    blockTitle: {
      fontSize:   theme.typography.size.md,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },
    bigNumber: {
      fontSize:   theme.typography.size['2xl'],
      fontWeight: 'bold',
      color:      theme.colors.textPrimary,
    },
    tabsRow: {
      flexDirection: 'row',
      columnGap:     theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tab: {
      paddingBottom: theme.spacing[2],
    },
    tabActive: {
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary,
    },
    tabText: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textSecondary,
    },
    tabTextActive: {
      color: theme.colors.primary,
    },
    tabDisabled: {
      opacity: 0.4,
    },
    chartWrapper: {
      marginLeft: -theme.spacing[3],
    },
    legendColumn: {
      rowGap:    theme.spacing[2],
      marginTop: theme.spacing[2],
    },
    legendRow: {
      flexDirection: 'row',
      alignItems:    'center',
      columnGap:     theme.spacing[2],
    },
    legendLine: {
      width:        18,
      borderRadius: 2,
    },
    legendText: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
    },

    // ────────────────── Bloc Interactions ──────────────────
    mutedText: {
      fontSize:   theme.typography.size.sm,
      color:      theme.colors.textSecondary,
      lineHeight: 18,
    },
    subCardsRow: {
      flexDirection: 'row',
      columnGap:     theme.spacing[2],
      paddingRight:  theme.spacing[2],
    },
    subCard: {
      backgroundColor: theme.colors.bgApp,
      borderRadius:    12,
      padding:         theme.spacing[3],
      minWidth:        100,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      rowGap:          theme.spacing[1],
    },
    subCardLabel: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textTertiary,
    },
    subCardValue: {
      fontSize:   theme.typography.size.lg,
      fontWeight: 'bold',
      color:      theme.colors.textPrimary,
    },

    // ────────────────── Skeleton (chargement) ──────────────────
    skeletonRow: {
      flexDirection: 'row',
      columnGap:     theme.spacing[3],
    },
    skeletonCard: {
      width:           120,
      height:          88,
      borderRadius:    12,
      backgroundColor: theme.colors.border,
    },
    skeletonChart: {
      height:          200,
      borderRadius:    theme.radius.lg,
      backgroundColor: theme.colors.border,
      marginTop:       theme.spacing[3],
    },

    // ────────────────── Erreur ──────────────────
    errorBox: {
      alignItems:      'center',
      rowGap:          theme.spacing[2],
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },
    errorText: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
    },
    retryBtn: {
      paddingVertical:   theme.spacing[2],
      paddingHorizontal: theme.spacing[4],
      borderRadius:      theme.radius.md,
      borderWidth:       1,
      borderColor:       theme.colors.primary,
    },
    retryText: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.primary,
    },
  });
