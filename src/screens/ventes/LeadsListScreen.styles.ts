/**
 * @file LeadsListScreen.styles.ts
 * @description Styles de la liste des leads.
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
    headerCount: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
    },
    searchWrapper:  { marginBottom: theme.spacing[3] },
    listContent: {
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[3],
      paddingBottom:     theme.spacing[16],
    },
    leadItem: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      marginBottom:    theme.spacing[3],
      borderWidth:     1,
      borderColor:     theme.colors.border,
      shadowColor:     theme.colors.black,
      shadowOffset:    { width: 0, height: 1 },
      shadowOpacity:   0.05,
      shadowRadius:    3,
      elevation:       1,
    },
    leadTopRow: {
      flexDirection:  'row',
      alignItems:     'flex-start',
      justifyContent: 'space-between',
      marginBottom:   theme.spacing[2],
    },
    leadNom: {
      flex:       1,
      fontSize:   theme.typography.size.base,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
      marginRight: theme.spacing[2],
    },
    leadMeta: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
      marginBottom: theme.spacing[3],
    },
    scoreWrapper: { marginTop: theme.spacing[1] },
    loadingContainer: {
      flex:           1,
      alignItems:     'center',
      justifyContent: 'center',
    },
  });