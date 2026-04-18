/**
 * @file Input.tsx
 * @description Composant champ de saisie générique avec support du label,
 *              validation d'erreur, champ obligatoire et affichage/masquage
 *              du mot de passe.
 * @author Riahi Dorsaf
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  TextInputProps, ViewStyle,
} from 'react-native';
import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './Input.styles';

interface InputProps extends TextInputProps {
  label?:          string;
  error?:          string;
  required?:       boolean;
  isPassword?:     boolean;
  containerStyle?: ViewStyle;
}

/**
 * Champ de saisie générique de l'application.
 * Gère l'affichage du label, du marqueur obligatoire (*), du message d'erreur
 * et du bouton de bascule visibilité pour les champs mot de passe.
 *
 * @param label          - Texte du label affiché au-dessus du champ
 * @param error          - Message d'erreur affiché sous le champ (bordure rouge si présent)
 * @param required       - Si true, affiche un astérisque rouge après le label
 * @param isPassword     - Si true, masque la saisie et affiche un bouton œil
 * @param containerStyle - Styles additionnels appliqués au conteneur
 * @author Riahi Dorsaf
 */
export const Input: React.FC<InputProps> = ({
  label, error, required = false, isPassword = false,
  containerStyle, ...rest
}) => {
  const styles = useStyles(makeStyles);
  const theme  = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.textPlaceholder}
          secureTextEntry={isPassword ? !showPassword : rest.secureTextEntry}
          autoCapitalize="none"
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword(v => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
