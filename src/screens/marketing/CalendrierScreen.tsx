/**
 * @file CalendrierScreen.tsx
 * @description Onglet "Calendrier éditorial" — publications marquées par statut.
 * @author Riahi Dorsaf
 */

import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';

import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './CalendrierScreen.styles';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

import {
  PublicationMarketing,
  STATUT_PUBLICATION_CONFIG,
} from '../../types/marketing.types';

interface CalendrierScreenProps {
  publications: PublicationMarketing[];
  onOpen:       (id: number) => void;
}

const extraireJour = (publication: PublicationMarketing): string | null => {
  const date = publication.dateProgrammation
    ?? publication.datePublication
    ?? publication.dateCreation;
  return date ? date.slice(0, 10) : null;
};

/**
 * Calendrier éditorial des publications + liste du jour sélectionné.
 * @author Riahi Dorsaf
 */
export const CalendrierScreen: React.FC<CalendrierScreenProps> = ({ publications, onOpen }) => {
  const styles = useStyles(makeStyles);
  const theme = useTheme();
  const [jourSelectionne, setJourSelectionne] = useState<string | null>(null);

  const marquages = useMemo(() => {
    const result: Record<string, { marked: boolean; dotColor: string }> = {};
    publications.forEach(pub => {
      const jour = extraireJour(pub);
      if (jour) {
        result[jour] = { marked: true, dotColor: STATUT_PUBLICATION_CONFIG[pub.statut].color };
      }
    });
    return result;
  }, [publications]);

  const publicationsDuJour = useMemo(
    () => publications.filter(pub => extraireJour(pub) === jourSelectionne),
    [publications, jourSelectionne],
  );

  const markedDates = jourSelectionne
    ? { ...marquages, [jourSelectionne]: { ...marquages[jourSelectionne], selected: true } }
    : marquages;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Calendar
        onDayPress={day => setJourSelectionne(day.dateString)}
        markedDates={markedDates}
        theme={{
          todayTextColor:   theme.colors.primary,
          selectedDayBackgroundColor: theme.colors.primary,
          arrowColor:       theme.colors.primary,
          textMonthFontWeight: '700',
        }}
      />

      <Text style={styles.sectionTitre}>
        {jourSelectionne ? 'Publications du ' + jourSelectionne : 'Publications à venir'}
      </Text>

      {(jourSelectionne ? publicationsDuJour : publications).length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          titre="Aucune publication"
          soustitre="Programmez une publication pour la voir ici"
        />
      ) : (
        (jourSelectionne ? publicationsDuJour : publications).map(pub => (
          <TouchableOpacity
            key={pub.id}
            style={styles.item}
            onPress={() => onOpen(pub.id)}
            activeOpacity={0.75}
          >
            <View style={styles.itemRow}>
              <Text style={styles.itemTitre} numberOfLines={1}>{pub.titre}</Text>
              <Badge
                label={STATUT_PUBLICATION_CONFIG[pub.statut].label}
                variant="neutral"
              />
            </View>
            <Text style={styles.itemMeta} numberOfLines={1}>
              {extraireJour(pub) ?? 'Non programmée'}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};
