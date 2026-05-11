/**
 * @file LeadDetailScreen.tsx
 * @description Fiche detail d'un lead : informations, score, pipeline statut,
 *              timeline des activites commerciales, actions qualifier/convertir/perdre.
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

import { useStyles, useTheme }              from '../../theme';
import { makeStyles }                       from './LeadDetailScreen.styles';
import { ScoreBar }                         from '../../components/ui/ScoreBar';
import { TimelineItem }                     from '../../components/ui/TimelineItem';
import { SmartActionSheet }                 from '../../components/ui/SmartActionSheet';
import { VentesStackParamList }             from '../../navigation/VentesStack';

import * as VenteApi from '../../api/vente.api';
import {
  LeadResponse,
  ActiviteCommercialeResponse,
  STATUT_LEAD_CONFIG,
  SOURCE_LEAD_LABELS,
} from '../../types/vente.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<VentesStackParamList, 'LeadDetail'>;
type Route = RouteProp<VentesStackParamList, 'LeadDetail'>;

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Fiche lead avec score, pipeline, timeline activites et actions CRM.
 * @author Riahi Dorsaf
 */
export const LeadDetailScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { leadId } = route.params;

  const [lead,         setLead]         = useState<LeadResponse | null>(null);
  const [activites,    setActivites]    = useState<ActiviteCommercialeResponse[]>([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [smartVisible, setSmartVisible] = useState(false);

  // ── Chargement ────────────────────────────────────────────

  const charger = useCallback(async () => {
    setIsLoading(true);
    try {
      const [leadRes] = await Promise.allSettled([
        VenteApi.obtenirLead(leadId),
        // Les activites seront chargees via un endpoint dedie Sprint 4
      ]);
      if (leadRes.status === 'fulfilled' && leadRes.value.success) {
        setLead(leadRes.value.data);
      }
    } catch {
      // silencieux
    } finally {
      setIsLoading(false);
    }
  }, [leadId]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // ── Actions pipeline ──────────────────────────────────────

  const handleQualifier = async () => {
    if (!lead) return;
    Alert.alert('Qualifier ce lead', 'Confirmer la qualification ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Qualifier',
        onPress: async () => {
          try {
            const res = await VenteApi.changerStatutLead(lead.id, 'QUALIFIE');
            if (res.success) setLead(res.data);
          } catch {
            Alert.alert('Erreur', 'Impossible de qualifier le lead.');
          }
        },
      },
    ]);
  };

  const handlePerdre = () => {
    if (!lead) return;
    Alert.alert('Marquer comme perdu', 'Indiquer une raison (optionnel) ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Marquer perdu',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await VenteApi.changerStatutLead(lead.id, 'PERDU');
            if (res.success) setLead(res.data);
          } catch {
            Alert.alert('Erreur', 'Impossible de changer le statut.');
          }
        },
      },
    ]);
  };

  const handleConvertir = () => {
    setSmartVisible(true);
  };

  const handleConvertirConfirm = async () => {
    if (!lead) return;
    setSmartVisible(false);
    try {
      const res = await VenteApi.convertirLead(lead.id, { creerNouveauClient: true });
      if (res.success) {
        navigation.replace('OpportuniteDetail', { opportuniteId: res.data.id });
      }
    } catch (e: any) {
      Alert.alert('Erreur', e?.response?.data?.message ?? 'Erreur lors de la conversion.');
    }
  };

  // ── Rendu ─────────────────────────────────────────────────

  if (isLoading || !lead) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const conf        = STATUT_LEAD_CONFIG[lead.statut];
  const peutAgir    = lead.statut !== 'CONVERTI' && lead.statut !== 'PERDU';
  const peutConv    = lead.statut !== 'CONVERTI' && lead.statut !== 'PERDU';

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
            <Text style={styles.headerNom} numberOfLines={1}>{lead.nom}</Text>
            <Text style={styles.headerSub}>
              {SOURCE_LEAD_LABELS[lead.source]} — {lead.dateRelative}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('LeadForm', { leadId: lead.id })}
          >
            <Ionicons name="pencil-outline" size={18} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* ── Statut + Score ── */}
        <View style={styles.scoreSection}>
          <View style={[styles.statutBadge, { backgroundColor: conf.bg, marginBottom: theme.spacing[3] }]}>
            <Text style={[styles.statutBadgeText, { color: conf.color }]}>
              {conf.label}
            </Text>
          </View>
          <Text style={styles.scoreLabel}>Score de qualification</Text>
          <ScoreBar score={lead.score} />
        </View>

        {/* ── Informations ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.card}>
            {lead.email ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{lead.email}</Text>
              </View>
            ) : null}
            {lead.telephone ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Telephone</Text>
                <Text style={styles.infoValue}>{lead.telephone}</Text>
              </View>
            ) : null}
            {lead.entreprise ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Entreprise</Text>
                <Text style={styles.infoValue}>{lead.entreprise}</Text>
              </View>
            ) : null}
            {lead.poste ? (
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <Text style={styles.infoLabel}>Poste</Text>
                <Text style={styles.infoValue}>{lead.poste}</Text>
              </View>
            ) : (
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <Text style={styles.infoLabel}>Source</Text>
                <Text style={styles.infoValue}>{SOURCE_LEAD_LABELS[lead.source]}</Text>
              </View>
            )}
          </View>
        </View>

        {lead.descriptionBesoin ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Besoin</Text>
            <View style={styles.card}>
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <Text style={[styles.infoValue, { textAlign: 'left', marginLeft: 0 }]}>
                  {lead.descriptionBesoin}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

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
        {peutAgir && (
          <View style={styles.actionsSection}>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionBtn, { borderColor: '#7C3AED' }]}
                onPress={handleQualifier}
              >
                <Ionicons name="checkmark-circle-outline" size={16} color="#7C3AED" />
                <Text style={[styles.actionBtnText, { color: '#7C3AED' }]}>Qualifier</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { borderColor: theme.colors.danger }]}
                onPress={handlePerdre}
              >
                <Ionicons name="close-circle-outline" size={16} color={theme.colors.danger} />
                <Text style={[styles.actionBtnText, { color: theme.colors.danger }]}>Perdre</Text>
              </TouchableOpacity>
            </View>

            {peutConv && (
              <TouchableOpacity style={styles.convertBtn} onPress={handleConvertir}>
                <Ionicons name="trending-up-outline" size={20} color={theme.colors.white} />
                <Text style={styles.convertBtnText}>Convertir en opportunite</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {lead.raisonPerte ? (
          <View style={[styles.section, { marginTop: theme.spacing[4] }]}>
            <Text style={styles.sectionTitle}>Raison de la perte</Text>
            <View style={styles.card}>
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <Text style={[styles.infoValue, { textAlign: 'left', marginLeft: 0, color: theme.colors.danger }]}>
                  {lead.raisonPerte}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

      </ScrollView>

      {/* ── Smart Automation conversion ── */}
      <SmartActionSheet
        visible={smartVisible}
        iconName="trending-up-outline"
        iconColor="#16A34A"
        iconBg="#F0FDF4"
        title="Convertir ce lead"
        subtitle="Un nouveau client et une opportunite seront crees automatiquement depuis les informations de ce lead."
        confirmLabel="Convertir et creer l'opportunite"
        dismissLabel="Annuler"
        onConfirm={handleConvertirConfirm}
        onDismiss={() => setSmartVisible(false)}
      />
    </SafeAreaView>
  );
};
