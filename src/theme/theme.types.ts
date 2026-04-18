/**
 * @file theme.types.ts
 * @description Définition de tous les types TypeScript liés au système de thème.
 *              Ce fichier est le "contrat" de notre thème — toute l'application
 *              doit respecter ces types pour garantir la cohérence visuelle.
 * @author Riahi Dorsaf
 */

import { spacing, radius } from './spacing';
import { typography } from './typography';

// ─────────────────────────────────────────────────────────────
// INTERFACE PRINCIPALE DES COULEURS
// ─────────────────────────────────────────────────────────────

/**
 * Toutes les couleurs disponibles dans l'application.
 * Chaque clé correspond à un usage sémantique précis.
 * On ne met JAMAIS de couleur hardcodée dans les composants —
 * on utilise toujours une clé de cette interface.
 */
export interface ThemeColors {
  // ── Couleurs de marque ──────────────────────────────────────
  /** Couleur principale de l'application (boutons, liens) */
  primary:        string;
  /** Couleur principale au survol */
  primaryHover:   string;
  /** Fond clair associé à la couleur principale */
  primaryLight:   string;
  /** Texte sur fond primaryLight */
  primaryText:    string;

  // ── Couleurs sémantiques ────────────────────────────────────
  /** Succès — validation, confirmation */
  success:        string;
  successLight:   string;
  successText:    string;

  /** Avertissement — attention, en attente */
  warning:        string;
  warningLight:   string;
  warningText:    string;

  /** Danger — erreur, suppression */
  danger:         string;
  dangerLight:    string;
  dangerText:     string;

  /** Information — aide, info */
  info:           string;
  infoLight:      string;
  infoText:       string;

  // ── Couleurs de texte ───────────────────────────────────────
  /** Texte principal — titres, contenu important */
  textPrimary:    string;
  /** Texte secondaire — descriptions, labels */
  textSecondary:  string;
  /** Texte tertiaire — hints, métadonnées */
  textTertiary:   string;
  /** Placeholder des champs de saisie */
  textPlaceholder:string;
  /** Texte sur fond sombre */
  textInverse:    string;

  // ── Couleurs d'arrière-plan ─────────────────────────────────
  /** Fond général de l'application */
  bgApp:          string;
  /** Fond des cartes et surfaces */
  bgSurface:      string;
  /** Fond au survol / états actifs */
  bgHover:        string;
  /** Fond overlay (modales, bottom sheets) */
  bgOverlay:      string;

  // ── Bordures ────────────────────────────────────────────────
  /** Bordure standard */
  border:         string;
  /** Bordure accentuée */
  borderStrong:   string;

  // ── Statuts du compte entreprise ───────────────────────────
  statutEnAttente:      string;
  statutEnAttenteLight: string;
  statutActive:         string;
  statutActiveLight:    string;
  statutRefuse:         string;
  statutRefuseLight:    string;
  statutSuspendu:       string;
  statutSuspenduLight:  string;

  // ── Couleurs utilitaires ────────────────────────────────────
  white:       string;
  black:       string;
  transparent: string;
  overlay:     string;
}

// ─────────────────────────────────────────────────────────────
// OBJET THÈME COMPLET
// ─────────────────────────────────────────────────────────────

/**
 * Objet thème complet passé à chaque composant via useStyles().
 * Il contient les couleurs MAIS AUSSI les espacements, rayons
 * et typographie — tout ce dont un composant a besoin pour
 * se styliser sans aucune valeur hardcodée.
 */
export interface AppTheme {
  /** Palette de couleurs (light ou dark) */
  colors:     ThemeColors;
  /** Espacements standard (4, 8, 12, 16, 20...) */
  spacing:    typeof spacing;
  /** Rayons de bordure (sm, md, lg, xl, full) */
  radius:     typeof radius;
  /** Tailles et graisses de police */
  typography: typeof typography;
  /** true si le thème sombre est actif */
  isDark:     boolean;
}

// ─────────────────────────────────────────────────────────────
// TYPE DU SCHÉMA DE COULEURS
// ─────────────────────────────────────────────────────────────

/**
 * Les deux modes de thème supportés par l'application.
 * - 'light' : thème clair (défaut)
 * - 'dark'  : thème sombre
 */
export type ColorScheme = 'light' | 'dark';