/**
 * @file ReunionDetailScreen.tsx
 * @description Fiche détail réunion — FIXES :
 *   ✅ changerStatut() → terminer() / annuler() (fonctions réelles de reunion.api.ts)
 *   ✅ p.type === 'INTERNE' → p.type !== 'EXTERNE' (TypeParticipant = CLIENT|CONTACT|EXTERNE)
 *   ✅ Fix URL Google Meet : normaliserURL() ajoute https:// si absent
 *   ✅ Section Client principal avec fetch ClientApi
 *   ✅ Boutons individuels par participant (pas de boutons globaux redondants)
 * @author Riahi Dorsaf
 */

import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Alert, Linking, ActivityIndicator,
} from 'react-native';
import { SafeAreaView }              from 'react-native-safe-area-context';
import { useNavigation, useRoute,
         RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons }                  from '@expo/vector-icons';

import { useStyles, useTheme } from '../../theme';
import { makeStyles }          from './ReunionDetailScreen.styles';
import { Avatar }              from '../../components/ui/Avatar';
import { PlusStackParamList }  from '../../navigation/PlusStack';

import * as ReunionApi    from '../../api/reunion.api';
import * as ClientApi     from '../../api/client.api';
import {
  ReunionResponse,
  STATUT_REUNION_CONFIG,
  TYPE_PARTICIPANT_CONFIG,
} from '../../types/reunion.types';
import { ClientResponse } from '../../types/client.types';
import { CalendarService } from '../../services/CalendarService';
import { NotificationService } from '../../services/NotificationService';
import { parseLocalDateTime } from '../../utils/dateUtils';

// ─── HELPERS ─────────────────────────────────────────────────
/** FIX Google Meet : ajoute https:// si absent */
const normaliserURL = (url: string): string =>
  url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;

const fmtDateLong = (iso: string): string =>
  parseLocalDateTime(iso).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

const fmtHeure = (iso: string): string =>
  parseLocalDateTime(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const fmtDuree = (m: number): string => {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), r = m % 60;
  return r > 0 ? `${h}h${String(r).padStart(2, '0')}` : `${h}h`;
};

// ─── TYPES ────────────────────────────────────────────────────
type NavProp    = NativeStackNavigationProp<PlusStackParamList, 'ReunionDetail'>;
type RoutePropT = RouteProp<PlusStackParamList, 'ReunionDetail'>;

