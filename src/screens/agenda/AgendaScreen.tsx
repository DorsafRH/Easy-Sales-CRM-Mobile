/**
 * @file AgendaScreen.tsx
 * @description Écran Agenda premium — réunions de la semaine.
 *              Week strip coloré, cards avec accent couleur, actions rapides.
 * @author Riahi Dorsaf
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  RefreshControl, ActivityIndicator, Alert, Linking,
} from 'react-native';
import { LinearGradient }                  from 'expo-linear-gradient';
import { SafeAreaView }                    from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect,
         CommonActions }                   from '@react-navigation/native';
import { NativeStackNavigationProp }       from '@react-navigation/native-stack';
import { Ionicons }                        from '@expo/vector-icons';

import { useStyles, useTheme } from '../../theme';
import { makeStyles }          from './AgendaScreen.styles';
import { EmptyState }          from '../../components/ui/EmptyState';
import { PlusStackParamList }  from '../../navigation/PlusStack';

import * as ReunionApi from '../../api/reunion.api';
import {
  ReunionResponse,
  STATUT_REUNION_CONFIG,
} from '../../types/reunion.types';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const lundiDe = (date: Date): Date => {
  const d = new Date(date);
  const j = d.getDay();
  d.setDate(d.getDate() + (j === 0 ? -6 : 1 - j));
  d.setHours(0, 0, 0, 0);
  return d;
};

const toISO = (d: Date) => d.toISOString().split('T')[0];

const fmtHeure = (iso: string) =>
  new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const fmtDuree = (m: number) => {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), r = m % 60;
  return r > 0 ? `${h}h${String(r).padStart(2, '0')}` : `${h}h`;
};

const fmtJour = (iso: string, todayISO: string) => {
  if (iso === todayISO) return "Aujourd'hui";
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
};

const labelSemaine = (lundi: Date) => {
  const dim = new Date(lundi);
  dim.setDate(lundi.getDate() + 6);
  const a = lundi.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  const b = dim.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  return `${a} – ${b}`;
};

const JOURS_COURTS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Écran Agenda premium — réunions de la semaine.
 * @author Riahi Dorsaf
 */
