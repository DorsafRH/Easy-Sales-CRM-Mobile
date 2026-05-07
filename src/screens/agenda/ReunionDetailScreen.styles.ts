/**
 * @file ReunionDetailScreen.styles.ts
 * @description Styles de la fiche détail d'une réunion.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme }   from '../../theme';
import { layout }     from '../../theme/dimensions';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({

    safe:    { flex: 1, backgroundColor: theme.colors.bgApp },
    scroll:  { flex: 1 },
    content: {
      paddingHorizontal: layout.screenPadding,
      paddingBottom:     theme.spacing[12],
      paddingTop:        theme.spacing[4],
      rowGap:            theme.spacing[4],
    },

    // ── Header gradient ───────────────────────────────────────
    headerGradient: {
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[5],
      paddingBottom:     theme.spacing[6],
    },

    headerTopRow: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginBottom:   theme.spacing[4],
    },

    headerBtn: {
      width:           40,
      height:          40,
      borderRadius:    20,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems:      'center',
      justifyContent:  'center',
    },

    statutBadge: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[1],
      borderRadius:      theme.radius.full,
      backgroundColor:   'rgba(255,255,255,0.2)',
    },

    statutBadgeTxt: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.white,
    },

    headerTitre: {
      fontSize:     theme.typography.size['2xl'],
      fontWeight:   '800',
      color:        theme.colors.white,
      marginBottom: theme.spacing[2],
    },

    headerMeta: {
      fontSize: theme.typography.size.sm,
      color:    'rgba(255,255,255,0.8)',
      marginBottom: 4,
    },

    // ── Section card ──────────────────────────────────────────
    card: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.xl,
      padding:         theme.spacing[4],
      borderWidth:     1,
      borderColor:     theme.colors.border,
      shadowColor:     '#000',
      shadowOffset:    { width: 0, height: 1 },
      shadowOpacity:   0.05,
      shadowRadius:    4,
      elevation:       1,
    },

    cardTitle: {
      fontSize:     theme.typography.size.sm,
      fontWeight:   '700',
      color:        theme.colors.textSecondary,
      textTransform:'uppercase',
      letterSpacing: 0.8,
      marginBottom:  theme.spacing[3],
    },

    // ── Info row ─────────────────────────────────────────────
    infoRow: {
      flexDirection:     'row',
      alignItems:        'flex-start',
      columnGap:         theme.spacing[3],
      paddingVertical:   theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },

    infoLabel: {
      fontSize:   theme.typography.size.sm,
      color:      theme.colors.textSecondary,
      width:      80,
    },

    infoValue: {
      flex:       1,
      fontSize:   theme.typography.size.sm,
      color:      theme.colors.textPrimary,
      fontWeight: '500',
    },

    infoValueLink: {
      color:      theme.colors.primary,
      fontWeight: '600',
    },

    // ── Participant item ──────────────────────────────────────
    participantItem: {
      flexDirection:     'row',
      alignItems:        'center',
      paddingVertical:   theme.spacing[3],
      columnGap:         theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },

    participantAvatar: {
      width:           38,
      height:          38,
      borderRadius:    19,
      backgroundColor: theme.colors.primaryLight,
      alignItems:      'center',
      justifyContent:  'center',
    },

    participantAvatarTxt: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.primary,
    },

    participantInfo: { flex: 1 },

    participantNom: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },

    participantContact: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },

    typeBadge: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical:   2,
      borderRadius:      theme.radius.full,
    },

    typeBadgeTxt: {
      fontSize:   9,
      fontWeight: '700',
    },

    participantActions: {
      flexDirection: 'row',
      columnGap:     theme.spacing[2],
    },

    participantActionBtn: {
      width:          32,
      height:         32,
      borderRadius:   16,
      alignItems:     'center',
      justifyContent: 'center',
      borderWidth:    1,
      borderColor:    theme.colors.border,
    },

    // ── Notes ─────────────────────────────────────────────────
    notesTxt: {
      fontSize:   theme.typography.size.sm,
      color:      theme.colors.textPrimary,
      lineHeight: 22,
    },

    // ── Actions bottom ────────────────────────────────────────
    actionsSection: { rowGap: theme.spacing[3] },

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

    actionBtnWhatsApp: { borderColor: '#25D366', backgroundColor: '#F0FFF4' },
    actionBtnEmail:    { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryLight },
    actionBtnLien:     { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryLight },

    actionBtnTxt: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textSecondary,
    },

    btnModifier: {
      backgroundColor: theme.colors.primary,
      borderRadius:    theme.radius.xl,
      paddingVertical: theme.spacing[4],
      alignItems:      'center',
      flexDirection:   'row',
      justifyContent:  'center',
      columnGap:       theme.spacing[2],
      shadowColor:     theme.colors.primary,
      shadowOffset:    { width: 0, height: 4 },
      shadowOpacity:   0.3,
      shadowRadius:    8,
      elevation:       4,
    },

    btnModifierTxt: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      theme.colors.white,
    },

    btnDanger: {
      borderRadius:    theme.radius.xl,
      paddingVertical: theme.spacing[4],
      alignItems:      'center',
      borderWidth:     1,
      borderColor:     theme.colors.danger,
    },

    btnDangerTxt: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.danger,
    },

    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  });