/**
 * @file OpportunitesKanbanScreen.tsx
 * @description Pipeline Kanban horizontal scrollable + vue Liste groupee.
 *              Drag & drop inter-colonnes via PanResponder (long press 600 ms).
 *              Cards enrichies : titre, client, montant, âge, boutons Devis/Perdre.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, Alert,
  Animated, PanResponder, Vibration,
} from 'react-native';
import { SafeAreaView }                  from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp }     from '@react-navigation/native-stack';
import { Ionicons }                      from '@expo/vector-icons';
import { useTranslation }                from 'react-i18next';

import { useStyles, useTheme }       from '../../theme';
import { makeStyles }                from './OpportunitesKanbanScreen.styles';
import { SkeletonKanbanCard }        from '../../components/ui/Skeleton';
import { SearchBar }                 from '../../components/ui/SearchBar';
import { FilterChips }               from '../../components/ui/FilterChips';
import { VentesStackParamList }      from '../../navigation/VentesStack';

import * as VenteApi from '../../api/vente.api';
import {
  KanbanData,
  OpportuniteResponse,
  DevisResponse,
  FactureResponse,
  StatutOpportunite,
  KANBAN_COLONNES,
} from '../../types/vente.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav        = NativeStackNavigationProp<VentesStackParamList, 'OpportunitesKanban'>;
type ViewMode   = 'kanban' | 'liste';
type ListFiltre = StatutOpportunite | 'TOUS';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const trouverDevisActif = (
  devisList: DevisResponse[],
  opportuniteId: number,
): DevisResponse | undefined =>
  devisList.find(
    d => d.opportuniteId === opportuniteId &&
         d.statut !== 'REFUSE' &&
         d.statut !== 'EXPIRE',
  );

const trouverFactureLiee = (
  factureList: FactureResponse[],
  devisNumero: string | undefined,
): FactureResponse | undefined => {
  if (!devisNumero) return undefined;
  return factureList.find(f => f.devisNumero === devisNumero);
};

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Pipeline Kanban horizontal scrollable avec drag & drop inter-colonnes.
 * Drag via PanResponder — long press 600 ms requis avant activation.
 */
