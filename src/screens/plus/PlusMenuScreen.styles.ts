/**
 * @file PlusMenuScreen.styles.ts
 * @description Styles du menu "Plus" (onglet 5 de la bottom tab bar).
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

    // ── Header utilisateur ─────────────────────────────────────
    userCard: {
      flexDirection:     'row',
      alignItems:        'center',
      columnGap:         theme.spacing[3],
      backgroundColor:   theme.colors.bgSurface,
      paddingHorizontal: layout.screenPadding,
      paddingVertical:   theme.spacing[5],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    userInfo: { flex: 1 },

    userName: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },

    userEntreprise: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
    },

    editProfileBtn: {
      width:           36,
      height:          36,
      borderRadius:    18,
      backgroundColor: theme.colors.bgApp,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      alignItems:      'center',
      justifyContent:  'center',
    },

    // ── Groupes ───────────────────────────────────────────────
    sectionLabel: {
      fontSize:          theme.typography.size.xs,
      fontWeight:        '700',
      color:             theme.colors.textTertiary,
      textTransform:     'uppercase',
      letterSpacing:     0.8,
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[5],
      paddingBottom:     theme.spacing[2],
    },

    menuGroup: {
      backgroundColor: theme.colors.bgSurface,
      borderTopWidth:    1,
      borderTopColor:    theme.colors.border,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    // ── Item de menu ──────────────────────────────────────────
    menuItem: {
      flexDirection:     'row',
      alignItems:        'center',
      columnGap:         theme.spacing[3],
      paddingVertical:   theme.spacing[4],
      paddingHorizontal: layout.screenPadding,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },

    menuItemLast: {
      borderBottomWidth: 0,
    },

    menuIconWrapper: {
      width:           40,
      height:          40,
      borderRadius:    theme.radius.md,
      alignItems:      'center',
      justifyContent:  'center',
    },

    menuItemContent: { flex: 1 },

    menuItemLabel: {
      fontSize:   theme.typography.size.base,
      fontWeight: '500',
      color:      theme.colors.textPrimary,
    },

    menuItemSub: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
      marginTop: 1,
    },

    menuItemChevron: {
      // opacity légère sur la flèche
    },

    menuItemBadge: {
      backgroundColor: theme.colors.bgApp,
      borderRadius:    theme.radius.full,
      paddingVertical: 2,
      paddingHorizontal: theme.spacing[2],
    },

    menuItemBadgeText: {
      fontSize:   theme.typography.size.xs,
      color:      theme.colors.textSecondary,
      fontWeight: '500',
    },

    // ── Bouton déconnexion ─────────────────────────────────────
    logoutGroup: {
      backgroundColor:   theme.colors.bgSurface,
      borderTopWidth:    1,
      borderTopColor:    theme.colors.border,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    logoutItem: {
      flexDirection:     'row',
      alignItems:        'center',
      columnGap:         theme.spacing[3],
      paddingVertical:   theme.spacing[4],
      paddingHorizontal: layout.screenPadding,
    },

    logoutIconWrapper: {
      width:           40,
      height:          40,
      borderRadius:    theme.radius.md,
      backgroundColor: theme.colors.dangerLight,
      alignItems:      'center',
      justifyContent:  'center',
    },

    logoutLabel: {
      fontSize:   theme.typography.size.base,
      fontWeight: '500',
      color:      theme.colors.danger,
    },

    // ── Version ───────────────────────────────────────────────
    version: {
      textAlign: 'center',
      fontSize:  theme.typography.size.xs,
      color:     theme.colors.textTertiary,
      marginTop: theme.spacing[6],
    },
  });