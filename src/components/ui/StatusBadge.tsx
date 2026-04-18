/**
 * @file StatusBadge.tsx
 * @description Composant badge affichant le statut du compte entreprise
 *              avec une couleur sémantique et un indicateur visuel (point coloré).
 * @author Riahi Dorsaf
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useStyles, useTheme, AppTheme } from '../../theme';
import { StatutCompte } from '../../types/entreprise.types';
import { makeStyles } from './StatusBadge.styles';

/**
 * Retourne la configuration visuelle (label, couleur de fond, couleur de texte)
 * associée à chaque statut de compte, en utilisant les tokens du thème.
 *
 * @param theme - Thème courant pour résoudre les couleurs sémantiques
 * @returns Dictionnaire statut → { label, bg, text }
 * @author Riahi Dorsaf
 */
const getConfig = (theme: AppTheme): Record<StatutCompte, { label: string; bg: string; text: string }> => ({
  EN_ATTENTE: { label: 'En attente', bg: theme.colors.statutEnAttenteLight, text: theme.colors.statutEnAttente },
  ACTIVE:     { label: 'Actif',      bg: theme.colors.statutActiveLight,    text: theme.colors.statutActive    },
  REFUSE:     { label: 'Refusé',     bg: theme.colors.statutRefuseLight,    text: theme.colors.statutRefuse    },
  SUSPENDU:   { label: 'Suspendu',   bg: theme.colors.statutSuspenduLight,  text: theme.colors.statutSuspendu  },
});

/**
 * Badge de statut du compte entreprise.
 * Affiche un point coloré et un libellé avec un fond sémantique
 * selon le statut (EN_ATTENTE, ACTIVE, REFUSE, SUSPENDU).
 *
 * @param statut - Statut du compte à afficher
 * @author Riahi Dorsaf
 */
export const StatusBadge: React.FC<{ statut: StatutCompte }> = ({ statut }) => {
  const styles = useStyles(makeStyles);
  const theme  = useTheme();
  const config = getConfig(theme)[statut] ?? getConfig(theme).EN_ATTENTE;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.text }]} />
      <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};
