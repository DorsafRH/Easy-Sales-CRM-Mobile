/**
 * @file CalendrierScreen.styles.ts
 * @description Styles de l'onglet Calendrier éditorial.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';
import { layout } from '../../theme/dimensions';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[3],
      paddingBottom:     theme.spacing[16],
    },
    sectionTitre: {
      fontSize:      theme.typography.size.sm,
      fontWeight:    '700',
      color:         theme.colors.textSecondary,
      marginTop:     theme.spacing[5],
      marginBottom:  theme.spacing[3],
      textTransform: 'uppercase',
    },
    item: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      marginBottom:    theme.spacing[3],
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },
    itemRow: {
      flexDirection:  'row',
      alignItems:     'flex-start',
      justifyContent: 'space-between',
      columnGap:      theme.spacing[2],
      marginBottom:   theme.spacing[2],
    },
    itemTitre: {
      flex:       1,
      fontSize:   theme.typography.size.base,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },
    itemMeta: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },
  });
