/**
 * @file DevisListScreen.styles.ts
 * @description Styles de la liste des devis.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';
import { layout } from '../../theme/dimensions';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safe:    { flex: 1, backgroundColor: theme.colors.bgApp },
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
    listContent: {
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[3],
      paddingBottom:     theme.spacing[16],
    },
    devisItem: {
      flexDirection:   'row',
      alignItems:      'center',
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      marginBottom:    theme.spacing[3],
      columnGap:       theme.spacing[3],
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },
    devisInfo: { flex: 1 },
    devisNumero: {
      fontSize:     theme.typography.size.sm,
      fontWeight:   '700',
      color:        theme.colors.textPrimary,
      marginBottom: 2,
    },
    devisClient: {
      fontSize:     theme.typography.size.xs,
      color:        theme.colors.textSecondary,
      marginBottom: 2,
    },
    devisDate: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textTertiary,
    },
    devisRight: {
      alignItems: 'flex-end',
      rowGap:     theme.spacing[1],
    },
    devisMontant: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      theme.colors.primary,
    },
    statsBanner: {
      flexDirection:     'row',
      paddingHorizontal: layout.screenPadding,
      paddingVertical:   theme.spacing[3],
      columnGap:         theme.spacing[3],
      backgroundColor:   theme.colors.bgSurface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    statItem: {
      flex:       1,
      alignItems: 'center',
      rowGap:     2,
    },
    statValue: {
      fontSize:   theme.typography.size.lg,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },
    statLabel: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },
    loadingContainer: {
      flex: 1, alignItems: 'center', justifyContent: 'center',
    },
  });