/**
 * @file LoginScreen.styles.ts
 * @description Styles de l'écran de connexion, définis via makeStyles
 *              pour un accès complet au thème (couleurs, spacing, typographie).
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

/**
 * Fabrique de styles pour LoginScreen.
 * Utilise les tokens du thème pour garantir la cohérence visuelle
 * et la compatibilité light/dark mode.
 *
 * @param theme - Thème courant injecté par useStyles()
 * @returns StyleSheet mémoïsé avec tous les styles de l'écran
 * @author Riahi Dorsaf
 */
export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    logoSection: {
      alignItems: 'center',
      paddingTop: theme.spacing[10],
      paddingBottom: theme.spacing[8],
    },
    logo: {
      width: 64,
      height: 64,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing[4],
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    logoText: {
      fontSize: 32,
      fontWeight: '800',
      color: theme.colors.white,
    },
    welcomeTitle: {
      fontSize: theme.typography.size.xl,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing[2],
    },
    welcomeSubtitle: {
      fontSize: theme.typography.size.base,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    card: {
      marginHorizontal: theme.spacing[1],
    },
    alertError: {
      backgroundColor: theme.colors.dangerLight,
      borderWidth: 1,
      borderColor: theme.colors.danger,
      borderRadius: theme.radius.md,
      padding: theme.spacing[3],
      marginBottom: theme.spacing[4],
    },
    alertText: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.dangerText,
    },
    btnSubmit: {
      marginTop: theme.spacing[2],
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing[6],
    },
    footerText: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.textSecondary,
    },
    footerLink: {
      fontSize: theme.typography.size.sm,
      fontWeight: '600',
      color: theme.colors.primary,
    },
  });