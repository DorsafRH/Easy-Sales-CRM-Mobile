/**
 * @file DashboardScreen.tsx
 * @description Tableau de bord principal de l'application Easy Sales CRM.
 *
 *              STRUCTURE :
 *              - Hero bleu : salutation + CA hero metric + sélecteur période
 *              - 3 mini KPIs (Clients / Opportunités / Devis)
 *              - Actions rapides (4 boutons)
 *              - Activité récente (5 derniers éléments)
 *
 * @author Riahi Dorsaf
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView }    from 'react-native-safe-area-context';
import { useNavigation,
         useFocusEffect }  from '@react-navigation/native';
import { Ionicons }        from '@expo/vector-icons';

import { useStyles, useTheme } from '../../theme';
import { makeStyles }          from './DashboardScreen.styles';
import { useAuth }             from '../../context/AuthContext';
import { Avatar }              from '../../components/ui/Avatar';

import * as ReportingApi from '../../api/reporting.api';
import {
  ReportingKpisResponse,
  PeriodeDashboard,
  PERIODE_LABELS,
} from '../../types/reporting.types';

// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────

const PERIODES: PeriodeDashboard[] = ['AUJOURD_HUI', 'CE_MOIS', 'CETTE_ANNEE'];

const formatCA = (value: number): string =>
  value.toLocaleString('fr-FR', { maximumFractionDigits: 0 });

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Écran Dashboard.
 * @author Riahi Dorsaf
 */
export const DashboardScreen: React.FC = () => {
  const styles                    = useStyles(makeStyles);
  const theme                     = useTheme();
  const { currentUser, refreshUser } = useAuth();
  const navigation                = useNavigation();

  const [kpis,         setKpis]         = useState<ReportingKpisResponse | null>(null);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [periode,      setPeriode]      = useState<PeriodeDashboard>('CE_MOIS');

  // ── Rafraîchir le nom à chaque fois que l'écran est actif ──
  useFocusEffect(
    useCallback(() => {
      refreshUser();
    }, [refreshUser]),
  );

  // ── Chargement des KPIs ──────────────────────────────────────
  const chargerKpis = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const response = await ReportingApi.getKpis();
      if (response.success) setKpis(response.data);
    } catch {
      // silencieux
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { chargerKpis(); }, [chargerKpis]);

  // ── Nom d'affichage ──────────────────────────────────────────
  const prenom        = currentUser?.prenom ?? '';
  const nom           = currentUser?.nom    ?? '';
  const nomComplet    = `${prenom} ${nom}`.trim();
  const nomEntreprise = currentUser?.nomEntreprise ?? '';

  // ── Actions rapides ──────────────────────────────────────────
  const ACTIONS_RAPIDES = [
    {
      label:   'Ajouter\nclient',
      icon:    'person-add-outline',
      onPress: () => navigation.navigate('Clients' as never),
    },
    {
      label:   'Nouveau\nlead',
      icon:    'trending-up-outline',
      onPress: () => Alert.alert('Sprint 3', 'Disponible en Sprint 3.'),
    },
    {
      label:   'Créer\ndevis',
      icon:    'document-outline',
      onPress: () => Alert.alert('Sprint 3', 'Disponible en Sprint 3.'),
    },
    {
      label:   'Catalogue',
      icon:    'grid-outline',
      onPress: () => navigation.navigate('Plus' as never),
    },
  ] as const;

  // ── Chargement ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement du tableau de bord…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => chargerKpis(true)}
            tintColor={theme.colors.white}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* ── Hero bandeau bleu ── */}
        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroGreeting}>Bonjour, {prenom} 👋</Text>
              <Text style={styles.heroName}>{nomEntreprise}</Text>
            </View>
            <TouchableOpacity
              style={styles.heroAvatarBtn}
              onPress={() => navigation.navigate('Plus' as never)}
            >
              <Avatar nom={nomComplet} size="sm" />
            </TouchableOpacity>
          </View>

          {/* CA hero metric */}
          <Text style={styles.caLabel}>
            Chiffre d'affaires {PERIODE_LABELS[periode].toLowerCase()}
          </Text>
          <Text style={styles.caValue}>
            {formatCA(kpis?.chiffreAffaires ?? 0)}
            <Text style={styles.caUnit}> TND</Text>
          </Text>
          <View style={styles.caEvolution}>
            <Ionicons name="trending-up-outline" size={16} color="rgba(255,255,255,0.85)" />
            <Text style={styles.caEvolutionText}>+0% vs période précédente</Text>
          </View>

          {/* Sélecteur période */}
          <View style={styles.periodeSelector}>
            {PERIODES.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.periodeBtn, periode === p && styles.periodeBtnActive]}
                onPress={() => setPeriode(p)}
              >
                <Text style={[
                  styles.periodeBtnText,
                  periode === p && styles.periodeBtnTextActive,
                ]}>
                  {PERIODE_LABELS[p]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Mini KPIs ── */}
        <View style={styles.kpisRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{kpis?.nbClients ?? 0}</Text>
            <Text style={styles.kpiLabel}>Clients</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{kpis?.nbOpportunites ?? 0}</Text>
            <Text style={styles.kpiLabel}>Opport.</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{kpis?.nbDevis ?? 0}</Text>
            <Text style={styles.kpiLabel}>Devis</Text>
          </View>
        </View>

        {/* ── Actions rapides ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actions rapides</Text>
          </View>
          <View style={styles.actionsGrid}>
            {ACTIONS_RAPIDES.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.actionItem}
                activeOpacity={0.75}
                onPress={action.onPress}
              >
                <View style={styles.actionIconWrapper}>
                  <Ionicons
                    name={action.icon as any}
                    size={22}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Activité récente ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activité récente</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Clients' as never)}>
              <Text style={styles.voirToutBtn}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {(kpis?.activiteRecente ?? []).length === 0 ? (
              <Text style={styles.activiteDate}>Aucune activité récente</Text>
            ) : (
              kpis!.activiteRecente.map((item) => (
                <View key={item.id} style={styles.activiteItem}>
                  <Avatar nom={item.titre} size="md" />
                  <View style={styles.activiteContent}>
                    <Text style={styles.activiteTitre} numberOfLines={1}>
                      {item.titre}
                    </Text>
                    <Text style={styles.activiteSoustitre}>
                      {item.soustitre}
                    </Text>
                  </View>
                  <Text style={styles.activiteDate}>{item.dateRelative}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};