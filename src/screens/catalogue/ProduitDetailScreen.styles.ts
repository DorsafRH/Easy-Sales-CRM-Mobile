/**
 * @file ProduitDetailScreen.styles.ts
 * @description Styles de la fiche produit détail.
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

    scroll:  { flex: 1 },

    content: {
      flexGrow:      1,
      paddingBottom: theme.spacing[10],
    },

    // ── Header ───────────────────────────────────────────────
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
      width:           44,
      height:          44,
      borderRadius:    22,
      backgroundColor: theme.colors.bgApp,
      alignItems:      'center',
      justifyContent:  'center',
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },

    editBtn: {
      width:           44,
      height:          44,
      borderRadius:    22,
      backgroundColor: theme.colors.bgApp,
      alignItems:      'center',
      justifyContent:  'center',
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },

    headerFlex: { flex: 1 },

    // ── Hero ─────────────────────────────────────────────────
    heroSection: {
      backgroundColor:   theme.colors.bgSurface,
      alignItems:        'center',
      paddingVertical:   theme.spacing[6],
      paddingHorizontal: layout.screenPadding,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    heroIcon: {
      width:           88,
      height:          88,
      borderRadius:    theme.radius.xl,
      backgroundColor: theme.colors.bgApp,
      alignItems:      'center',
      justifyContent:  'center',
      borderWidth:     1,
      borderColor:     theme.colors.border,
      marginBottom:    theme.spacing[3],
    },

    heroNom: {
      fontSize:     theme.typography.size.xl,
      fontWeight:   '700',
      color:        theme.colors.textPrimary,
      textAlign:    'center',
      marginBottom: theme.spacing[1],
    },

    heroCode: {
      fontSize:   theme.typography.size.xs,
      color:      theme.colors.textTertiary,
      fontFamily: 'monospace',
      marginBottom: theme.spacing[2],
    },

    badgesRow: {
      flexDirection: 'row',
      columnGap:     theme.spacing[2],
      marginTop:     theme.spacing[2],
    },

    // ── Sections ─────────────────────────────────────────────
    section: {
      paddingHorizontal: layout.screenPadding,
      marginTop:         theme.spacing[4],
    },

    card: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      overflow:        'hidden',
    },

    // ── Lignes info ───────────────────────────────────────────
    row: {
      flexDirection:     'row',
      justifyContent:    'space-between',
      alignItems:        'center',
      paddingVertical:   theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },

    rowLabel: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
    },

    rowValue: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },

    rowValueCA: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.primary,
    },

    // ── Description ───────────────────────────────────────────
    description: {
      fontSize:   theme.typography.size.sm,
      color:      theme.colors.textSecondary,
      lineHeight: theme.typography.size.sm * 1.6,
      padding:    theme.spacing[4],
    },

    // ── Actions ───────────────────────────────────────────────
    actions: {
      paddingHorizontal: layout.screenPadding,
      marginTop:         theme.spacing[4],
      rowGap:            theme.spacing[3],
    },

    // Toggle Actif/Inactif — card avec switch
    toggleCard: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      backgroundColor:   theme.colors.bgSurface,
      borderRadius:      theme.radius.lg,
      borderWidth:       1,
      borderColor:       theme.colors.border,
      paddingVertical:   theme.spacing[4],
      paddingHorizontal: theme.spacing[4],
    },

    toggleLeft: {
      flex:     1,
      rowGap:   2,
    },

    toggleLabel: {
      fontSize:   theme.typography.size.base,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },

    toggleSub: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },

    // Bouton archiver (orange)
    archiveBtn: {
      paddingVertical: theme.spacing[3],
      borderRadius:    theme.radius.md,
      borderWidth:     1,
      borderColor:     theme.colors.warning,
      alignItems:      'center',
      backgroundColor: theme.colors.warningLight,
    },

    archiveBtnText: {
      fontSize:   theme.typography.size.sm,
      color:      theme.colors.warning,
      fontWeight: '600',
    },

    // Bouton désarchiver (vert)
    desarchiveBtn: {
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'center',
      columnGap:       theme.spacing[2],
      paddingVertical: theme.spacing[3],
      borderRadius:    theme.radius.md,
      borderWidth:     1,
      borderColor:     theme.colors.success,
      backgroundColor: theme.colors.successLight,
    },

    desarchiveBtnText: {
      fontSize:   theme.typography.size.sm,
      color:      theme.colors.success,
      fontWeight: '600',
    },

    // ── Chargement ────────────────────────────────────────────
    loadingContainer: {
      flex:           1,
      alignItems:     'center',
      justifyContent: 'center',
    },
  });