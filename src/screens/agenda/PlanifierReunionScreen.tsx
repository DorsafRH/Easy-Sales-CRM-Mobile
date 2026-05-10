/**
 * @file PlanifierReunionScreen.tsx
 * @description Formulaire premium de planification de réunion.
 *              Participants multiples, réunion en ligne (Jitsi auto),
 *              rappels multi-sélection, invitation email.
 *              Modal fermé par tap sur l'overlay — pas de bouton X.
 * @author Riahi Dorsaf
 */

import React, { useState, useEffect, useCallback, useId } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  Modal, FlatList, Alert, ActivityIndicator, Switch,
} from 'react-native';
import { SafeAreaView }                        from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp }  from '@react-navigation/native';
import { NativeStackNavigationProp }           from '@react-navigation/native-stack';
import { Ionicons }                            from '@expo/vector-icons';
import DateTimePicker                          from '@react-native-community/datetimepicker';

import { useStyles, useTheme } from '../../theme';
import { makeStyles }          from './PlanifierReunionScreen.styles';
import { PlusStackParamList }  from '../../navigation/PlusStack';

import * as ReunionApi from '../../api/reunion.api';
import * as ClientApi  from '../../api/client.api';
import {
  ReunionRequest, ReunionResponse, ReunionParticipant, TypeParticipant,
  DUREES, RAPPELS, TYPE_PARTICIPANT_CONFIG,
} from '../../types/reunion.types';
import { ClientResponse }        from '../../types/client.types';
import { NotificationService }   from '../../services/NotificationService';
import { CalendarService, NativeCalendarEvent } from '../../services/CalendarService';
import { parseLocalDateTime, toLocalDateString, toLocalDateTimeString } from '../../utils/dateUtils';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<PlusStackParamList, 'PlanifierReunion'>;
type Route = RouteProp<PlusStackParamList, 'PlanifierReunion'>;

interface ParticipantLocal extends ReunionParticipant {
  _key: string;
}

const makeKey = () => Math.random().toString(36).slice(2);

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Formulaire de planification / modification d'une réunion.
 * @author Riahi Dorsaf
 */
