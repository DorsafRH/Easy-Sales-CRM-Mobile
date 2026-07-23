/**
 * @file ImportClientsScreen.styles.ts
 * @description Styles de l'écran d'import clients (Excel + Photo).
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme }   from '../../theme';
import { layout }     from '../../theme/dimensions';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({

    safe: {
      flex:            1,
      backgroundColor: theme.colors.bgApp,
    },

    // ── Header ───────────────────────────────────────────────
    header: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      paddingHorizontal: layout.screenPadding,
      paddingVertical:   theme.spacing[3],
      backgroundColor:   theme.colors.bgSurface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    headerTitle: {
      fontSize:   theme.typography.size.lg,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },

    backBtn: {
      padding: 4,
    },

    // ── Tabs ─────────────────────────────────────────────────
    tabs: {
      flexDirection:     'row',
      backgroundColor:   theme.colors.bgSurface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    tabItem: {
      flex:           1,
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            6,
      paddingVertical: theme.spacing[3],
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },

    tabItemActive: {
      borderBottomColor: theme.colors.primary,
    },

    tabLabel: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '500',
      color:      theme.colors.textSecondary,
    },

    tabLabelActive: {
      color: theme.colors.primary,
    },

    // ── Layout commun ─────────────────────────────────────────
    centerContent: {
      flex:           1,
      alignItems:     'center',
      justifyContent: 'center',
      padding:        layout.screenPadding,
      gap:            12,
    },

    scrollContent: {
      flex: 1,
      paddingHorizontal: layout.screenPadding,
      paddingTop: theme.spacing[4],
    },

    stepTitle: {
      fontSize:     theme.typography.size.xl,
      fontWeight:   '700',
      color:        theme.colors.textPrimary,
      textAlign:    'center',
      marginBottom: theme.spacing[2],
    },

    stepSub: {
      fontSize:   theme.typography.size.sm,
      color:      theme.colors.textSecondary,
      textAlign:  'center',
      lineHeight: 20,
      marginBottom: theme.spacing[4],
    },

    // ── Mapping ───────────────────────────────────────────────
    sectionLabel: {
      fontSize:     theme.typography.size.sm,
      fontWeight:   '600',
      color:        theme.colors.textSecondary,
      marginBottom: theme.spacing[2],
      marginTop:    theme.spacing[4],
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    typeRow: {
      flexDirection: 'row',
      gap:           8,
      marginBottom:  theme.spacing[2],
    },

    typeBtn: {
      flex:             1,
      paddingVertical:  theme.spacing[2],
      borderRadius:     theme.radius.md,
      borderWidth:      1,
      borderColor:      theme.colors.border,
      alignItems:       'center',
      backgroundColor:  theme.colors.bgSurface,
    },

    typeBtnActive: {
      borderColor:     theme.colors.primary,
      backgroundColor: theme.colors.primary + '15',
    },

    typeBtnLabel: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '500',
      color:      theme.colors.textSecondary,
    },

    typeBtnLabelActive: {
      color: theme.colors.primary,
    },

    mapRow: {
      flexDirection:   'row',
      alignItems:      'center',
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.md,
      padding:         theme.spacing[3],
      marginBottom:    theme.spacing[2],
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },

    mapFieldLabel: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },

    mapColValue: {
      fontSize:   theme.typography.size.xs,
      color:      theme.colors.textSecondary,
      marginTop:  2,
    },

    // ── Aperçu ────────────────────────────────────────────────
    previewHeader: {
      paddingHorizontal: layout.screenPadding,
      paddingVertical:   theme.spacing[3],
    },

    previewCard: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.md,
      padding:         theme.spacing[3],
      marginBottom:    theme.spacing[2],
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },

    previewNom: {
      fontSize:     theme.typography.size.base,
      fontWeight:   '600',
      color:        theme.colors.textPrimary,
      marginBottom: 2,
    },

    previewMeta: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },

    moreLabel: {
      textAlign:    'center',
      fontSize:     theme.typography.size.sm,
      color:        theme.colors.textSecondary,
      paddingBottom: theme.spacing[4],
    },

    // ── Vérification OCR ──────────────────────────────────────
    verifyCard: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.md,
      padding:         theme.spacing[3],
      marginBottom:    theme.spacing[3],
      borderWidth:     1,
      borderColor:     theme.colors.border,
      gap:             8,
    },

    verifyCardHeader: {
      flexDirection:  'row',
      justifyContent: 'space-between',
      alignItems:     'center',
      marginBottom:   4,
    },

    verifyInput: {
      backgroundColor:  theme.colors.bgApp,
      borderWidth:      1,
      borderColor:      theme.colors.border,
      borderRadius:     theme.radius.sm,
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[2],
      fontSize:         theme.typography.size.sm,
      color:            theme.colors.textPrimary,
    },

    // ── Barre de progression ──────────────────────────────────
    progressBar: {
      width:           '80%',
      height:          6,
      backgroundColor: theme.colors.border,
      borderRadius:    3,
      marginTop:       theme.spacing[3],
      overflow:        'hidden',
    },

    progressFill: {
      height:          6,
      backgroundColor: theme.colors.primary,
      borderRadius:    3,
    },

    // ── Résumé ────────────────────────────────────────────────
    doneContent: {
      flexGrow:          1,
      alignItems:        'center',
      justifyContent:    'center',
      padding:           layout.screenPadding,
    },

    errorRow: {
      width:            '100%',
      backgroundColor:  '#FEF2F2',
      borderRadius:     theme.radius.sm,
      padding:          theme.spacing[2],
      marginTop:        theme.spacing[1],
    },

    errorNom: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      '#DC2626',
    },

    errorMsg: {
      fontSize: theme.typography.size.xs,
      color:    '#EF4444',
    },

    // ── Action fixée en bas ───────────────────────────────────
    bottomAction: {
      position:          'absolute',
      bottom:            0,
      left:              0,
      right:             0,
      padding:           layout.screenPadding,
      backgroundColor:   theme.colors.bgSurface,
      borderTopWidth:    1,
      borderTopColor:    theme.colors.border,
    },

    // ── Modal picker colonnes ────────────────────────────────
    modalOverlay: {
      flex:            1,
      backgroundColor: 'rgba(0,0,0,0.4)',
    },

    modalSheet: {
      backgroundColor: theme.colors.bgSurface,
      borderTopLeftRadius:  20,
      borderTopRightRadius: 20,
      paddingTop:      theme.spacing[4],
      paddingBottom:   theme.spacing[8],
      maxHeight:       '60%',
    },

    modalTitle: {
      fontSize:          theme.typography.size.base,
      fontWeight:        '600',
      color:             theme.colors.textPrimary,
      paddingHorizontal: layout.screenPadding,
      marginBottom:      theme.spacing[3],
    },

    modalItem: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      paddingHorizontal: layout.screenPadding,
      paddingVertical:   theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    modalItemText: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textPrimary,
    },
  });
