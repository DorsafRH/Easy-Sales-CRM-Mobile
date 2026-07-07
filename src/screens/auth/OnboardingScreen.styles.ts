/**
 * @file OnboardingScreen.styles.ts
 * @description Styles de l'écran d'onboarding, définis via makeStyles
 *              pour un accès complet au thème (couleurs, spacing, typographie).
 * @author Riahi Dorsaf
 */

import { Dimensions, StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

const { width } = Dimensions.get('window');

/**
 * Fabrique de styles pour OnboardingScreen.
 * Utilise les tokens du thème pour garantir la cohérence visuelle
 * et la compatibilité light/dark mode.
 *
 * @param theme - Thème courant injecté par useStyles()
 * @returns StyleSheet mémoïsé avec tous les styles de l'écran
 * @author Riahi Dorsaf
 */
export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    hero: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing[6],
      paddingTop: theme.spacing[12],
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing[6],
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 8,
    },
    logoText: {
      fontSize: 40,
      fontWeight: '800',
      color: theme.colors.white,
    },
    appName: {
      fontSize: theme.typography.size['2xl'],
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing[3],
      textAlign: 'center',
    },
    tagline: {
      fontSize: theme.typography.size.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: theme.typography.size.md * 1.6,
      marginBottom: theme.spacing[10],
    },
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: theme.spacing[3],
      rowGap: theme.spacing[3],
      justifyContent: 'center',
      width: '100%',
    },
    featureItem: {
      width: (width - theme.spacing[6] * 2 - theme.spacing[3]) / 2 - 1,
      backgroundColor: theme.colors.bgApp,
      borderRadius: theme.radius.lg,
      padding: theme.spacing[4],
      alignItems: 'center',
      rowGap: theme.spacing[2],
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    featureIcon: {
      fontSize: 28,
    },
    featureLabel: {
      fontSize: theme.typography.size.sm,
      fontWeight: '500',
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    actions: {
      paddingHorizontal: theme.spacing[5],
      paddingBottom: theme.spacing[10],
      rowGap: theme.spacing[3],
    },
    btnPrimary: {
      marginBottom: theme.spacing[1],
    },
    disclaimer: {
      fontSize: theme.typography.size.xs,
      color: theme.colors.textTertiary,
      textAlign: 'center',
      marginTop: theme.spacing[3],
    },
  });