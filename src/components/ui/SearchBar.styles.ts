/**
 * @file SearchBar.styles.ts
 * @description Styles de la barre de recherche.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

/**
 * @param theme - Thème courant injecté par useStyles()
 * @author Riahi Dorsaf
 */
export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection:     'row',
      alignItems:        'center',
      backgroundColor:   theme.colors.bgSurface,
      borderRadius:      theme.radius.lg,
      borderWidth:       1,
      borderColor:       theme.colors.border,
      paddingHorizontal: theme.spacing[4],
      paddingVertical:   theme.spacing[2] + 2,
    },
    iconLeft: {
      marginRight: theme.spacing[2],
    },
    input: {
      flex:      1,
      fontSize:  theme.typography.size.base,
      color:     theme.colors.textPrimary,
      padding:   0, // reset padding natif Android
    },
    clearBtn: {
      marginLeft:  theme.spacing[2],
      paddingLeft: theme.spacing[1],
    },
  });