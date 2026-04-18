/**
 * @file StatutCompteScreen.styles.ts
 * @description Styles de l'écran de statut du compte, définis via makeStyles
 *              pour un accès complet au thème. Regroupe les styles principaux
 *              et ceux du sous-composant InfoRow.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

/**
 * Fabrique de styles pour StatutCompteScreen et son sous-composant InfoRow.
 *
 * @param theme - Thème courant injecté par useStyles()
 * @returns StyleSheet mémoïsé avec tous les styles de l'écran
 * @author Riahi Dorsaf
 */
export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    // ── Layout racine ────────────────────────────────────────────
    safe: {
      flex: 1,
      backgroundColor: theme.colors.bgApp,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingHorizontal: theme.spacing[5],
      paddingTop: theme.spacing[4],
      paddingBottom: theme.spacing[10],
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loading: {
      fontSize: theme.typography.size.base,
      color: theme.colors.textSecondary,
    },

    // ── Barre supérieure ─────────────────────────────────────────
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[5],
    },
    greeting: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    companyName: {
      fontSize: theme.typography.size.lg,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    logoutBtn: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.bgSurface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoutIcon: {
      fontSize: 18,
      color: theme.colors.textSecondary,
    },

    // ── Carte de statut ──────────────────────────────────────────
    statusCard: {
      borderRadius: theme.radius.xl,
      padding: theme.spacing[6],
      alignItems: 'center',
      marginBottom: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    statusEmoji: {
      fontSize: 36,
      marginBottom: theme.spacing[4],
    },
    statusTitle: {
      fontSize: theme.typography.size.lg,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      textAlign: 'center',
      marginBottom: theme.spacing[3],
      marginTop: theme.spacing[4],
    },
    statusSubtitle: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: theme.typography.size.sm * 1.6,
      marginBottom: theme.spacing[4],
    },
    motifBox: {
      width: '100%',
      backgroundColor: theme.colors.dangerLight,
      borderRadius: theme.radius.md,
      padding: theme.spacing[4],
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.danger,
      marginBottom: theme.spacing[4],
    },
    motifLabel: {
      fontSize: theme.typography.size.xs,
      fontWeight: '600',
      color: theme.colors.dangerText,
      marginBottom: theme.spacing[2],
    },
    motifText: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.dangerText,
    },
    refreshHint: {
      fontSize: theme.typography.size.xs,
      color: theme.colors.textTertiary,
      marginTop: theme.spacing[2],
    },

    // ── Carte informations ───────────────────────────────────────
    infoCard: {
      marginBottom: theme.spacing[4],
    },
    cardTitle: {
      fontSize: theme.typography.size.base,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing[4],
    },

    // ── Grille modules ───────────────────────────────────────────
    modulesCard: {
      marginBottom: theme.spacing[4],
    },
    modulesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: theme.spacing[3],
      rowGap: theme.spacing[3],
    },
    moduleItem: {
      width: '45%',
      alignItems: 'center',
      rowGap: theme.spacing[2],
    },
    moduleIcon: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.bgApp,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    moduleEmoji: {
      fontSize: 24,
    },
    moduleLabel: {
      fontSize: theme.typography.size.sm,
      fontWeight: '500',
      color: theme.colors.textTertiary,
      textAlign: 'center',
    },
    moduleSprint: {
      fontSize: theme.typography.size.xs,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    btnLogout: {
      marginTop: theme.spacing[2],
    },

    // ── Sous-composant InfoRow ───────────────────────────────────
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing[2],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },
    infoLabel: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.textSecondary,
    },
    infoValue: {
      fontSize: theme.typography.size.sm,
      fontWeight: '500',
      color: theme.colors.textPrimary,
      flex: 1,
      textAlign: 'right',
    },
    infoMono: {
      fontFamily: 'monospace',
      fontSize: theme.typography.size.xs,
    },
  });