export const OpportunitesKanbanScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const { t, i18n } = useTranslation();
  const locale      = i18n.language === 'en' ? 'en-US' : 'fr-FR';
  const navigation = useNavigation<Nav>();

  // ── États principaux ──────────────────────────────────────
  const [kanban,       setKanban]       = useState<KanbanData | null>(null);
  const [viewMode,     setViewMode]     = useState<ViewMode>('kanban');
  const [isLoading,    setIsLoading]    = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── États drag & drop ─────────────────────────────────────
  const [isDragging,       setIsDragging]       = useState(false);
  const [draggedItem,      setDraggedItem]       = useState<OpportuniteResponse | null>(null);
  const [dropTargetStatut, setDropTargetStatut] = useState<StatutOpportunite | null>(null);

  const draggingRef     = useRef<OpportuniteResponse | null>(null);
  const dropTargetRef   = useRef<StatutOpportunite | null>(null);
  const touchStartTime  = useRef(0);
  const dragPos         = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const colonneRefs     = useRef<Partial<Record<StatutOpportunite, any>>>({});
  const colonneRects    = useRef<Partial<Record<StatutOpportunite, {
    x: number; y: number; width: number; height: number;
  }>>>({});

  // ── États devis / factures ────────────────────────────────
  const [devisList,   setDevisList]   = useState<DevisResponse[]>([]);
  const [factureList, setFactureList] = useState<FactureResponse[]>([]);

  // ── États vue liste ───────────────────────────────────────
  const [listFiltre, setListFiltre] = useState<ListFiltre>('TOUS');
  const [listSearch, setListSearch] = useState('');

  // ── Chargement ────────────────────────────────────────────

  const charger = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true); else setIsLoading(true);
    const [kanbanRes, devisRes, factureRes] = await Promise.allSettled([
      VenteApi.obtenirKanban(),
      VenteApi.listerDevis(),
      VenteApi.listerFactures(),
    ]);
    if (kanbanRes.status === 'fulfilled' && kanbanRes.value.success)
      setKanban(kanbanRes.value.data);
    if (devisRes.status === 'fulfilled' && devisRes.value.success)
      setDevisList(devisRes.value.data);
    if (factureRes.status === 'fulfilled' && factureRes.value.success)
      setFactureList(factureRes.value.data);
    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // ── Mesurer les colonnes ──────────────────────────────────

  const mesurerColonnes = () => {
    KANBAN_COLONNES.forEach(col => {
      colonneRefs.current[col.statut]?.measure(
        (_x: number, _y: number, w: number, h: number, px: number, py: number) => {
          colonneRects.current[col.statut] = { x: px, y: py, width: w, height: h };
        },
      );
    });
  };

  // ── Détecter colonne survolée ─────────────────────────────

  const detecterColonne = (pageX: number, pageY: number): StatutOpportunite | null => {
    for (const col of KANBAN_COLONNES) {
      const rect = colonneRects.current[col.statut];
      if (
        rect &&
        pageX >= rect.x &&
        pageX <= rect.x + rect.width &&
        pageY >= rect.y &&
        pageY <= rect.y + rect.height
      ) {
        return col.statut;
      }
    }
    return null;
  };

  // ── Confirmation perte (partagée) ─────────────────────────

  const demanderConfirmationPerte = (titre: string, onConfirm: () => void) => {
    Alert.alert(
      t('ventes.opport.loseTitle'),
      t('ventes.opport.loseConfirm', { titre }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('ventes.leadDetail.confirm'), style: 'destructive', onPress: onConfirm },
      ],
    );
  };

  // ── Drop sur colonne ──────────────────────────────────────

  const handleDrop = (
    opportunite: OpportuniteResponse,
    nouveauStatut: StatutOpportunite,
  ) => {
    if (opportunite.statut === nouveauStatut) return;

    const doMove = async () => {
      try {
        await VenteApi.changerStatutOpportunite(opportunite.id, nouveauStatut);
        // La facture est générée côté backend (copie du devis accepté) lors du passage
        // à GAGNÉE. On rafraîchit simplement. Sans devis, le backend renvoie une erreur
        // affichée ci-dessous (cohérent avec la fiche détail).
        charger(true);
      } catch (e: any) {
        Alert.alert(t('ventes.leadDetail.error'), e?.response?.data?.message ?? t('ventes.kanban.moveError'));
      }
    };

    // GAGNEE → PERDUE : message spécifique
    if (opportunite.statut === 'GAGNEE' && nouveauStatut === 'PERDUE') {
      Alert.alert(
        t('ventes.kanban.cancelWinTitle'),
        t('ventes.kanban.cancelWinMsg'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('ventes.leadDetail.confirm'), style: 'destructive', onPress: doMove },
        ],
      );
      return;
    }

    // Toute autre colonne → PERDUE
    if (nouveauStatut === 'PERDUE') {
      demanderConfirmationPerte(opportunite.titre, doMove);
      return;
    }

    // PERDUE → GAGNEE
    if (opportunite.statut === 'PERDUE' && nouveauStatut === 'GAGNEE') {
      Alert.alert(
        t('ventes.kanban.changeResultTitle'),
        t('ventes.kanban.changeResultMsg'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('ventes.leadDetail.confirm'), onPress: doMove },
        ],
      );
      return;
    }

    // Régression dans les étapes normales
    const ORDRE      = KANBAN_COLONNES.map(c => c.statut);
    const idxActuel  = ORDRE.indexOf(opportunite.statut);
    const idxCible   = ORDRE.indexOf(nouveauStatut);
    const labelActuel = t(KANBAN_COLONNES.find(c => c.statut === opportunite.statut)?.labelKey ?? opportunite.statut);
    const labelCible  = t(KANBAN_COLONNES.find(c => c.statut === nouveauStatut)?.labelKey ?? nouveauStatut);

    if (idxCible < idxActuel) {
      Alert.alert(
        t('ventes.kanban.demoteTitle'),
        t('ventes.kanban.demoteMsg', { titre: opportunite.titre, from: labelActuel, to: labelCible }),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('ventes.leadDetail.confirm'), onPress: doMove },
        ],
      );
      return;
    }

    // Déplacement vers l'avant — direct
    doMove();
  };

  // ── PanResponder factory (long press 600 ms) ──────────────

  const createPanResponder = (opportunite: OpportuniteResponse) =>
    PanResponder.create({
      onStartShouldSetPanResponder:        () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder:         () => Date.now() - touchStartTime.current >= 600,
      onMoveShouldSetPanResponderCapture:  () => Date.now() - touchStartTime.current >= 600,

      onPanResponderGrant: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        dragPos.setValue({ x: pageX, y: pageY });
        draggingRef.current = opportunite;
        Vibration.vibrate(30);
        setIsDragging(true);
        setDraggedItem(opportunite);
        setTimeout(mesurerColonnes, 50);
      },

      onPanResponderMove: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        dragPos.setValue({ x: pageX, y: pageY });
        const colonne = detecterColonne(pageX, pageY);
        dropTargetRef.current = colonne;
        setDropTargetStatut(colonne);
      },

      onPanResponderRelease: () => {
        const item   = draggingRef.current;
        const target = dropTargetRef.current;
        setIsDragging(false);
        setDraggedItem(null);
        setDropTargetStatut(null);
        draggingRef.current   = null;
        dropTargetRef.current = null;
        if (item && target && item.statut !== target) {
          handleDrop(item, target);
        }
      },

      onPanResponderTerminate: () => {
        setIsDragging(false);
        setDraggedItem(null);
        setDropTargetStatut(null);
        draggingRef.current   = null;
        dropTargetRef.current = null;
      },
    });

  // ── Perdre (bouton card) ──────────────────────────────────

  const handlePerdre = (o: OpportuniteResponse) => {
    demanderConfirmationPerte(o.titre, async () => {
      await VenteApi.changerStatutOpportunite(o.id, 'PERDUE');
      charger(true);
    });
  };

  const formatMontant = (v: number | null) =>
    v ? v.toLocaleString(locale, { maximumFractionDigits: 0 }) + ' TND' : '';

  // ── Bouton devis/facture selon statut ────────────────────

  const buildDevisBtnKanban = (
    colStatut: StatutOpportunite,
    o: OpportuniteResponse,
    devisActif: DevisResponse | undefined,
    facture: FactureResponse | undefined,
  ) => {
    if (colStatut === 'PROSPECTION' || colStatut === 'QUALIFICATION' || colStatut === 'PERDUE') {
      return null;
    }
    if (colStatut === 'NEGOCIATION') {
      if (devisActif) {
        return (
          <TouchableOpacity style={styles.btnVoirDevis}
            onPress={() => navigation.navigate('DevisDetail', { devisId: devisActif.id })}>
            <Text style={styles.btnVoirDevisText}>{t('ventes.opport.viewQuote')}</Text>
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity style={styles.btnVoirDevis}
          onPress={() => navigation.navigate('DevisForm', {
            clientId:      o.clientId,
            opportuniteId: o.id,
          })}>
          <Text style={styles.btnVoirDevisText}>{t('ventes.opport.createQuote')}</Text>
        </TouchableOpacity>
      );
    }
    if (colStatut === 'GAGNEE') {
      if (facture) {
        return (
          <TouchableOpacity style={styles.btnVoirFacture}
            onPress={() => navigation.navigate('FactureDetail', { factureId: facture.id })}>
            <Text style={styles.btnVoirFactureText}>{t('ventes.opport.viewInvoice')}</Text>
          </TouchableOpacity>
        );
      }
      if (devisActif) {
        return (
          <TouchableOpacity style={styles.btnVoirDevis}
            onPress={() => navigation.navigate('DevisDetail', { devisId: devisActif.id })}>
            <Text style={styles.btnVoirDevisText}>{t('ventes.opport.viewQuote')}</Text>
          </TouchableOpacity>
        );
      }
    }
    return null;
  };

  // ── Contenu interne d'une card ────────────────────────────

  const renderCardContent = (
    o: OpportuniteResponse,
    colStatut: StatutOpportunite,
  ) => {
    const devisActif = trouverDevisActif(devisList, o.id);
    const facture    = trouverFactureLiee(factureList, devisActif?.numero);

    const diff = Math.floor(
      (Date.now() - new Date(o.dateCreation).getTime()) / 86400000,
    );
    const dotColor =
      diff < 3  ? '#16A34A' :
      diff <= 7 ? '#D97706' :
                  '#DC2626';

    const peutPerdre = colStatut !== 'GAGNEE' && colStatut !== 'PERDUE';
    const devisBtn   = buildDevisBtnKanban(colStatut, o, devisActif, facture);

    return (
      <>
        <Text style={styles.cardTitre} numberOfLines={2}>{o.titre}</Text>
        <Text style={styles.cardClient} numberOfLines={1}>{o.clientNom}</Text>
        <View style={styles.cardMeta}>
          {o.montantEstime ? (
            <Text style={styles.cardMontant}>{formatMontant(o.montantEstime)}</Text>
          ) : null}
          <Text style={styles.cardDateRelative}>{o.dateRelative ?? ''}</Text>
          <View style={[styles.cardAgeDot, { backgroundColor: dotColor }]} />
        </View>
        {(devisBtn !== null || peutPerdre) && (
          <View style={styles.cardActionsRow}>
            {devisBtn}
            {peutPerdre && (
              <TouchableOpacity style={styles.cardPerdreBtn} onPress={() => handlePerdre(o)}>
                <Text style={styles.cardPerdreBtnText}>Perdre</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </>
    );
  };

  // ── Rendu Kanban card ─────────────────────────────────────

  const renderKanbanCard = (o: OpportuniteResponse, colStatut: StatutOpportunite) => {
    const panResponder   = createPanResponder(o);
    const isBeingDragged = draggedItem?.id === o.id;

    return (
      <View
        key={o.id}
        {...panResponder.panHandlers}
        onTouchStart={() => { touchStartTime.current = Date.now(); }}
        style={[
          styles.opportuniteCard,
          isBeingDragged && styles.cardDragging,
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            if (!isDragging) {
              navigation.navigate('OpportuniteDetail', { opportuniteId: o.id });
            }
          }}
          activeOpacity={0.85}
        >
          {renderCardContent(o, colStatut)}
        </TouchableOpacity>
      </View>
    );
  };

  // ── Rendu Liste ───────────────────────────────────────────

  const renderListeGroupee = () => {
    if (!kanban) return null;

    const chips = [
      { value: 'TOUS', label: t('ventes.leadsList.filterAll') },
      ...KANBAN_COLONNES.map(c => ({ value: c.statut, label: t(c.labelKey) })),
    ];

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.searchWrapper}>
          <SearchBar
            value={listSearch}
            onChangeText={setListSearch}
            placeholder={t('ventes.kanban.searchPlaceholder')}
          />
        </View>
        <View style={styles.filtresWrapper}>
          <FilterChips
            chips={chips}
            selected={listFiltre}
            onSelect={v => setListFiltre(v as ListFiltre)}
          />
        </View>
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
          {KANBAN_COLONNES
            .filter(col => listFiltre === 'TOUS' || col.statut === listFiltre)
            .map(col => {
              const q = listSearch.toLowerCase();
              const items = (kanban[col.statut] ?? []).filter(o =>
                !q ||
                o.titre.toLowerCase().includes(q) ||
                o.clientNom.toLowerCase().includes(q),
              );
              if (items.length === 0) return null;
              return (
                <View key={col.statut}>
                  <Text style={styles.groupTitle}>{t(col.labelKey)} ({items.length})</Text>
                  {items.map(o => (
                    <TouchableOpacity
                      key={o.id}
                      style={styles.listCard}
                      onPress={() =>
                        navigation.navigate('OpportuniteDetail', { opportuniteId: o.id })
                      }
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
      </View>
    );
  };

  // ── Écran chargement ──────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', columnGap: 12, padding: 16 }}>
          <SkeletonKanbanCard style={{ width: 240 }} />
          <SkeletonKanbanCard style={{ width: 240 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const totalOpportunites = kanban
    ? Object.values(kanban).reduce((acc, list) => acc + list.length, 0)
    : 0;

  // ── Rendu principal ───────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('ventes.kanban.title', { nb: totalOpportunites })}</Text>
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
            {viewMode === 'kanban' ? t('ventes.kanban.viewList') : t('ventes.kanban.viewKanban')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Vue Liste ── */}
      {viewMode === 'liste' && renderListeGroupee()}

      {/* ── Vue Kanban horizontale ── */}
      {viewMode === 'kanban' && (
        <View style={{ flex: 1 }}>
          <ScrollView
            horizontal
            style={styles.kanbanScroll}
            contentContainerStyle={styles.kanbanContent}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={!isDragging}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => charger(true)}
                tintColor={theme.colors.primary}
              />
            }
          >
            {KANBAN_COLONNES.map(col => {
              const items        = kanban ? (kanban[col.statut] ?? []) : [];
              const isDropTarget = isDragging && dropTargetStatut === col.statut;

              return (
                <View
                  key={col.statut}
                  style={styles.colonne}
                  ref={ref => { colonneRefs.current[col.statut] = ref; }}
                >
                  {/* Header colonne */}
                  <View
                    style={[
                      styles.colonneHeader,
                      { backgroundColor: isDropTarget ? theme.colors.primary : col.color },
                    ]}
                  >
                    <Ionicons name={col.iconName as any} size={16} color="#FFFFFF" />
                    <Text style={[styles.colonneTitle, { color: '#FFFFFF' }]}>
                      {isDropTarget ? `→ ${t(col.labelKey)}` : t(col.labelKey)}
                    </Text>
                    <View style={styles.colonneBadge}>
                      <Text style={[styles.colonneBadgeText, { color: '#FFFFFF' }]}>
                        {items.length}
                      </Text>
                    </View>
                  </View>

                  {/* Body colonne */}
                  <ScrollView
                    style={styles.colonneBody}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={!isDragging}
                    contentContainerStyle={{
                      rowGap:        theme.spacing[2],
                      paddingBottom: theme.spacing[3],
                      padding:       theme.spacing[2],
                    }}
                  >
                    {items.length === 0 && (
                      <Text style={styles.emptyColonne}>
                        {isDragging && isDropTarget ? t('ventes.kanban.dropHere') : t('ventes.kanban.empty')}
                      </Text>
                    )}
                    {items.map(o => renderKanbanCard(o, col.statut))}

                    {col.statut === 'PROSPECTION' && (
                      <TouchableOpacity
                        style={styles.addCardBtn}
                        onPress={() => navigation.navigate('OpportuniteForm', {})}
                      >
                        <Ionicons name="add" size={14} color={theme.colors.textTertiary} />
                        <Text style={styles.addCardBtnText}>{t('clients.detail.add')}</Text>
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                </View>
              );
            })}
          </ScrollView>

          {/* Card fantôme qui suit le doigt */}
          {isDragging && draggedItem && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.dragGhost,
                {
                  left:      dragPos.x,
                  top:       dragPos.y,
                  transform: [{ translateX: -100 }, { translateY: -50 }],
                },
              ]}
            >
              <Text style={styles.dragGhostTitre} numberOfLines={1}>
                {draggedItem.titre}
              </Text>
              <Text style={styles.dragGhostClient} numberOfLines={1}>
                {draggedItem.clientNom}
              </Text>
            </Animated.View>
          )}
        </View>
      )}

    </SafeAreaView>
  );
};
