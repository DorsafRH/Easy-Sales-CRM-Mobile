/**
 * @file Avatar.styles.ts
 * @description Styles du composant Avatar.
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
      alignItems:     'center',
      justifyContent: 'center',
      // width / height / borderRadius / backgroundColor injectés inline
      // depuis les SIZE_CONFIG pour éviter de créer N variantes de styles
    },
    initiales: {
      fontWeight: '700',
      letterSpacing: 0.5,
      // fontSize / color injectés inline depuis SIZE_CONFIG
    },
  });