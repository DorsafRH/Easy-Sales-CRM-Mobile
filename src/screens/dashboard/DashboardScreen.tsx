/**
 * @file DashboardScreen.tsx
 * @description Tableau de bord principal — Easy Sales CRM.
 *              Section "Réunions du jour" ajoutée — affiche les réunions
 *              planifiées pour aujourd'hui avec navigation vers la fiche détail.
 * @author Riahi Dorsaf
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient }                from 'expo-linear-gradient';
import { SafeAreaView }                  from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect,
         CommonActions }                 from '@react-navigation/native';
import { Ionicons }                      from '@expo/vector-icons';

import { useStyles, useTheme } from '../../theme';
import { makeStyles }          from './DashboardScreen.styles';
import { useAuth }             from '../../context/AuthContext';
import { Avatar }              from '../../components/ui/Avatar';

import * as ReportingApi from '../../api/reporting.api';
import * as ReunionApi   from '../../api/reunion.api';
import {
  ReportingKpisResponse, ActiviteRecenteItem,
  PeriodeDashboard, PERIODE_LABELS,
  ACTIVITE_ICONE, ACTIVITE_BG, ACTIVITE_ICON_COLOR,
} from '../../types/reporting.types';
import { ReunionResponse, STATUT_REUNION_CONFIG } from '../../types/reunion.types';

// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────

const PERIODES: PeriodeDashboard[] = ['AUJOURD_HUI', 'CE_MOIS', 'CETTE_ANNEE'];

const formatCA = (v: number) =>
  v.toLocaleString('fr-FR', { maximumFractionDigits: 0 });

const fmtHeure = (iso: string) =>
  new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const fmtDuree = (m: number) => {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), r = m % 60;
  return r > 0 ? `${h}h${String(r).padStart(2, '0')}` : `${h}h`;
};

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Écran Dashboard avec section réunions du jour.
 * @author Riahi Dorsaf
 */
