/**
 * @file TimelineItem.tsx
 * @description Élément de timeline pour l'historique des activités.
 *              Adapté pour accepter ActiviteResponse (module reporting).
 *              Utilise ACTIVITE_ICONE / ACTIVITE_BG / ACTIVITE_ICON_COLOR.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons }   from '@expo/vector-icons';

import { useStyles }         from '../../theme';
import { makeStyles }        from './TimelineItem.styles';
import {
  ActiviteResponse,
  ACTIVITE_ICONE,
  ACTIVITE_BG,
  ACTIVITE_ICON_COLOR,
} from '../../types/reporting.types';

// ─────────────────────────────────────────────────────────────

interface TimelineItemProps {
  activite: ActiviteResponse;
  isLast?:  boolean;
}

// ─────────────────────────────────────────────────────────────

/**
 * Item de timeline d'activité avec icône, titre, description et date relative.
 *
 * @param activite - Activité au format ActiviteResponse (reporting)
 * @param isLast   - Si true, masque la ligne de connexion vers le bas
 * @author Riahi Dorsaf
 */
export const TimelineItem: React.FC<TimelineItemProps> = ({
  activite,
  isLast = false,
}) => {
  const styles    = useStyles(makeStyles);
  const iconName  = ACTIVITE_ICONE[activite.type]      ?? 'ellipse-outline';
  const iconBg    = ACTIVITE_BG[activite.type]         ?? '#F3F4F6';
  const iconColor = ACTIVITE_ICON_COLOR[activite.type] ?? '#6B7280';

  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
          <Ionicons name={iconName as any} size={16} color={iconColor} />
        </View>
        {!isLast && <View style={styles.line} />}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.sujet} numberOfLines={1}>{activite.titre}</Text>
          <Text style={styles.date}>{activite.dateRelative}</Text>
        </View>

        {activite.description ? (
          <Text style={styles.notes} numberOfLines={2}>{activite.description}</Text>
        ) : null}
      </View>
    </View>
  );
};
