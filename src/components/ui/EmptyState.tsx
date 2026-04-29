/**
 * @file EmptyState.tsx
 * @description Composant d'état vide affiché quand une liste ne contient
 *              aucun élément (après chargement ou après filtrage sans résultat).
 *              Affiche une icône Ionicons, un titre et un sous-titre.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './EmptyState.styles';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface EmptyStateProps {
  /** Nom de l'icône Ionicons à afficher */
  icon:      string;
  /** Titre principal */
  titre:     string;
  /** Sous-titre descriptif */
  soustitre: string;
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * État vide centré avec icône, titre et sous-titre.
 * À utiliser dans ScrollView ou FlatList quand la liste est vide.
 *
 * @param icon      - Nom de l'icône Ionicons (ex: 'people-outline')
 * @param titre     - Message principal (ex: 'Aucun client')
 * @param soustitre - Message secondaire (ex: 'Ajoutez votre premier client')
 * @author Riahi Dorsaf
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  titre,
  soustitre,
}) => {
  const styles = useStyles(makeStyles);
  const theme  = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons
          name={icon as any}
          size={48}
          color={theme.colors.textTertiary}
        />
      </View>
      <Text style={styles.titre}>{titre}</Text>
      <Text style={styles.soustitre}>{soustitre}</Text>
    </View>
  );
};