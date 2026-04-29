/**
 * @file Badge.tsx
 * @description Composant badge générique pour afficher un statut ou un type
 *              avec une couleur sémantique.
 *              Utilisé pour : type client (INDIVIDUEL/ENTREPRISE),
 *              statut produit (ACTIF/INACTIF/ARCHIVE), badge "Principal" contact.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './Badge.styles';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type BadgeVariant =
  | 'success'   // Vert  — ACTIF, ENTREPRISE
  | 'warning'   // Orange — EN_ATTENTE, INDIVIDUEL
  | 'danger'    // Rouge  — INACTIF, ARCHIVE
  | 'primary'   // Bleu   — Principal, Entreprise
  | 'neutral';  // Gris   — défaut

interface BadgeProps {
  /** Texte à afficher dans le badge */
  label:     string;
  /** Variante de couleur (défaut : 'neutral') */
  variant?:  BadgeVariant;
  /** Affiche un point coloré avant le label (défaut : false) */
  withDot?:  boolean;
}

// ─────────────────────────────────────────────────────────────
// CONFIGURATION DES VARIANTES
// ─────────────────────────────────────────────────────────────

/**
 * Map variante → couleurs (bg + text).
 * Les couleurs sont récupérées du thème au moment du rendu.
 */
const useVariantColors = (variant: BadgeVariant) => {
  const theme = useTheme();
  const map: Record<BadgeVariant, { bg: string; text: string }> = {
    success: { bg: theme.colors.successLight, text: theme.colors.success     },
    warning: { bg: theme.colors.warningLight, text: theme.colors.warning     },
    danger:  { bg: theme.colors.dangerLight,  text: theme.colors.danger      },
    primary: { bg: theme.colors.primaryLight, text: theme.colors.primary     },
    neutral: { bg: theme.colors.bgApp,        text: theme.colors.textSecondary },
  };
  return map[variant];
};

// ─────────────────────────────────────────────────────────────
// HELPERS — VARIANTE AUTOMATIQUE DEPUIS LA VALEUR
// ─────────────────────────────────────────────────────────────

/**
 * Déduit la variante de couleur depuis une valeur de statut/type connue.
 * Pratique pour éviter de spécifier la variante manuellement.
 *
 * @param value - Valeur du statut/type (ex: 'ACTIF', 'INDIVIDUEL')
 * @returns Variante de couleur appropriée
 * @author Riahi Dorsaf
 */
export const variantFromValue = (value: string): BadgeVariant => {
  switch (value?.toUpperCase()) {
    case 'ACTIF':
    case 'ACTIVE':
    case 'ENTREPRISE':
      return 'success';
    case 'INDIVIDUEL':
    case 'EN_ATTENTE':
      return 'warning';
    case 'INACTIF':
    case 'ARCHIVE':
    case 'REFUSE':
      return 'danger';
    case 'PRINCIPAL':
      return 'primary';
    default:
      return 'neutral';
  }
};

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Badge coloré réutilisable avec variantes sémantiques.
 *
 * @param label   - Texte du badge
 * @param variant - Couleur sémantique (défaut : 'neutral')
 * @param withDot - Affiche un point coloré (défaut : false)
 * @author Riahi Dorsaf
 */
export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  withDot = false,
}) => {
  const styles = useStyles(makeStyles);
  const colors = useVariantColors(variant);

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg },
      ]}
    >
      {withDot && (
        <View style={[styles.dot, { backgroundColor: colors.text }]} />
      )}
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
      </Text>
    </View>
  );
};