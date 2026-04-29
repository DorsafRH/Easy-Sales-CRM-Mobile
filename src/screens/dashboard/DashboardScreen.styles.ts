/**
 * @file DashboardScreen.styles.ts
 * @description Styles du tableau de bord principal (Dashboard).
 *              Design : fusion Var A + Var B des mockups :
 *              - Hero metric CA en haut (bandeau dégradé bleu)
 *              - 3 mini KPIs en ligne dessous
 *              - Sélecteur période
 *              - Actions rapides en grille
 *              - Activité récente
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

    scroll: { flex: 1 },

    content: {
      flexGrow:      1,
      paddingBottom: theme.spacing[10],
    },

    // ── Hero header bleu ──────────────────────────────────────
    hero: {
      backgroundColor:   theme.colors.primary,
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[5],
      paddingBottom:     theme.spacing[8],
    },

    heroTopRow: {
      flexDirection:  'row',
      justifyContent: 'space-between',
      alignItems:     'flex-start',
      marginBottom:   theme.spacing[6],
    },

    heroGreeting: {
      fontSize:   theme.typography.size.sm,
      color:      'rgba(255,255,255,0.75)',
      marginBottom: 2,
    },

    heroName: {
      fontSize:   theme.typography.size.lg,
      fontWeight: '700',
      color:      theme.colors.white,
    },

    heroAvatarBtn: {
      width:           40,
      height:          40,
      borderRadius:    20,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems:      'center',
      justifyContent:  'center',
    },

    // ── CA metric ─────────────────────────────────────────────
    caLabel: {
      fontSize: theme.typography.size.sm,
      color:    'rgba(255,255,255,0.75)',
      marginBottom: theme.spacing[1],
    },

    caValue: {
      fontSize:     theme.typography.size['3xl'],
      fontWeight:   '800',
      color:        theme.colors.white,
      marginBottom: theme.spacing[1],
    },

    caUnit: {
      fontSize:    theme.typography.size.lg,
      fontWeight:  '600',
      color:       theme.colors.white,
    },

    caEvolution: {
      flexDirection: 'row',
      alignItems:    'center',
      columnGap:     theme.spacing[1],
    },

    caEvolutionText: {
      fontSize:   theme.typography.size.sm,
      color:      'rgba(255,255,255,0.85)',
      fontWeight: '500',
    },

    // ── Sélecteur période ──────────────────────────────────────
    periodeSelector: {
      flexDirection:     'row',
      backgroundColor:   'rgba(255,255,255,0.15)',
      borderRadius:      theme.radius.lg,
      padding:           3,
      marginTop:         theme.spacing[4],
    },

    periodeBtn: {
      flex:           1,
      paddingVertical: theme.spacing[2],
      alignItems:     'center',
      borderRadius:   theme.radius.md,
    },

    periodeBtnActive: {
      backgroundColor: theme.colors.white,
    },

    periodeBtnText: {
      fontSize:   theme.typography.size.xs,
      fontWeight: '600',
      color:      'rgba(255,255,255,0.75)',
    },

    periodeBtnTextActive: {
      color: theme.colors.primary,
    },

    // ── Mini KPIs ─────────────────────────────────────────────
    kpisRow: {
      flexDirection:     'row',
      paddingHorizontal: layout.screenPadding,
      columnGap:         theme.spacing[3],
      marginTop:         -theme.spacing[5],
      marginBottom:      theme.spacing[4],
    },

    kpiCard: {
      flex:              1,
      backgroundColor:   theme.colors.bgSurface,
      borderRadius:      theme.radius.lg,
      padding:           theme.spacing[4],
      borderWidth:       1,
      borderColor:       theme.colors.border,
      shadowColor:       theme.colors.black,
      shadowOffset:      { width: 0, height: 2 },
      shadowOpacity:     0.06,
      shadowRadius:      4,
      elevation:         2,
    },

    kpiValue: {
      fontSize:     theme.typography.size.xl,
      fontWeight:   '700',
      color:        theme.colors.primary,
      marginBottom: 2,
    },

    kpiLabel: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },

    // ── Sections ─────────────────────────────────────────────
    section: {
      paddingHorizontal: layout.screenPadding,
      marginBottom:      theme.spacing[5],
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

    voirToutBtn: {
      fontSize:   theme.typography.size.sm,
      color:      theme.colors.primary,
      fontWeight: '600',
    },

    // ── Actions rapides ──────────────────────────────────────
    actionsGrid: {
      flexDirection: 'row',
      columnGap:     theme.spacing[3],
    },

    actionItem: {
      flex:            1,
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      alignItems:      'center',
      rowGap:          theme.spacing[2],
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },

    actionIconWrapper: {
      width:           44,
      height:          44,
      borderRadius:    theme.radius.md,
      backgroundColor: theme.colors.primaryLight,
      alignItems:      'center',
      justifyContent:  'center',
    },

    actionLabel: {
      fontSize:  theme.typography.size.xs,
      color:     theme.colors.textSecondary,
      fontWeight: '500',
      textAlign: 'center',
    },

    // ── Activité récente ──────────────────────────────────────
    activiteItem: {
      flexDirection:   'row',
      alignItems:      'center',
      columnGap:       theme.spacing[3],
      paddingVertical: theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },

    activiteContent: {
      flex: 1,
    },

    activiteTitre: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
      marginBottom: 2,
    },

    activiteSoustitre: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },

    activiteDate: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textTertiary,
    },

    // ── Carte ────────────────────────────────────────────────
    card: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      padding:         theme.spacing[4],
      shadowColor:     theme.colors.black,
      shadowOffset:    { width: 0, height: 1 },
      shadowOpacity:   0.05,
      shadowRadius:    3,
      elevation:       1,
    },

    // ── Chargement ────────────────────────────────────────────
    loadingContainer: {
      flex:           1,
      alignItems:     'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing[12],
    },

    loadingText: {
      fontSize:  theme.typography.size.sm,
      color:     theme.colors.textSecondary,
      marginTop: theme.spacing[3],
    },
  });