export const PlanifierReunionScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();

  const { reunionId, clientId: clientIdParam, clientNom: clientNomParam } = route.params ?? {};
  const isEdition = !!reunionId;

  // ── Formulaire ────────────────────────────────────────────
  const [titre,          setTitre]          = useState('');
  const [date,           setDate]           = useState(new Date());
  const [dureeMinutes,   setDureeMinutes]   = useState(60);
  const [clientId,       setClientId]       = useState<number | null>(clientIdParam ?? null);
  const [clientNom,      setClientNom]      = useState(clientNomParam ?? '');
  const [lieu,           setLieu]           = useState('');
  const [notes,          setNotes]          = useState('');
  const [enLigne,        setEnLigne]        = useState(false);
  const [lienReunion,    setLienReunion]    = useState('');
  const [rappels,        setRappels]        = useState<number[]>([30]);
  const [participants,   setParticipants]   = useState<ParticipantLocal[]>([]);
  const [envoyerInvit,   setEnvoyerInvit]   = useState(false);

  // ── UI ────────────────────────────────────────────────────
  const [showDate,       setShowDate]       = useState(false);
  const [showHeure,      setShowHeure]      = useState(false);
  const [showDureeModal, setShowDureeModal] = useState(false);
  const [showClientModal,setShowClientModal]= useState(false);
  const [isSaving,       setIsSaving]       = useState(false);
  const [isLoading,      setIsLoading]      = useState(false);
  const [clients,        setClients]        = useState<ClientResponse[]>([]);
  const [recherche,      setRecherche]      = useState('');
  const [isSearching,    setIsSearching]    = useState(false);
  const [nativeEvents,   setNativeEvents]   = useState<NativeCalendarEvent[]>([]);
  const [crmEvents,      setCrmEvents]      = useState<ReunionResponse[]>([]);
  const [isLoadingEvents,setIsLoadingEvents]= useState(false);
  const [hasConflict,    setHasConflict]    = useState(false);

  // ── Recherche clients ─────────────────────────────────────
  const rechercherClients = useCallback(async (kw: string) => {
    setIsSearching(true);
    try {
      const res = await ClientApi.listerClients(undefined, kw, 0, 20);
      if (res.success) setClients(res.data.content);
    } catch { /* silencieux */ }
    finally { setIsSearching(false); }
  }, []);

  useEffect(() => {
    if (showClientModal) rechercherClients(recherche);
  }, [recherche, showClientModal]);

  const fermerModalClient = () => { setShowClientModal(false); setRecherche(''); };

  const checkConflicts = useCallback(() => {
    const meetingStart = date.getTime();
    const meetingEnd = meetingStart + dureeMinutes * 60 * 1000;

    const overlaps = (start: Date, end: Date) => start.getTime() < meetingEnd && end.getTime() > meetingStart;

    const nativeConflict = nativeEvents.some(e => overlaps(e.start, e.end));
    const crmConflict = crmEvents.some(r => {
      if (r.id === reunionId) return false;
      const start = parseLocalDateTime(r.dateHeure);
      const end = new Date(start.getTime() + r.dureeMinutes * 60 * 1000);
      return overlaps(start, end);
    });

    setHasConflict(nativeConflict || crmConflict);
  }, [crmEvents, date, dureeMinutes, nativeEvents, reunionId]);

  const chargerPlage = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      const [native, crmRes] = await Promise.all([
        CalendarService.getEventsForDay(date),
        ReunionApi.listerSemaine(
          toLocalDateString(date),
          toLocalDateString(date),
        ).catch(() => ({ success: false, data: [] } as any)),
      ]);
      setNativeEvents(native);
      if (crmRes.success) setCrmEvents(crmRes.data ?? []);
    } catch (e) {
      console.warn('[PlanifierReunionScreen] Erreur chargement événements jour:', e);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [date]);

  useEffect(() => {
    chargerPlage();
  }, [chargerPlage]);

  useEffect(() => {
    checkConflicts();
  }, [checkConflicts]);

  // ── Édition ───────────────────────────────────────────────
  useEffect(() => {
    if (!reunionId) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await ReunionApi.obtenir(reunionId);
        if (res.success) {
          const r = res.data;
          setTitre(r.titre);
          setDate(new Date(r.dateHeure));
          setDureeMinutes(r.dureeMinutes);
          setClientId(r.clientId);
          setClientNom(r.clientNom);
          setLieu(r.lieu ?? '');
          setNotes(r.notes ?? '');
          setEnLigne(r.enLigne);
          setLienReunion(r.lienReunion ?? '');
          setRappels(r.rappelsMinutes);
          setParticipants(r.participants.map(p => ({ ...p, _key: makeKey() })));
        }
      } catch { /* silencieux */ }
      finally { setIsLoading(false); }
    };
    load();
  }, [reunionId]);

  // ── Participants ──────────────────────────────────────────
  const ajouterParticipant = () => {
    setParticipants(prev => [
      ...prev,
      { _key: makeKey(), nom: '', type: 'EXTERNE' as TypeParticipant },
    ]);
  };

  const modifierParticipant = (key: string, champ: keyof ReunionParticipant, valeur: string) => {
    setParticipants(prev =>
      prev.map(p => p._key === key ? { ...p, [champ]: valeur } : p),
    );
  };

  const setTypeParticipant = (key: string, type: TypeParticipant) => {
    setParticipants(prev => prev.map(p => p._key === key ? { ...p, type } : p));
  };

  const supprimerParticipant = (key: string) => {
    setParticipants(prev => prev.filter(p => p._key !== key));
  };

  // ── Helpers ───────────────────────────────────────────────
  const toggleRappel = (m: number) =>
    setRappels(prev => prev.includes(m) ? prev.filter(r => r !== m) : [...prev, m]);

  const fmtDate  = (d: Date) => d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const fmtHeure = (d: Date) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const fmtDuree = (m: number) => DUREES.find(d => d.minutes === m)?.label ?? `${m} min`;

  const isValid = titre.trim().length > 0 && clientId !== null;

  // ── Soumission ────────────────────────────────────────────
  const handleSauvegarder = async () => {
    if (!isValid || !clientId) return;
    setIsSaving(true);
    try {
      const request: ReunionRequest = {
        titre:             titre.trim(),
        dateHeure:         toLocalDateTimeString(date),
        dureeMinutes,
        clientId,
        lieu:              lieu.trim() || undefined,
        notes:             notes.trim() || undefined,
        enLigne,
        lienReunion:       lienReunion.trim() || undefined,
        participants:      participants
          .filter(p => p.nom.trim())
          .map(({ _key, ...p }) => p),
        rappelsMinutes:    rappels,
        envoyerInvitation: envoyerInvit,
      };

      if (isEdition && reunionId) {
        const res = await ReunionApi.modifier(reunionId, request);
        if (res.success) {
          await NotificationService.cancelAllRemindersForReunion(reunionId);
          await NotificationService.scheduleReunionReminders(
            res.data.id, res.data.titre, res.data.dateHeure, res.data.rappelsMinutes,
          );
          await CalendarService.addReunionToCalendar(res.data);
        }
        Alert.alert('✅', 'Réunion mise à jour.');
      } else {
        const res = await ReunionApi.creer(request);
        if (res.success) {
          await NotificationService.scheduleReunionReminders(
            res.data.id, res.data.titre, res.data.dateHeure, res.data.rappelsMinutes,
          );
          await CalendarService.addReunionToCalendar(res.data);
        }
        Alert.alert('✅', 'Réunion planifiée avec succès.');
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Erreur', e?.response?.data?.message ?? 'Impossible de sauvegarder.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdition ? 'Modifier la réunion' : 'Planifier une réunion'}
        </Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ══ INFORMATIONS ══ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Titre *</Text>
            <TextInput style={styles.input} placeholder="Ex : Présentation offre commerciale"
              placeholderTextColor={theme.colors.textTertiary} value={titre} onChangeText={setTitre} />
          </View>

          <View style={styles.rowDateHeure}>
            <View style={[styles.field, styles.fieldDate]}>
              <Text style={styles.label}>Date *</Text>
              <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowDate(true)}>
                <Text style={styles.pickerBtnTxt}>{fmtDate(date)}</Text>
                <Ionicons name="calendar-outline" size={16} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            </View>
            <View style={[styles.field, styles.fieldHeure]}>
              <Text style={styles.label}>Heure *</Text>
              <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowHeure(true)}>
                <Text style={styles.pickerBtnTxt}>{fmtHeure(date)}</Text>
                <Ionicons name="time-outline" size={16} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            </View>
          </View>

          {showDate && (
            <DateTimePicker value={date} mode="date" minimumDate={new Date()}
              onChange={(_, s) => { setShowDate(false); if (s) setDate(s); }} />
          )}
          {showHeure && (
            <DateTimePicker value={date} mode="time" is24Hour
              onChange={(_, s) => { setShowHeure(false); if (s) setDate(s); }} />
          )}

          <View style={styles.conflictBox}>
            <Text style={styles.sectionTitle}>Plages occupées</Text>
            {isLoadingEvents ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <>
                {nativeEvents.length === 0 && crmEvents.length === 0 ? (
                  <Text style={styles.conflictTxt}>Aucun événement natif ou réunion CRM trouvé ce jour.</Text>
                ) : (
                  <>
                    {nativeEvents.map(event => (
                      <View key={`native-${event.id}`} style={styles.slotRow}>
                        <Text style={styles.slotTitle}>{event.title}</Text>
                        <Text style={styles.slotSub}>{`${event.start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} – ${event.end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}</Text>
                      </View>
                    ))}
                    {crmEvents.filter(r => r.id !== reunionId).map(event => {
                      const start = parseLocalDateTime(event.dateHeure);
                      const end = new Date(start.getTime() + event.dureeMinutes * 60 * 1000);
                      return (
                        <View key={`crm-${event.id}`} style={styles.slotRow}>
                          <Text style={styles.slotTitle}>{event.titre}</Text>
                          <Text style={styles.slotSub}>{`${start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}</Text>
                        </View>
                      );
                    })}
                  </>
                )}
                {hasConflict && (
                  <Text style={styles.warningTxt}>
                    ⚠️ Conflit détecté : la plage sélectionnée chevauche un événement existant.
                  </Text>
                )}
              </>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Durée *</Text>
            <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowDureeModal(true)}>
              <Text style={styles.pickerBtnTxt}>{fmtDuree(dureeMinutes)}</Text>
              <Ionicons name="chevron-down" size={16} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Lieu <Text style={styles.labelOpt}>(optionnel)</Text></Text>
            <TextInput style={styles.input} placeholder="Ex : Bureau client, Siège social…"
              placeholderTextColor={theme.colors.textTertiary} value={lieu} onChangeText={setLieu} />
          </View>

          {/* Toggle en ligne */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Réunion en ligne</Text>
            <TouchableOpacity
              style={[styles.toggle, enLigne && styles.toggleActive]}
              onPress={() => setEnLigne(!enLigne)}
            >
              <View style={[styles.toggleThumb, enLigne && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>

          {enLigne && (
            <View style={styles.field}>
              <Text style={styles.label}>Lien <Text style={styles.labelOpt}>(laisser vide = Jitsi auto)</Text></Text>
              <View style={styles.lienRow}>
                <TextInput
                  style={[styles.input, styles.lienInput]}
                  placeholder="https://meet.jit.si/… ou Google Meet…"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={lienReunion}
                  onChangeText={setLienReunion}
                  autoCapitalize="none"
                />
                {!lienReunion && (
                  <TouchableOpacity style={styles.btnGenerer}>
                    <Text style={styles.btnGenererTxt}>Auto</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>

        {/* ══ CLIENT ══ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client principal</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Client *</Text>
            <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowClientModal(true)}>
              <Text style={[styles.pickerBtnTxt, !clientNom && styles.pickerBtnPlaceholder]}>
                {clientNom || 'Rechercher un client…'}
              </Text>
              <Ionicons name="search-outline" size={16} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ══ PARTICIPANTS ══ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Participants ({participants.length})
          </Text>

          {participants.map((p, idx) => (
            <View key={p._key} style={styles.participantCard}>
              <View style={styles.participantCardHeader}>
                <Text style={styles.participantCardTitle}>Participant {idx + 1}</Text>
                <TouchableOpacity
                  style={styles.participantDeleteBtn}
                  onPress={() => supprimerParticipant(p._key)}
                >
                  <Ionicons name="trash-outline" size={14} color="#DC2626" />
                </TouchableOpacity>
              </View>

              <View style={styles.participantRow}>
                <TextInput
                  style={[styles.input, styles.participantField]}
                  placeholder="Prénom"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={p.prenom ?? ''}
                  onChangeText={v => modifierParticipant(p._key, 'prenom', v)}
                />
                <TextInput
                  style={[styles.input, styles.participantField]}
                  placeholder="Nom *"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={p.nom}
                  onChangeText={v => modifierParticipant(p._key, 'nom', v)}
                />
              </View>

              <TextInput
                style={[styles.input, { marginTop: theme.spacing[2] }]}
                placeholder="Email"
                placeholderTextColor={theme.colors.textTertiary}
                value={p.email ?? ''}
                onChangeText={v => modifierParticipant(p._key, 'email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={[styles.input, { marginTop: theme.spacing[2] }]}
                placeholder="Téléphone (ex: +21621000000)"
                placeholderTextColor={theme.colors.textTertiary}
                value={p.telephone ?? ''}
                onChangeText={v => modifierParticipant(p._key, 'telephone', v)}
                keyboardType="phone-pad"
              />

              {/* Type participant */}
              <View style={styles.typeBadgeRow}>
                {(['CLIENT', 'CONTACT', 'EXTERNE'] as TypeParticipant[]).map(type => {
                  const actif = p.type === type;
                  const conf  = TYPE_PARTICIPANT_CONFIG[type];
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.typeBadge, actif && styles.typeBadgeActif,
                              actif && { borderColor: conf.color, backgroundColor: conf.bg }]}
                      onPress={() => setTypeParticipant(p._key, type)}
                    >
                      <Text style={[styles.typeBadgeTxt, actif && { color: conf.color }]}>
                        {conf.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addParticipantBtn} onPress={ajouterParticipant}>
            <Ionicons name="person-add-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.addParticipantTxt}>Ajouter un participant</Text>
          </TouchableOpacity>
        </View>

        {/* ══ RAPPELS ══ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Rappels — {rappels.length} sélectionné{rappels.length !== 1 ? 's' : ''}
          </Text>
          <View style={styles.rappelsGrid}>
            {RAPPELS.map(r => {
              const actif = rappels.includes(r.minutes);
              return (
                <TouchableOpacity
                  key={r.minutes}
                  style={[styles.rappelChip, actif && styles.rappelChipActif]}
                  onPress={() => toggleRappel(r.minutes)}
                >
                  <Text style={[styles.rappelChipTxt, actif && styles.rappelChipTxtActif]}>
                    {actif ? '✓ ' : ''}{r.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ══ INVITATION EMAIL ══ */}
        {participants.some(p => p.email) && (
          <View style={styles.section}>
            <View style={styles.invitationRow}>
              <View>
                <Text style={styles.label}>Envoyer une invitation</Text>
                <Text style={styles.invitationInfo}>
                  Email avec fichier .ics aux participants ayant un email
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.toggle, envoyerInvit && styles.toggleActive]}
                onPress={() => setEnvoyerInvit(!envoyerInvit)}
              >
                <View style={[styles.toggleThumb, envoyerInvit && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ══ NOTES ══ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Notes sur la réunion…"
            placeholderTextColor={theme.colors.textTertiary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* ══ BOUTON ══ */}
        <TouchableOpacity
          style={[styles.btnSauvegarder, (!isValid || isSaving) && styles.btnSauvegarderDisabled]}
          onPress={handleSauvegarder}
          disabled={!isValid || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <Text style={styles.btnSauvegarderTxt}>
              {isEdition ? 'Mettre à jour' : 'Planifier la réunion'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* ════ MODALS ════ */}

      {/* Durée */}
      <Modal visible={showDureeModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1}
          onPress={() => setShowDureeModal(false)}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Durée de la réunion</Text>
              <FlatList data={DUREES} keyExtractor={i => String(i.minutes)}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem}
                    onPress={() => { setDureeMinutes(item.minutes); setShowDureeModal(false); }}>
                    <Text style={[styles.modalItemTxt, item.minutes === dureeMinutes && styles.modalItemActif]}>
                      {item.minutes === dureeMinutes ? '✓ ' : ''}{item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Client — tap overlay = fermeture */}
      <Modal visible={showClientModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1}
          onPress={fermerModalClient}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Sélectionner un client</Text>
              <TextInput
                style={styles.inputRecherche}
                placeholder="Rechercher par nom, email…"
                placeholderTextColor={theme.colors.textTertiary}
                value={recherche}
                onChangeText={setRecherche}
                autoFocus
              />
              {isSearching ? (
                <View style={styles.modalSearching}>
                  <ActivityIndicator color={theme.colors.primary} />
                </View>
              ) : (
                <FlatList data={clients} keyExtractor={i => String(i.id)}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.modalItem}
                      onPress={() => {
                        setClientId(item.id);
                        setClientNom(item.nomAffichage);
                        fermerModalClient();
                      }}>
                      <Text style={[styles.modalItemTxt, item.id === clientId && styles.modalItemActif]}>
                        {item.id === clientId ? '✓ ' : ''}{item.nomAffichage}
                      </Text>
                      {item.email && <Text style={styles.modalItemSub}>{item.email}</Text>}
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text style={[styles.modalItemTxt, { textAlign: 'center', padding: 16 }]}>
                      Aucun client trouvé
                    </Text>
                  }
                />
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};