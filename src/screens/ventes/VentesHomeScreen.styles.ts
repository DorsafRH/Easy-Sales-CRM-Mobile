/**
 * @file VentesHomeScreen.styles.ts
 * @description Styles du dashboard commercial Ventes — 4 tabs.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';
import { layout } from '../../theme/dimensions';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safe:    { flex: 1, backgroundColor: theme.colors.bgApp },
    scroll:  { flex: 1 },
    content: { flexGrow: 1, paddingBottom: theme.spacing[10] },

    // ── Header fixe ────────────────────────────────────────────
    header: {
      backgroundColor:   theme.colors.bgSurface,
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[5],
      paddingBottom:     theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize:     theme.typography.size['2xl'],
      fontWeight:   '800',
      color:        theme.colors.textPrimary,
      marginBottom: 2,
    },
    headerSub: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
    },

    // ── Barre de tabs ──────────────────────────────────────────
    tabBar: {
      flexDirection:     'row',
      backgroundColor:   theme.colors.bgSurface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tabItem: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical:   theme.spacing[3],
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabItemActive: {
      borderBottomColor: theme.colors.primary,
    },
    tabItemText: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textTertiary,
    },
    tabItemTextActive: {
      color: theme.colors.primary,
    },

    // ── Conteneur du tab (pour FAB) ────────────────────────────
    tabContent: {
      flex:     1,
      position: 'relative',
    },

    // ── KPIs ───────────────────────────────────────────────────
    kpisGrid: {
      flexDirection:     'row',
      flexWrap:          'wrap',
      columnGap:         theme.spacing[3],
      rowGap:            theme.spacing[3],
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[4],
    },
    kpiItem: {
      width: '47%',
    },

    // ── Section générique ──────────────────────────────────────
    section: {
      paddingHorizontal: layout.screenPadding,
      marginTop:         theme.spacing[5],
    },
    sectionHeader: {
      flexDirection:  'row',
      justifyContent: 'space-between',
      alignItems:     'center',
      marginBottom:   theme.spacing[3],
    },
    sectionTitle: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },
    sectionLink: {
      fontSize:   theme.typography.size.sm,
      color:      theme.colors.primary,
      fontWeight: '600',
    },

    // ── Actions rapides ────────────────────────────────────────
    actionGrid: {
      flexDirection: 'row',
      columnGap:     theme.spacing[3],
    },
    actionItem: {
      flex:            1,
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.xl,
      paddingVertical: theme.spacing[4],
      alignItems:      'center',
      rowGap:          theme.spacing[2],
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },
    actionIconWrapper: {
      width:          44,
      height:         44,
      borderRadius:   22,
      alignItems:     'center',
      justifyContent: 'center',
    },
    actionLabel: {
      fontSize:   theme.typography.size.xs,
      color:      theme.colors.textSecondary,
      fontWeight: '600',
      textAlign:  'center',
    },

    // ── Cartes récentes (Résumé) ───────────────────────────────
    recentCard: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      padding:         theme.spacing[4],
    },
    recentItem: {
      flexDirection:     'row',
      alignItems:        'center',
      paddingVertical:   theme.spacing[3],
      columnGap:         theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },
    recentItemLast: {
      borderBottomWidth: 0,
    },
    recentIconWrapper: {
      width:          40,
      height:         40,
      borderRadius:   20,
      alignItems:     'center',
      justifyContent: 'center',
    },
    recentContent: { flex: 1 },
    recentTitle: {
      fontSize:     theme.typography.size.sm,
      fontWeight:   '600',
      color:        theme.colors.textPrimary,
      marginBottom: 2,
    },
    recentSub: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },
    recentMontant: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.primary,
    },

    // ── Item liste (Leads / Pipeline / Devis) ──────────────────
    listItem: {
      flexDirection:   'row',
      alignItems:      'center',
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      marginBottom:    theme.spacing[2],
      borderWidth:     1,
      borderColor:     theme.colors.border,
      columnGap:       theme.spacing[3],
    },

    // ── Badge statut ───────────────────────────────────────────
    badge: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical:   2,
      borderRadius:      theme.radius.full,
    },
    badgeText: {
      fontSize:   10,
      fontWeight: '700',
    },

    // ── Label de groupe (Pipeline) ─────────────────────────────
    groupLabel: {
      fontSize:      theme.typography.size.xs,
      fontWeight:    '700',
      color:         theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginTop:     theme.spacing[4],
      marginBottom:  theme.spacing[2],
    },

    // ── Bouton Voir Kanban ─────────────────────────────────────
    kanbanButton: {
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'center',
      backgroundColor: theme.colors.primaryLight,
      borderRadius:    theme.radius.lg,
      paddingVertical: theme.spacing[3],
      columnGap:       theme.spacing[2],
      borderWidth:     1,
      borderColor:     theme.colors.primary,
    },
    kanbanButtonText: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.primary,
    },

    // ── FAB ────────────────────────────────────────────────────
    fab: {
      position:        'absolute',
      bottom:          theme.spacing[6],
      right:           theme.spacing[5],
      width:           56,
      height:          56,
      borderRadius:    28,
      backgroundColor: theme.colors.primary,
      alignItems:      'center',
      justifyContent:  'center',
      shadowColor:     '#000',
      shadowOffset:    { width: 0, height: 2 },
      shadowOpacity:   0.25,
      shadowRadius:    4,
      elevation:       6,
    },

    // ── Sous-titre CA ──────────────────────────────────────────
    caSubtitle: {
      fontSize:  theme.typography.size.xs,
      color:     theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing[1],
    },

    // ── Chargement ─────────────────────────────────────────────
    loadingContainer: {
      flex:            1,
      alignItems:      'center',
      justifyContent:  'center',
      paddingVertical: theme.spacing[12],
    },
  });
