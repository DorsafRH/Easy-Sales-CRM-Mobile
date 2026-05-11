/**
 * @file VentesHomeScreen.styles.ts
 * @description Styles du dashboard commercial Ventes.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';
import { layout } from '../../theme/dimensions';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safe:    { flex: 1, backgroundColor: theme.colors.bgApp },
    scroll:  { flex: 1 },
    content: { flexGrow: 1, paddingBottom: theme.spacing[10] },

    header: {
      backgroundColor:   theme.colors.bgSurface,
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[5],
      paddingBottom:     theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize:     theme.typography.size['2xl'],
      fontWeight:   '800',
      color:        theme.colors.textPrimary,
      marginBottom: 2,
    },
    headerSub: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
    },

    kpisGrid: {
      flexDirection:     'row',
      flexWrap:          'wrap',
      gap:               theme.spacing[3],
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[4],
    },
    kpiItem: {
      width: '47%',
    },

    section: {
      paddingHorizontal: layout.screenPadding,
      marginTop:         theme.spacing[5],
    },
    sectionHeader: {
      flexDirection:  'row',
      justifyContent: 'space-between',
      alignItems:     'center',
      marginBottom:   theme.spacing[3],
    },
    sectionTitle: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },
    sectionLink: {
      fontSize:   theme.typography.size.sm,
      color:      theme.colors.primary,
      fontWeight: '600',
    },

    actionGrid: {
      flexDirection: 'row',
      gap:           theme.spacing[3],
    },
    actionItem: {
      flex:            1,
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.xl,
      paddingVertical: theme.spacing[4],
      alignItems:      'center',
      rowGap:          theme.spacing[2],
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },
    actionIconWrapper: {
      width:          44,
      height:         44,
      borderRadius:   22,
      alignItems:     'center',
      justifyContent: 'center',
    },
    actionLabel: {
      fontSize:   theme.typography.size.xs,
      color:      theme.colors.textSecondary,
      fontWeight: '600',
      textAlign:  'center',
    },

    recentCard: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      padding:         theme.spacing[4],
    },
    recentItem: {
      flexDirection:     'row',
      alignItems:        'center',
      paddingVertical:   theme.spacing[3],
      columnGap:         theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },
    recentItemLast: {
      borderBottomWidth: 0,
    },
    recentIconWrapper: {
      width:          40,
      height:         40,
      borderRadius:   20,
      alignItems:     'center',
      justifyContent: 'center',
    },
    recentContent: { flex: 1 },
    recentTitle: {
      fontSize:     theme.typography.size.sm,
      fontWeight:   '600',
      color:        theme.colors.textPrimary,
      marginBottom: 2,
    },
    recentSub: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },
    recentMontant: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.primary,
    },
    loadingContainer: {
      flex:           1,
      alignItems:     'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing[12],
    },
  });