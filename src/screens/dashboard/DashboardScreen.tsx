/**
 * @file DashboardScreen.tsx
 * @description Tableau de bord principal — Easy Sales CRM.
 *              Navigation cross-tab entièrement corrigée :
 *              - "Ajouter client"     → Clients > ClientForm
 *              - "Planifier réunion"  → Plus > PlanifierReunion
 *              - Réunions du jour     → Plus > ReunionDetail
 *              - "Agenda"             → Plus > Agenda
 *              - Activités récentes   → fiche correspondante dans le bon tab
 * @author Riahi Dorsaf
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient }       from 'expo-linear-gradient';
import { SafeAreaView }         from 'react-native-safe-area-context';
import { useNavigation,
         useFocusEffect }       from '@react-navigation/native';
import { Ionicons }             from '@expo/vector-icons';

import { useStyles, useTheme } from '../../theme';
import { makeStyles }          from './DashboardScreen.styles';
import { useAuth }             from '../../context/AuthContext';
import { Avatar }              from '../../components/ui/Avatar';

import * as ReportingApi  from '../../api/reporting.api';
import * as ReunionApi    from '../../api/reunion.api';
import * as CatalogueApi  from '../../api/catalogue.api';
import { ProduitResponse } from '../../types/catalogue.types';
import {
  ReportingKpisResponse,
  ActiviteRecenteItem,
  PeriodeDashboard,
  PERIODE_LABELS,
  ACTIVITE_ICONE,
  ACTIVITE_BG,
  ACTIVITE_ICON_COLOR,
} from '../../types/reporting.types';
import { ReunionResponse, STATUT_REUNION_CONFIG } from '../../types/reunion.types';

// ─────────────────────────────────────────────────────────────
// HELPERS TIMEZONE-SAFE
// ─────────────────────────────────────────────────────────────

/** Date locale en YYYY-MM-DD (évite le bug UTC en Tunisie UTC+1) */
const toLocalISO = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

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
// CONSTANTES
// ─────────────────────────────────────────────────────────────

const PERIODES: PeriodeDashboard[] = ['AUJOURD_HUI', 'CE_MOIS', 'CETTE_ANNEE'];

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Tableau de bord avec KPIs, réunions du jour et activité récente.
 * @author Riahi Dorsaf
 */
