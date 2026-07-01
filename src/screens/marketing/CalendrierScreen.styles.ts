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
    calendarCard: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      overflow:        'hidden',
      paddingVertical: theme.spacing[1],
      shadowColor:     '#000',
      shadowOffset:    { width: 0, height: 2 },
      shadowOpacity:   0.08,
      shadowRadius:    6,
      elevation:       3,
    },
    sectionTitre: {
      fontSize:      theme.typography.size.sm,
      fontWeight:    '800',
      color:         theme.colors.textPrimary,
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
      borderLeftWidth: 4,
      shadowColor:     '#000',
      shadowOffset:    { width: 0, height: 1 },
      shadowOpacity:   0.05,
      shadowRadius:    3,
      elevation:       1,
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
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },
    statutPill: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical:   2,
      borderRadius:      theme.radius.full,
    },
    statutPillText: {
      fontSize:   10,
      fontWeight: '700',
    },
    itemMetaRow: {
      flexDirection: 'row',
      alignItems:    'center',
      columnGap:     theme.spacing[1],
    },
    itemMeta: {
      fontSize:   theme.typography.size.xs,
      fontWeight: '600',
    },
  });
