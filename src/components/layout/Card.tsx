/**
 * @file Card.tsx
 * @description Composant de surface élevée (carte) servant de conteneur
 *              visuel avec ombre, bordure et fond thématisé.
 * @author Riahi Dorsaf
 */

import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { useStyles } from '../../theme';
import { makeStyles } from './Card.styles';

interface CardProps {
  children: ReactNode;
  style?:   ViewStyle;
  padded?:  boolean;
}

/**
 * Carte — conteneur visuel avec élévation, bordure et fond thématisé.
 * Utilisé pour regrouper des informations connexes dans un bloc distinct.
 *
 * @param children - Contenu de la carte
 * @param style    - Styles additionnels appliqués au conteneur
 * @param padded   - Si true (défaut), applique un padding interne standard
 * @author Riahi Dorsaf
 */
export const Card: React.FC<CardProps> = ({ children, style, padded = true }) => {
  const styles = useStyles(makeStyles);

  return (
    <View style={[styles.card, padded && styles.padded, style]}>
      {children}
    </View>
  );
};
