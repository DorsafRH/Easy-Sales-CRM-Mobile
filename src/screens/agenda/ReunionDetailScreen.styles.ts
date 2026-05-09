/**
 * @file ReunionDetailScreen.styles.ts
 * @description Styles fiche réunion — section client + participants individuels.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme }   from '../../theme';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({

    safe: {
      flex:            1,
      backgroundColor: theme.colors.bgApp,
    },

    loadingCenter: {
      flex:           1,
      alignItems:     'center',
      justifyContent: 'center',
    },

    // ── Hero gradient simulé (fond bleu dégradé) ──────────────────
    hero: {
      backgroundColor:   theme.colors.primary,
      paddingHorizontal: 20,
      paddingTop:        20,
      paddingBottom:     28,
    },

    statusPill: {
      alignSelf:         'flex-start',
      paddingHorizontal: 12,
      paddingVertical:   4,
      borderRadius:      20,
      marginBottom:      10,
    },

    statusPillTxt: {
      fontSize:   11,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    heroTitre: {
      fontSize:     22,
      fontWeight:   '800',
      color:        '#FFFFFF',
      marginBottom: 12,
      lineHeight:   28,
    },

    heroRow: {
      flexDirection: 'row',
      alignItems:    'center',
      columnGap:     8,
      marginBottom:  5,
    },

    heroMeta: {
      fontSize: 13,
      color:    'rgba(255,255,255,0.85)',
    },

    // ── Contenu (fond gris) ───────────────────────────────────────
    content: {
      paddingHorizontal: 16,
      paddingTop:        16,
      paddingBottom:     40,
    },

    // ── Cards ─────────────────────────────────────────────────────
    card: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    16,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      padding:         16,
      marginBottom:    12,
      shadowColor:     '#000',
      shadowOffset:    { width: 0, height: 1 },
      shadowOpacity:   0.05,
      shadowRadius:    4,
      elevation:       1,
    },

    cardTitre: {
      fontSize:      11,
      fontWeight:    '700',
      color:         theme.colors.textSecondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom:  12,
    },

    // ── Lien réunion ──────────────────────────────────────────────
    joinBtn: {
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'center',
      columnGap:       8,
      paddingVertical: 12,
      borderRadius:    12,
      borderWidth:     1.5,
      borderColor:     theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
      marginBottom:    8,
    },

    joinBtnTxt: {
      fontSize:   15,
      fontWeight: '700',
      color:      theme.colors.primary,
    },

    joinUrl: {
      fontSize:  11,
      color:     theme.colors.textSecondary,
      textAlign: 'center',
    },

    // ── Ligne contact (client ou participant) ─────────────────────
    contactRow: {
      flexDirection: 'row',
      alignItems:    'center',
      columnGap:     12,
    },

    participantRow: {
      flexDirection: 'row',
      alignItems:    'center',
      columnGap:     12,
      paddingTop:    12,
    },

    participantSep: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.bgApp,
    },

    contactInfo: { flex: 1 },

    contactNom: {
      fontSize:     14,
      fontWeight:   '700',
      color:        theme.colors.textPrimary,
      marginBottom: 2,
    },

    contactSub: {
      fontSize: 12,
      color:    theme.colors.textSecondary,
      marginBottom: 2,
    },

    // ── Boutons icônes contact ────────────────────────────────────
    contactBtns: {
      flexDirection: 'row',
      columnGap:     6,
    },

    iconBtn: {
      width:           38,
      height:          38,
      borderRadius:    19,
      backgroundColor: theme.colors.primaryLight,
      alignItems:      'center',
      justifyContent:  'center',
      borderWidth:     1,
      borderColor:     theme.colors.primary,
    },

    iconBtnWA: {
      backgroundColor: '#F0FDF4',
      borderColor:     '#16A34A',
    },

    iconBtnSm: {
      width:           32,
      height:          32,
      borderRadius:    16,
      backgroundColor: theme.colors.primaryLight,
      alignItems:      'center',
      justifyContent:  'center',
      borderWidth:     1,
      borderColor:     theme.colors.primary,
    },

    // ── Badge type participant ─────────────────────────────────────
    typePill: {
      alignSelf:         'flex-start',
      paddingHorizontal: 8,
      paddingVertical:   2,
      borderRadius:      20,
      backgroundColor:   '#FFF7ED',
      marginTop:         4,
    },

    typePillInterne: {
      backgroundColor: theme.colors.primaryLight,
    },

    typePillTxt: {
      fontSize:   10,
      fontWeight: '700',
      color:      '#EA580C',
    },

    // ── Notes ─────────────────────────────────────────────────────
    notesTxt: {
      fontSize:   14,
      color:      theme.colors.textPrimary,
      lineHeight: 22,
    },

    // ── Section actions ───────────────────────────────────────────
    actionsSection: {
      rowGap: 10,
      marginTop: 4,
    },

    btnPrimary: {
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'center',
      columnGap:       8,
      paddingVertical: 15,
      borderRadius:    14,
      backgroundColor: theme.colors.primary,
      shadowColor:     theme.colors.primary,
      shadowOffset:    { width: 0, height: 3 },
      shadowOpacity:   0.3,
      shadowRadius:    6,
      elevation:       4,
    },

    btnPrimaryTxt: {
      fontSize:   15,
      fontWeight: '700',
      color:      '#FFFFFF',
    },

    btnSuccess: {
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'center',
      columnGap:       8,
      paddingVertical: 14,
      borderRadius:    14,
      backgroundColor: '#F0FDF4',
      borderWidth:     1.5,
      borderColor:     '#16A34A',
    },

    btnSuccessTxt: {
      fontSize:   14,
      fontWeight: '700',
      color:      '#16A34A',
    },

    btnDanger: {
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'center',
      columnGap:       8,
      paddingVertical: 14,
      borderRadius:    14,
      backgroundColor: '#FFF1F2',
      borderWidth:     1.5,
      borderColor:     '#EF4444',
    },

    btnDangerTxt: {
      fontSize:   14,
      fontWeight: '700',
      color:      '#EF4444',
    },

    btnGhost: {
      alignItems:      'center',
      paddingVertical: 12,
    },

    btnGhostTxt: {
      fontSize:   13,
      color:      theme.colors.textSecondary,
      fontWeight: '600',
    },
  });