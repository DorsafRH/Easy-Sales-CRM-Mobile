/**
 * @file AgendaScreen.tsx
 * @description Écran Agenda CRM — Calendrier mensuel coloré + vue jour.
 *   FIXES :
 *   ✅ NavProp : 'AgendaHome' (pas 'Agenda') — conforme PlusStackParamList
 *   ✅ changerStatut inexistant → ReunionApi.terminer() / ReunionApi.annuler()
 *   ✅ toLocalISO() — timezone-safe (pas toISOString())
 * @author Riahi Dorsaf
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  RefreshControl, ActivityIndicator,
  Alert, Linking, ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView }          from 'react-native-safe-area-context';
import { useNavigation,
         useFocusEffect }        from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons }              from '@expo/vector-icons';

import { useStyles, useTheme }  from '../../theme';
import { makeStyles }           from './AgendaScreen.styles';
import { EmptyState }           from '../../components/ui/EmptyState';
import { PlusStackParamList }   from '../../navigation/PlusStack';
import * as ReunionApi          from '../../api/reunion.api';
import {
  ReunionResponse,
  STATUT_REUNION_CONFIG,
} from '../../types/reunion.types';

// ─── HELPERS TIMEZONE-SAFE ────────────────────────────────────
const toLocalISO = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const fmtHeure = (iso: string): string =>
  new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const fmtDuree = (m: number): string => {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), r = m % 60;
  return r > 0 ? `${h}h${String(r).padStart(2, '0')}` : `${h}h`;
};

// ─── CONSTANTES ───────────────────────────────────────────────
const MOIS_NOMS  = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const MOIS_ABREV = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];
const JOURS_COURTS = ['Lu','Ma','Me','Je','Ve','Sa','Di'];
const JOURS_LONGS  = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];

// ─── PALETTE COULEURS ─────────────────────────────────────────
const EVENT_PALETTE = [
  { bg:'#EFF6FF', border:'#2563EB', text:'#1E40AF', pill:'#DBEAFE' },
  { bg:'#F5F3FF', border:'#7C3AED', text:'#5B21B6', pill:'#EDE9FE' },
  { bg:'#F0FDFA', border:'#0D9488', text:'#0F766E', pill:'#CCFBF1' },
  { bg:'#FFF7ED', border:'#EA580C', text:'#9A3412', pill:'#FED7AA' },
  { bg:'#FFF1F2', border:'#E11D48', text:'#9F1239', pill:'#FFE4E6' },
  { bg:'#F0FDF4', border:'#16A34A', text:'#15803D', pill:'#DCFCE7' },
  { bg:'#FEFCE8', border:'#CA8A04', text:'#92400E', pill:'#FEF9C3' },
  { bg:'#FDF4FF', border:'#A21CAF', text:'#86198F', pill:'#FAE8FF' },
];

const getEventColor = (r: ReunionResponse) => {
  if (r.statut === 'TERMINEE') return { bg:'#F0FDF4', border:'#16A34A', text:'#15803D', pill:'#DCFCE7' };
  if (r.statut === 'ANNULEE')  return { bg:'#F9FAFB', border:'#9CA3AF', text:'#6B7280', pill:'#F3F4F6' };
  return EVENT_PALETTE[r.id % EVENT_PALETTE.length];
};

// ─── GRILLE MENSUELLE ─────────────────────────────────────────
const getDaysGrid = (year: number, month: number): (Date | null)[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  const offset   = (firstDay.getDay() + 6) % 7;
  const days: (Date | null)[] = [];
  for (let i = 0; i < offset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
  while (days.length % 7 !== 0) days.push(null);
  return days;
};

// ─── FIX : 'AgendaHome' conforme à PlusStackParamList ─────────
type NavProp = NativeStackNavigationProp<PlusStackParamList, 'AgendaHome'>;

// ─── COMPOSANT ────────────────────────────────────────────────
export const AgendaScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<NavProp>();

  const today    = new Date();
  const todayISO = toLocalISO(today);

  const [currentMonth, setCurrentMonth] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedISO,  setSelectedISO]  = useState(todayISO);
  const [reunions,     setReunions]     = useState<ReunionResponse[]>([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const charger = useCallback(async (refresh = false, y = currentMonth.year, m = currentMonth.month) => {
    if (refresh) setIsRefreshing(true); else setIsLoading(true);
    try {
      const res = await ReunionApi.listerSemaine(
        toLocalISO(new Date(y, m, 1)),
        toLocalISO(new Date(y, m + 1, 0)),
      );
      if (res.success) setReunions(res.data ?? []);
    } catch { /* silencieux */ }
    finally { setIsLoading(false); setIsRefreshing(false); }
  }, [currentMonth.year, currentMonth.month]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  const naviguerMois = (delta: -1 | 1) => {
    const { year, month } = currentMonth;
    let ny = year, nm = month + delta;
    if (nm < 0)  { ny--; nm = 11; }
    if (nm > 11) { ny++; nm = 0; }
    setCurrentMonth({ year: ny, month: nm });
    setSelectedISO(
      ny === today.getFullYear() && nm === today.getMonth()
        ? todayISO
        : toLocalISO(new Date(ny, nm, 1)),
    );
    charger(false, ny, nm);
  };

  const daysGrid    = getDaysGrid(currentMonth.year, currentMonth.month);
  const hasEvents   = (iso: string) => reunions.some(r => r.dateHeure.startsWith(iso));
  const eventsOfDay = reunions
    .filter(r => r.dateHeure.startsWith(selectedISO))
    .sort((a, b) => a.dateHeure.localeCompare(b.dateHeure));

  const selDate  = new Date(`${selectedISO}T12:00:00`);
  const dayLabel = selectedISO === todayISO
    ? "AUJOURD'HUI"
    : `${JOURS_LONGS[selDate.getDay()].toUpperCase()} ${selDate.getDate()} ${MOIS_ABREV[selDate.getMonth()].toUpperCase()}`;

  // ── Actions — FIX : terminer() et annuler() au lieu de changerStatut() ──
  const envoyerWhatsApp = useCallback((r: ReunionResponse) => {
    const p = r.participants?.find(x => x.telephone);
    if (!p?.telephone) { Alert.alert('Aucun numéro', 'Aucun participant avec numéro.'); return; }
    const phone = p.telephone.replace(/\D/g, '');
    const msg   = `Bonjour ${p.prenom ?? p.nom},\n\nRappel : réunion "${r.titre}" — ${fmtHeure(r.dateHeure)}.${r.lienReunion ? `\n🔗 ${r.lienReunion}` : ''}\n\nCordialement.`;
    Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
  }, []);

  const envoyerEmail = useCallback((r: ReunionResponse) => {
    const mails = r.participants?.filter(p => p.email).map(p => p.email).join(',');
    if (!mails) { Alert.alert('Aucun email', 'Aucun participant avec email.'); return; }
    Linking.openURL(`mailto:${mails}?subject=${encodeURIComponent(`Rappel : ${r.titre}`)}&body=${encodeURIComponent(`Bonjour,\n\nRappel : "${r.titre}" — ${fmtHeure(r.dateHeure)}.\n\nCordialement.`)}`);
  }, []);

  const confirmerTerminer = useCallback((r: ReunionResponse) => {
    Alert.alert('Terminer', `Marquer "${r.titre}" comme terminée ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Confirmer', onPress: async () => {
        try {
          // FIX : ReunionApi.terminer() — pas changerStatut()
          await ReunionApi.terminer(r.id);
          charger(true);
        } catch { Alert.alert('Erreur', 'Impossible de terminer cette réunion.'); }
      }},
    ]);
  }, [charger]);

  const confirmerAnnuler = useCallback((r: ReunionResponse) => {
    Alert.alert('Annuler', `Annuler "${r.titre}" ?`, [
      { text: 'Retour', style: 'cancel' },
      { text: 'Annuler la réunion', style: 'destructive', onPress: async () => {
        try {
          // FIX : ReunionApi.annuler() — pas changerStatut()
          await ReunionApi.annuler(r.id);
          charger(true);
        } catch { Alert.alert('Erreur', 'Impossible d\'annuler cette réunion.'); }
      }},
    ]);
  }, [charger]);

  // ── Rendu card ────────────────────────────────────────────────
  const renderEvent = useCallback(({ item: r }: ListRenderItemInfo<ReunionResponse>) => {
    const colors   = getEventColor(r);
    const isPlanif = r.statut === 'PLANIFIEE';
    const isCancl  = r.statut === 'ANNULEE';
    const cfg      = STATUT_REUNION_CONFIG[r.statut];
    return (
      <TouchableOpacity activeOpacity={0.82} onPress={() => navigation.navigate('ReunionDetail', { reunionId: r.id })}>
        <View style={styles.eventCard}>
          <View style={[styles.eventBar, { backgroundColor: colors.border }]} />
          <View style={[styles.eventBody, { backgroundColor: colors.bg }]}>
            <View style={styles.eventRow}>
              <Text style={[styles.eventHeure, { color: colors.border }, isCancl && styles.textStrike]}>{fmtHeure(r.dateHeure)}</Text>
              <View style={[styles.eventPill, { backgroundColor: colors.pill }]}>
                <Text style={[styles.eventPillTxt, { color: colors.text }]}>{cfg.label}</Text>
              </View>
            </View>
            <Text style={styles.eventDuree}>{fmtDuree(r.dureeMinutes)}</Text>
            <Text style={[styles.eventTitre, { color: colors.text }, isCancl && styles.textStrike]} numberOfLines={1}>{r.titre}</Text>
            <View style={styles.metaRow}><Ionicons name="person-outline" size={11} color="#9CA3AF" /><Text style={styles.metaTxt}>{r.clientNom}</Text></View>
            {r.lieu       ? <View style={styles.metaRow}><Ionicons name="location-outline" size={11} color="#9CA3AF" /><Text style={styles.metaTxt}>{r.lieu}</Text></View> : null}
            {r.lienReunion ? <View style={styles.metaRow}><Ionicons name="link-outline" size={11} color={colors.border} /><Text style={[styles.metaTxt, { color: colors.border }]}>Lien disponible</Text></View> : null}
            {isPlanif && (
              <View style={styles.eventActions}>
                <TouchableOpacity style={styles.chip} onPress={() => envoyerWhatsApp(r)}><Ionicons name="logo-whatsapp" size={12} color="#16A34A" /><Text style={[styles.chipTxt, { color: '#16A34A' }]}>WhatsApp</Text></TouchableOpacity>
                <TouchableOpacity style={styles.chip} onPress={() => envoyerEmail(r)}><Ionicons name="mail-outline" size={12} color={colors.border} /><Text style={[styles.chipTxt, { color: colors.border }]}>Email</Text></TouchableOpacity>
                <TouchableOpacity style={styles.chip} onPress={() => confirmerTerminer(r)}><Ionicons name="checkmark-outline" size={12} color="#6B7280" /><Text style={styles.chipTxt}>Terminée</Text></TouchableOpacity>
                <TouchableOpacity style={styles.chip} onPress={() => confirmerAnnuler(r)}><Ionicons name="close-outline" size={12} color="#EF4444" /><Text style={[styles.chipTxt, { color: '#EF4444' }]}>Annuler</Text></TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [envoyerWhatsApp, envoyerEmail, confirmerTerminer, confirmerAnnuler, navigation, styles]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Section calendrier ── */}
      <View style={styles.calSection}>
        <View style={styles.calHeader}>
          <View>
            <Text style={styles.calTitre}>Agenda</Text>
            <Text style={styles.calSub}>{reunions.length} réunion{reunions.length !== 1 ? 's' : ''} ce mois</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('PlanifierReunion', {})} activeOpacity={0.8}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.monthRow}>
          <TouchableOpacity style={styles.monthArrow} onPress={() => naviguerMois(-1)}><Ionicons name="chevron-back" size={18} color={theme.colors.primary} /></TouchableOpacity>
          <Text style={styles.monthLabel}>{MOIS_NOMS[currentMonth.month]} {currentMonth.year}</Text>
          <TouchableOpacity style={styles.monthArrow} onPress={() => naviguerMois(1)}><Ionicons name="chevron-forward" size={18} color={theme.colors.primary} /></TouchableOpacity>
        </View>

        <View style={styles.daysHeader}>
          {JOURS_COURTS.map((j, i) => (
            <Text key={j} style={[styles.dayHdrTxt, i >= 5 && styles.dayHdrWknd]}>{j}</Text>
          ))}
        </View>

        <View style={styles.calGrid}>
          {daysGrid.map((day, idx) => {
            if (!day) return <View key={`_${idx}`} style={styles.calCell} />;
            const iso   = toLocalISO(day);
            const isTdy = iso === todayISO;
            const isSel = iso === selectedISO;
            const hasEv = hasEvents(iso);
            const isW   = day.getDay() === 0 || day.getDay() === 6;
            return (
              <TouchableOpacity key={iso} style={styles.calCell} onPress={() => setSelectedISO(iso)} activeOpacity={0.7}>
                <View style={[styles.calCircle, isSel && { backgroundColor: theme.colors.primary }, isTdy && !isSel && styles.calCircleToday]}>
                  <Text style={[styles.calDayTxt, isW && styles.calDayWknd, isSel && styles.calDayTxtSel, isTdy && !isSel && { color: theme.colors.primary, fontWeight: '700' }]}>{day.getDate()}</Text>
                </View>
                {hasEv && <View style={[styles.evDot, isSel && { backgroundColor: '#FFFFFF' }]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Label jour ── */}
      <View style={styles.dayLabelRow}>
        <Text style={[styles.dayLabel, selectedISO === todayISO && { color: theme.colors.primary }]}>{dayLabel}</Text>
        <Text style={styles.dayCount}>{eventsOfDay.length} réunion{eventsOfDay.length !== 1 ? 's' : ''}</Text>
      </View>

      {/* ── Liste ── */}
      {isLoading ? (
        <View style={styles.loader}><ActivityIndicator size="large" color={theme.colors.primary} /></View>
      ) : (
        <FlatList
          data={eventsOfDay}
          keyExtractor={item => String(item.id)}
          renderItem={renderEvent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => charger(true)} tintColor={theme.colors.primary} />}
          ListEmptyComponent={<EmptyState icon="calendar-outline" titre="Aucune réunion" soustitre="Pas de réunion prévue ce jour" />}
        />
      )}
    </SafeAreaView>
  );
};