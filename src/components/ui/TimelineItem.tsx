/**
 * @file TimelineItem.tsx
 * @description Élément de timeline pour l'historique des activités commerciales.
 *              Affiche icône du type + sujet + notes + résultat + date relative.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles } from '../../theme';
import { makeStyles } from './TimelineItem.styles';
import {
  ActiviteCommercialeResponse,
  TYPE_ACTIVITE_COMMERCIALE_CONFIG,
  ResultatActivite,
} from '../../types/vente.types';

interface TimelineItemProps {
  activite:  ActiviteCommercialeResponse;
  isLast?:   boolean;
}

const RESULTAT_CONFIG: Record<ResultatActivite, { label: string; color: string; bg: string }> = {
  POSITIF:      { label: 'Positif',      color: '#16A34A', bg: '#F0FDF4' },
  NEGATIF:      { label: 'Negatif',      color: '#DC2626', bg: '#FEF2F2' },
  EN_ATTENTE:   { label: 'En attente',   color: '#D97706', bg: '#FFFBEB' },
  SANS_REPONSE: { label: 'Sans reponse', color: '#6B7280', bg: '#F3F4F6' },
};

/**
 * Item de timeline d'activité commerciale avec ligne verticale de connexion.
 *
 * @param activite - Données de l'activité commerciale
 * @param isLast   - Si true, masque la ligne de connexion vers le bas
 * @author Riahi Dorsaf
 */
export const TimelineItem: React.FC<TimelineItemProps> = ({ activite, isLast = false }) => {
  const styles = useStyles(makeStyles);
  const conf   = TYPE_ACTIVITE_COMMERCIALE_CONFIG[activite.type];
  const res    = activite.resultat ? RESULTAT_CONFIG[activite.resultat] : null;

  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <View style={[styles.iconWrapper, { backgroundColor: conf.bg }]}>
          <Ionicons name={conf.iconName as any} size={16} color={conf.color} />
        </View>
        {!isLast && <View style={styles.line} />}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.sujet} numberOfLines={1}>{activite.sujet}</Text>
          <Text style={styles.date}>{activite.dateRelative}</Text>
        </View>

        {activite.notes ? (
          <Text style={styles.notes} numberOfLines={2}>{activite.notes}</Text>
        ) : null}

        {res ? (
          <View style={[styles.resultatBadge, { backgroundColor: res.bg }]}>
            <Text style={[styles.resultatText, { color: res.color }]}>{res.label}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};