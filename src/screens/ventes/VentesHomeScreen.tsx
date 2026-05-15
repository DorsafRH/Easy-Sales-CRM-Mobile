/**
 * @file VentesHomeScreen.tsx
 * @description Dashboard commercial — 4 tabs : Résumé, Leads, Pipeline, Devis & Factures.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView }                  from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp }     from '@react-navigation/native-stack';
import { Ionicons }                      from '@expo/vector-icons';

import { useStyles, useTheme }        from '../../theme';
import { makeStyles }                 from './VentesHomeScreen.styles';
import { StatCard }                   from '../../components/ui/StatCard';
import { EmptyState }                 from '../../components/ui/EmptyState';
import { ScoreBar }                   from '../../components/ui/ScoreBar';
import { VentesStackParamList }       from '../../navigation/VentesStack';

import * as VenteApi from '../../api/vente.api';
import {
  OpportuniteResponse,
  LeadResponse,
  DevisResponse,
  FactureResponse,
  KANBAN_COLONNES,
  STATUT_LEAD_CONFIG,
  STATUT_DEVIS_CONFIG,
  STATUT_FACTURE_CONFIG,
} from '../../types/vente.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav    = NativeStackNavigationProp<VentesStackParamList, 'VentesHome'>;
type TabKey = 'resume' | 'leads' | 'pipeline' | 'devis';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'resume',   label: 'Résumé'       },
  { key: 'leads',    label: 'Leads'        },
  { key: 'pipeline', label: 'Pipeline'     },
  { key: 'devis',    label: 'Devis & Fact.' },
];

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Dashboard Ventes avec 4 tabs : Résumé, Leads, Pipeline, Devis & Factures.
 */
