/**
 * @file LeadDetailScreen.tsx
 * @description Fiche détail d'un lead : informations, score, statut pipeline,
 *              timeline activités, actions qualifier/convertir/perdre.
 *              Conversion : 3 choix (nouveau client auto / client existant / annuler).
 * @author Riahi Dorsaf
 */

import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Modal, StyleSheet,
} from 'react-native';
import { SafeAreaView }                      from 'react-native-safe-area-context';
import { useNavigation, useRoute,
         RouteProp, useFocusEffect }         from '@react-navigation/native';
import { NativeStackNavigationProp }         from '@react-navigation/native-stack';
import { Ionicons }                          from '@expo/vector-icons';

import { useStyles, useTheme }   from '../../theme';
import { makeStyles }            from './LeadDetailScreen.styles';
import { ScoreBar }              from '../../components/ui/ScoreBar';
import { TimelineItem }          from '../../components/ui/TimelineItem';
import { ClientPickerModal }     from '../../components/ui/ClientPickerModal';
import { VentesStackParamList }  from '../../navigation/VentesStack';
import { AppTheme }              from '../../theme';
import { useTimeline }           from '../../hooks/useTimeline';

import * as VenteApi from '../../api/vente.api';
import {
  LeadResponse,
  STATUT_LEAD_CONFIG,
  SOURCE_LEAD_LABELS,
} from '../../types/vente.types';
import { ClientResponse } from '../../types/client.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<VentesStackParamList, 'LeadDetail'>;
type Route = RouteProp<VentesStackParamList, 'LeadDetail'>;

// ─────────────────────────────────────────────────────────────
// STYLES MODAL CONVERSION
// ─────────────────────────────────────────────────────────────

const makeConvStyles = (theme: AppTheme) =>
  StyleSheet.create({
    overlay: {
      flex:            1,
      backgroundColor: theme.colors.overlay,
      justifyContent:  'flex-end',
    },
    sheet: {
      backgroundColor:      theme.colors.bgSurface,
      borderTopLeftRadius:  theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      padding:              theme.spacing[5],
      paddingBottom:        theme.spacing[8],
    },
    handle: {
      alignSelf:       'center',
      width:           40,
      height:          4,
      borderRadius:    2,
      backgroundColor: theme.colors.border,
      marginBottom:    theme.spacing[4],
    },
    iconWrapper: {
      width:           56,
      height:          56,
      borderRadius:    28,
      alignSelf:       'center',
      alignItems:      'center',
      justifyContent:  'center',
      backgroundColor: '#F0FDF4',
      marginBottom:    theme.spacing[3],
    },
    title: {
      fontSize:     theme.typography.size.lg,
      fontWeight:   '700',
      color:        theme.colors.textPrimary,
      textAlign:    'center',
      marginBottom: theme.spacing[2],
    },
    subtitle: {
      fontSize:     theme.typography.size.sm,
      color:        theme.colors.textSecondary,
      textAlign:    'center',
      lineHeight:   theme.typography.size.sm * 1.6,
      marginBottom: theme.spacing[5],
    },
    choiceBtn: {
      flexDirection:     'row',
      alignItems:        'center',
      columnGap:         theme.spacing[3],
      paddingVertical:   theme.spacing[4],
      paddingHorizontal: theme.spacing[4],
      borderRadius:      theme.radius.lg,
      borderWidth:       1,
      borderColor:       theme.colors.border,
      backgroundColor:   theme.colors.bgApp,
      marginBottom:      theme.spacing[3],
    },
    choiceBtnPrimary: {
      borderColor:     theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
    },
    choiceIconWrapper: {
      width:          40,
      height:         40,
      borderRadius:   20,
      alignItems:     'center',
      justifyContent: 'center',
    },
    choiceContent: { flex: 1 },
    choiceTitle: {
      fontSize:     theme.typography.size.sm,
      fontWeight:   '700',
      color:        theme.colors.textPrimary,
      marginBottom: 2,
    },
    choiceTitlePrimary: { color: theme.colors.primary },
    choiceSub: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },
    cancelBtn: {
      alignItems:      'center',
      paddingVertical: theme.spacing[3],
      marginTop:       theme.spacing[1],
    },
    cancelBtnText: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
    },
  });

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Fiche lead avec score, pipeline, timeline et conversion intelligente.
 * @author Riahi Dorsaf
 */
