/**
 * @file Avatar.tsx
 * @description Composant avatar affichant les initiales d'un nom
 *              avec une couleur de fond déterministe (même nom = même couleur).
 *              Utilisé dans les listes clients, contacts et activité récente.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useStyles } from '../../theme';
import { makeStyles } from './Avatar.styles';
import { getAvatarColor } from '../../hooks/useAvatarColor';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  /** Nom d'affichage utilisé pour générer les initiales et la couleur */
  nom:    string;
  /** Taille de l'avatar (défaut : 'md') */
  size?:  AvatarSize;
}

// ─────────────────────────────────────────────────────────────
// DIMENSIONS PAR TAILLE
// ─────────────────────────────────────────────────────────────

const SIZE_CONFIG: Record<AvatarSize, { container: number; fontSize: number; radius: number }> = {
  sm: { container: 32, fontSize: 12, radius: 16 },
  md: { container: 44, fontSize: 16, radius: 22 },
  lg: { container: 56, fontSize: 20, radius: 28 },
  xl: { container: 72, fontSize: 26, radius: 36 },
};

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Avatar à initiales colorées.
 * La couleur est calculée de façon déterministe depuis le nom :
 * le même nom produit toujours la même couleur, même après reload.
 *
 * @param nom  - Nom d'affichage (client, contact, entreprise)
 * @param size - Taille : 'sm' | 'md' | 'lg' | 'xl' (défaut 'md')
 * @author Riahi Dorsaf
 */
export const Avatar: React.FC<AvatarProps> = ({ nom, size = 'md' }) => {
  const styles = useStyles(makeStyles);
  const { bg, text, initiales } = getAvatarColor(nom);
  const config = SIZE_CONFIG[size];

  return (
    <View
      style={[
        styles.container,
        {
          width:           config.container,
          height:          config.container,
          borderRadius:    config.radius,
          backgroundColor: bg,
        },
      ]}
    >
      <Text
        style={[
          styles.initiales,
          {
            fontSize: config.fontSize,
            color:    text,
          },
        ]}
      >
        {initiales}
      </Text>
    </View>
  );
};