export const DashboardScreen: React.FC = () => {
  const styles                       = useStyles(makeStyles);
  const theme                        = useTheme();
  const { currentUser, refreshUser } = useAuth();
  const navigation                   = useNavigation<any>();

  const [kpis,           setKpis]           = useState<ReportingKpisResponse | null>(null);
  const [reunionsDuJour, setReunionsDuJour] = useState<ReunionResponse[]>([]);
  const [isLoading,      setIsLoading]      = useState(true);
  const [isRefreshing,   setIsRefreshing]   = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [periode,        setPeriode]        = useState<PeriodeDashboard>('CE_MOIS');

  const isInitialLoad = useRef(true);

  useFocusEffect(useCallback(() => { refreshUser(); }, [refreshUser]));

  // ── Chargement KPIs ──────────────────────────────────────
  const chargerKpis = useCallback(async (options?: {
    refresh?: boolean; periodeOverride?: PeriodeDashboard;
  }) => {
    const { refresh = false, periodeOverride } = options ?? {};
    const p = periodeOverride ?? periode;

    if (refresh) {
      setIsRefreshing(true);
    } else if (isInitialLoad.current) {
      setIsLoading(true);
    } else {
      setIsLoadingStats(true);
    }

    try {
      const [kpisRes, reunionsRes] = await Promise.all([
        ReportingApi.getKpis(p),
        isInitialLoad.current || refresh ? ReunionApi.listerAujourdhui() : Promise.resolve(null),
      ]);
      if (kpisRes.success)               setKpis(kpisRes.data);
      if (reunionsRes?.success)          setReunionsDuJour(reunionsRes.data);
    } catch { /* silencieux */ }
    finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingStats(false);
      isInitialLoad.current = false;
    }
  }, [periode]);

  useEffect(() => { chargerKpis(); }, []); // eslint-disable-line

  useEffect(() => {
    if (isInitialLoad.current) return;
    chargerKpis({ periodeOverride: periode });
  }, [periode]); // eslint-disable-line

  const prenom        = currentUser?.prenom ?? '';
  const nom           = currentUser?.nom    ?? '';
  const nomComplet    = `${prenom} ${nom}`.trim();
  const nomEntreprise = currentUser?.nomEntreprise ?? '';

  // ── Navigation activités ──────────────────────────────────
  const naviguerVersActivite = (item: ActiviteRecenteItem) => {
    switch (item.type) {
      case 'CLIENT':
        navigation.dispatch(CommonActions.navigate('ClientDetail', { clientId: item.id })); break;
      case 'CONTACT':
        if (item.entiteParentId) {
          navigation.dispatch(CommonActions.navigate('ContactDetail', {
            contactId: item.id, clientId: item.entiteParentId,
          }));
        }
        break;
      case 'PRODUIT':
        navigation.dispatch(CommonActions.navigate('ProduitDetail', { produitId: item.id })); break;
    }
  };

  // ── Actions rapides ───────────────────────────────────────
  const ACTIONS_RAPIDES = [
    { label: 'Ajouter\nclient', icon: 'person-add-outline', iconColor: '#2563EB', iconBg: '#EFF6FF',
      onPress: () => navigation.dispatch(CommonActions.navigate('ClientForm', {})) },
    { label: 'Réunion', icon: 'calendar-outline', iconColor: '#16A34A', iconBg: '#F0FDF4',
      onPress: () => navigation.dispatch(CommonActions.navigate('PlanifierReunion', {})) },
    { label: 'Créer\ndevis', icon: 'document-text-outline', iconColor: '#16A34A', iconBg: '#F0FDF4',
      onPress: () => Alert.alert('Sprint 3', 'Disponible en Sprint 3.') },
    { label: 'Publier', icon: 'megaphone-outline', iconColor: '#EA580C', iconBg: '#FFF7ED',
      onPress: () => Alert.alert('Sprint 4', 'Disponible en Sprint 4.') },
  ] as const;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing}
            onRefresh={() => chargerKpis({ refresh: true })}
            tintColor={theme.colors.white} colors={[theme.colors.primary]} />
        }
      >
        {/* ── Hero ── */}
        <LinearGradient colors={['#1E3A8A', '#2563EB', '#3B82F6']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>

          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroGreeting}>Bonjour, {prenom} 👋</Text>
              <Text style={styles.heroName}>{nomEntreprise}</Text>
            </View>
            <TouchableOpacity style={styles.heroAvatarBtn}
              onPress={() => navigation.navigate('Plus' as never)}>
              <Avatar nom={nomComplet} size="sm" />
            </TouchableOpacity>
          </View>

          <Text style={styles.caLabel}>
            Chiffre d'affaires {PERIODE_LABELS[periode].toLowerCase()}
          </Text>

          {isLoadingStats ? (
            <View style={styles.caLoadingRow}>
              <ActivityIndicator size="small" color="rgba(255,255,255,0.9)" />
              <Text style={styles.caLoadingText}>Mise à jour…</Text>
            </View>
          ) : (
            <>
              <Text style={styles.caValue}>
                {formatCA(kpis?.chiffreAffaires ?? 0)}
                <Text style={styles.caUnit}> TND</Text>
              </Text>
              <View style={styles.caEvolution}>
                <Ionicons name="trending-up-outline" size={16} color="rgba(255,255,255,0.85)" />
                <Text style={styles.caEvolutionText}>+0% vs période précédente</Text>
              </View>
            </>
          )}

          <View style={styles.periodeSelector}>
            {PERIODES.map(p => (
              <TouchableOpacity key={p}
                style={[styles.periodeBtn, periode === p && styles.periodeBtnActive]}
                onPress={() => setPeriode(p)} disabled={isLoadingStats}>
                <Text style={[styles.periodeBtnText, periode === p && styles.periodeBtnTextActive]}>
                  {PERIODE_LABELS[p]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        {/* ── KPIs ── */}
        <View style={styles.kpisRow}>
          {[
            { value: kpis?.nbClients ?? 0,      label: 'Clients' },
            { value: kpis?.nbOpportunites ?? 0, label: 'Opport.' },
            { value: kpis?.nbDevis ?? 0,        label: 'Devis'   },
          ].map(k => (
            <View key={k.label} style={styles.kpiCard}>
              {isLoadingStats ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <Text style={styles.kpiValue}>{k.value}</Text>
              )}
              <Text style={styles.kpiLabel}>{k.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Actions rapides ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actions rapides</Text>
          </View>
          <View style={styles.actionsGrid}>
            {ACTIONS_RAPIDES.map(action => (
              <TouchableOpacity key={action.label} style={styles.actionItem}
                activeOpacity={0.75} onPress={action.onPress}>
                <View style={[styles.actionIconWrapper, { backgroundColor: action.iconBg }]}>
                  <Ionicons name={action.icon as any} size={22} color={action.iconColor} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Réunions du jour ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Réunions du jour
              {reunionsDuJour.length > 0 && ` (${reunionsDuJour.length})`}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.dispatch(CommonActions.navigate('AgendaHome'))}>
              <Text style={styles.voirToutBtn}>Agenda</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            {reunionsDuJour.length === 0 ? (
              <View style={styles.reunionDuJourVide}>
                <Text style={styles.reunionDuJourVideTxt}>Aucune réunion aujourd'hui</Text>
              </View>
            ) : (
              reunionsDuJour.map(r => {
                const conf = STATUT_REUNION_CONFIG[r.statut];
                return (
                  <TouchableOpacity
                    key={r.id}
                    style={styles.reunionDuJourItem}
                    onPress={() => navigation.dispatch(
                      CommonActions.navigate('ReunionDetail', { reunionId: r.id }),
                    )}
                    activeOpacity={0.75}
                  >
                    <View style={styles.reunionDuJourHeure}>
                      <Text style={styles.reunionDuJourHeureTxt}>{fmtHeure(r.dateHeure)}</Text>
                      <Text style={styles.reunionDuJourDureeTxt}>{fmtDuree(r.dureeMinutes)}</Text>
                    </View>
                    <View style={styles.reunionDuJourInfo}>
                      <Text style={styles.reunionDuJourTitre} numberOfLines={1}>{r.titre}</Text>
                      <Text style={styles.reunionDuJourClient} numberOfLines={1}>
                        👤 {r.clientNom}
                      </Text>
                    </View>
                    <View style={[styles.reunionDuJourStatut, { backgroundColor: conf.bg }]}>
                      <Text style={[styles.reunionDuJourStatutTxt, { color: conf.color }]}>
                        {conf.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>

        {/* ── Activité récente ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activité récente</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Activites' as never)}>
              <Text style={styles.voirToutBtn}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            {(kpis?.activiteRecente ?? []).length === 0 ? (
              <Text style={styles.activiteDate}>Aucune activité récente</Text>
            ) : (
              kpis!.activiteRecente.map((item, i) => {
                const icone     = ACTIVITE_ICONE[item.typeActivite]     ?? 'ellipse-outline';
                const bg        = ACTIVITE_BG[item.typeActivite]         ?? '#EFF6FF';
                const iconColor = ACTIVITE_ICON_COLOR[item.typeActivite] ?? '#2563EB';
                return (
                  <TouchableOpacity key={`${item.id}-${i}`} style={styles.activiteItem}
                    onPress={() => naviguerVersActivite(item)} activeOpacity={0.75}>
                    <View style={[styles.activiteIconWrapper, { backgroundColor: bg }]}>
                      <Ionicons name={icone as any} size={20} color={iconColor} />
                    </View>
                    <View style={styles.activiteContent}>
                      <Text style={styles.activiteTitre} numberOfLines={1}>{item.titre}</Text>
                      <Text style={styles.activiteSoustitre} numberOfLines={1}>{item.soustitre}</Text>
                    </View>
                    <Text style={styles.activiteDate}>{item.dateRelative}</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};