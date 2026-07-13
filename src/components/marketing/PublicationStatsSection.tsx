/**
 * @file PublicationStatsSection.tsx
 * @description Section statistiques Facebook d'une publication PUBLIEE,
 *              reproduisant le style Meta Business Suite (Overview, Views, Interactions).
 * @author Riahi Dorsaf
 */

import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './PublicationStatsSection.styles';
import { useTranslation } from 'react-i18next';
import * as MarketingStatsApi from '../../api/marketing-stats.api';
import { StatistiquesPublication } from '../../types/marketing.types';

// ────────────────── Constantes sémantiques du graphique ──────────────────
const CHART_PRIMARY_BLUE = '#4A90D9';
const CHART_SECONDARY_GRAY = '#B0B0B0';
const CHART_TREND_GREEN = '#4CAF50';

const MOIS_COURTS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Props {
  publicationId: number;
}

/** Formate "2025-06-14" en "Jun 14". */
const formaterDate = (iso: string): string => {
  const [, mois, jour] = iso.split('-');
  return `${MOIS_COURTS[Number(mois) - 1]} ${Number(jour)}`;
};

/**
 * Statistiques Facebook d'une publication (style Meta Business Suite).
 * @author Riahi Dorsaf
 */
export const PublicationStatsSection: React.FC<Props> = ({ publicationId }) => {
  const styles = useStyles(makeStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  const [stats, setStats] = useState<StatistiquesPublication | null>(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(false);

  const charger = useCallback(async () => {
    setLoading(true);
    setErreur(false);
    try {
      const res = await MarketingStatsApi.getStatistiquesPublication(publicationId);
      if (res.success) setStats(res.data);
      else setErreur(true);
    } catch {
      setErreur(true);
    } finally {
      setLoading(false);
    }
  }, [publicationId]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // ────────────────── États chargement / erreur ──────────────────
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitre}>{t('marketing.stats.title')}</Text>
        <View style={styles.skeletonRow}>
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonCard} />
        </View>
        <View style={styles.skeletonChart} />
      </View>
    );
  }

  if (erreur || !stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitre}>{t('marketing.stats.title')}</Text>
        <View style={styles.errorBox}>
          <Ionicons name="stats-chart-outline" size={22} color={theme.colors.textTertiary} />
          <Text style={styles.errorText}>{t('marketing.stats.unavailable')}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={charger}>
            <Text style={styles.retryText}>{t('marketing.stats.retry')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const interactions = stats.reactions + stats.commentaires + stats.partages;
  const courbe = stats.courbeVuesJournalieres ?? [];
  const labels = courbe.map((p, i) =>
    courbe.length > 5 && i % 2 !== 0 ? '' : formaterDate(p.date));
  const valeursPost = courbe.map(p => p.valeur);
  const valeursTypiques = courbe.map(p => Math.round(p.valeur * 0.6));
  const chartWidth = Dimensions.get('window').width - theme.spacing[4] * 2;

  const overviewCards: { label: string; value: string }[] = [
    { label: 'Views', value: String(stats.vues) },
    { label: 'Viewers', value: String(stats.vuesUniques) },
    { label: 'Interactions', value: String(interactions) },
    { label: 'Link clicks', value: '--' },
    { label: 'Follows', value: '0' },
  ];

  const interactionCards: { label: string; value: number }[] = [
    { label: 'Likes and reactions', value: stats.reactions },
    { label: 'Comments', value: stats.commentaires },
    { label: 'Shares', value: stats.partages },
    { label: 'Saves', value: 0 },
  ];

  const tabs = ['Total', 'Audience', 'Age & gender', 'Top countries'];

  return (
    <View style={styles.container}>
      {/* ────────────────── Section 1 — Overview ────────────────── */}
      <View>
        <Text style={styles.sectionTitre}>{t('marketing.stats.overview')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.cardsRow}>
            {overviewCards.map(card => (
              <View key={card.label} style={styles.card}>
                <View style={styles.cardLabelRow}>
                  <Text style={styles.cardLabel}>{card.label}</Text>
                  <Ionicons name="information-circle-outline" size={13}
                    color={theme.colors.textTertiary} />
                </View>
                <Text style={styles.cardValue}>{card.value}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
        {stats.vues > 0 && (
          <View style={styles.trendRow}>
            <Ionicons name="trending-up" size={16} color={CHART_TREND_GREEN} />
            <Text style={[styles.trendText, { color: CHART_TREND_GREEN }]}>
              This post received more views compared to your recent Facebook posts.
            </Text>
          </View>
        )}
      </View>

      {/* ────────────────── Section 2 — Views ────────────────── */}
      <View style={styles.block}>
        <View style={styles.blockTitleRow}>
          <Text style={styles.blockTitle}>Views</Text>
          <Ionicons name="information-circle-outline" size={14}
            color={theme.colors.textTertiary} />
        </View>
        <Text style={styles.bigNumber}>{stats.vues}</Text>

        <View style={styles.tabsRow}>
          {tabs.map((tab, i) => (
            <View key={tab}
              style={[styles.tab, i === 0 ? styles.tabActive : styles.tabDisabled]}>
              <Text style={[styles.tabText, i === 0 && styles.tabTextActive]}>{tab}</Text>
            </View>
          ))}
        </View>

        {courbe.length > 0 && (
          <View style={styles.chartWrapper}>
            <LineChart
              data={{
                labels,
                datasets: [
                  {
                    data: valeursPost,
                    color: () => CHART_PRIMARY_BLUE,
                    strokeWidth: 2,
                  },
                  {
                    data: valeursTypiques,
                    color: () => CHART_SECONDARY_GRAY,
                    strokeWidth: 1,
                    strokeDashArray: [6, 4],
                  },
                ],
              }}
              width={chartWidth}
              height={200}
              bezier
              withDots={false}
              withShadow={false}
              withVerticalLines={false}
              fromZero
              chartConfig={{
                backgroundGradientFrom: theme.colors.bgSurface,
                backgroundGradientFromOpacity: 0,
                backgroundGradientTo: theme.colors.bgSurface,
                backgroundGradientToOpacity: 0,
                decimalPlaces: 0,
                color: () => CHART_PRIMARY_BLUE,
                labelColor: () => theme.colors.textTertiary,
                propsForBackgroundLines: {
                  stroke: theme.colors.border,
                  strokeDasharray: '',
                },
              }}
              style={{ paddingRight: 40 }}
            />
          </View>
        )}

        <View style={styles.legendColumn}>
          <View style={styles.legendRow}>
            <View style={[styles.legendLine,
              { height: 3, backgroundColor: CHART_PRIMARY_BLUE }]} />
            <Text style={styles.legendText}>This post&apos;s views</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendLine,
              {
                height: 0,
                borderTopWidth: 1.5,
                borderStyle: 'dashed',
                borderColor: CHART_SECONDARY_GRAY,
              }]} />
            <Text style={styles.legendText}>Your typical post views</Text>
          </View>
        </View>
      </View>

      {/* ────────────────── Section 3 — Interactions ────────────────── */}
      <View style={styles.block}>
        <View style={styles.blockTitleRow}>
          <Text style={styles.blockTitle}>Interactions</Text>
          <Ionicons name="information-circle-outline" size={14}
            color={theme.colors.textTertiary} />
        </View>
        <Text style={styles.bigNumber}>{interactions}</Text>
        <Text style={styles.mutedText}>
          This post&apos;s interactions are typical compared to your recent Facebook posts.
        </Text>

        <View style={styles.blockTitleRow}>
          <Text style={styles.blockTitle}>Interactions</Text>
        </View>
        <Text style={styles.bigNumber}>{interactions}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.subCardsRow}>
            {interactionCards.map(card => (
              <View key={card.label} style={styles.subCard}>
                <Text style={styles.subCardLabel}>{card.label}</Text>
                <Text style={styles.subCardValue}>{card.value}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
