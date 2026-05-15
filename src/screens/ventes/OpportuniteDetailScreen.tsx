/**
 * @file OpportuniteDetailScreen.tsx
 * @description Fiche detail d'une opportunite : montant, probabilite,
 *              pipeline statut, timeline activites et actions CRM.
 *              Smart action : generer un devis depuis l'opportunite.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView }                         from 'react-native-safe-area-context';
import { useNavigation, useRoute,
         RouteProp, useFocusEffect }            from '@react-navigation/native';
import { NativeStackNavigationProp }            from '@react-navigation/native-stack';
import { Ionicons }                             from '@expo/vector-icons';

import { useStyles, useTheme }          from '../../theme';
import { makeStyles }                   from './OpportuniteDetailScreen.styles';
import { TimelineItem }                 from '../../components/ui/TimelineItem';
import { SmartActionSheet }             from '../../components/ui/SmartActionSheet';
import { VentesStackParamList }         from '../../navigation/VentesStack';
import { useTimeline }                  from '../../hooks/useTimeline';

import * as VenteApi from '../../api/vente.api';
import {
  OpportuniteResponse,
  KANBAN_COLONNES,
} from '../../types/vente.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<VentesStackParamList, 'OpportuniteDetail'>;
type Route = RouteProp<VentesStackParamList, 'OpportuniteDetail'>;

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Fiche opportunite avec montant, probabilite, timeline et actions.
 * @author Riahi Dorsaf
 */
