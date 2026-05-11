/**
 * @file TimelineItem.styles.ts
 * @description Styles d'un élément de timeline d'activité commerciale.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      columnGap:     theme.spacing[3],
    },
    leftColumn: {
      alignItems: 'center',
      width:      36,
    },
    iconWrapper: {
      width:           36,
      height:          36,
      borderRadius:    18,
      alignItems:      'center',
      justifyContent:  'center',
    },
    line: {
      flex:             1,
      width:            1.5,
      backgroundColor:  theme.colors.border,
      marginTop:        4,
    },
    content: {
      flex:          1,
      paddingBottom: theme.spacing[4],
    },
    header: {
      flexDirection:  'row',
      justifyContent: 'space-between',
      alignItems:     'center',
      marginBottom:   2,
    },
    sujet: {
      flex:       1,
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },
    date: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textTertiary,
    },
    notes: {
      fontSize:   theme.typography.size.xs,
      color:      theme.colors.textSecondary,
      lineHeight: theme.typography.size.xs * 1.6,
      marginTop:  2,
    },
    resultatBadge: {
      alignSelf:         'flex-start',
      paddingHorizontal: theme.spacing[2],
      paddingVertical:   2,
      borderRadius:      theme.radius.full,
      marginTop:         4,
    },
    resultatText: {
      fontSize:   9,
      fontWeight: '700',
    },
  });