export const VentesHomeScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();

  const [activeTab,       setActiveTab]       = useState<TabKey>('resume');
  const [opportunites,    setOpportunites]    = useState<OpportuniteResponse[]>([]);
  const [leads,           setLeads]           = useState<LeadResponse[]>([]);
  const [allLeads,        setAllLeads]        = useState<LeadResponse[]>([]);
  const [allOpportunites, setAllOpportunites] = useState<OpportuniteResponse[]>([]);
  const [devis,           setDevis]           = useState<DevisResponse[]>([]);
  const [factures,        setFactures]        = useState<FactureResponse[]>([]);
  const [nbDevis,         setNbDevis]         = useState(0);
  const [isLoading,       setIsLoading]       = useState(true);
  const [isRefreshing,    setIsRefreshing]    = useState(false);

  // ── Chargement ────────────────────────────────────────────

  const charger = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true); else setIsLoading(true);
    try {
      const [leadsRes, opRes, devisRes, facturesRes] = await Promise.allSettled([
        VenteApi.listerLeads(),
        VenteApi.listerOpportunites(),
        VenteApi.listerDevis(),
        VenteApi.listerFactures(),
      ]);
      if (leadsRes.status === 'fulfilled' && leadsRes.value.success) {
        const data = leadsRes.value.data;
        setAllLeads(data);
        setLeads(data.slice(0, 3));
      }
      if (opRes.status === 'fulfilled' && opRes.value.success) {
        const data = opRes.value.data;
        setAllOpportunites(data);
        setOpportunites(data.slice(0, 4));
      }
      if (devisRes.status === 'fulfilled' && devisRes.value.success) {
        const data = devisRes.value.data;
        setDevis(data.slice(0, 5));
        setNbDevis(data.filter(d => d.statut === 'ENVOYE').length);
      }
      if (facturesRes.status === 'fulfilled' && facturesRes.value.success) {
        setFactures(facturesRes.value.data.slice(0, 5));
      }
    } catch {
      // silencieux
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // ── Helpers ───────────────────────────────────────────────

  const formatMontant = (v: number) =>
    v.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' TND';

  const montantPipeline = allOpportunites.reduce((acc, o) => acc + (o.montantEstime ?? 0), 0);

  const refreshControl = (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={() => charger(true)}
      tintColor={theme.colors.primary}
    />
  );

  // ── Actions rapides ───────────────────────────────────────

  const ACTIONS = [
    {
      label:    'Nouveau lead',
      iconName: 'person-add-outline',
      iconColor:'#2563EB',
      iconBg:   '#EFF6FF',
      onPress:  () => navigation.navigate('LeadForm', {}),
    },
    {
      label:    'Kanban',
      iconName: 'albums-outline',
      iconColor:'#7C3AED',
      iconBg:   '#F5F3FF',
      onPress:  () => navigation.navigate('OpportunitesKanban'),
    },
    {
      label:    'Devis',
      iconName: 'document-text-outline',
      iconColor:'#16A34A',
      iconBg:   '#F0FDF4',
      onPress:  () => navigation.navigate('DevisList'),
    },
    {
      label:    'Factures',
      iconName: 'receipt-outline',
      iconColor:'#D97706',
      iconBg:   '#FFFBEB',
      onPress:  () => navigation.navigate('DevisList'),
    },
  ] as const;

  // ── Tab : Résumé ──────────────────────────────────────────

  const renderResumeTab = () => (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    >
      {/* KPIs */}
      <View style={styles.kpisGrid}>
        <View style={styles.kpiItem}>
          <StatCard
            iconName="people-outline"
            iconColor="#2563EB"
            iconBg="#EFF6FF"
            value={allLeads.length}
            label="Leads"
          />
        </View>
        <View style={styles.kpiItem}>
          <StatCard
            iconName="trending-up-outline"
            iconColor="#7C3AED"
            iconBg="#F5F3FF"
            value={allOpportunites.length}
            label="Opportunites"
          />
        </View>
        <View style={styles.kpiItem}>
          <StatCard
            iconName="cash-outline"
            iconColor="#16A34A"
            iconBg="#F0FDF4"
            value={formatMontant(montantPipeline)}
            label="Pipeline"
          />
        </View>
        <View style={styles.kpiItem}>
          <StatCard
            iconName="document-text-outline"
            iconColor="#D97706"
            iconBg="#FFFBEB"
            value={nbDevis}
            label="Devis envoyes"
          />
        </View>
      </View>

      {/* Actions rapides */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Acces rapide</Text>
        </View>
        <View style={styles.actionGrid}>
          {ACTIONS.map(a => (
            <TouchableOpacity
              key={a.label}
              style={styles.actionItem}
              onPress={a.onPress}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconWrapper, { backgroundColor: a.iconBg }]}>
                <Ionicons name={a.iconName as any} size={22} color={a.iconColor} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Leads récents */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Leads recents</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LeadsList')}>
            <Text style={styles.sectionLink}>Voir tous</Text>
          </TouchableOpacity>
        </View>

        {leads.length === 0 ? (
          <EmptyState
            icon="people-outline"
            titre="Aucun lead"
            soustitre="Ajoutez votre premier prospect"
          />
        ) : (
          <View style={styles.recentCard}>
            {leads.map((l, i) => {
              const conf = STATUT_LEAD_CONFIG[l.statut];
              return (
                <TouchableOpacity
                  key={l.id}
                  style={[
                    styles.recentItem,
                    i === leads.length - 1 && styles.recentItemLast,
                  ]}
                  onPress={() => navigation.navigate('LeadDetail', { leadId: l.id })}
                  activeOpacity={0.75}
                >
                  <View style={[styles.recentIconWrapper, { backgroundColor: conf.bg }]}>
                    <Ionicons name="person-outline" size={18} color={conf.color} />
                  </View>
                  <View style={styles.recentContent}>
                    <Text style={styles.recentTitle} numberOfLines={1}>{l.nom}</Text>
                    <Text style={styles.recentSub} numberOfLines={1}>
                      {l.entreprise ?? l.email ?? l.telephone ?? 'Aucune info'}
                    </Text>
                    <View style={{ marginTop: 4 }}>
                      <ScoreBar score={l.score} showLabel={false} />
                    </View>
                  </View>
                  <View style={[styles.badge, { backgroundColor: conf.bg }]}>
                    <Text style={[styles.badgeText, { color: conf.color }]}>{conf.label}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Opportunités récentes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Opportunites ({opportunites.length})</Text>
          <TouchableOpacity onPress={() => navigation.navigate('OpportunitesKanban')}>
            <Text style={styles.sectionLink}>Kanban</Text>
          </TouchableOpacity>
        </View>

        {opportunites.length === 0 ? (
          <EmptyState
            icon="trending-up-outline"
            titre="Aucune opportunite"
            soustitre="Convertissez un lead ou creez directement une opportunite"
          />
        ) : (
          <View style={styles.recentCard}>
            {opportunites.map((o, i) => {
              const col = KANBAN_COLONNES.find(c => c.statut === o.statut);
              return (
                <TouchableOpacity
                  key={o.id}
                  style={[
                    styles.recentItem,
                    i === opportunites.length - 1 && styles.recentItemLast,
                  ]}
                  onPress={() =>
                    navigation.navigate('OpportuniteDetail', { opportuniteId: o.id })
                  }
                  activeOpacity={0.75}
                >
                  <View style={[
                    styles.recentIconWrapper,
                    { backgroundColor: col?.bg ?? theme.colors.bgApp },
                  ]}>
                    <Ionicons
                      name={(col?.iconName ?? 'ellipse-outline') as any}
                      size={18}
                      color={col?.color ?? theme.colors.textSecondary}
                    />
                  </View>
                  <View style={styles.recentContent}>
                    <Text style={styles.recentTitle} numberOfLines={1}>{o.titre}</Text>
                    <Text style={styles.recentSub}>{o.clientNom}</Text>
                  </View>
                  {o.montantEstime ? (
                    <Text style={styles.recentMontant}>
                      {formatMontant(o.montantEstime)}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );

  // ── Tab : Leads ───────────────────────────────────────────

  const renderLeadsTab = () => (
    <View style={styles.tabContent}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tous les leads ({allLeads.length})</Text>
          </View>

          {allLeads.length === 0 ? (
            <EmptyState
              icon="people-outline"
              titre="Aucun lead"
              soustitre="Ajoutez votre premier prospect"
            />
          ) : (
            allLeads.map(l => {
              const conf = STATUT_LEAD_CONFIG[l.statut];
              return (
                <TouchableOpacity
                  key={l.id}
                  style={styles.listItem}
                  onPress={() => navigation.navigate('LeadDetail', { leadId: l.id })}
                  activeOpacity={0.75}
                >
                  <View style={[styles.recentIconWrapper, { backgroundColor: conf.bg }]}>
                    <Ionicons name="person-outline" size={18} color={conf.color} />
                  </View>
                  <View style={styles.recentContent}>
                    <Text style={styles.recentTitle} numberOfLines={1}>{l.nom}</Text>
                    <Text style={styles.recentSub} numberOfLines={1}>
                      {l.entreprise ?? l.email ?? l.telephone ?? 'Aucune info'}
                    </Text>
                    <View style={{ marginTop: 4 }}>
                      <ScoreBar score={l.score} showLabel={false} />
                    </View>
                  </View>
                  <View style={[styles.badge, { backgroundColor: conf.bg }]}>
                    <Text style={[styles.badgeText, { color: conf.color }]}>{conf.label}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* FAB : nouveau lead */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('LeadForm', {})}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  );

  // ── Tab : Pipeline ────────────────────────────────────────

  const renderPipelineTab = () => (
    <View style={styles.tabContent}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        {/* Bouton Voir Kanban */}
        <View style={[styles.section, { marginTop: theme.spacing[4] }]}>
          <TouchableOpacity
            style={styles.kanbanButton}
            onPress={() => navigation.navigate('OpportunitesKanban')}
            activeOpacity={0.8}
          >
            <Ionicons name="albums-outline" size={18} color={theme.colors.primary} />
            <Text style={styles.kanbanButtonText}>Voir Kanban</Text>
          </TouchableOpacity>
        </View>

        {/* Groupes par statut */}
        <View style={styles.section}>
          {allOpportunites.length === 0 ? (
            <EmptyState
              icon="trending-up-outline"
              titre="Aucune opportunite"
              soustitre="Convertissez un lead ou creez une opportunite"
            />
          ) : (
            KANBAN_COLONNES.map(col => {
              const items = allOpportunites.filter(o => o.statut === col.statut);
              if (items.length === 0) return null;
              return (
                <View key={col.statut}>
                  <Text style={styles.groupLabel}>{col.label} ({items.length})</Text>
                  {items.map(o => (
                    <TouchableOpacity
                      key={o.id}
                      style={styles.listItem}
                      onPress={() =>
                        navigation.navigate('OpportuniteDetail', { opportuniteId: o.id })
                      }
                      activeOpacity={0.75}
                    >
                      <View style={[styles.recentIconWrapper, { backgroundColor: col.bg }]}>
                        <Ionicons name={col.iconName as any} size={18} color={col.color} />
                      </View>
                      <View style={styles.recentContent}>
                        <Text style={styles.recentTitle} numberOfLines={1}>{o.titre}</Text>
                        <Text style={styles.recentSub}>{o.clientNom}</Text>
                      </View>
                      {o.montantEstime ? (
                        <Text style={styles.recentMontant}>
                          {formatMontant(o.montantEstime)}
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  ))}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );

  // ── Tab : Devis & Factures ────────────────────────────────

  const renderDevisTab = () => (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    >
      {/* Devis récents */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Devis recents</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DevisList')}>
            <Text style={styles.sectionLink}>Voir tous</Text>
          </TouchableOpacity>
        </View>

        {devis.length === 0 ? (
          <EmptyState
            icon="document-text-outline"
            titre="Aucun devis"
            soustitre="Aucun devis n'a ete cree"
          />
        ) : (
          devis.slice(0, 3).map(d => {
            const conf = STATUT_DEVIS_CONFIG[d.statut];
            return (
              <TouchableOpacity
                key={d.id}
                style={styles.listItem}
                onPress={() => navigation.navigate('DevisDetail', { devisId: d.id })}
                activeOpacity={0.75}
              >
                <View style={[styles.recentIconWrapper, { backgroundColor: conf.bg }]}>
                  <Ionicons name="document-text-outline" size={18} color={conf.color} />
                </View>
                <View style={styles.recentContent}>
                  <Text style={styles.recentTitle} numberOfLines={1}>{d.numero}</Text>
                  <Text style={styles.recentSub}>{d.clientNom}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <View style={[styles.badge, { backgroundColor: conf.bg }]}>
                    <Text style={[styles.badgeText, { color: conf.color }]}>{conf.label}</Text>
                  </View>
                  <Text style={[styles.recentMontant, { marginTop: 4 }]}>
                    {formatMontant(d.montantTtc)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* Factures récentes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Factures recentes</Text>
        </View>

        {factures.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            titre="Aucune facture"
            soustitre="Aucune facture n'a ete generee"
          />
        ) : (
          factures.slice(0, 3).map(f => {
            const conf = STATUT_FACTURE_CONFIG[f.statut];
            return (
              <TouchableOpacity
                key={f.id}
                style={styles.listItem}
                onPress={() => navigation.navigate('FactureDetail', { factureId: f.id })}
                activeOpacity={0.75}
              >
                <View style={[styles.recentIconWrapper, { backgroundColor: conf.bg }]}>
                  <Ionicons name="receipt-outline" size={18} color={conf.color} />
                </View>
                <View style={styles.recentContent}>
                  <Text style={styles.recentTitle} numberOfLines={1}>{f.numero}</Text>
                  <Text style={styles.recentSub}>{f.clientNom}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <View style={[styles.badge, { backgroundColor: conf.bg }]}>
                    <Text style={[styles.badgeText, { color: conf.color }]}>{conf.label}</Text>
                  </View>
                  <Text style={[styles.recentMontant, { marginTop: 4 }]}>
                    {formatMontant(f.montantTtc)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );

  // ── Écran de chargement initial ───────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // ── Rendu principal ───────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

      {/* Header fixe */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ventes</Text>
        <Text style={styles.headerSub}>Pipeline commercial</Text>
      </View>

      {/* Barre de tabs */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabItemText, activeTab === tab.key && styles.tabItemTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenu du tab actif */}
      {activeTab === 'resume'   && renderResumeTab()}
      {activeTab === 'leads'    && renderLeadsTab()}
      {activeTab === 'pipeline' && renderPipelineTab()}
      {activeTab === 'devis'    && renderDevisTab()}

    </SafeAreaView>
  );
};
