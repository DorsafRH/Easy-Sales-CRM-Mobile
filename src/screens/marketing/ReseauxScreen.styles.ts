/**
 * @file ReseauxScreen.styles.ts
 * @description Styles de l'onglet Réseaux sociaux.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';
import { layout } from '../../theme/dimensions';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[4],
      paddingBottom:     theme.spacing[16],
    },
    sectionTitre: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.textSecondary,
      marginTop:  theme.spacing[4],
      marginBottom: theme.spacing[3],
      textTransform: 'uppercase',
    },
    connectBtn: {
      flexDirection:   'row',
      alignItems:      'center',
      columnGap:       theme.spacing[3],
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      marginBottom:    theme.spacing[3],
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },
    connectIcon: {
      width:          40,
      height:         40,
      borderRadius:   20,
      alignItems:     'center',
      justifyContent: 'center',
    },
    connectLabel: {
      flex:       1,
      fontSize:   theme.typography.size.base,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },
    compteItem: {
      flexDirection:   'row',
      alignItems:      'center',
      columnGap:       theme.spacing[3],
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      marginBottom:    theme.spacing[3],
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },
    compteInfo: {
      flex:      1,
      rowGap:    theme.spacing[1],
      alignItems: 'flex-start',
    },
    compteNom: {
      fontSize:   theme.typography.size.base,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },
    messageBox: {
      backgroundColor: theme.colors.warningLight,
      borderRadius:    theme.radius.md,
      padding:         theme.spacing[3],
      marginBottom:    theme.spacing[2],
    },
    messageText: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.warningText,
    },
  });
