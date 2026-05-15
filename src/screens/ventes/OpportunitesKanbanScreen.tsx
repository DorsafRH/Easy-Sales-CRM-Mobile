/**
 * @file OpportunitesKanbanScreen.tsx
 * @description Pipeline Kanban horizontal scrollable + vue Liste groupee.
 *              Colonnes: Prospection → Qualification → Proposition →
 *              Negociation → Gagnee → Perdue.
 *              Changement de statut via boutons inline sur chaque card.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { SafeAreaView }                  from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp }     from '@react-navigation/native-stack';
import { Ionicons }                      from '@expo/vector-icons';

import { useStyles, useTheme }       from '../../theme';
import { makeStyles }                from './OpportunitesKanbanScreen.styles';
import { EmptyState }                from '../../components/ui/EmptyState';
import { SmartActionSheet }          from '../../components/ui/SmartActionSheet';
import { VentesStackParamList }      from '../../navigation/VentesStack';

import * as VenteApi from '../../api/vente.api';
import {
  KanbanData,
  OpportuniteResponse,
  StatutOpportunite,
  KANBAN_COLONNES,
} from '../../types/vente.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav = NativeStackNavigationProp<VentesStackParamList, 'OpportunitesKanban'>;
type ViewMode = 'kanban' | 'liste';

const STATUT_SUIVANT: Partial<Record<StatutOpportunite, StatutOpportunite>> = {
  PROSPECTION:   'QUALIFICATION',
  QUALIFICATION: 'PROPOSITION',
  PROPOSITION:   'NEGOCIATION',
  NEGOCIATION:   'GAGNEE',
};

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Pipeline Kanban horizontal + vue liste groupee par statut.
 * Pas de drag & drop natif — changement de statut via boutons Avancer/Perdre.
 * @author Riahi Dorsaf
 */