export const DashboardScreen: React.FC = () => {
  const styles                       = useStyles(makeStyles);
  const theme                        = useTheme();
  const { currentUser, refreshUser } = useAuth();
  const navigation                   = useNavigation<any>();

  const [kpis,           setKpis]           = useState<ReportingKpisResponse | null>(null);
  const [reunionsDuJour, setReunionsDuJour] = useState<ReunionResponse[]>([]);
  const [produitAlertes, setProduitAlertes] = useState<ProduitResponse[]>([]);
  const [isLoading,      setIsLoading]      = useState(true);
  const [isRefreshing,   setIsRefreshing]   = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [periode,        setPeriode]        = useState<PeriodeDashboard>('CE_MOIS');

  const isInitialLoad = useRef(true);

  useFocusEffect(useCallback(() => { refreshUser(); }, [refreshUser]));

  // ── Alertes stock ─────────────────────────────────────────────
  const chargerAlertes = useCallback(async () => {
    try {
      const res = await CatalogueApi.listerProduits(undefined, 'ACTIF');
      if (res.success) {
        setProduitAlertes(
          (res.data ?? []).filter(p => p.enAlerte || p.stockDisponible === 0),
        );
      }
    } catch { /* silencieux */ }
  }, []);

  useEffect(() => { chargerAlertes(); }, [chargerAlertes]);

  // ── Chargement KPIs + réunions du jour ───────────────────────
  const chargerKpis = useCallback(async (options?: {
    refresh?: boolean;
    periodeOverride?: PeriodeDashboard;
  }) => {
    const { refresh = false, periodeOverride } = options ?? {};
    const p = periodeOverride ?? periode;

    if (refresh)                     setIsRefreshing(true);
    else if (isInitialLoad.current)  setIsLoading(true);
    else                             setIsLoadingStats(true);

    try {
      const todayISO = toLocalISO(new Date());

      const [kpisRes, reunionsRes] = await Promise.all([
        ReportingApi.getKpis(p),
        // Réunions du jour : on passe la date locale pour éviter le bug timezone
        isInitialLoad.current || refresh
          ? ReunionApi.listerSemaine(todayISO, todayISO)
          : Promise.resolve(null),
      ]);

      if (kpisRes.success)       setKpis(kpisRes.data);
      if (reunionsRes?.success)  setReunionsDuJour(reunionsRes.data ?? []);
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

  const prenom        = currentUser?.prenom       ?? '';
  const nom           = currentUser?.nom          ?? '';
  const nomComplet    = `${prenom} ${nom}`.trim();
  const nomEntreprise = currentUser?.nomEntreprise ?? '';

  // ─────────────────────────────────────────────────────────────
  // NAVIGATION — Activités récentes
  // Chaque type d'entité navigue vers la fiche correspondante
  // dans le bon onglet (Clients ou Plus).
  // ─────────────────────────────────────────────────────────────
  const naviguerVersActivite = useCallback((item: ActiviteRecenteItem) => {
    switch (item.type) {

      case 'CLIENT':
        // Fiche client → onglet Clients > ClientDetail
        navigation.navigate('Clients', {
          screen: 'ClientDetail',
          params: { clientId: item.id },
        });
        break;

      case 'CONTACT':
        // Fiche contact → onglet Clients > ContactDetail
        if (item.entiteParentId) {
          navigation.navigate('Clients', {
            screen: 'ContactDetail',
            params: {
              contactId: item.id,
              clientId:  item.entiteParentId,
            },
          });
        }
        break;

      case 'PRODUIT':
        // Fiche produit → onglet Plus > ProduitDetail
        navigation.navigate('Plus', {
          screen: 'ProduitDetail',
          params: { produitId: item.id },
        });
        break;

      case 'REUNION':
        // Fiche réunion → onglet Plus > ReunionDetail
        navigation.navigate('Plus', {
          screen: 'ReunionDetail',
          params: { reunionId: item.id },
        });
        break;

      default:
        break;
    }
  }, [navigation]);

  // ─────────────────────────────────────────────────────────────
  // ACTIONS RAPIDES
  // Navigation cross-tab entièrement corrigée.
  // ─────────────────────────────────────────────────────────────
  const ACTIONS_RAPIDES = [
    {
      label:     'Ajouter\nclient',
      icon:      'person-add-outline',
      iconColor: '#2563EB',
      iconBg:    '#EFF6FF',
      /**
       * Ajouter client → onglet Clients > ClientForm
       */
      onPress: () => navigation.navigate('Clients', {
        screen: 'ClientForm',
        params: {},
      }),
    },
    {
      label:     'Planifier\nune réunion',
      icon:      'calendar-outline',
      iconColor: '#16A34A',
      iconBg:    '#F0FDF4',
      /**
       * Planifier réunion → onglet Plus > PlanifierReunion
       */
      onPress: () => navigation.navigate('Plus', {
        screen: 'PlanifierReunion',
        params: {},
      }),
    },
    {
      label:     'Créer\ndevis',
      icon:      'document-text-outline',
      iconColor: '#16A34A',
      iconBg:    '#F0FDF4',
      onPress: () => Alert.alert('Sprint 3', 'Disponible en Sprint 3.'),
    },
    {
      label:     'Publier',
      icon:      'megaphone-outline',
      iconColor: '#EA580C',
      iconBg:    '#FFF7ED',
      onPress: () => Alert.alert('Sprint 4', 'Disponible en Sprint 4.'),
    },
  ] as const;

  // ── Chargement initial ────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────
  // RENDU PRINCIPAL
  // ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => chargerKpis({ refresh: true })}
            tintColor={theme.colors.white}
            colors={[theme.colors.primary]}
          />
        }
      >

        {/* ══════════════════ HERO GRADIENT ══════════════════ */}
        <LinearGradient
          colors={['#1E3A8A', '#2563EB', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Ligne supérieure : salutation + avatar */}
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroGreeting}>Bonjour, {prenom} 👋</Text>
              <Text style={styles.heroName}>{nomEntreprise}</Text>
            </View>
            <TouchableOpacity
              style={styles.heroAvatarBtn}
              onPress={() => navigation.navigate('Plus')}
            >
              <Avatar nom={nomComplet} size="sm" />
            </TouchableOpacity>
          </View>

          {/* Chiffre d'affaires */}
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

          {/* Sélecteur de période */}
          <View style={styles.periodeSelector}>
            {PERIODES.map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.periodeBtn, periode === p && styles.periodeBtnActive]}
                onPress={() => setPeriode(p)}
                disabled={isLoadingStats}
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
        </LinearGradient>

        {/* ══════════════════ KPIs ══════════════════ */}
        <View style={styles.kpisRow}>
          {[
            { value: kpis?.nbClients      ?? 0, label: 'Clients' },
            { value: kpis?.nbOpportunites ?? 0, label: 'Opport.' },
            { value: kpis?.nbDevis        ?? 0, label: 'Devis'   },
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

        {/* ══════════════════ ACTIONS RAPIDES ══════════════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actions rapides</Text>
          </View>
          <View style={styles.actionsGrid}>
            {ACTIONS_RAPIDES.map(action => (
              <TouchableOpacity
                key={action.label}
                style={styles.actionItem}
                activeOpacity={0.75}
                onPress={action.onPress}
              >
                <View style={[styles.actionIconWrapper, { backgroundColor: action.iconBg }]}>
                  <Ionicons name={action.icon as any} size={22} color={action.iconColor} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ══════════════════ ALERTES STOCK ══════════════════ */}
        {produitAlertes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.stockAlertCard}>
              <View style={styles.stockAlertHeader}>
                <Text style={styles.stockAlertTitle}>
                  ⚠ Alertes stock ({produitAlertes.length})
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Plus', {
                    screen: 'CatalogueHome',
                  })}
                >
                  <Text style={styles.stockAlertVoirTout}>Voir tout</Text>
                </TouchableOpacity>
              </View>
              {produitAlertes.slice(0, 3).map(p => (
                <View key={p.id} style={styles.stockAlertItem}>
                  <Text style={styles.stockAlertNom} numberOfLines={1}>
                    {p.nom}
                  </Text>
                  <Text style={styles.stockAlertStock}>
                    {p.stockDisponible === 0
                      ? 'Rupture'
                      : `${p.stockDisponible} / ${p.stockMinimum}`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ══════════════════ RÉUNIONS DU JOUR ══════════════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Réunions du jour
              {reunionsDuJour.length > 0 && ` (${reunionsDuJour.length})`}
            </Text>

            {/**
             * Bouton "Agenda" → onglet Plus > écran Agenda
             */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Plus', {
                screen: 'AgendaHome',
                params: undefined,
              })}
            >
              <Text style={styles.voirToutBtn}>Agenda</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {reunionsDuJour.length === 0 ? (
              <View style={styles.reunionDuJourVide}>
                <Text style={styles.reunionDuJourVideTxt}>Aucune réunion aujourd'hui</Text>
              </View>
            ) : (
              reunionsDuJour
                .sort((a, b) => a.dateHeure.localeCompare(b.dateHeure))
                .map(r => {
                  const conf = STATUT_REUNION_CONFIG[r.statut];
                  return (
                    /**
                     * Tap réunion → onglet Plus > ReunionDetail
                     */
                    <TouchableOpacity
                      key={r.id}
                      style={styles.reunionDuJourItem}
                      activeOpacity={0.75}
                      onPress={() => navigation.navigate('Plus', {
                        screen: 'ReunionDetail',
                        params: { reunionId: r.id },
                      })}
                    >
                      <View style={styles.reunionDuJourHeure}>
                        <Text style={styles.reunionDuJourHeureTxt}>
                          {fmtHeure(r.dateHeure)}
                        </Text>
                        <Text style={styles.reunionDuJourDureeTxt}>
                          {fmtDuree(r.dureeMinutes)}
                        </Text>
                      </View>

                      <View style={styles.reunionDuJourInfo}>
                        <Text style={styles.reunionDuJourTitre} numberOfLines={1}>
                          {r.titre}
                        </Text>
                        <Text style={styles.reunionDuJourClient} numberOfLines={1}>
                          👤 {r.clientNom}
                        </Text>
                      </View>

                      <View style={[
                        styles.reunionDuJourStatut,
                        { backgroundColor: conf.bg },
                      ]}>
                        <Text style={[
                          styles.reunionDuJourStatutTxt,
                          { color: conf.color },
                        ]}>
                          {conf.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
            )}
          </View>
        </View>

        {/* ══════════════════ ACTIVITÉ RÉCENTE ══════════════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activité récente</Text>

            {/**
             * "Voir tout" → écran Activites (dans AppStack ou drawer)
             */}
            <TouchableOpacity onPress={() => navigation.navigate('Activites' as never)}>
              <Text style={styles.voirToutBtn}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {(kpis?.activiteRecente ?? []).length === 0 ? (
              <Text style={styles.activiteDate}>Aucune activité récente</Text>
            ) : (
              kpis!.activiteRecente.map((item, i) => {
                const icone     = ACTIVITE_ICONE[item.typeActivite]      ?? 'ellipse-outline';
                const bg        = ACTIVITE_BG[item.typeActivite]          ?? '#EFF6FF';
                const iconColor = ACTIVITE_ICON_COLOR[item.typeActivite]  ?? '#2563EB';

                return (
                  <TouchableOpacity
                    key={`${item.id}-${i}`}
                    style={styles.activiteItem}
                    onPress={() => naviguerVersActivite(item)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.activiteIconWrapper, { backgroundColor: bg }]}>
                      <Ionicons name={icone as any} size={20} color={iconColor} />
                    </View>
                    <View style={styles.activiteContent}>
                      <Text style={styles.activiteTitre} numberOfLines={1}>
                        {item.titre}
                      </Text>
                      <Text style={styles.activiteSoustitre} numberOfLines={1}>
                        {item.soustitre}
                      </Text>
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