/**
 * @file RecapitulationScreen.styles.ts
 * @description Styles de l'écran de récapitulation (étape 3 d'inscription),
 *              définis via makeStyles pour un accès complet au thème.
 *              Regroupe les styles de l'écran principal, du composant Row,
 *              de l'état succès et du StepIndicator.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

/**
 * Fabrique de styles pour RecapitulationScreen et ses sous-composants
 * (Row, StepIndicator, vue succès). Tous les styles sont regroupés
 * dans un seul objet mémoïsé avec des préfixes pour éviter les collisions.
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
    section: {
      marginBottom: theme.spacing[4],
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: theme.spacing[2],
      rowGap: theme.spacing[2],
      marginBottom: theme.spacing[4],
      paddingBottom: theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    sectionIcon: {
      fontSize: 18,
    },
    sectionTitle: {
      flex: 1,
      fontSize: theme.typography.size.base,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    editLink: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    terms: {
      backgroundColor: theme.colors.bgApp,
      borderRadius: theme.radius.md,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[4],
    },
    termsText: {
      fontSize: theme.typography.size.xs,
      color: theme.colors.textTertiary,
      lineHeight: theme.typography.size.xs * 1.7,
      textAlign: 'center',
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

    // ── Sous-composant Row ───────────────────────────────────────
    rowRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing[2],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },
    rowLabel: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.textSecondary,
      flex: 1,
    },
    rowValue: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.textPrimary,
      fontWeight: '500',
      flex: 1.5,
      textAlign: 'right',
    },
    rowMono: {
      fontFamily: 'monospace',
    },

    // ── Vue succès ───────────────────────────────────────────────
    successContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing[5],
      paddingVertical: theme.spacing[8],
    },
    successIconWrapper: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: theme.colors.successLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing[6],
    },
    successIcon: {
      fontSize: 48,
    },
    successTitle: {
      fontSize: theme.typography.size.xl,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing[3],
      textAlign: 'center',
    },
    successSubtitle: {
      fontSize: theme.typography.size.base,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: theme.typography.size.base * 1.6,
      marginBottom: theme.spacing[6],
    },
    successInfoCard: {
      width: '100%',
      marginBottom: theme.spacing[6],
      rowGap: theme.spacing[3],
    },
    successInfoRow: {
      flexDirection: 'row',
      columnGap: theme.spacing[3],
      alignItems: 'flex-start',
    },
    successInfoText: {
      flex: 1,
      fontSize: theme.typography.size.sm,
      color: theme.colors.textSecondary,
      lineHeight: theme.typography.size.sm * 1.6,
    },
    successEmailHighlight: {
      color: theme.colors.primary,
    },
    successBtn: {
      width: '100%',
      marginBottom: theme.spacing[3],
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