export const OpportunitesKanbanScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();

  const [kanban,        setKanban]        = useState<KanbanData | null>(null);
  const [viewMode,      setViewMode]      = useState<ViewMode>('kanban');
  const [isLoading,     setIsLoading]     = useState(true);
  const [isRefreshing,  setIsRefreshing]  = useState(false);
  const [smartSheet,    setSmartSheet]    = useState<{
    visible: boolean;
    opportuniteId: number | null;
  }>({ visible: false, opportuniteId: null });

  // ── Chargement ────────────────────────────────────────────

  const charger = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true); else setIsLoading(true);
    try {
      const res = await VenteApi.obtenirKanban();
      if (res.success) setKanban(res.data);
    } catch {
      // silencieux
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // ── Changement de statut ──────────────────────────────────

  const handleAvancer = async (o: OpportuniteResponse) => {
    const next = STATUT_SUIVANT[o.statut];
    if (!next) return;

    try {
      await VenteApi.changerStatutOpportunite(o.id, next);

      if (next === 'GAGNEE') {
        // Smart automation : proposer de creer un devis
        setSmartSheet({ visible: true, opportuniteId: o.id });
      } else {
        charger(true);
      }
    } catch (e: any) {
      Alert.alert('Erreur', e?.response?.data?.message ?? 'Impossible de changer le statut.');
    }
  };

  const handlePerdre = (o: OpportuniteResponse) => {
    Alert.alert(
      'Marquer comme perdue',
      `Confirmer la perte de "${o.titre}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'destructive',
          onPress: async () => {
            await VenteApi.changerStatutOpportunite(o.id, 'PERDUE');
            charger(true);
          },
        },
      ],
    );
  };

  const handleSmartConfirm = async () => {
    if (!smartSheet.opportuniteId) return;
    setSmartSheet({ visible: false, opportuniteId: null });
    try {
      const res = await VenteApi.genererDevisDepuisOpportunite(smartSheet.opportuniteId);
      if (res.success) {
        charger(true);
        navigation.navigate('DevisDetail', { devisId: res.data.id });
      }
    } catch {
      charger(true);
    }
  };

  const handleSmartDismiss = () => {
    setSmartSheet({ visible: false, opportuniteId: null });
    charger(true);
  };

  const formatMontant = (v: number | null) =>
    v ? v.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' TND' : '';

  // ── Rendu Kanban ──────────────────────────────────────────

  const renderKanbanCard = (o: OpportuniteResponse, colStatut: StatutOpportunite) => {
    const peutAvancer = !!STATUT_SUIVANT[colStatut];
    const peutPerdre  = colStatut !== 'GAGNEE' && colStatut !== 'PERDUE';

    return (
      <TouchableOpacity
        key={o.id}
        style={styles.opportuniteCard}
        onPress={() => navigation.navigate('OpportuniteDetail', { opportuniteId: o.id })}
        activeOpacity={0.85}
      >
        <Text style={styles.cardTitre} numberOfLines={2}>{o.titre}</Text>
        <Text style={styles.cardClient} numberOfLines={1}>{o.clientNom}</Text>
        {o.montantEstime ? (
          <Text style={styles.cardMontant}>{formatMontant(o.montantEstime)}</Text>
        ) : null}

        {(peutAvancer || peutPerdre) && (
          <View style={styles.cardActionsRow}>
            {peutAvancer && (
              <TouchableOpacity
                style={[styles.cardActionBtn, { borderColor: theme.colors.primary }]}
                onPress={() => handleAvancer(o)}
              >
                <Text style={[styles.cardActionBtnText, { color: theme.colors.primary }]}>
                  Avancer
                </Text>
              </TouchableOpacity>
            )}
            {peutPerdre && (
              <TouchableOpacity
                style={[styles.cardActionBtn, { borderColor: theme.colors.danger }]}
                onPress={() => handlePerdre(o)}
              >
                <Text style={[styles.cardActionBtnText, { color: theme.colors.danger }]}>
                  Perdre
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // ── Rendu Liste ───────────────────────────────────────────

  const renderListeGroupee = () => {
    if (!kanban) return null;

    return (
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => charger(true)}
            tintColor={theme.colors.primary}
          />
        }
      >
        {KANBAN_COLONNES.map(col => {
          const items = kanban[col.statut] ?? [];
          if (items.length === 0) return null;
          return (
            <View key={col.statut}>
              <Text style={styles.groupTitle}>
                {col.label} ({items.length})
              </Text>
              {items.map(o => (
                <TouchableOpacity
                  key={o.id}
                  style={styles.listCard}
                  onPress={() => navigation.navigate('OpportuniteDetail', { opportuniteId: o.id })}
                  activeOpacity={0.75}
                >
                  <View style={[styles.listCardIcon, { backgroundColor: col.bg }]}>
                    <Ionicons name={col.iconName as any} size={18} color={col.color} />
                  </View>
                  <View style={styles.listCardContent}>
                    <Text style={styles.listCardTitre} numberOfLines={1}>{o.titre}</Text>
                    <Text style={styles.listCardClient}>{o.clientNom}</Text>
                  </View>
                  {o.montantEstime ? (
                    <Text style={styles.listCardMontant}>{formatMontant(o.montantEstime)}</Text>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </ScrollView>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const totalOpportunites = kanban
    ? Object.values(kanban).reduce((acc, list) => acc + list.length, 0)
    : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Pipeline ({totalOpportunites})
        </Text>
        <TouchableOpacity
          style={styles.toggleBtn}
          onPress={() => setViewMode(v => v === 'kanban' ? 'liste' : 'kanban')}
        >
          <Ionicons
            name={viewMode === 'kanban' ? 'list-outline' : 'albums-outline'}
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.toggleBtnText}>
            {viewMode === 'kanban' ? 'Liste' : 'Kanban'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Contenu ── */}
      {viewMode === 'liste' ? renderListeGroupee() : (
        <ScrollView
          horizontal
          style={styles.kanbanScroll}
          contentContainerStyle={styles.kanbanContent}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => charger(true)}
              tintColor={theme.colors.primary}
            />
          }
        >
          {KANBAN_COLONNES.map(col => {
            const items = kanban ? (kanban[col.statut] ?? []) : [];
            return (
              <View key={col.statut} style={styles.colonne}>
                <View style={[styles.colonneHeader, { backgroundColor: col.color }]}>
                  <Ionicons name={col.iconName as any} size={16} color="#FFFFFF" />
                  <Text style={[styles.colonneTitle, { color: '#FFFFFF' }]}>
                    {col.label}
                  </Text>
                  <View style={styles.colonneBadge}>
                    <Text style={[styles.colonneBadgeText, { color: '#FFFFFF' }]}>
                      {items.length}
                    </Text>
                  </View>
                </View>

                <View style={styles.colonneBody}>
                  {items.length === 0 && (
                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary, textAlign: 'center', paddingVertical: 12 }}>
                      Vide
                    </Text>
                  )}
                  {items.map(o => renderKanbanCard(o, col.statut))}

                  <TouchableOpacity
                    style={styles.addCardBtn}
                    onPress={() => navigation.navigate('OpportuniteForm', {})}
                  >
                    <Ionicons name="add" size={14} color={theme.colors.textTertiary} />
                    <Text style={styles.addCardBtnText}>Ajouter</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* ── Smart Automation ── */}
      <SmartActionSheet
        visible={smartSheet.visible}
        iconName="trophy-outline"
        iconColor="#16A34A"
        iconBg="#F0FDF4"
        title="Opportunite gagnee !"
        subtitle="Voulez-vous creer un devis maintenant ?"
        confirmLabel="Creer le devis"
        dismissLabel="Plus tard"
        onConfirm={handleSmartConfirm}
        onDismiss={handleSmartDismiss}
      />
    </SafeAreaView>
  );
};