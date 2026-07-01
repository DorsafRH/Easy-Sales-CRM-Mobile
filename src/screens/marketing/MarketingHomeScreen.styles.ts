/**
 * @file MarketingHomeScreen.styles.ts
 * @description Styles de l'écran principal Marketing (4 onglets).
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';
import { layout } from '../../theme/dimensions';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.colors.bgApp },
    header: {
      backgroundColor:   theme.colors.bgSurface,
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[4],
      paddingBottom:     theme.spacing[3],
    },
    headerTitle: {
      fontSize:   theme.typography.size.xl,
      fontWeight: '800',
      color:      theme.colors.textPrimary,
    },
    headerSub: {
      fontSize:  theme.typography.size.sm,
      color:     theme.colors.textSecondary,
      marginTop: 2,
    },
    tabs: {
      flexDirection:     'row',
      columnGap:         theme.spacing[2],
      backgroundColor:   theme.colors.bgSurface,
      paddingHorizontal: layout.screenPadding,
      paddingBottom:     theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tab: {
      flex:            1,
      alignItems:      'center',
      justifyContent:  'center',
      rowGap:          theme.spacing[1],
      paddingVertical: theme.spacing[2],
      borderRadius:    theme.radius.md,
      backgroundColor: theme.colors.bgApp,
    },
    tabActif: {
      backgroundColor: theme.colors.primaryLight,
    },
    tabLabel: {
      fontSize:   theme.typography.size.xs,
      fontWeight: '600',
      color:      theme.colors.textTertiary,
    },
    tabLabelActif: {
      color: theme.colors.primary,
    },
    body: { flex: 1 },
    tabBody: { flex: 1 },

    // ── Recherche + filtres ─────────────────────────────────────
    searchBar: {
      flexDirection:     'row',
      alignItems:        'center',
      columnGap:         theme.spacing[2],
      backgroundColor:   theme.colors.bgSurface,
      borderWidth:       1,
      borderColor:       theme.colors.border,
      borderRadius:      theme.radius.full,
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[2],
      marginHorizontal:  layout.screenPadding,
      marginTop:         theme.spacing[3],
    },
    searchInput: {
      flex:     1,
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textPrimary,
      padding:  0,
    },
    filterRow: {
      flexDirection:     'row',
      flexWrap:          'wrap',
      columnGap:         theme.spacing[2],
      rowGap:            theme.spacing[2],
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[3],
    },
    filterChip: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[1],
      borderRadius:      theme.radius.full,
      borderWidth:       1,
      borderColor:       theme.colors.border,
      backgroundColor:   theme.colors.bgSurface,
    },
    filterChipActif: {
      backgroundColor: theme.colors.primary,
      borderColor:     theme.colors.primary,
    },
    filterChipText: {
      fontSize:   theme.typography.size.xs,
      fontWeight: '600',
      color:      theme.colors.textSecondary,
    },
    filterChipTextActif: {
      color: theme.colors.white,
    },
    statsRow: {
      flexDirection: 'row',
      columnGap:     theme.spacing[3],
      marginBottom:  theme.spacing[4],
    },
    listContent: {
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[4],
      paddingBottom:     theme.spacing[16],
    },
    statsCard: {
      flexDirection:   'row',
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      paddingVertical: theme.spacing[4],
      marginBottom:    theme.spacing[4],
      shadowColor:     '#000',
      shadowOffset:    { width: 0, height: 1 },
      shadowOpacity:   0.05,
      shadowRadius:    3,
      elevation:       1,
    },
    statCol: {
      flex:       1,
      alignItems: 'center',
      rowGap:     2,
    },
    statVal: {
      fontSize:   theme.typography.size.xl,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },
    statLbl: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },
    statDivider: {
      width:            1,
      backgroundColor:  theme.colors.border,
      marginVertical:   theme.spacing[1],
    },
    pubItem: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      marginBottom:    theme.spacing[3],
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },
    pubRow: {
      flexDirection:  'row',
      alignItems:     'flex-start',
      justifyContent: 'space-between',
      columnGap:      theme.spacing[2],
      marginBottom:   theme.spacing[2],
    },
    pubTitre: {
      flex:       1,
      fontSize:   theme.typography.size.base,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },
    pubMeta: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },
  });
