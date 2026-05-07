/**
 * @file ReunionDetailScreen.tsx
 * @description Fiche détail d'une réunion — toutes les informations,
 *              liste des participants avec actions directes,
 *              lien de réunion en ligne, notes, actions de gestion.
 * @author Riahi Dorsaf
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Alert, ActivityIndicator, Linking,
} from 'react-native';
import { LinearGradient }          from 'expo-linear-gradient';
import { SafeAreaView }            from 'react-native-safe-area-context';
import { useNavigation, useRoute,
         RouteProp }               from '@react-navigation/native';
import { NativeStackNavigationProp }from '@react-navigation/native-stack';
import { Ionicons }                from '@expo/vector-icons';

import { useStyles, useTheme }    from '../../theme';
import { makeStyles }             from './ReunionDetailScreen.styles';
import { PlusStackParamList }     from '../../navigation/PlusStack';

import * as ReunionApi from '../../api/reunion.api';
import {
  ReunionResponse, ReunionParticipant,
  STATUT_REUNION_CONFIG, TYPE_PARTICIPANT_CONFIG,
} from '../../types/reunion.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<PlusStackParamList, 'ReunionDetail'>;
type Route = RouteProp<PlusStackParamList, 'ReunionDetail'>;

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const fmtDateHeure = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }) + ' à ' + new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const fmtDuree = (m: number) => {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), r = m % 60;
  return r > 0 ? `${h}h${String(r).padStart(2, '0')}` : `${h}h`;
};

const initiales = (nom: string, prenom?: string) => {
  const n = prenom ? `${prenom[0]}${nom[0]}` : nom.slice(0, 2);
  return n.toUpperCase();
};

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Fiche détail d'une réunion.
 * @author Riahi Dorsaf
 */