export const AgendaScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<PlusStackParamList>>();

  const [reunions,     setReunions]     = useState<ReunionResponse[]>([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lundi,        setLundi]        = useState(() => lundiDe(new Date()));
  const [jourActif,    setJourActif]    = useState(() => toISO(new Date()));

  const todayISO = toISO(new Date());

  // ── Chargement ────────────────────────────────────────────
  const charger = useCallback(async (refresh = false, l = lundi) => {
    if (refresh) setIsRefreshing(true); else setIsLoading(true);
    try {
      const dim = new Date(l); dim.setDate(l.getDate() + 6);
      const res = await ReunionApi.listerSemaine(toISO(l), toISO(dim));
      if (res.success) setReunions(res.data);
    } catch { /* silencieux */ }
    finally { setIsLoading(false); setIsRefreshing(false); }
  }, [lundi]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  const semainePrev = () => {
    const l = new Date(lundi); l.setDate(l.getDate() - 7);
    setLundi(l); charger(false, l);
  };
  const semaineSuiv = () => {
    const l = new Date(lundi); l.setDate(l.getDate() + 7);
    setLundi(l); charger(false, l);
  };

  // ── Week strip ────────────────────────────────────────────
  const jours = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lundi); d.setDate(lundi.getDate() + i);
    return { iso: toISO(d), num: d.getDate(), label: JOURS_COURTS[i] };
  });

  const reunionsParJour = (iso: string) =>
    reunions.filter(r => r.dateHeure.split('T')[0] === iso);

  // ── WhatsApp avec numéro ──────────────────────────────────
  const envoyerWhatsApp = (reunion: ReunionResponse) => {
    const date  = new Date(reunion.dateHeure).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
    const heure = fmtHeure(reunion.dateHeure);
    const lien  = reunion.lienReunion ? `\n🔗 Lien : ${reunion.lienReunion}` : '';
    const lieu  = reunion.lieu ? `\n📍 ${reunion.lieu}` : '';
    const msg   = `Bonjour,\n\nJe vous rappelle notre réunion "${reunion.titre}" le ${date} à ${heure}.${lieu}${lien}\n\nCordialement.`;

    // Chercher le premier participant avec un téléphone
    const participant = reunion.participants.find(p => p.telephone);
    const phone = participant?.telephone?.replace(/\D/g, '') ?? '';
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
      : `whatsapp://send?text=${encodeURIComponent(msg)}`;
    Linking.openURL(url);
  };

  // ── Email avec destinataires ──────────────────────────────
  const envoyerEmail = (reunion: ReunionResponse) => {
    const date  = new Date(reunion.dateHeure).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
    const heure = fmtHeure(reunion.dateHeure);
    const lien  = reunion.lienReunion ? `\nLien : ${reunion.lienReunion}` : '';
    const lieu  = reunion.lieu ? `\nLieu : ${reunion.lieu}` : '';
    const sujet = encodeURIComponent(`Rappel réunion : ${reunion.titre}`);
    const corps = encodeURIComponent(
      `Bonjour,\n\nRéunion "${reunion.titre}"\nDate : ${date} à ${heure}${lieu}${lien}\n\nCordialement.`,
    );
    const emails = reunion.participants
      .filter(p => p.email)
      .map(p => p.email)
      .join(',');
    Linking.openURL(`mailto:${emails}?subject=${sujet}&body=${corps}`);
  };

  // ── Actions statut ────────────────────────────────────────
  const confirmerTerminer = (r: ReunionResponse) =>
    Alert.alert('Terminer', `Marquer "${r.titre}" comme terminée ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Terminer', onPress: async () => { await ReunionApi.terminer(r.id); charger(true); } },
    ]);

  const confirmerAnnuler = (r: ReunionResponse) =>
    Alert.alert('Annuler la réunion', `Annuler "${r.titre}" ?`, [
      { text: 'Non', style: 'cancel' },
      { text: 'Annuler', style: 'destructive', onPress: async () => { await ReunionApi.annuler(r.id); charger(true); } },
    ]);

  // ── Card réunion ──────────────────────────────────────────
  const renderCard = (reunion: ReunionResponse) => {
    const config    = STATUT_REUNION_CONFIG[reunion.statut];
    const planifiee = reunion.statut === 'PLANIFIEE';

    return (
      <TouchableOpacity
        key={reunion.id}
        style={styles.reunionCard}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ReunionDetail', { reunionId: reunion.id })}
      >
        {/* Barre accent couleur */}
        <View style={[styles.reunionCardAccent, { backgroundColor: config.color }]} />

        <View style={styles.reunionCardBody}>
          <View style={styles.reunionCardTopRow}>
            <View>
              <Text style={styles.reunionHeure}>{fmtHeure(reunion.dateHeure)}</Text>
              <Text style={styles.reunionDuree}>{fmtDuree(reunion.dureeMinutes)}</Text>
            </View>
            <View style={[styles.statutBadge, { backgroundColor: config.bg }]}>
              <Text style={[styles.statutBadgeTxt, { color: config.color }]}>
                {config.label}
              </Text>
            </View>
          </View>

          <Text style={styles.reunionTitre} numberOfLines={1}>{reunion.titre}</Text>
          <Text style={styles.reunionMeta}>
            👤 {reunion.clientNom}
            {reunion.participants.length > 0 &&
              ` · ${reunion.participants.length} participant${reunion.participants.length > 1 ? 's' : ''}`}
          </Text>
          {reunion.lieu ? (
            <Text style={styles.reunionMeta}>📍 {reunion.lieu}</Text>
          ) : null}
          {reunion.lienReunion ? (
            <Text style={styles.reunionLien} numberOfLines={1}>🔗 Lien réunion disponible</Text>
          ) : null}

          {/* Actions rapides uniquement si PLANIFIEE */}
          {planifiee && (
            <View style={styles.reunionActions}>
              <TouchableOpacity
                style={[styles.actionChip, styles.actionChipWhatsApp]}
                onPress={() => envoyerWhatsApp(reunion)}
              >
                <Ionicons name="logo-whatsapp" size={12} color="#16A34A" />
                <Text style={[styles.actionChipTxt, styles.actionChipWhatsAppTxt]}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionChip, styles.actionChipEmail]}
                onPress={() => envoyerEmail(reunion)}
              >
                <Ionicons name="mail-outline" size={12} color={theme.colors.primary} />
                <Text style={[styles.actionChipTxt, styles.actionChipEmailTxt]}>Email</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionChip} onPress={() => confirmerTerminer(reunion)}>
                <Ionicons name="checkmark-outline" size={12} color={theme.colors.textSecondary} />
                <Text style={styles.actionChipTxt}>Terminée</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionChip} onPress={() => confirmerAnnuler(reunion)}>
                <Ionicons name="close-outline" size={12} color={theme.colors.textSecondary} />
                <Text style={styles.actionChipTxt}>Annuler</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // ── FlatList data ─────────────────────────────────────────
  const reunionsFiltrees = jourActif
    ? reunions.filter(r => r.dateHeure.split('T')[0] === jourActif)
    : reunions;

  const groupes: Record<string, ReunionResponse[]> = {};
  reunionsFiltrees.forEach(r => {
    const j = r.dateHeure.split('T')[0];
    if (!groupes[j]) groupes[j] = [];
    groupes[j].push(r);
  });

  type Item = { type: 'header'; jour: string } | { type: 'reunion'; reunion: ReunionResponse };
  const items: Item[] = [];
  Object.keys(groupes).sort().forEach(j => {
    items.push({ type: 'header', jour: j });
    groupes[j].forEach(r => items.push({ type: 'reunion', reunion: r }));
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header gradient premium ── */}
      <LinearGradient
        colors={['#1E3A8A', '#2563EB', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Agenda</Text>
            <Text style={styles.headerSubtitle}>
              {reunions.length} réunion{reunions.length !== 1 ? 's' : ''} cette semaine
            </Text>
          </View>
          <TouchableOpacity
            style={styles.headerAddBtn}
            onPress={() => navigation.navigate('PlanifierReunion', {})}
          >
            <Ionicons name="add" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        {/* Navigation semaine */}
        <View style={styles.semaineRow}>
          <TouchableOpacity style={styles.semaineBtnNav} onPress={semainePrev}>
            <Ionicons name="chevron-back" size={16} color={theme.colors.white} />
          </TouchableOpacity>
          <Text style={styles.semaineLabel}>{labelSemaine(lundi)}</Text>
          <TouchableOpacity style={styles.semaineBtnNav} onPress={semaineSuiv}>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        {/* Week strip */}
        <View style={styles.weekStrip}>
          {jours.map(jour => {
            const isActive  = jour.iso === jourActif;
            const hasEvents = reunionsParJour(jour.iso).length > 0;
            return (
              <TouchableOpacity
                key={jour.iso}
                style={[styles.dayBtn, isActive && styles.dayBtnActive]}
                onPress={() => setJourActif(isActive ? '' : jour.iso)}
              >
                <Text style={[styles.dayLabel, isActive && styles.dayLabelActive]}>
                  {jour.label}
                </Text>
                <Text style={[styles.dayNum, isActive && styles.dayNumActive]}>
                  {jour.num}
                </Text>
                <View style={[styles.dayDot, !hasEvents && styles.dayDotHidden]} />
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>

      {/* ── Contenu ── */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, i) =>
            item.type === 'header' ? `h-${item.jour}` : `r-${item.reunion.id}-${i}`
          }
          renderItem={({ item }) => {
            if (item.type === 'header') {
              const today = item.jour === todayISO;
              return (
                <Text style={[styles.jourHeader, today && styles.jourHeaderAujourdhui]}>
                  {fmtJour(item.jour, todayISO)}
                </Text>
              );
            }
            return renderCard(item.reunion);
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => charger(true)}
              tintColor={theme.colors.primary} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              titre={jourActif ? "Aucune réunion ce jour" : "Aucune réunion cette semaine"}
              soustitre="Appuyez sur + pour planifier une réunion"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};