export const OpportuniteDetailScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { opportuniteId } = route.params;

  const [opportunite,  setOpportunite]  = useState<OpportuniteResponse | null>(null);
  const [isLoading,    setIsLoading]    = useState(true);

  // ── Timeline activités depuis le reporting ────────────────
  const { activites } = useTimeline('OPPORTUNITE', opportuniteId);
  const [smartVisible, setSmartVisible] = useState(false);

  // ── Chargement ────────────────────────────────────────────

  const charger = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await VenteApi.obtenirOpportunite(opportuniteId);
      if (res.success) setOpportunite(res.data);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger l opportunite.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }, [opportuniteId, navigation]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // ── Actions ───────────────────────────────────────────────

  const handleAvancer = async () => {
    if (!opportunite) return;
    const colonnes = KANBAN_COLONNES.map(c => c.statut);
    const idx      = colonnes.indexOf(opportunite.statut);
    if (idx < 0 || idx >= colonnes.length - 2) return;

    const next = colonnes[idx + 1];
    Alert.alert('Avancer', `Passer a ${next} ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Confirmer',
        onPress: async () => {
          try {
            const res = await VenteApi.changerStatutOpportunite(opportunite.id, next);
            if (res.success) {
              setOpportunite(res.data);
              if (next === 'GAGNEE') setSmartVisible(true);
            }
          } catch {
            Alert.alert('Erreur', 'Impossible de changer le statut.');
          }
        },
      },
    ]);
  };

  const handlePerdre = () => {
    if (!opportunite) return;
    Alert.alert('Marquer comme perdue', `Confirmer la perte de "${opportunite.titre}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Confirmer',
        style: 'destructive',
        onPress: async () => {
          const res = await VenteApi.changerStatutOpportunite(opportunite.id, 'PERDUE');
          if (res.success) setOpportunite(res.data);
        },
      },
    ]);
  };

  const handleGenererDevis = async () => {
    if (!opportunite) return;
    setSmartVisible(false);
    try {
      const res = await VenteApi.genererDevisDepuisOpportunite(opportunite.id);
      if (res.success) {
        navigation.navigate('DevisDetail', { devisId: res.data.id });
      }
    } catch (e: any) {
      Alert.alert('Erreur', e?.response?.data?.message ?? 'Impossible de generer le devis.');
    }
  };

  // ── Rendu ─────────────────────────────────────────────────

  if (isLoading || !opportunite) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const col          = KANBAN_COLONNES.find(c => c.statut === opportunite.statut);
  const peutAvancer  = opportunite.statut !== 'GAGNEE' && opportunite.statut !== 'PERDUE';
  const peutPerdre   = opportunite.statut !== 'GAGNEE' && opportunite.statut !== 'PERDUE';
  const estActive    = opportunite.statut !== 'PERDUE';

  const fmt = (v: number | null) =>
    v ? v.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' TND' : 'Non renseigne';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitre} numberOfLines={1}>{opportunite.titre}</Text>
            <Text style={styles.headerSub}>{opportunite.clientNom} — {opportunite.dateRelative}</Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('OpportuniteForm', { opportuniteId: opportunite.id })}
          >
            <Ionicons name="pencil-outline" size={18} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* ── Hero montant ── */}
        <View style={styles.heroSection}>
          <Text style={styles.heroLabel}>Montant estime</Text>
          <Text style={styles.heroMontant}>{fmt(opportunite.montantEstime)}</Text>
          {opportunite.probabilite ? (
            <Text style={styles.heroProbabilite}>Probabilite : {opportunite.probabilite}%</Text>
          ) : null}
        </View>

        {/* ── Statut pills ── */}
        <View style={styles.statutRow}>
          {KANBAN_COLONNES.map(c => {
            const isActif = c.statut === opportunite.statut;
            return (
              <View key={c.statut} style={[
                styles.statutPill,
                { backgroundColor: isActif ? c.color : theme.colors.bgApp },
              ]}>
                <Text style={[
                  styles.statutPillText,
                  { color: isActif ? '#FFFFFF' : theme.colors.textTertiary },
                ]}>
                  {c.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ── Informations ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Client</Text>
              <Text style={styles.infoValue}>{opportunite.clientNom}</Text>
            </View>
            {opportunite.leadNom ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Lead source</Text>
                <Text style={styles.infoValue}>{opportunite.leadNom}</Text>
              </View>
            ) : null}
            {opportunite.dateCloturePrevue ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cloture prevue</Text>
                <Text style={styles.infoValue}>{opportunite.dateCloturePrevue}</Text>
              </View>
            ) : null}
            {opportunite.description ? (
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <Text style={[styles.infoValue, { textAlign: 'left', marginLeft: 0 }]}>
                  {opportunite.description}
                </Text>
              </View>
            ) : (
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <Text style={styles.infoLabel}>Cree le</Text>
                <Text style={styles.infoValue}>{opportunite.dateRelative}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Activites ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activites ({activites.length})</Text>
          <View style={styles.timelineCard}>
            {activites.length === 0 ? (
              <View style={styles.emptyTimeline}>
                <Text style={styles.emptyTimelineText}>Aucune activite enregistree</Text>
              </View>
            ) : (
              activites.map((a, i) => (
                <TimelineItem key={a.id} activite={a} isLast={i === activites.length - 1} />
              ))
            )}
            <TouchableOpacity style={styles.addActiviteBtn}>
              <Ionicons name="add" size={16} color={theme.colors.textTertiary} />
              <Text style={styles.addActiviteBtnText}>Ajouter une activite</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Actions ── */}
        {estActive && (
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate('DevisForm', { opportuniteId: opportunite.id, clientId: opportunite.clientId })}
            >
              <Ionicons name="document-text-outline" size={20} color={theme.colors.white} />
              <Text style={styles.primaryBtnText}>Creer un devis</Text>
            </TouchableOpacity>

            {(peutAvancer || peutPerdre) && (
              <View style={styles.actionRow}>
                {peutAvancer && (
                  <TouchableOpacity
                    style={[styles.actionBtn, { borderColor: theme.colors.primary }]}
                    onPress={handleAvancer}
                  >
                    <Ionicons name="arrow-forward-outline" size={16} color={theme.colors.primary} />
                    <Text style={[styles.actionBtnText, { color: theme.colors.primary }]}>
                      Avancer
                    </Text>
                  </TouchableOpacity>
                )}
                {peutPerdre && (
                  <TouchableOpacity
                    style={[styles.actionBtn, { borderColor: theme.colors.danger }]}
                    onPress={handlePerdre}
                  >
                    <Ionicons name="close-outline" size={16} color={theme.colors.danger} />
                    <Text style={[styles.actionBtnText, { color: theme.colors.danger }]}>Perdre</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}

      </ScrollView>

      {/* ── Smart Automation ── */}
      <SmartActionSheet
        visible={smartVisible}
        iconName="trophy-outline"
        iconColor="#16A34A"
        iconBg="#F0FDF4"
        title="Opportunite gagnee !"
        subtitle="Voulez-vous generer un devis maintenant pour cette opportunite ?"
        confirmLabel="Generer le devis"
        onConfirm={handleGenererDevis}
        onDismiss={() => setSmartVisible(false)}
      />
    </SafeAreaView>
  );
};