export const LeadDetailScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const convStyles = useStyles(makeConvStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { leadId } = route.params;

  const [lead,               setLead]               = useState<LeadResponse | null>(null);
  const [isLoading,          setIsLoading]          = useState(true);

  // ── Timeline activités depuis le reporting ────────────────
  const { activites } = useTimeline('LEAD', leadId);
  const [isConverting,       setIsConverting]       = useState(false);
  const [convSheetVisible,   setConvSheetVisible]   = useState(false);
  const [clientPickerVisible, setClientPickerVisible] = useState(false);

  // ── Chargement ────────────────────────────────────────────

  const charger = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await VenteApi.obtenirLead(leadId);
      if (res.success) setLead(res.data);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger le lead.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }, [leadId, navigation]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // ── Actions pipeline ──────────────────────────────────────

  const handleQualifier = () => {
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
            Alert.alert('Erreur', 'Impossible de qualifier.');
          }
        },
      },
    ]);
  };

  const handlePerdre = () => {
    if (!lead) return;
    Alert.alert('Marquer comme perdu', 'Confirmer ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Confirmer',
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

  // ── Conversion : nouveau client auto ─────────────────────

  const handleConvertirNouveauClient = async () => {
    if (!lead) return;
    setConvSheetVisible(false);
    setIsConverting(true);
    try {
      const res = await VenteApi.convertirLead(lead.id, { creerNouveauClient: true });
      if (res.success) {
        navigation.replace('OpportuniteDetail', { opportuniteId: res.data.id });
      }
    } catch (e: any) {
      Alert.alert('Erreur', e?.response?.data?.message ?? 'Erreur lors de la conversion.');
    } finally {
      setIsConverting(false);
    }
  };

  // ── Conversion : client existant ──────────────────────────

  const handleConvertirClientExistant = async (client: ClientResponse) => {
    if (!lead) return;
    setClientPickerVisible(false);
    setIsConverting(true);
    try {
      const res = await VenteApi.convertirLead(lead.id, { clientExistantId: client.id });
      if (res.success) {
        navigation.replace('OpportuniteDetail', { opportuniteId: res.data.id });
      }
    } catch (e: any) {
      Alert.alert('Erreur', e?.response?.data?.message ?? 'Erreur lors de la conversion.');
    } finally {
      setIsConverting(false);
    }
  };

  // ── Rendu ─────────────────────────────────────────────────

  if (isLoading || !lead) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const conf     = STATUT_LEAD_CONFIG[lead.statut];
  const peutAgir = lead.statut !== 'CONVERTI' && lead.statut !== 'PERDU';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ── Header avec flèche retour ── */}
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
            <Text style={[styles.statutBadgeText, { color: conf.color }]}>{conf.label}</Text>
          </View>
          <Text style={styles.scoreLabel}>Score de qualification</Text>
          <ScoreBar score={lead.score} />
        </View>

        {/* ── Informations contact ── */}
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
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Text style={styles.infoLabel}>Source</Text>
              <Text style={styles.infoValue}>{SOURCE_LEAD_LABELS[lead.source]}</Text>
            </View>
          </View>
        </View>

        {/* ── Besoin ── */}
        {lead.descriptionBesoin ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Besoin identifie</Text>
            <View style={styles.card}>
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <Text style={[styles.infoValue, { textAlign: 'left', marginLeft: 0 }]}>
                  {lead.descriptionBesoin}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* ── Activités ── */}
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
            <TouchableOpacity
              style={[styles.convertBtn, isConverting && { opacity: 0.6 }]}
              onPress={() => setConvSheetVisible(true)}
              disabled={isConverting}
            >
              {isConverting ? (
                <ActivityIndicator size="small" color={theme.colors.white} />
              ) : (
                <>
                  <Ionicons name="trending-up-outline" size={20} color={theme.colors.white} />
                  <Text style={styles.convertBtnText}>Convertir en opportunite</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* ── Converti — info ── */}
        {lead.statut === 'CONVERTI' && (
          <View style={[styles.section, { marginTop: theme.spacing[4] }]}>
            <View style={[styles.card, { padding: theme.spacing[4] }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: theme.spacing[2] }}>
                <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                <Text style={{ fontSize: theme.typography.size.sm, fontWeight: '600', color: '#16A34A' }}>
                  Lead converti en opportunite
                </Text>
              </View>
            </View>
          </View>
        )}

      </ScrollView>

      {/* ── Modal 3 choix conversion ── */}
      <Modal
        visible={convSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setConvSheetVisible(false)}
      >
        <TouchableOpacity
          style={convStyles.overlay}
          activeOpacity={1}
          onPress={() => setConvSheetVisible(false)}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={convStyles.sheet}>
              <View style={convStyles.handle} />
              <View style={convStyles.iconWrapper}>
                <Ionicons name="trending-up-outline" size={28} color="#16A34A" />
              </View>
              <Text style={convStyles.title}>Convertir ce lead</Text>
              <Text style={convStyles.subtitle}>
                Choisissez comment associer ce lead a un client CRM pour creer l opportunite
              </Text>

              {/* Choix 1 — Nouveau client automatique */}
              <TouchableOpacity
                style={[convStyles.choiceBtn, convStyles.choiceBtnPrimary]}
                onPress={handleConvertirNouveauClient}
                activeOpacity={0.8}
              >
                <View style={[convStyles.choiceIconWrapper, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="person-add-outline" size={20} color="#16A34A" />
                </View>
                <View style={convStyles.choiceContent}>
                  <Text style={[convStyles.choiceTitle, convStyles.choiceTitlePrimary]}>
                    Creer un nouveau client
                  </Text>
                  <Text style={convStyles.choiceSub}>
                    Cree automatiquement depuis les infos du lead
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
              </TouchableOpacity>

              {/* Choix 2 — Client existant */}
              <TouchableOpacity
                style={convStyles.choiceBtn}
                onPress={() => {
                  setConvSheetVisible(false);
                  setTimeout(() => setClientPickerVisible(true), 300);
                }}
                activeOpacity={0.8}
              >
                <View style={[convStyles.choiceIconWrapper, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="people-outline" size={20} color="#2563EB" />
                </View>
                <View style={convStyles.choiceContent}>
                  <Text style={convStyles.choiceTitle}>Lier a un client existant</Text>
                  <Text style={convStyles.choiceSub}>
                    Choisir parmi les clients deja enregistres
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.textTertiary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={convStyles.cancelBtn}
                onPress={() => setConvSheetVisible(false)}
              >
                <Text style={convStyles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ── Picker client existant ── */}
      <ClientPickerModal
        visible={clientPickerVisible}
        titre="Lier a un client existant"
        onSelect={handleConvertirClientExistant}
        onClose={() => setClientPickerVisible(false)}
      />
    </SafeAreaView>
  );
};