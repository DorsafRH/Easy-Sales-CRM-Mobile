/**
 * @file AgendaScreen.styles.ts
 * @description Styles — Agenda CRM redesign : calendrier mensuel + événements colorés.
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

    // ─── SECTION CALENDRIER ───────────────────────────────────────
    calSection: {
      backgroundColor:   theme.colors.bgSurface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      shadowColor:       '#000',
      shadowOffset:      { width: 0, height: 2 },
      shadowOpacity:     0.06,
      shadowRadius:      6,
      elevation:         4,
    },

    // Header : titre + bouton +
    calHeader: {
      flexDirection:  'row',
      justifyContent: 'space-between',
      alignItems:     'center',
      paddingHorizontal: 20,
      paddingTop:        16,
      paddingBottom:     10,
    },

    calTitre: {
      fontSize:   24,
      fontWeight: '800',
      color:      theme.colors.textPrimary,
    },

    calSub: {
      fontSize:  12,
      color:     theme.colors.textSecondary,
      marginTop: 2,
    },

    addBtn: {
      width:           42,
      height:          42,
      borderRadius:    21,
      backgroundColor: theme.colors.primary,
      alignItems:      'center',
      justifyContent:  'center',
      shadowColor:     theme.colors.primary,
      shadowOffset:    { width: 0, height: 3 },
      shadowOpacity:   0.35,
      shadowRadius:    6,
      elevation:       4,
    },

    // Navigation mois
    monthRow: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      paddingHorizontal: 16,
      marginBottom:      8,
    },

    monthArrow: {
      width:           34,
      height:          34,
      borderRadius:    17,
      backgroundColor: theme.colors.bgApp,
      alignItems:      'center',
      justifyContent:  'center',
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },

    monthLabel: {
      fontSize:   16,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },

    // En-tête Lu Ma Me Je Ve Sa Di
    daysHeader: {
      flexDirection:     'row',
      paddingHorizontal: 6,
      marginBottom:      2,
    },

    dayHdrTxt: {
      flex:            1,
      textAlign:       'center',
      fontSize:        11,
      fontWeight:      '600',
      color:           theme.colors.textSecondary,
      textTransform:   'uppercase',
      letterSpacing:   0.5,
    },

    dayHdrWknd: {
      color: '#EF4444',
    },

    // Grille calendrier
    calGrid: {
      flexDirection:     'row',
      flexWrap:          'wrap',
      paddingHorizontal: 6,
      paddingBottom:     10,
    },

    calCell: {
      width:          `${100 / 7}%` as any,
      alignItems:     'center',
      paddingVertical: 3,
      minHeight:       44,
      justifyContent: 'center',
    },

    calCircle: {
      width:           32,
      height:          32,
      borderRadius:    16,
      alignItems:      'center',
      justifyContent:  'center',
    },

    calCircleToday: {
      borderWidth:  1.5,
      borderColor:  theme.colors.primary,
    },

    calDayTxt: {
      fontSize:   13,
      color:      theme.colors.textPrimary,
      fontWeight: '400',
    },

    calDayWknd: {
      color: '#EF4444',
    },

    calDayTxtSel: {
      color:      '#FFFFFF',
      fontWeight: '700',
    },

    evDot: {
      width:           4,
      height:          4,
      borderRadius:    2,
      backgroundColor: theme.colors.primary,
      marginTop:       1,
    },

    // ─── LABEL JOUR SÉLECTIONNÉ ────────────────────────────────────
    dayLabelRow: {
      flexDirection:     'row',
      justifyContent:    'space-between',
      alignItems:        'center',
      paddingHorizontal: 20,
      paddingVertical:   12,
    },

    dayLabel: {
      fontSize:      11,
      fontWeight:    '700',
      color:         theme.colors.textSecondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },

    dayCount: {
      fontSize: 11,
      color:    theme.colors.textSecondary,
    },

    // ─── LISTE ÉVÉNEMENTS ──────────────────────────────────────────
    loader: {
      flex:           1,
      alignItems:     'center',
      justifyContent: 'center',
    },

    listContent: {
      paddingHorizontal: 16,
      paddingBottom:     80,
      paddingTop:        4,
    },

    // Card événement
    eventCard: {
      flexDirection: 'row',
      borderRadius:  14,
      marginBottom:  12,
      overflow:      'hidden',
      shadowColor:   '#000',
      shadowOffset:  { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius:  6,
      elevation:     2,
    },

    eventBar: {
      width: 5,
    },

    eventBody: {
      flex:                  1,
      padding:               14,
      borderTopRightRadius:  14,
      borderBottomRightRadius: 14,
    },

    eventRow: {
      flexDirection:  'row',
      justifyContent: 'space-between',
      alignItems:     'center',
      marginBottom:   1,
    },

    eventHeure: {
      fontSize:   16,
      fontWeight: '800',
    },

    textStrike: {
      textDecorationLine: 'line-through',
      opacity:            0.6,
    },

    eventPill: {
      paddingHorizontal: 8,
      paddingVertical:   3,
      borderRadius:      20,
    },

    eventPillTxt: {
      fontSize:      10,
      fontWeight:    '700',
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },

    eventDuree: {
      fontSize:     11,
      color:        '#9CA3AF',
      marginBottom: 5,
    },

    eventTitre: {
      fontSize:     15,
      fontWeight:   '700',
      marginBottom: 5,
    },

    metaRow: {
      flexDirection: 'row',
      alignItems:    'center',
      columnGap:     4,
      marginBottom:  2,
    },

    metaTxt: {
      fontSize: 12,
      color:    '#6B7280',
    },

    // Actions rapides (chips)
    eventActions: {
      flexDirection: 'row',
      flexWrap:      'wrap',
      gap:           6,
      marginTop:     10,
      paddingTop:    10,
      borderTopWidth:  1,
      borderTopColor:  'rgba(0,0,0,0.06)',
    },

    chip: {
      flexDirection:   'row',
      alignItems:      'center',
      columnGap:       4,
      paddingHorizontal: 10,
      paddingVertical:   5,
      borderRadius:    20,
      borderWidth:     1,
      borderColor:     '#E5E7EB',
      backgroundColor: '#FFFFFF',
    },

    chipTxt: {
      fontSize:   11,
      fontWeight: '600',
      color:      '#6B7280',
    },
  });