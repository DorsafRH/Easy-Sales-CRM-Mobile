/**
 * @file ClientsListScreen.styles.ts
 * @description Styles de la liste clients avec recherche et filtres.
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

    // ── Header ───────────────────────────────────────────────
    header: {
      backgroundColor:   theme.colors.bgSurface,
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[4],
      paddingBottom:     theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    headerTopRow: {
      flexDirection:  'row',
      justifyContent: 'space-between',
      alignItems:     'center',
      marginBottom:   theme.spacing[3],
    },

    headerTitle: {
      fontSize:   theme.typography.size.xl,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },

    headerCount: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
    },

    searchWrapper: {
      marginBottom: theme.spacing[3],
    },

    filtersWrapper: {
      // ScrollView horizontal — pas de padding ici (géré dans FilterChips)
    },

    // ── Liste ─────────────────────────────────────────────────
    listContent: {
      paddingTop:        theme.spacing[3],
      paddingHorizontal: layout.screenPadding,
      paddingBottom:     theme.spacing[16],
    },

    // ── Item client ───────────────────────────────────────────
    clientItem: {
      flexDirection:   'row',
      alignItems:      'center',
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      marginBottom:    theme.spacing[3],
      columnGap:       theme.spacing[3],
      borderWidth:     1,
      borderColor:     theme.colors.border,
      shadowColor:     theme.colors.black,
      shadowOffset:    { width: 0, height: 1 },
      shadowOpacity:   0.05,
      shadowRadius:    3,
      elevation:       1,
    },

    clientInfo: {
      flex: 1,
    },

    clientNom: {
      fontSize:     theme.typography.size.base,
      fontWeight:   '600',
      color:        theme.colors.textPrimary,
      marginBottom: 2,
    },

    clientMeta: {
      fontSize:   theme.typography.size.xs,
      color:      theme.colors.textSecondary,
    },

    clientRight: {
      alignItems: 'flex-end',
      rowGap:     theme.spacing[1],
    },

    clientCA: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.primary,
    },

    // ── Chargement ────────────────────────────────────────────
    loadingContainer: {
      flex:           1,
      alignItems:     'center',
      justifyContent: 'center',
    },
  });