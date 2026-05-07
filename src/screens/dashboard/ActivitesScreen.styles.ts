/**
 * @file ActivitesScreen.styles.ts
 * @description Styles de l'écran liste complète des activités.
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

    headerTitle: {
      flex:       1,
      fontSize:   theme.typography.size.lg,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },

    listContent: {
      paddingVertical:   theme.spacing[3],
      paddingHorizontal: layout.screenPadding,
      paddingBottom:     theme.spacing[10],
    },

    // ── Item activité ─────────────────────────────────────────
    activiteItem: {
      flexDirection:   'row',
      alignItems:      'center',
      columnGap:       theme.spacing[3],
      paddingVertical: theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    iconWrapper: {
      width:          44,
      height:         44,
      borderRadius:   22,
      alignItems:     'center',
      justifyContent: 'center',
    },

    content: { flex: 1 },

    titre: {
      fontSize:     theme.typography.size.sm,
      fontWeight:   '600',
      color:        theme.colors.textPrimary,
      marginBottom: 2,
    },

    description: {
      fontSize:     theme.typography.size.xs,
      color:        theme.colors.textSecondary,
      marginBottom: 2,
    },

    date: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textTertiary,
    },

    chevron: {
      opacity: 0.4,
    },

    // ── Chargement ────────────────────────────────────────────
    loadingContainer: {
      flex:           1,
      alignItems:     'center',
      justifyContent: 'center',
    },

    footerLoading: {
      paddingVertical: theme.spacing[4],
      alignItems:      'center',
    },
  });