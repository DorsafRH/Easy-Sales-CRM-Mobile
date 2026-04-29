/**
 * @file FilterChips.tsx
 * @description Composant de filtres en chips horizontaux défilants.
 *              Utilisé pour les filtres [Tous / Entreprises / Individuels]
 *              dans la liste clients, et [Tous / Services / Stockables] dans le catalogue.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './FilterChips.styles';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface FilterChip {
  /** Valeur transmise au parent lors de la sélection */
  value:  string;
  /** Libellé affiché dans le chip */
  label:  string;
}

interface FilterChipsProps {
  /** Liste des options disponibles */
  chips:    FilterChip[];
  /** Valeur actuellement sélectionnée */
  selected: string;
  /** Callback déclenché à la sélection d'un chip */
  onSelect: (value: string) => void;
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Barre de filtres en chips horizontaux défilants.
 * Le chip sélectionné est mis en surbrillance bleu.
 * Les chips non sélectionnés ont un fond gris clair et une bordure.
 *
 * @param chips    - Options disponibles { value, label }[]
 * @param selected - Valeur du chip actuellement actif
 * @param onSelect - Callback de sélection
 * @author Riahi Dorsaf
 */
export const FilterChips: React.FC<FilterChipsProps> = ({
  chips,
  selected,
  onSelect,
}) => {
  const styles = useStyles(makeStyles);
  const theme  = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {chips.map((chip) => {
        const isActive = chip.value === selected;
        return (
          <TouchableOpacity
            key={chip.value}
            style={[
              styles.chip,
              isActive && {
                backgroundColor: theme.colors.primary,
                borderColor:     theme.colors.primary,
              },
            ]}
            onPress={() => onSelect(chip.value)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.chipLabel,
                isActive && { color: theme.colors.white },
              ]}
            >
              {chip.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};