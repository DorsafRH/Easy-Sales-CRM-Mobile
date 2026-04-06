/**
 * colors.ts
 * ============================================================
 * FICHIER UNIQUE DE CONFIGURATION DES COULEURS
 * Pour changer les couleurs de toute l'application mobile,
 * modifiez uniquement ce fichier.
 * ============================================================
 */

export const colors = {
  // ── Couleurs principales ──────────────────────────────────
  primary:        '#2563EB',
  primaryHover:   '#1D4ED8',
  primaryLight:   '#EFF6FF',
  primaryText:    '#1E40AF',

  // ── Sémantiques ───────────────────────────────────────────
  success:        '#16A34A',
  successLight:   '#F0FDF4',
  successText:    '#15803D',

  warning:        '#D97706',
  warningLight:   '#FFFBEB',
  warningText:    '#B45309',

  danger:         '#DC2626',
  dangerLight:    '#FEF2F2',
  dangerText:     '#B91C1C',

  info:           '#0891B2',
  infoLight:      '#ECFEFF',
  infoText:       '#0E7490',

  // ── Texte ─────────────────────────────────────────────────
  textPrimary:    '#111827',
  textSecondary:  '#6B7280',
  textTertiary:   '#9CA3AF',
  textPlaceholder:'#9CA3AF',
  textInverse:    '#FFFFFF',

  // ── Arrière-plans ─────────────────────────────────────────
  bgApp:          '#F3F4F6',
  bgSurface:      '#FFFFFF',
  bgHover:        '#F9FAFB',

  // ── Bordures ──────────────────────────────────────────────
  border:         '#E5E7EB',
  borderStrong:   '#D1D5DB',

  // ── Statuts compte ────────────────────────────────────────
  statutEnAttente:      '#D97706',
  statutEnAttenteLight: '#FFFBEB',
  statutActive:         '#16A34A',
  statutActiveLight:    '#F0FDF4',
  statutRefuse:         '#DC2626',
  statutRefuseLight:    '#FEF2F2',
  statutSuspendu:       '#7C3AED',
  statutSuspenduLight:  '#F5F3FF',

  // ── Divers ────────────────────────────────────────────────
  white:       '#FFFFFF',
  black:       '#000000',
  transparent: 'transparent',
  overlay:     'rgba(0, 0, 0, 0.5)',
} as const;