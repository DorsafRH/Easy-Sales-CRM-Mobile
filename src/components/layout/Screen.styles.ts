/**
 * @file Screen.styles.ts
 * @description Styles du composant Screen, définis via makeStyles
 *              pour un accès complet au thème (couleurs, spacing).
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

/**
 * Fabrique de styles pour le composant Screen.
 *
 * @param theme - Thème courant injecté par useStyles()
 * @returns StyleSheet mémoïsé avec tous les styles de l'écran conteneur
 * @author Riahi Dorsaf
 */
export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.colors.bgApp,
    },
    keyboard: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: theme.spacing[10],
    },
    fixedContent: {
      flex: 1,
    },
    padded: {
      paddingHorizontal: theme.spacing[5],
    },
  });
