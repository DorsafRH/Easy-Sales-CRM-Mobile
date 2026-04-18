/**
 * @file InformationsEntrepriseScreen.styles.ts
 * @description Styles de l'écran d'informations entreprise (étape 1 d'inscription),
 *              définis via makeStyles pour un accès complet au thème.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

/**
 * Fabrique de styles pour InformationsEntrepriseScreen et son sous-composant StepIndicator.
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
    fieldGroup: {
      marginBottom: theme.spacing[4],
    },
    fieldLabel: {
      fontSize: theme.typography.size.sm,
      fontWeight: '500',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing[2],
    },
    required: {
      color: theme.colors.danger,
    },
    sectorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: theme.spacing[2],
      rowGap: theme.spacing[2],
    },
    chip: {
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
      borderRadius: theme.radius.full,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.bgSurface,
    },
    chipActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
    },
    chipText: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },
    chipTextActive: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    tailleRow: {
      flexDirection: 'row',
      columnGap: theme.spacing[2],
      rowGap: theme.spacing[2],
    },
    tailleCard: {
      flex: 1,
      padding: theme.spacing[3],
      borderRadius: theme.radius.md,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.bgSurface,
      alignItems: 'center',
    },
    tailleCardActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
    },
    tailleLabel: {
      fontSize: theme.typography.size.md,
      fontWeight: '700',
      color: theme.colors.textSecondary,
    },
    tailleLabelActive: {
      color: theme.colors.primary,
    },
    tailleDesc: {
      fontSize: theme.typography.size.xs,
      color: theme.colors.textTertiary,
      textAlign: 'center',
      marginTop: theme.spacing[1],
    },
    tailleDescActive: {
      color: theme.colors.primaryText,
    },
    row: {
      flexDirection: 'row',
      columnGap: theme.spacing[3],
      rowGap: theme.spacing[3],
    },
    rowItem: {
      flex: 1,
    },
    error: {
      fontSize: theme.typography.size.xs,
      color: theme.colors.danger,
      marginTop: theme.spacing[1],
    },
    btn: {
      marginBottom: theme.spacing[6],
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
