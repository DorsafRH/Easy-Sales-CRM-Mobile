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
      fontWeight: '700',
      color:      theme.colors.textPrimary,
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
