/**
 * @file darkTheme.ts
 * @description Palette de couleurs du thème SOMBRE (mode nuit).
 *              Activé par l'utilisateur via un bouton toggle dans l'app.
 *              Toutes les valeurs respectent l'interface ThemeColors —
 *              même structure que lightTheme.ts, couleurs inversées/adaptées.
 * @author Riahi Dorsaf
 */

import { ThemeColors } from './theme.types';

/**
 * Palette complète du thème sombre.
 * Principes appliqués :
 * - Fonds sombres (navy/slate) pour réduire la fatigue oculaire
 * - Couleurs primaires légèrement plus claires pour rester lisibles
 * - Couleurs sémantiques plus vives pour contraster sur fond sombre
 * - Texte moins blanc pur (#F9FAFB) pour éviter l'éblouissement
 */
export const darkColors: ThemeColors = {
  // ── Couleurs de marque ──────────────────────────────────────
  primary:        '#3B82F6', // Bleu plus clair — visible sur fond sombre
  primaryHover:   '#2563EB', // Bleu standard — état pressé
  primaryLight:   '#1E3A5F', // Bleu très sombre — fonds de badges
  primaryText:    '#93C5FD', // Bleu clair — lisible sur primaryLight sombre

  // ── Sémantiques ─────────────────────────────────────────────
  success:        '#22C55E', // Vert vif — visible sur fond sombre
  successLight:   '#14532D', // Vert très sombre — fond badge
  successText:    '#86EFAC', // Vert clair — lisible sur successLight sombre

  warning:        '#F59E0B', // Orange vif
  warningLight:   '#451A03', // Orange très sombre — fond badge
  warningText:    '#FCD34D', // Jaune clair — lisible sur warningLight sombre

  danger:         '#EF4444', // Rouge vif
  dangerLight:    '#450A0A', // Rouge très sombre — fond badge
  dangerText:     '#FCA5A5', // Rose clair — lisible sur dangerLight sombre

  info:           '#06B6D4', // Cyan vif
  infoLight:      '#083344', // Cyan très sombre — fond badge
  infoText:       '#67E8F9', // Cyan clair — lisible sur infoLight sombre

  // ── Texte ───────────────────────────────────────────────────
  textPrimary:    '#F9FAFB', // Blanc cassé — moins agressif que blanc pur
  textSecondary:  '#9CA3AF', // Gris clair — descriptions
  textTertiary:   '#6B7280', // Gris moyen — hints
  textPlaceholder:'#4B5563', // Gris foncé — placeholder inputs
  textInverse:    '#111827', // Quasi-noir — texte sur fond clair

  // ── Arrière-plans ───────────────────────────────────────────
  bgApp:          '#0F172A', // Bleu très sombre — fond général (slate-900)
  bgSurface:      '#1E293B', // Bleu sombre — fond cartes (slate-800)
  bgHover:        '#334155', // Bleu moyen — états hover (slate-700)
  bgOverlay:      'rgba(0,0,0,0.7)', // Noir plus opaque — modales

  // ── Bordures ────────────────────────────────────────────────
  border:         '#334155', // Slate-700 — bordures standard
  borderStrong:   '#475569', // Slate-600 — bordures accentuées

  // ── Statuts compte entreprise ───────────────────────────────
  statutEnAttente:      '#F59E0B', // Orange vif
  statutEnAttenteLight: '#451A03', // Orange très sombre
  statutActive:         '#22C55E', // Vert vif
  statutActiveLight:    '#14532D', // Vert très sombre
  statutRefuse:         '#EF4444', // Rouge vif
  statutRefuseLight:    '#450A0A', // Rouge très sombre
  statutSuspendu:       '#A78BFA', // Violet clair
  statutSuspenduLight:  '#2E1065', // Violet très sombre

  // ── Utilitaires ─────────────────────────────────────────────
  white:       '#FFFFFF',
  black:       '#000000',
  transparent: 'transparent',
  overlay:     'rgba(0, 0, 0, 0.7)', // Plus opaque qu'en light
};