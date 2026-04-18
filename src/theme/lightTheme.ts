/**
 * @file lightTheme.ts
 * @description Palette de couleurs du thème CLAIR (mode jour).
 *              C'est le thème par défaut de l'application.
 *              Toutes les valeurs respectent l'interface ThemeColors
 *              définie dans theme.types.ts — TypeScript vérifie
 *              automatiquement qu'aucune clé n'est oubliée.
 * @author Riahi Dorsaf
 */

import { ThemeColors } from './theme.types';

/**
 * Palette complète du thème clair.
 * Chaque couleur est choisie pour :
 * - Un contraste suffisant (accessibilité WCAG AA)
 * - Une cohérence visuelle professionnelle
 * - Une lisibilité optimale en pleine lumière
 */
export const lightColors: ThemeColors = {
  // ── Couleurs de marque ──────────────────────────────────────
  primary:        '#2563EB', // Bleu principal — boutons, liens, focus
  primaryHover:   '#1D4ED8', // Bleu foncé — état pressé
  primaryLight:   '#EFF6FF', // Bleu très clair — fonds de badges
  primaryText:    '#1E40AF', // Bleu texte — lisible sur primaryLight

  // ── Sémantiques ─────────────────────────────────────────────
  success:        '#16A34A', // Vert — succès, compte actif
  successLight:   '#F0FDF4', // Vert clair — fond badge succès
  successText:    '#15803D', // Vert texte — lisible sur successLight

  warning:        '#D97706', // Orange — avertissement, en attente
  warningLight:   '#FFFBEB', // Orange clair — fond badge warning
  warningText:    '#B45309', // Orange texte — lisible sur warningLight

  danger:         '#DC2626', // Rouge — erreur, suppression
  dangerLight:    '#FEF2F2', // Rouge clair — fond badge danger
  dangerText:     '#B91C1C', // Rouge texte — lisible sur dangerLight

  info:           '#0891B2', // Cyan — information
  infoLight:      '#ECFEFF', // Cyan clair — fond badge info
  infoText:       '#0E7490', // Cyan texte — lisible sur infoLight

  // ── Texte ───────────────────────────────────────────────────
  textPrimary:    '#111827', // Quasi-noir — titres, contenu principal
  textSecondary:  '#6B7280', // Gris moyen — descriptions, labels
  textTertiary:   '#9CA3AF', // Gris clair — hints, métadonnées
  textPlaceholder:'#9CA3AF', // Gris clair — placeholder inputs
  textInverse:    '#FFFFFF', // Blanc — texte sur fond sombre

  // ── Arrière-plans ───────────────────────────────────────────
  bgApp:          '#F3F4F6', // Gris très clair — fond général
  bgSurface:      '#FFFFFF', // Blanc — fond cartes, modales
  bgHover:        '#F9FAFB', // Gris quasi-blanc — états hover
  bgOverlay:      'rgba(0,0,0,0.4)', // Noir semi-transparent — modales

  // ── Bordures ────────────────────────────────────────────────
  border:         '#E5E7EB', // Gris clair — bordures standard
  borderStrong:   '#D1D5DB', // Gris moyen — bordures accentuées

  // ── Statuts compte entreprise ───────────────────────────────
  statutEnAttente:      '#D97706', // Orange
  statutEnAttenteLight: '#FFFBEB', // Orange clair
  statutActive:         '#16A34A', // Vert
  statutActiveLight:    '#F0FDF4', // Vert clair
  statutRefuse:         '#DC2626', // Rouge
  statutRefuseLight:    '#FEF2F2', // Rouge clair
  statutSuspendu:       '#7C3AED', // Violet
  statutSuspenduLight:  '#F5F3FF', // Violet clair

  // ── Utilitaires ─────────────────────────────────────────────
  white:       '#FFFFFF',
  black:       '#000000',
  transparent: 'transparent',
  overlay:     'rgba(0, 0, 0, 0.5)',
};