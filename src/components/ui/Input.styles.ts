/**
 * @file Input.styles.ts
 * @description Styles du composant Input, définis via makeStyles
 *              pour un accès complet au thème (couleurs, spacing, typographie).
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

/**
 * Fabrique de styles pour le composant Input.
 *
 * @param theme - Thème courant injecté par useStyles()
 * @returns StyleSheet mémoïsé avec tous les styles du champ de saisie
 * @author Riahi Dorsaf
 */
export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing[4],
    },
    label: {
      fontSize: theme.typography.size.sm,
      fontWeight: '500',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing[2],
    },
    required: {
      color: theme.colors.danger,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.bgSurface,
      paddingHorizontal: theme.spacing[4],
    },
    inputError: {
      borderColor: theme.colors.danger,
    },
    input: {
      flex: 1,
      paddingVertical: theme.spacing[3],
      fontSize: theme.typography.size.base,
      color: theme.colors.textPrimary,
    },
    eyeBtn: {
      padding: theme.spacing[1],
      marginLeft: theme.spacing[2],
    },
    errorText: {
      fontSize: theme.typography.size.xs,
      color: theme.colors.danger,
      marginTop: theme.spacing[1],
    },
  });
