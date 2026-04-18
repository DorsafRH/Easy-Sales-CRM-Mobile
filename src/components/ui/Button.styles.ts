/**
 * @file Button.styles.ts
 * @description Styles du composant Button, définis via makeStyles.
 *              Les clés de variante et de taille sont nommées pour correspondre
 *              aux accès dynamiques dans Button.tsx (ex: styles[variant], styles[`size_${size}`]).
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

/**
 * Fabrique de styles pour le composant Button.
 * Les noms de clés sont intentionnellement calqués sur les valeurs des types
 * Variant et Size pour permettre les accès dynamiques dans le composant.
 *
 * @param theme - Thème courant injecté par useStyles()
 * @returns StyleSheet mémoïsé avec tous les styles du bouton
 * @author Riahi Dorsaf
 */
export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    // ── Base ─────────────────────────────────────────────────────
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.md,
    },
    fullWidth: {
      width: '100%',
    },
    disabled: {
      opacity: 0.55,
    },

    // ── Variantes ────────────────────────────────────────────────
    primary: {
      backgroundColor: theme.colors.primary,
    },
    secondary: {
      backgroundColor: theme.colors.bgHover,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    outline: {
      backgroundColor: theme.colors.transparent,
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
    },
    danger: {
      backgroundColor: theme.colors.danger,
    },
    ghost: {
      backgroundColor: theme.colors.transparent,
    },

    // ── Tailles ──────────────────────────────────────────────────
    size_sm: {
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
    },
    size_md: {
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[5],
    },
    size_lg: {
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[6],
    },

    // ── Labels ───────────────────────────────────────────────────
    label: {
      fontWeight: '600',
    },
    label_primary: {
      color: theme.colors.white,
    },
    label_secondary: {
      color: theme.colors.textPrimary,
    },
    label_outline: {
      color: theme.colors.primary,
    },
    label_danger: {
      color: theme.colors.white,
    },
    label_ghost: {
      color: theme.colors.primary,
    },

    // ── Tailles de label ─────────────────────────────────────────
    labelSize_sm: {
      fontSize: theme.typography.size.sm,
    },
    labelSize_md: {
      fontSize: theme.typography.size.base,
    },
    labelSize_lg: {
      fontSize: theme.typography.size.md,
    },
  });
