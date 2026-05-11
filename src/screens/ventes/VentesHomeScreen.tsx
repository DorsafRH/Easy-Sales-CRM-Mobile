/**
 * @file VentesHomeScreen.tsx
 * @description Dashboard commercial — KPIs pipeline + acces rapide
 *              Leads, Opportunites, Devis, Factures.
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
import { VentesStackParamList }       from '../../navigation/VentesStack';

import * as VenteApi from '../../api/vente.api';
import { OpportuniteResponse, KANBAN_COLONNES } from '../../types/vente.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav = NativeStackNavigationProp<VentesStackParamList, 'VentesHome'>;

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Ecran d'accueil du module Ventes.
 * @author Riahi Dorsaf
 */
export const VentesHomeScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();

  const [opportunites,  setOpportunites]  = useState<OpportuniteResponse[]>([]);
  const [nbLeads,       setNbLeads]       = useState(0);
  const [nbDevis,       setNbDevis]       = useState(0);
  const [nbFactures,    setNbFactures]    = useState(0);
  const [isLoading,     setIsLoading]     = useState(true);
  const [isRefreshing,  setIsRefreshing]  = useState(false);

  // ── Chargement ────────────────────────────────────────────

  const charger = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const [leadsRes, opRes, devisRes, facturesRes] = await Promise.allSettled([
        VenteApi.listerLeads(),
        VenteApi.listerOpportunites(),
        VenteApi.listerDevis('ENVOYE'),
        VenteApi.listerFactures('EMISE'),
      ]);

      if (leadsRes.status === 'fulfilled' && leadsRes.value.success) {
        setNbLeads(leadsRes.value.data.length);
      }
      if (opRes.status === 'fulfilled' && opRes.value.success) {
        setOpportunites(opRes.value.data.slice(0, 5));
      }
      if (devisRes.status === 'fulfilled' && devisRes.value.success) {
        setNbDevis(devisRes.value.data.length);
      }
      if (facturesRes.status === 'fulfilled' && facturesRes.value.success) {
        setNbFactures(facturesRes.value.data.length);
      }
    } catch {
      // silencieux
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // ── Actions rapides ───────────────────────────────────────

  const ACTIONS = [
    {
      label:     'Nouveau lead',
      iconName:  'person-add-outline',
      iconColor: '#2563EB',
      iconBg:    '#EFF6FF',
      onPress:   () => navigation.navigate('LeadForm', {}),
    },
    {
      label:     'Kanban',
      iconName:  'albums-outline',
      iconColor: '#7C3AED',
      iconBg:    '#F5F3FF',
      onPress:   () => navigation.navigate('OpportunitesKanban'),
    },
    {
      label:     'Devis',
      iconName:  'document-text-outline',
      iconColor: '#16A34A',
      iconBg:    '#F0FDF4',
      onPress:   () => navigation.navigate('DevisList'),
    },
    {
      label:     'Factures',
      iconName:  'receipt-outline',
      iconColor: '#D97706',
      iconBg:    '#FFFBEB',
      onPress:   () => navigation.navigate('DevisList'),
    },
  ] as const;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const montantPipeline = opportunites
    .reduce((acc, o) => acc + (o.montantEstime ?? 0), 0);

  const formatMontant = (v: number) =>
    v.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' TND';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => charger(true)}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ventes</Text>
          <Text style={styles.headerSub}>Pipeline commercial</Text>
        </View>

        {/* ── KPIs ── */}
        <View style={styles.kpisGrid}>
          <View style={styles.kpiItem}>
            <StatCard
              iconName="people-outline"
              iconColor="#2563EB"
              iconBg="#EFF6FF"
              value={nbLeads}
              label="Leads actifs"
            />
          </View>
          <View style={styles.kpiItem}>
            <StatCard
              iconName="trending-up-outline"
              iconColor="#7C3AED"
              iconBg="#F5F3FF"
              value={opportunites.length}
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

        {/* ── Actions rapides ── */}
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

        {/* ── Opportunités récentes ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Opportunites ({opportunites.length})
            </Text>
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
                    style={[styles.recentItem, i === opportunites.length - 1 && styles.recentItemLast]}
                    onPress={() => navigation.navigate('OpportuniteDetail', { opportuniteId: o.id })}
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
    </SafeAreaView>
  );
};