export const ReunionDetailScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { reunionId } = route.params;

  const [reunion,   setReunion]   = useState<ReunionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const charger = useCallback(async () => {
    try {
      const res = await ReunionApi.obtenir(reunionId);
      if (res.success) setReunion(res.data);
    } catch { /* silencieux */ }
    finally { setIsLoading(false); }
  }, [reunionId]);

  useEffect(() => { charger(); }, [charger]);

  // ── Actions ───────────────────────────────────────────────
  const ouvrirLien = () => {
    if (reunion?.lienReunion) Linking.openURL(reunion.lienReunion);
  };

  const envoyerWhatsAppParticipant = (p: ReunionParticipant) => {
    if (!p.telephone || !reunion) return;
    const date  = fmtDateHeure(reunion.dateHeure);
    const lien  = reunion.lienReunion ? `\n🔗 ${reunion.lienReunion}` : '';
    const msg   = `Bonjour ${p.prenom ?? p.nom},\n\nRéunion "${reunion.titre}"\n📅 ${date}${lien}\n\nCordialement.`;
    const phone = p.telephone.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
  };

  const envoyerEmailParticipant = (p: ReunionParticipant) => {
    if (!p.email || !reunion) return;
    const sujet = encodeURIComponent(`Réunion : ${reunion.titre}`);
    const corps = encodeURIComponent(
      `Bonjour ${p.prenom ?? p.nom},\n\nRéunion "${reunion.titre}"\n📅 ${fmtDateHeure(reunion.dateHeure)}`
      + (reunion.lienReunion ? `\n🔗 ${reunion.lienReunion}` : '')
      + '\n\nCordialement.',
    );
    Linking.openURL(`mailto:${p.email}?subject=${sujet}&body=${corps}`);
  };

  const handleTerminer = () => {
    Alert.alert('Terminer', `Marquer "${reunion?.titre}" comme terminée ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Terminer', onPress: async () => {
        await ReunionApi.terminer(reunionId); charger();
      }},
    ]);
  };

  const handleAnnuler = () => {
    Alert.alert('Annuler la réunion', `Annuler "${reunion?.titre}" ?`, [
      { text: 'Non', style: 'cancel' },
      { text: 'Annuler', style: 'destructive', onPress: async () => {
        await ReunionApi.annuler(reunionId); charger();
      }},
    ]);
  };

  const handleSupprimer = () => {
    Alert.alert('Supprimer', 'Cette action est irréversible.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        await ReunionApi.supprimer(reunionId); navigation.goBack();
      }},
    ]);
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

  if (!reunion) return null;

  const config    = STATUT_REUNION_CONFIG[reunion.statut];
  const planifiee = reunion.statut === 'PLANIFIEE';

  // Couleurs du gradient selon le statut
  const gradientColors: readonly [string, string, string] =
    planifiee
      ? ['#1E3A8A', '#2563EB', '#3B82F6']
      : reunion.statut === 'TERMINEE'
      ? ['#14532D', '#16A34A', '#22C55E']
      : ['#7F1D1D', '#DC2626', '#EF4444'];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: theme.spacing[12] }}
        showsVerticalScrollIndicator={false}>

        {/* ── Header gradient ── */}
        <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.headerGradient}>

          <View style={styles.headerTopRow}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={theme.colors.white} />
            </TouchableOpacity>

            <View style={styles.statutBadge}>
              <Text style={styles.statutBadgeTxt}>{config.label}</Text>
            </View>

            {planifiee && (
              <TouchableOpacity style={styles.headerBtn}
                onPress={() => navigation.navigate('PlanifierReunion', { reunionId })}>
                <Ionicons name="create-outline" size={20} color={theme.colors.white} />
              </TouchableOpacity>
            )}
            {!planifiee && <View style={{ width: 40 }} />}
          </View>

          <Text style={styles.headerTitre}>{reunion.titre}</Text>
          <Text style={styles.headerMeta}>📅 {fmtDateHeure(reunion.dateHeure)}</Text>
          <Text style={styles.headerMeta}>⏱ {fmtDuree(reunion.dureeMinutes)}</Text>
          {reunion.lieu ? <Text style={styles.headerMeta}>📍 {reunion.lieu}</Text> : null}
          <Text style={styles.headerMeta}>👤 {reunion.clientNom}</Text>
        </LinearGradient>

        <View style={styles.content}>

          {/* ── Lien réunion ── */}
          {reunion.lienReunion && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Lien de réunion</Text>
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnLien]}
                onPress={ouvrirLien}
              >
                <Ionicons name="videocam-outline" size={18} color={theme.colors.primary} />
                <Text style={[styles.actionBtnTxt, { color: theme.colors.primary }]}>
                  Rejoindre la réunion
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Participants ── */}
          {reunion.participants.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Participants ({reunion.participants.length})
              </Text>
              {reunion.participants.map((p, i) => {
                const typeConf = TYPE_PARTICIPANT_CONFIG[p.type];
                return (
                  <View key={i} style={styles.participantItem}>
                    <View style={styles.participantAvatar}>
                      <Text style={styles.participantAvatarTxt}>
                        {initiales(p.nom, p.prenom)}
                      </Text>
                    </View>
                    <View style={styles.participantInfo}>
                      <Text style={styles.participantNom}>
                        {p.prenom ? `${p.prenom} ${p.nom}` : p.nom}
                      </Text>
                      {p.email && <Text style={styles.participantContact}>{p.email}</Text>}
                      {p.telephone && <Text style={styles.participantContact}>{p.telephone}</Text>}
                      <View style={[styles.typeBadge, { backgroundColor: typeConf.bg, marginTop: 3 }]}>
                        <Text style={[styles.typeBadgeTxt, { color: typeConf.color }]}>
                          {typeConf.label}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.participantActions}>
                      {p.telephone && (
                        <TouchableOpacity
                          style={[styles.participantActionBtn, { borderColor: '#25D366', backgroundColor: '#F0FFF4' }]}
                          onPress={() => envoyerWhatsAppParticipant(p)}
                        >
                          <Ionicons name="logo-whatsapp" size={16} color="#16A34A" />
                        </TouchableOpacity>
                      )}
                      {p.email && (
                        <TouchableOpacity
                          style={[styles.participantActionBtn, { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryLight }]}
                          onPress={() => envoyerEmailParticipant(p)}
                        >
                          <Ionicons name="mail-outline" size={16} color={theme.colors.primary} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* ── Notes ── */}
          {reunion.notes && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Notes</Text>
              <Text style={styles.notesTxt}>{reunion.notes}</Text>
            </View>
          )}

          {/* ── Actions ── */}
          <View style={styles.actionsSection}>
            {planifiee && (
              <>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={[styles.actionBtn, styles.actionBtnWhatsApp]}
                    onPress={() => {
                      const p = reunion.participants.find(x => x.telephone);
                      if (p) envoyerWhatsAppParticipant(p);
                    }}>
                    <Ionicons name="logo-whatsapp" size={16} color="#16A34A" />
                    <Text style={[styles.actionBtnTxt, { color: '#16A34A' }]}>WhatsApp</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, styles.actionBtnEmail]}
                    onPress={() => {
                      const emails = reunion.participants.filter(p => p.email).map(p => p.email).join(',');
                      if (emails) Linking.openURL(`mailto:${emails}?subject=${encodeURIComponent('Réunion : ' + reunion.titre)}`);
                    }}>
                    <Ionicons name="mail-outline" size={16} color={theme.colors.primary} />
                    <Text style={[styles.actionBtnTxt, { color: theme.colors.primary }]}>Email</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.btnModifier}
                  onPress={() => navigation.navigate('PlanifierReunion', { reunionId })}>
                  <Ionicons name="create-outline" size={18} color={theme.colors.white} />
                  <Text style={styles.btnModifierTxt}>Modifier la réunion</Text>
                </TouchableOpacity>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionBtn} onPress={handleTerminer}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.actionBtnTxt}>Terminée</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={handleAnnuler}>
                    <Ionicons name="close-circle-outline" size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.actionBtnTxt}>Annuler</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <TouchableOpacity style={styles.btnDanger} onPress={handleSupprimer}>
              <Text style={styles.btnDangerTxt}>Supprimer cette réunion</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};