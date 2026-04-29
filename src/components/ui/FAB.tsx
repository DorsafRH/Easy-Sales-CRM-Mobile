/**
 * @file FAB.tsx
 * @description Floating Action Button — bouton bleu en bas à droite
 *              présent sur toutes les listes (clients, produits, catégories).
 *              Utilise Ionicons pour l'icône (+).
 * @author Riahi Dorsaf
 */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './FAB.styles';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface FABProps {
  /** Callback déclenché au clic */
  onPress: () => void;
  /** Accessible label pour les lecteurs d'écran */
  accessibilityLabel?: string;
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Bouton d'action flottant (FAB) positionné en bas à droite de l'écran.
 * Affiche une icône "+" Ionicons de taille 28 (taille standard FAB).
 * Toujours de couleur primaire (#2563EB) avec shadow.
 *
 * @param onPress            - Callback de clic
 * @param accessibilityLabel - Label pour l'accessibilité
 * @author Riahi Dorsaf
 */
export const FAB: React.FC<FABProps> = ({
  onPress,
  accessibilityLabel = 'Ajouter',
}) => {
  const styles = useStyles(makeStyles);
  const theme  = useTheme();

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Ionicons
        name="add"
        size={28}
        color={theme.colors.white}
      />
    </TouchableOpacity>
  );
};