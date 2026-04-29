/**
 * @file ContactDetailScreen.styles.ts
 * @description Styles de la fiche contact avec 3 boutons d'action.
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

    // ── Header ───────────────────────────────────────────────
    header: {
      backgroundColor:   theme.colors.bgSurface,
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[4],
      paddingBottom:     theme.spacing[5],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      alignItems:        'center',
    },

    backBtn: {
      position:     'absolute',
      top:          theme.spacing[4],
      left:         layout.screenPadding,
      width:        40,
      height:       40,
      borderRadius: 20,
      backgroundColor: theme.colors.bgApp,
      alignItems:   'center',
      justifyContent: 'center',
      borderWidth:  1,
      borderColor:  theme.colors.border,
    },

    editBtn: {
      position:     'absolute',
      top:          theme.spacing[4],
      right:        layout.screenPadding,
      width:        40,
      height:       40,
      borderRadius: 20,
      backgroundColor: theme.colors.bgApp,
      alignItems:   'center',
      justifyContent: 'center',
      borderWidth:  1,
      borderColor:  theme.colors.border,
    },

    headerNom: {
      fontSize:     theme.typography.size.xl,
      fontWeight:   '700',
      color:        theme.colors.textPrimary,
      marginTop:    theme.spacing[3],
      marginBottom: theme.spacing[1],
      textAlign:    'center',
    },

    headerPoste: {
      fontSize:  theme.typography.size.sm,
      color:     theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing[1],
    },

    headerEntreprise: {
      fontSize:   theme.typography.size.sm,
      color:      theme.colors.primary,
      fontWeight: '500',
      textAlign:  'center',
    },

    // ── Boutons d'action ──────────────────────────────────────
    actionsRow: {
      flexDirection:     'row',
      paddingHorizontal: layout.screenPadding,
      marginTop:         theme.spacing[4],
      columnGap:         theme.spacing[3],
    },

    actionBtn: {
      flex:            1,
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'center',
      columnGap:       theme.spacing[2],
      paddingVertical: theme.spacing[3],
      borderRadius:    theme.radius.md,
      borderWidth:     1,
    },

    actionBtnAppeler: {
      backgroundColor: theme.colors.primaryLight,
      borderColor:     theme.colors.primary,
    },

    actionBtnWhatsapp: {
      backgroundColor: '#F0FDF4',
      borderColor:     '#16A34A',
    },

    actionBtnEmail: {
      backgroundColor: theme.colors.bgSurface,
      borderColor:     theme.colors.border,
    },

    actionBtnText: {
      fontSize:   theme.typography.size.xs,
      fontWeight: '600',
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

    infoRow: {
      flexDirection:     'row',
      alignItems:        'center',
      columnGap:         theme.spacing[3],
      paddingVertical:   theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },

    infoLabel: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
      width:    80,
    },

    infoValue: {
      flex:       1,
      fontSize:   theme.typography.size.sm,
      fontWeight: '500',
      color:      theme.colors.textPrimary,
    },

    // ── Bouton supprimer ──────────────────────────────────────
    deleteBtn: {
      marginHorizontal: layout.screenPadding,
      marginTop:        theme.spacing[4],
      paddingVertical:  theme.spacing[3],
      borderRadius:     theme.radius.md,
      borderWidth:      1,
      borderColor:      theme.colors.danger,
      alignItems:       'center',
    },

    deleteBtnText: {
      fontSize:   theme.typography.size.sm,
      color:      theme.colors.danger,
      fontWeight: '600',
    },

    // ── Chargement ────────────────────────────────────────────
    loadingContainer: {
      flex:           1,
      alignItems:     'center',
      justifyContent: 'center',
    },
  });