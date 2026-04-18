/**
 * @file InformationsProprietaireScreen.styles.ts
 * @description Styles de l'écran d'informations propriétaire (étape 2 d'inscription),
 *              définis via makeStyles pour un accès complet au thème.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

/**
 * Fabrique de styles pour InformationsProprietaireScreen et son sous-composant StepIndicator.
 * Regroupe les styles principaux et les styles du stepper dans un seul objet mémoïsé.
 *
 * @param theme - Thème courant injecté par useStyles()
 * @returns StyleSheet mémoïsé avec tous les styles de l'écran
 * @author Riahi Dorsaf
 */
export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    // ── Écran principal ─────────────────────────────────────────
    title: {
      fontSize: theme.typography.size.xl,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing[2],
      marginTop: theme.spacing[4],
    },
    subtitle: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing[5],
    },
    card: {
      marginBottom: theme.spacing[4],
    },
    row: {
      flexDirection: 'row',
      columnGap: theme.spacing[3],
      rowGap: theme.spacing[3],
    },
    rowItem: {
      flex: 1,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: theme.spacing[3],
      rowGap: theme.spacing[3],
      marginBottom: theme.spacing[4],
      marginTop: theme.spacing[2],
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    dividerText: {
      fontSize: theme.typography.size.xs,
      fontWeight: '600',
      color: theme.colors.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    strengthWrapper: {
      marginBottom: theme.spacing[4],
      marginTop: -theme.spacing[2],
    },
    strengthBar: {
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: theme.radius.full,
      marginBottom: theme.spacing[1],
    },
    strengthFill: {
      height: 4,
      borderRadius: theme.radius.full,
    },
    strengthLabel: {
      fontSize: theme.typography.size.xs,
      fontWeight: '500',
    },
    btnRow: {
      flexDirection: 'row',
      columnGap: theme.spacing[3],
      rowGap: theme.spacing[3],
      marginBottom: theme.spacing[6],
    },
    btnBack: {
      flex: 1,
    },
    btnNext: {
      flex: 2,
    },

    // ── StepIndicator ────────────────────────────────────────────
    stepWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: theme.spacing[4],
    },
    stepDot: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.bgSurface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepDotActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    stepDotDone: {
      borderColor: theme.colors.success,
      backgroundColor: theme.colors.success,
    },
    stepDotText: {
      fontSize: theme.typography.size.sm,
      fontWeight: '600',
      color: theme.colors.textTertiary,
    },
    stepDotTextLight: {
      color: theme.colors.white,
    },
    stepLine: {
      flex: 1,
      height: 2,
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing[1],
    },
    stepLineDone: {
      backgroundColor: theme.colors.success,
    },
  });
