/**
 * @file OpportuniteDetailScreen.styles.ts
 * @description Styles de la fiche detail d'une opportunite.
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
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: theme.colors.bgApp,
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 1, borderColor: theme.colors.border,
    },
    headerInfo: { flex: 1 },
    headerTitre: {
      fontSize: theme.typography.size.base,
      fontWeight: '700', color: theme.colors.textPrimary,
    },
    headerSub: {
      fontSize: theme.typography.size.xs,
      color: theme.colors.textSecondary, marginTop: 2,
    },
    editBtn: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: theme.colors.bgApp,
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 1, borderColor: theme.colors.border,
    },

    // ── Hero montant ──────────────────────────────────────────
    heroSection: {
      backgroundColor:   theme.colors.primary,
      paddingHorizontal: layout.screenPadding,
      paddingVertical:   theme.spacing[5],
      alignItems:        'center',
      rowGap:            theme.spacing[1],
    },
    heroLabel: {
      fontSize:   theme.typography.size.xs,
      fontWeight: '600',
      color:      'rgba(255,255,255,0.7)',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    heroMontant: {
      fontSize:   theme.typography.size['3xl'],
      fontWeight: '800',
      color:      theme.colors.white,
    },
    heroProbabilite: {
      fontSize:   theme.typography.size.sm,
      color:      'rgba(255,255,255,0.8)',
    },

    // ── Statut pills ──────────────────────────────────────────
    statutRow: {
      flexDirection:     'row',
      paddingHorizontal: layout.screenPadding,
      paddingVertical:   theme.spacing[3],
      backgroundColor:   theme.colors.bgSurface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      columnGap:         theme.spacing[2],
      flexWrap:          'wrap',
    },
    statutPill: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[1],
      borderRadius:      theme.radius.full,
    },
    statutPillText: {
      fontSize:   theme.typography.size.xs,
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

    // ── Actions ───────────────────────────────────────────────
    actionsSection: {
      paddingHorizontal: layout.screenPadding,
      marginTop:         theme.spacing[4],
      rowGap:            theme.spacing[3],
    },
    primaryBtn: {
      flexDirection:   'row', alignItems: 'center',
      justifyContent:  'center', columnGap: theme.spacing[2],
      paddingVertical: theme.spacing[4],
      borderRadius:    theme.radius.xl,
      backgroundColor: theme.colors.primary,
    },
    primaryBtnText: {
      fontSize: theme.typography.size.base, fontWeight: '700',
      color: theme.colors.white,
    },
    actionRow: { flexDirection: 'row', columnGap: theme.spacing[3] },
    actionBtn: {
      flex: 1, flexDirection: 'row', alignItems: 'center',
      justifyContent: 'center', columnGap: theme.spacing[2],
      paddingVertical: theme.spacing[3], borderRadius: theme.radius.lg,
      borderWidth: 1, borderColor: theme.colors.border,
      backgroundColor: theme.colors.bgSurface,
    },
    actionBtnText: { fontSize: theme.typography.size.sm, fontWeight: '600' },

    // ── Timeline ──────────────────────────────────────────────
    timelineCard: {
      backgroundColor: theme.colors.bgSurface, borderRadius: theme.radius.lg,
      borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing[4],
    },
    addActiviteBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      columnGap: theme.spacing[2], paddingVertical: theme.spacing[3],
      borderRadius: theme.radius.md, borderWidth: 1,
      borderStyle: 'dashed', borderColor: theme.colors.border, marginTop: theme.spacing[3],
    },
    addActiviteBtnText: { fontSize: theme.typography.size.sm, color: theme.colors.textTertiary },

    emptyTimeline: { alignItems: 'center', paddingVertical: theme.spacing[4] },
    emptyTimelineText: { fontSize: theme.typography.size.sm, color: theme.colors.textTertiary },

    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  });
