/**
 * @file SearchBar.tsx
 * @description Barre de recherche réutilisable avec icône loupe (Feather)
 *              et bouton de réinitialisation. Utilisée dans les listes
 *              clients, catalogue, contacts.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './SearchBar.styles';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface SearchBarProps {
  /** Valeur courante du champ de recherche */
  value:          string;
  /** Callback déclenché à chaque modification */
  onChangeText:   (text: string) => void;
  /** Placeholder du champ (défaut : 'Rechercher…') */
  placeholder?:   string;
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Barre de recherche avec icône loupe à gauche et bouton X à droite.
 * Le bouton X s'affiche uniquement si le champ n'est pas vide.
 *
 * @param value         - Texte courant
 * @param onChangeText  - Callback de modification
 * @param placeholder   - Placeholder (défaut : 'Rechercher…')
 * @author Riahi Dorsaf
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Rechercher…',
}) => {
  const styles = useStyles(makeStyles);
  const theme  = useTheme();

  return (
    <View style={styles.container}>
      <Feather
        name="search"
        size={18}
        color={theme.colors.textTertiary}
        style={styles.iconLeft}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textPlaceholder}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.clearBtn}
        >
          <Feather
            name="x"
            size={16}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};