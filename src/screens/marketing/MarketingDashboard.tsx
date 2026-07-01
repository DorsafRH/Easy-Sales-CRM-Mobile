/**
 * @file MarketingDashboard.tsx
 * @description Tableau de bord statistiques du module Marketing : KPIs des leads issus
 *              des réseaux sociaux, état des publications, engagement par publication
 *              (barres horizontales + détail des réactions par emoji) et derniers
 *              besoins identifiés par l'IA. Aligné sur le langage visuel du dashboard Ventes.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './MarketingDashboard.styles';
import { EmptyState } from '../../components/ui/EmptyState';
import * as StatsApi from '../../api/marketing-stats.api';
import { MarketingOverview, TopPostReactions } from '../../types/marketing.types';

// ── Réactions : ordre, icône, couleur ─────────────────────────────────
const REACTION_ORDER = ['like', 'love', 'haha', 'wow', 'sad', 'angry'] as const;
const REACTION_COLOR: Record<string, string> = {
  like: '#2563EB', love: '#E0245E', haha: '#F59E0B', wow: '#7C3AED', sad: '#0891B2', angry: '#F97316',
};
/** Icônes vectorielles MaterialCommunityIcons, couleur = celle du segment. */
const REACTION_ICON: Record<string, string> = {
  like: 'thumb-up-outline', love: 'heart-outline', haha: 'emoticon-happy-outline',
  wow: 'emoticon-excited-outline', sad: 'emoticon-sad-outline', angry: 'emoticon-angry-outline',
};

// ── Accents des cartes KPI ────────────────────────────────────────────
const KPI_LEADS      = '#7C3AED';
const KPI_QUALIFIES  = '#16A34A';
const KPI_SCORE      = '#D97706';
const KPI_CONVERSION = '#0891B2';

export const MarketingDashboard: React.FC = () => {
  const styles = useStyles(makeStyles);
  const theme = useTheme();

  const [overview, setOverview] = useState<MarketingOverview | null>(null);
  const [topPosts, setTopPosts] = useState<TopPostReactions[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const charger = useCallback(async () => {
    try {
      const [ov, tp] = await Promise.all([StatsApi.getOverview(), StatsApi.getTopPosts()]);
      if (ov.success) setOverview(ov.data);
      if (tp.success) setTopPosts(tp.data);
    } catch {
      // silencieux
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (!overview) {
    return (
      <EmptyState icon="stats-chart-outline" titre="Aucune statistique"
        soustitre="Les données apparaîtront ici" />
    );
  }

  // ── Total des réactions d'une publication ───────────────────────────
  const totalPost = (p: TopPostReactions) => {
    const somme = REACTION_ORDER.reduce((s, k) => s + (p.reactionsBreakdown?.[k] ?? 0), 0);
    return somme > 0 ? somme : p.likes;
  };
  const maxTotal = Math.max(1, ...topPosts.map(totalPost));

  // ── Carte KPI (accent coloré à gauche) ──────────────────────────────
  const kpi = (icon: string, value: string | number, label: string, color: string) => (
    <View style={[styles.kpiCard, { borderLeftColor: color }]}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={[styles.kpiValue, { color }]} numberOfLines={1}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );

  // ── Mini-stat publication ───────────────────────────────────────────
  const pubStat = (icon: string, value: number, label: string, color: string) => (
    <View style={styles.pubStat}>
      <Ionicons name={icon as any} size={18} color={color} />
      <Text style={styles.pubStatValue}>{value}</Text>
      <Text style={styles.pubStatLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} tintColor={theme.colors.primary}
          onRefresh={() => { setRefreshing(true); charger(); }} />
      }
    >
      {/* ── KPIs leads ─────────────────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Performance des leads</Text>
      <View style={styles.kpiGrid}>
        {kpi('people-outline',       overview.leadsMarketing,           'Leads réseaux',   KPI_LEADS)}
        {kpi('ribbon-outline',       overview.leadsQualifies,           'Qualifiés',       KPI_QUALIFIES)}
        {kpi('speedometer-outline',  `${overview.scoreMoyen}`,          'Score moyen',     KPI_SCORE)}
        {kpi('trending-up-outline',  `${overview.tauxConversion}%`,     'Conversion',      KPI_CONVERSION)}
      </View>

      {/* ── Publications ───────────────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Publications</Text>
      <View style={styles.pubCard}>
        {pubStat('checkmark-done-outline', overview.publicationsPubliees,    'Publiées',    theme.colors.success)}
        <View style={styles.pubDivider} />
        {pubStat('time-outline',           overview.publicationsProgrammees, 'Programmées', theme.colors.primary)}
        <View style={styles.pubDivider} />
        {pubStat('create-outline',         overview.publicationsBrouillons,  'Brouillons',  theme.colors.textSecondary)}
      </View>

      {/* ── Réactions par publication ──────────────────────────────── */}
      <Text style={styles.sectionTitle}>Réactions par publication</Text>
      {topPosts.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.vide}>Aucune réaction pour le moment</Text>
        </View>
      ) : (
        <>
          <View style={styles.reactionsList}>
            {topPosts.map((p, i) => {
              const total = totalPost(p);
              return (
                <View key={i} style={styles.reactionCard}>
                  {/* Titre (2 lignes) à gauche + total détaché à droite */}
                  <View style={styles.engHead}>
                    <Text style={styles.engLabel} numberOfLines={2} ellipsizeMode="tail">
                      {p.titre?.trim() || 'Publication sans titre'}
                    </Text>
                    <View style={styles.engTotalBox}>
                      <Text style={styles.engTotalValue}>{total}</Text>
                      <Text style={styles.engTotalLabel}>réactions</Text>
                    </View>
                  </View>

                  {/* Barre : largeur totale proportionnelle au volume max entre publications */}
                  <View style={styles.barRow}>
                    <View style={[styles.bar, { width: `${(total / maxTotal) * 100}%` }]}>
                      {REACTION_ORDER.map(k => {
                        const n = p.reactionsBreakdown?.[k] ?? 0;
                        if (n <= 0) return null;
                        return <View key={k} style={{ flex: n, backgroundColor: REACTION_COLOR[k] }} />;
                      })}
                    </View>
                  </View>

                  {/* Icônes vectorielles colorées (couleur = segment) + compteur */}
                  <View style={styles.engChips}>
                    {REACTION_ORDER.map(k => {
                      const n = p.reactionsBreakdown?.[k] ?? 0;
                      if (n <= 0) return null;
                      return (
                        <View key={k} style={styles.engChip}>
                          <MaterialCommunityIcons
                            name={REACTION_ICON[k] as any} size={14} color={REACTION_COLOR[k]} />
                          <Text style={styles.engChipNum}>{n}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        </>
      )}

      {/* ── Derniers besoins (vitrine IA) ──────────────────────────── */}
      {overview.derniersBesoins.length > 0 && (
        <>
          <View style={styles.sectionRow}>
            <Ionicons name="sparkles-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.sectionTitleInline}>Besoins identifiés par l'IA</Text>
          </View>
          <View style={styles.card}>
            {overview.derniersBesoins.slice(0, 3).map((b, i) => (
              <View key={i} style={[styles.besoinRow, i === 0 && styles.besoinRowFirst]}>
                <View style={styles.besoinHead}>
                  <Text style={styles.besoinNom} numberOfLines={1}>{b.nom}</Text>
                  {b.score != null && (
                    <View style={styles.scoreBadge}>
                      <Text style={styles.scoreText}>{b.score}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.besoinTexte} numberOfLines={2}>{b.besoin}</Text>
                <Text style={styles.besoinDate}>{b.dateRelative}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};