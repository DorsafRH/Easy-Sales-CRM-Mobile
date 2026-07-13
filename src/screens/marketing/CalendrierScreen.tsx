/**
 * @file CalendrierScreen.tsx
 * @description Onglet "Calendrier éditorial" — publications marquées par statut.
 * @author Riahi Dorsaf
 */

import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

// ── Localisation française du calendrier ──────────────────────────────
LocaleConfig.locales.fr = {
  monthNames: [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ],
  monthNamesShort: [
    'Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin',
    'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.',
  ],
  dayNames: [
    'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi',
  ],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './CalendrierScreen.styles';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '../../components/ui/EmptyState';
import { parseLocalDateTime } from '../../utils/dateUtils';

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


// libelleDate est définie dans le composant (accès à t + locale)

/**
 * Calendrier éditorial des publications + liste du jour sélectionné.
 * @author Riahi Dorsaf
 */
export const CalendrierScreen: React.FC<CalendrierScreenProps> = ({ publications, onOpen }) => {
  const styles = useStyles(makeStyles);
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';

  const fmtDateLocale = (s: string): string => {
    const d = parseLocalDateTime(s);
    const date = d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
    const heure = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    return `${date} ${heure}`;
  };

  const libelleDate = (pub: PublicationMarketing): string => {
    if (pub.statut === 'PROGRAMMEE' && pub.dateProgrammation)
      return t('marketing.calendrier.scheduledOn', { date: fmtDateLocale(pub.dateProgrammation) });
    if (pub.datePublication)
      return t('marketing.calendrier.publishedOn', { date: fmtDateLocale(pub.datePublication) });
    if (pub.dateProgrammation)
      return t('marketing.calendrier.on', { date: fmtDateLocale(pub.dateProgrammation) });
    return t('marketing.calendrier.notScheduled');
  };
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
      <View style={styles.calendarCard}>
        <Calendar
          onDayPress={day => setJourSelectionne(day.dateString)}
          markedDates={markedDates}
          theme={{
            calendarBackground:         theme.colors.bgSurface,
            monthTextColor:             theme.colors.textPrimary,
            textMonthFontWeight:        '800',
            textMonthFontSize:          17,
            textSectionTitleColor:      theme.colors.primary,
            dayTextColor:               theme.colors.textPrimary,
            textDayFontWeight:          '600',
            todayTextColor:             theme.colors.primary,
            todayBackgroundColor:       theme.colors.primaryLight,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor:       theme.colors.white,
            arrowColor:                 theme.colors.primary,
            textDisabledColor:          theme.colors.textTertiary,
          }}
        />
      </View>

      <Text style={styles.sectionTitre}>
        {jourSelectionne
          ? t('marketing.calendrier.publicationsOf', {
              date: new Date(jourSelectionne + 'T00:00:00')
                .toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }),
            })
          : t('marketing.calendrier.upcoming')}
      </Text>

      {(jourSelectionne ? publicationsDuJour : publications).length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          titre={t('marketing.calendrier.empty')}
          soustitre={t('marketing.calendrier.emptySub')}
        />
      ) : (
        (jourSelectionne ? publicationsDuJour : publications).map(pub => {
          const conf = STATUT_PUBLICATION_CONFIG[pub.statut];
          return (
            <TouchableOpacity
              key={pub.id}
              style={[styles.item, { borderLeftColor: conf.color }]}
              onPress={() => onOpen(pub.id)}
              activeOpacity={0.75}
            >
              <View style={styles.itemRow}>
                <Text style={styles.itemTitre} numberOfLines={1}>{pub.titre}</Text>
                <View style={[styles.statutPill, { backgroundColor: conf.bg }]}>
                  <Text style={[styles.statutPillText, { color: conf.color }]}>{t(conf.labelKey)}</Text>
                </View>
              </View>
              <View style={styles.itemMetaRow}>
                <Ionicons
                  name={pub.statut === 'PROGRAMMEE' ? 'time-outline' : 'calendar-outline'}
                  size={13} color={conf.color} />
                <Text style={[styles.itemMeta, { color: conf.color }]} numberOfLines={1}>
                  {libelleDate(pub)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
};
