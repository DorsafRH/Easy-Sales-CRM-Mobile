/**
 * @file AgendaScreen.styles.ts
 * @description Styles premium de l'écran Agenda.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme }   from '../../theme';
import { layout }     from '../../theme/dimensions';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({

    safe: { flex: 1, backgroundColor: theme.colors.bgApp },

    // ── Header gradient ──────────────────────────────────────
    headerGradient: {
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[5],
      paddingBottom:     theme.spacing[4],
    },

    headerRow: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginBottom:   theme.spacing[4],
    },

    headerTitle: {
      fontSize:   theme.typography.size['2xl'],
      fontWeight: '800',
      color:      theme.colors.white,
    },

    headerSubtitle: {
      fontSize: theme.typography.size.sm,
      color:    'rgba(255,255,255,0.75)',
      marginTop: 2,
    },

    headerAddBtn: {
      width:           44,
      height:          44,
      borderRadius:    22,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems:      'center',
      justifyContent:  'center',
    },

    // ── Sélecteur semaine ─────────────────────────────────────
    semaineRow: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginBottom:   theme.spacing[3],
    },

    semaineBtnNav: {
      width:           32,
      height:          32,
      borderRadius:    16,
      backgroundColor: 'rgba(255,255,255,0.15)',
      alignItems:      'center',
      justifyContent:  'center',
    },

    semaineLabel: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.white,
    },

    // ── Week strip ────────────────────────────────────────────
    weekStrip: {
      flexDirection:   'row',
      justifyContent:  'space-between',
      paddingVertical: theme.spacing[2],
    },

    dayBtn: {
      flex:           1,
      alignItems:     'center',
      paddingVertical: theme.spacing[2],
      borderRadius:   theme.radius.md,
    },

    dayBtnActive: {
      backgroundColor: 'rgba(255,255,255,0.25)',
    },

    dayLabel: {
      fontSize:   9,
      fontWeight: '600',
      color:      'rgba(255,255,255,0.65)',
      textTransform: 'uppercase',
      marginBottom: 4,
    },

    dayLabelActive: { color: theme.colors.white },

    dayNum: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      'rgba(255,255,255,0.8)',
    },

    dayNumActive: { color: theme.colors.white },

    dayDot: {
      width:           5,
      height:          5,
      borderRadius:    3,
      backgroundColor: 'rgba(255,255,255,0.9)',
      marginTop:       3,
    },

    dayDotHidden: { opacity: 0 },

    // ── Liste ─────────────────────────────────────────────────
    listContent: {
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[4],
      paddingBottom:     theme.spacing[16],
    },

    // ── Jour header ───────────────────────────────────────────
    jourHeader: {
      fontSize:      theme.typography.size.xs,
      fontWeight:    '700',
      color:         theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom:  theme.spacing[2],
      marginTop:     theme.spacing[4],
    },

    jourHeaderAujourdhui: {
      color: theme.colors.primary,
    },

    // ── Card réunion premium ──────────────────────────────────
    reunionCard: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.xl,
      marginBottom:    theme.spacing[3],
      overflow:        'hidden',
      shadowColor:     '#000',
      shadowOffset:    { width: 0, height: 2 },
      shadowOpacity:   0.07,
      shadowRadius:    8,
      elevation:       3,
      flexDirection:   'row',
    },

    /** Barre colorée gauche selon le statut. */
    reunionCardAccent: {
      width:        4,
      borderRadius: 0,
    },

    reunionCardBody: {
      flex:    1,
      padding: theme.spacing[4],
    },

    reunionCardTopRow: {
      flexDirection:  'row',
      alignItems:     'flex-start',
      justifyContent: 'space-between',
      marginBottom:   theme.spacing[2],
    },

    reunionHeure: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.primary,
    },

    reunionDuree: {
      fontSize:  theme.typography.size.xs,
      color:     theme.colors.textTertiary,
      marginTop: 2,
    },

    statutBadge: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical:   2,
      borderRadius:      theme.radius.full,
    },

    statutBadgeTxt: {
      fontSize:   9,
      fontWeight: '700',
    },

    reunionTitre: {
      fontSize:     theme.typography.size.base,
      fontWeight:   '700',
      color:        theme.colors.textPrimary,
      marginBottom: theme.spacing[1],
    },

    reunionMeta: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
      marginBottom: 2,
    },

    reunionLien: {
      fontSize:   theme.typography.size.xs,
      color:      theme.colors.primary,
      fontWeight: '600',
      marginTop:  2,
    },

    // ── Actions inline ────────────────────────────────────────
    reunionActions: {
      flexDirection:  'row',
      columnGap:      theme.spacing[2],
      marginTop:      theme.spacing[3],
      paddingTop:     theme.spacing[2],
      borderTopWidth: 1,
      borderTopColor: theme.colors.bgApp,
    },

    actionChip: {
      flexDirection:     'row',
      alignItems:        'center',
      columnGap:         4,
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[2],
      borderRadius:      theme.radius.lg,
      borderWidth:       1,
      borderColor:       theme.colors.border,
    },

    actionChipTxt: {
      fontSize:   theme.typography.size.xs,
      fontWeight: '600',
      color:      theme.colors.textSecondary,
    },

    actionChipWhatsApp: {
      borderColor:     '#25D366',
      backgroundColor: '#F0FFF4',
    },

    actionChipWhatsAppTxt: { color: '#16A34A' },

    actionChipEmail: {
      borderColor:     theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
    },

    actionChipEmailTxt: { color: theme.colors.primary },

    // ── FAB ───────────────────────────────────────────────────
    fab: {
      position:        'absolute',
      bottom:          theme.spacing[6],
      right:           layout.screenPadding,
      width:           56,
      height:          56,
      borderRadius:    28,
      backgroundColor: theme.colors.primary,
      alignItems:      'center',
      justifyContent:  'center',
      shadowColor:     theme.colors.primary,
      shadowOffset:    { width: 0, height: 6 },
      shadowOpacity:   0.4,
      shadowRadius:    10,
      elevation:       8,
    },

    loadingContainer: {
      flex: 1, alignItems: 'center', justifyContent: 'center',
    },
  });