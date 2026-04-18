/**
 * @file index.ts
 * @description Point d'entrée unique du système de thème.
 *
 *              POURQUOI UN INDEX.TS ?
 *              Sans ce fichier, chaque composant devrait importer
 *              depuis des chemins différents :
 *              import { useStyles } from '../../theme/useStyles';
 *              import { AppTheme } from '../../theme/theme.types';
 *              import { useTheme } from '../../theme/themeStore';
 *
 *              Avec ce fichier, tout vient d'un seul endroit :
 *              import { useStyles, AppTheme, useTheme } from '../../theme';
 *
 *              C'est le pattern "Barrel Export" — standard en TypeScript.
 *
 * @author Riahi Dorsaf
 */

// ── Tokens de base (compatibilité avec l'existant) ──────────
// Ces exports permettent de garder la compatibilité avec le code
// existant qui importe depuis '../../theme' directement.
export * from './colors';
export * from './spacing';
export * from './typography';

// ── Système de thème ────────────────────────────────────────
// Types TypeScript du thème
export * from './theme.types';

// Palettes de couleurs
export * from './lightTheme';
export * from './darkTheme';

// Store Zustand + hook useTheme()
export * from './themeStore';

// Hook useStyles() + type StyleFactory
export * from './useStyles';