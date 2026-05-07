/**
 * @file DashboardScreen.styles.ts
 * @description Styles du tableau de bord principal.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme }   from '../../theme';
import { layout }     from '../../theme/dimensions';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({

    safe:    { flex: 1, backgroundColor: theme.colors.bgApp },
    scroll:  { flex: 1 },
    content: { flexGrow: 1, paddingBottom: theme.spacing[10] },

    // ── Hero ─────────────────────────────────────────────────
    hero: {
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[5],
      paddingBottom:     theme.spacing[8],
    },

    heroTopRow: {
      flexDirection:  'row',
      justifyContent: 'space-between',
      alignItems:     'flex-start',
      marginBottom:   theme.spacing[5],
    },

    heroGreeting: {
      fontSize:     theme.typography.size.sm,
      color:        'rgba(255,255,255,0.8)',
      marginBottom: 2,
    },

    heroName: {
      fontSize:   theme.typography.size.xl,
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

    caLabel: {
      fontSize:     theme.typography.size.sm,
      color:        'rgba(255,255,255,0.75)',
      marginBottom: theme.spacing[1],
    },

    caValue: {
      fontSize:     theme.typography.size['3xl'],
      fontWeight:   '800',
      color:        theme.colors.white,
      marginBottom: theme.spacing[1],
    },

    caUnit: {
      fontSize:   theme.typography.size.lg,
      fontWeight: '600',
      color:      theme.colors.white,
    },

    caLoadingRow: {
      flexDirection: 'row',
      alignItems:    'center',
      columnGap:     theme.spacing[2],
      height:        52,
      marginBottom:  theme.spacing[1],
    },

    caLoadingText: {
      fontSize:   theme.typography.size.sm,
      color:      'rgba(255,255,255,0.75)',
      fontWeight: '500',
    },

    caEvolution: {
      flexDirection: 'row',
      alignItems:    'center',
      columnGap:     theme.spacing[1],
      marginBottom:  theme.spacing[4],
    },

    caEvolutionText: {
      fontSize:   theme.typography.size.sm,
      color:      'rgba(255,255,255,0.85)',
      fontWeight: '500',
    },

    periodeSelector: {
      flexDirection:   'row',
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius:    theme.radius.lg,
      padding:         3,
    },

    periodeBtn: {
      flex:            1,
      paddingVertical: theme.spacing[2],
      alignItems:      'center',
      borderRadius:    theme.radius.md,
    },

    periodeBtnActive: { backgroundColor: theme.colors.white },

    periodeBtnText: {
      fontSize:   theme.typography.size.xs,
      fontWeight: '600',
      color:      'rgba(255,255,255,0.75)',
    },

    periodeBtnTextActive: { color: '#1E40AF' },

    // ── KPIs ─────────────────────────────────────────────────
    kpisRow: {
      flexDirection:     'row',
      paddingHorizontal: layout.screenPadding,
      columnGap:         theme.spacing[3],
      marginTop:         -theme.spacing[5],
      marginBottom:      theme.spacing[4],
    },

    kpiCard: {
      flex:            1,
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      borderWidth:     1,
      borderColor:     theme.colors.border,
      shadowColor:     '#000',
      shadowOffset:    { width: 0, height: 2 },
      shadowOpacity:   0.08,
      shadowRadius:    4,
      elevation:       3,
      minHeight:       72,
      justifyContent:  'center',
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

    // ── Actions rapides ───────────────────────────────────────
    actionsGrid: { flexDirection: 'row', columnGap: theme.spacing[3] },

    actionItem: {
      flex:            1,
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.xl,
      paddingVertical: theme.spacing[4],
      alignItems:      'center',
      rowGap:          theme.spacing[2],
      borderWidth:     1,
      borderColor:     theme.colors.border,
      shadowColor:     '#000',
      shadowOffset:    { width: 0, height: 1 },
      shadowOpacity:   0.05,
      shadowRadius:    3,
      elevation:       1,
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

    // ── Activité récente ──────────────────────────────────────
    activiteItem: {
      flexDirection:     'row',
      alignItems:        'center',
      columnGap:         theme.spacing[3],
      paddingVertical:   theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },

    activiteIconWrapper: {
      width:          42,
      height:         42,
      borderRadius:   21,
      alignItems:     'center',
      justifyContent: 'center',
    },

    activiteContent: { flex: 1 },

    activiteTitre: {
      fontSize:     theme.typography.size.sm,
      fontWeight:   '600',
      color:        theme.colors.textPrimary,
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

    // ── Réunions du jour ──────────────────────────────────────
    reunionDuJourItem: {
      flexDirection:     'row',
      alignItems:        'center',
      paddingVertical:   theme.spacing[3],
      columnGap:         theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },

    reunionDuJourHeure: {
      width:      50,
      alignItems: 'center',
    },

    reunionDuJourHeureTxt: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.primary,
    },

    reunionDuJourDureeTxt: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textTertiary,
    },

    reunionDuJourInfo: { flex: 1 },

    reunionDuJourTitre: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
      marginBottom: 2,
    },

    reunionDuJourClient: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },

    reunionDuJourStatut: {
      paddingHorizontal: 6,
      paddingVertical:   2,
      borderRadius:      theme.radius.full,
    },

    reunionDuJourStatutTxt: {
      fontSize:   9,
      fontWeight: '700',
    },

    reunionDuJourVide: {
      paddingVertical: theme.spacing[4],
      alignItems:      'center',
    },

    reunionDuJourVideTxt: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textTertiary,
    },

    // ── Carte ─────────────────────────────────────────────────
    card: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      padding:         theme.spacing[4],
      shadowColor:     '#000',
      shadowOffset:    { width: 0, height: 1 },
      shadowOpacity:   0.05,
      shadowRadius:    3,
      elevation:       1,
    },

    // ── Chargement ────────────────────────────────────────────
    loadingContainer: {
      flex:            1,
      alignItems:      'center',
      justifyContent:  'center',
      paddingVertical: theme.spacing[12],
    },

    loadingText: {
      fontSize:  theme.typography.size.sm,
      color:     theme.colors.textSecondary,
      marginTop: theme.spacing[3],
    },
  });