// ─── COMPOSANT ───────────────────────────────────────────────
export const ReunionDetailScreen: React.FC = () => {
  const styles = useStyles(makeStyles);
  const theme  = useTheme();
  const nav    = useNavigation<NavProp>();
  const { params } = useRoute<RoutePropT>();

  const [reunion,       setReunion]       = useState<ReunionResponse | null>(null);
  const [client,        setClient]        = useState<ClientResponse | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Chargement ────────────────────────────────────────────────
  const charger = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ReunionApi.obtenir(params.reunionId);
      if (res.success && res.data) {
        setReunion(res.data);
        const cRes = await ClientApi.obtenirClient(res.data.clientId);
        if (cRes.success) setClient(cRes.data);
      }
    } catch { /* silencieux */ }
    finally { setLoading(false); }
  }, [params.reunionId]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  useLayoutEffect(() => {
    if (!reunion || reunion.statut !== 'PLANIFIEE') return;
    nav.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 16 }}
          onPress={() => nav.navigate('PlanifierReunion', {
            reunionId: reunion.id,
            clientId:  reunion.clientId,
            clientNom: reunion.clientNom,
          })}
        >
          <Ionicons name="pencil-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      ),
    });
  }, [reunion, nav]);

  // ── Actions contact ─────────────────────────────────────────
  const ouvrirLien = () => {
    if (!reunion?.lienReunion) return;
    Linking.openURL(normaliserURL(reunion.lienReunion))
      .catch(() => Alert.alert('Erreur', 'Impossible d\'ouvrir ce lien. Vérifiez l\'URL.'));
  };

  const appeler  = (tel: string) => Linking.openURL(`tel:${tel.replace(/\s/g, '')}`);

  const whatsapp = (nom: string, tel: string) => {
    const phone = tel.replace(/\D/g, '');
    const msg   = `Bonjour ${nom},\n\nConcernant notre réunion "${reunion?.titre}" — ${fmtHeure(reunion?.dateHeure ?? '')}.\n\nCordialement.`;
    Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
  };

  const email = (nom: string, mail: string) => {
    const s = encodeURIComponent(`Réunion : ${reunion?.titre}`);
    const b = encodeURIComponent(`Bonjour ${nom},\n\nConcernant notre réunion "${reunion?.titre}" — ${fmtDateLong(reunion?.dateHeure ?? '')} à ${fmtHeure(reunion?.dateHeure ?? '')}.\n\nCordialement.`);
    Linking.openURL(`mailto:${mail}?subject=${s}&body=${b}`);
  };

  // ── Changement statut — FIX : terminer() / annuler() ──────────
  /**
   * FIX : changerStatut() n'existe pas dans reunion.api.ts.
   * On appelle directement terminer() ou annuler() selon le statut souhaité.
   */
  const changerStatut = async (cible: 'TERMINEE' | 'ANNULEE') => {
    Alert.alert(
      cible === 'TERMINEE' ? 'Terminer la réunion' : 'Annuler la réunion',
      cible === 'TERMINEE'
        ? `Marquer "${reunion?.titre}" comme terminée ?`
        : `Annuler définitivement "${reunion?.titre}" ?`,
      [
        { text: 'Retour', style: 'cancel' },
        {
          text:  cible === 'TERMINEE' ? 'Confirmer' : 'Annuler la réunion',
          style: cible === 'TERMINEE' ? 'default' : 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              if (cible === 'TERMINEE') {
                await ReunionApi.terminer(reunion!.id);  // FIX : était changerStatut()
              } else {
                await ReunionApi.annuler(reunion!.id);   // FIX : était changerStatut()
              }
              await charger();
            } catch {
              Alert.alert('Erreur', 'Impossible de modifier le statut.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  };

  const confirmerSupprimer = () => {
    Alert.alert('Supprimer', `Supprimer définitivement "${reunion?.titre}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        setActionLoading(true);
        try {
          await ReunionApi.supprimer(reunion!.id);
          await NotificationService.cancelAllRemindersForReunion(reunion!.id);
          await CalendarService.removeReunionFromCalendar(reunion!.id);
          nav.goBack();
        } catch {
          Alert.alert('Erreur', 'Impossible de supprimer.');
          setActionLoading(false);
        }
      }},
    ]);
  };

  // ── Loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.loadingCenter}><ActivityIndicator size="large" color={theme.colors.primary} /></View>
      </SafeAreaView>
    );
  }
  if (!reunion) return null;

  const isPlanif = reunion.statut === 'PLANIFIEE';
  const isTerm   = reunion.statut === 'TERMINEE';
  const cfg      = STATUT_REUNION_CONFIG[reunion.statut];

  // ─────────────────────────────────────────────────────────────
  // RENDU
  // ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={[styles.statusPill, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.statusPillTxt, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
          <Text style={styles.heroTitre} numberOfLines={2}>{reunion.titre}</Text>
          <View style={styles.heroRow}><Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.8)" /><Text style={styles.heroMeta}>{fmtDateLong(reunion.dateHeure)}</Text></View>
          <View style={styles.heroRow}><Ionicons name="time-outline"     size={13} color="rgba(255,255,255,0.8)" /><Text style={styles.heroMeta}>{fmtHeure(reunion.dateHeure)} · {fmtDuree(reunion.dureeMinutes)}</Text></View>
          {reunion.lieu ? <View style={styles.heroRow}><Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.8)" /><Text style={styles.heroMeta}>{reunion.lieu}</Text></View> : null}
        </View>

        <View style={styles.content}>

          {/* ── Lien ── */}
          {reunion.lienReunion ? (
            <View style={styles.card}>
              <Text style={styles.cardTitre}>LIEN DE RÉUNION</Text>
              <TouchableOpacity style={styles.joinBtn} onPress={ouvrirLien} activeOpacity={0.8}>
                <Ionicons name="videocam-outline" size={18} color={theme.colors.primary} />
                <Text style={styles.joinBtnTxt}>Rejoindre la réunion</Text>
              </TouchableOpacity>
              <Text style={styles.joinUrl} numberOfLines={1}>{reunion.lienReunion}</Text>
            </View>
          ) : null}

          {/* ── Client principal ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitre}>CLIENT PRINCIPAL</Text>
            <View style={styles.contactRow}>
              <Avatar nom={reunion.clientNom} size="md" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactNom}>{reunion.clientNom}</Text>
                {client?.telephone ? <Text style={styles.contactSub}>{client.telephone}</Text> : null}
                {client?.email     ? <Text style={styles.contactSub}>{client.email}</Text>     : null}
              </View>
              <View style={styles.contactBtns}>
                {client?.telephone ? (
                  <>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => appeler(client.telephone!)}>
                      <Ionicons name="call-outline" size={18} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconBtn, styles.iconBtnWA]} onPress={() => whatsapp(reunion.clientNom, client.telephone!)}>
                      <Ionicons name="logo-whatsapp" size={18} color="#16A34A" />
                    </TouchableOpacity>
                  </>
                ) : null}
                {client?.email ? (
                  <TouchableOpacity style={styles.iconBtn} onPress={() => email(reunion.clientNom, client.email!)}>
                    <Ionicons name="mail-outline" size={18} color={theme.colors.primary} />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>

          {/* ── Participants ── */}
          {reunion.participants?.length > 0 ? (
            <View style={styles.card}>
              <Text style={styles.cardTitre}>PARTICIPANTS ({reunion.participants.length})</Text>
              {reunion.participants.map((p, i) => {
                // FIX : TypeParticipant = 'CLIENT' | 'CONTACT' | 'EXTERNE'
                // (pas 'INTERNE') → on distingue interne vs externe par p.type !== 'EXTERNE'
                const estInterne = p.type !== 'EXTERNE';
                const ptCfg      = TYPE_PARTICIPANT_CONFIG[p.type];
                return (
                  <View key={i} style={[styles.participantRow, i > 0 && styles.participantSep]}>
                    <Avatar nom={`${p.prenom ?? ''} ${p.nom}`.trim()} size="sm" />
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactNom}>{p.prenom} {p.nom}</Text>
                      {p.email     ? <Text style={styles.contactSub}>{p.email}</Text>     : null}
                      {p.telephone ? <Text style={styles.contactSub}>{p.telephone}</Text> : null}
                      {/* FIX : p.type !== 'EXTERNE' au lieu de p.type === 'INTERNE' */}
                      <View style={[styles.typePill, estInterne && styles.typePillInterne]}>
                        <Text style={[styles.typePillTxt, estInterne && { color: theme.colors.primary }]}>
                          {ptCfg?.label ?? p.type}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.contactBtns}>
                      {p.telephone ? (
                        <>
                          <TouchableOpacity style={styles.iconBtnSm} onPress={() => appeler(p.telephone!)}>
                            <Ionicons name="call-outline" size={15} color={theme.colors.primary} />
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.iconBtnSm, styles.iconBtnWA]} onPress={() => whatsapp(`${p.prenom ?? p.nom}`, p.telephone!)}>
                            <Ionicons name="logo-whatsapp" size={15} color="#16A34A" />
                          </TouchableOpacity>
                        </>
                      ) : null}
                      {p.email ? (
                        <TouchableOpacity style={styles.iconBtnSm} onPress={() => email(`${p.prenom ?? p.nom}`, p.email!)}>
                          <Ionicons name="mail-outline" size={15} color={theme.colors.primary} />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}

          {/* ── Notes ── */}
          {reunion.notes ? (
            <View style={styles.card}>
              <Text style={styles.cardTitre}>NOTES</Text>
              <Text style={styles.notesTxt}>{reunion.notes}</Text>
            </View>
          ) : null}

          {/* ── Actions ── */}
          <View style={styles.actionsSection}>
            {isPlanif ? (
              <>
                <TouchableOpacity
                  style={styles.btnPrimary}
                  onPress={() => nav.navigate('PlanifierReunion', { reunionId: reunion.id, clientId: reunion.clientId, clientNom: reunion.clientNom })}
                  disabled={actionLoading}
                  activeOpacity={0.8}
                >
                  <Ionicons name="pencil-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.btnPrimaryTxt}>Modifier la réunion</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnSuccess} onPress={() => changerStatut('TERMINEE')} disabled={actionLoading} activeOpacity={0.8}>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#16A34A" />
                  <Text style={styles.btnSuccessTxt}>Marquer comme terminée</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnDanger} onPress={confirmerSupprimer} disabled={actionLoading} activeOpacity={0.8}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  <Text style={styles.btnDangerTxt}>Supprimer</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnGhost} onPress={() => changerStatut('ANNULEE')} disabled={actionLoading}>
                  <Text style={styles.btnGhostTxt}>Annuler la réunion</Text>
                </TouchableOpacity>
              </>
            ) : null}

            {isTerm ? (
              <TouchableOpacity style={styles.btnDanger} onPress={confirmerSupprimer} disabled={actionLoading} activeOpacity={0.8}>
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                <Text style={styles.btnDangerTxt}>Supprimer</Text>
              </TouchableOpacity>
            ) : null}

            {actionLoading && <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginTop: 8 }} />}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};