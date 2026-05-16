/**
 * @file OpportunitesKanbanScreen.tsx
 * @description Pipeline Kanban horizontal scrollable + vue Liste groupee.
 *              Drag & drop inter-colonnes via PanResponder (sans rebuild natif).
 *              Cards enrichies : titre, client, montant, âge, boutons Devis/Perdre.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl, Alert,
  Animated, PanResponder,
} from 'react-native';
import { SafeAreaView }                  from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp }     from '@react-navigation/native-stack';
import { Ionicons }                      from '@expo/vector-icons';
import { GestureHandlerRootView }        from 'react-native-gesture-handler';

import { useStyles, useTheme }       from '../../theme';
import { makeStyles }                from './OpportunitesKanbanScreen.styles';
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

type Nav      = NativeStackNavigationProp<VentesStackParamList, 'OpportunitesKanban'>;
type ViewMode = 'kanban' | 'liste';

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Pipeline Kanban horizontal scrollable avec drag & drop inter-colonnes.
 * Drag via PanResponder — aucun rebuild natif nécessaire.
 * @author Riahi Dorsaf
 */
export const OpportunitesKanbanScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();

  // ── États principaux ──────────────────────────────────────
  const [kanban,       setKanban]       = useState<KanbanData | null>(null);
  const [viewMode,     setViewMode]     = useState<ViewMode>('kanban');
  const [isLoading,    setIsLoading]    = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [smartSheet,   setSmartSheet]   = useState<{
    visible: boolean;
    opportuniteId: number | null;
  }>({ visible: false, opportuniteId: null });

  // ── États drag & drop ─────────────────────────────────────
  const [isDragging,       setIsDragging]       = useState(false);
  const [draggedItem,      setDraggedItem]       = useState<OpportuniteResponse | null>(null);
  const [dropTargetStatut, setDropTargetStatut] = useState<StatutOpportunite | null>(null);
  const draggingRef    = useRef<OpportuniteResponse | null>(null);
  const dragPos        = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const colonneRefs    = useRef<Partial<Record<StatutOpportunite, any>>>({});
  const colonneRects   = useRef<Partial<Record<StatutOpportunite, {
    x: number; y: number; width: number; height: number;
  }>>>({});

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

  // ── Drop sur colonne ──────────────────────────────────────

  const handleDrop = async (
    opportunite: OpportuniteResponse,
    nouveauStatut: StatutOpportunite,
  ) => {
    if (opportunite.statut === nouveauStatut) return;
    try {
      await VenteApi.changerStatutOpportunite(opportunite.id, nouveauStatut);
      if (nouveauStatut === 'GAGNEE') {
        setSmartSheet({ visible: true, opportuniteId: opportunite.id });
      } else {
        charger(true);
      }
    } catch (e: any) {
      Alert.alert('Erreur', e?.response?.data?.message ?? 'Impossible de déplacer.');
    }
  };

  // ── PanResponder factory ──────────────────────────────────

  const createPanResponder = (opportunite: OpportuniteResponse) =>
    PanResponder.create({
      onStartShouldSetPanResponder:         () => false,
      onStartShouldSetPanResponderCapture:  () => false,
      onMoveShouldSetPanResponder:          () => true,
      onMoveShouldSetPanResponderCapture:   () => true,

      onPanResponderGrant: (evt) => {
        dragPos.setValue({
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY,
        });
        draggingRef.current = opportunite;
        setDraggedItem(opportunite);
        setIsDragging(true);
        // Mesurer les colonnes au début du drag
        setTimeout(mesurerColonnes, 50);
      },

      onPanResponderMove: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        dragPos.setValue({ x: pageX, y: pageY });
        const colonne = detecterColonne(pageX, pageY);
        setDropTargetStatut(colonne);
      },

      onPanResponderRelease: () => {
        const item   = draggingRef.current;
        const target = dropTargetStatut;
        setIsDragging(false);
        setDraggedItem(null);
        setDropTargetStatut(null);
        draggingRef.current = null;
        if (item && target && item.statut !== target) {
          handleDrop(item, target);
        }
      },

      onPanResponderTerminate: () => {
        setIsDragging(false);
        setDraggedItem(null);
        setDropTargetStatut(null);
        draggingRef.current = null;
      },
    });

  // ── Perdre ────────────────────────────────────────────────

  const handlePerdre = (o: OpportuniteResponse) => {
    Alert.alert(
      'Marquer comme perdue',
      `Confirmer la perte de "${o.titre}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text:  'Confirmer',
          style: 'destructive',
          onPress: async () => {
            await VenteApi.changerStatutOpportunite(o.id, 'PERDUE');
            charger(true);
          },
        },
      ],
    );
  };

  // ── Smart Automation ──────────────────────────────────────

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

  // ── Contenu interne d'une card ────────────────────────────

  const renderCardContent = (
    o: OpportuniteResponse,
    colStatut: StatutOpportunite,
  ) => {
    const diff = Math.floor(
      (Date.now() - new Date(o.dateCreation).getTime()) / 86400000,
    );
    const dotColor =
      diff < 3  ? '#16A34A' :
      diff <= 7 ? '#D97706' :
                  '#DC2626';

    const peutDevis  = colStatut === 'NEGOCIATION' || colStatut === 'GAGNEE';
    const peutPerdre = colStatut !== 'GAGNEE' && colStatut !== 'PERDUE';

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

        {(peutDevis || peutPerdre) && (
          <View style={styles.cardActionsRow}>
            {peutDevis && (
              <TouchableOpacity
                style={styles.cardDevisBtn}
                onPress={() =>
                  navigation.navigate('OpportuniteDetail', { opportuniteId: o.id })
                }
              >
                <Text style={styles.cardDevisBtnText}>→ Devis</Text>
              </TouchableOpacity>
            )}
            {peutPerdre && (
              <TouchableOpacity
                style={styles.cardPerdreBtn}
                onPress={() => handlePerdre(o)}
              >
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
    const panResponder = createPanResponder(o);
    const isBeingDragged = draggedItem?.id === o.id;

    return (
      <View
        key={o.id}
        {...panResponder.panHandlers}
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
              <Text style={styles.groupTitle}>{col.label} ({items.length})</Text>
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
    );
  };

  // ── Écran chargement ──────────────────────────────────────

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }

  const totalOpportunites = kanban
    ? Object.values(kanban).reduce((acc, list) => acc + list.length, 0)
    : 0;

  // ── Rendu principal ───────────────────────────────────────

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pipeline ({totalOpportunites})</Text>
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
                const items       = kanban ? (kanban[col.statut] ?? []) : [];
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
                        {isDropTarget ? `→ ${col.label}` : col.label}
                      </Text>
                      <View style={styles.colonneBadge}>
                        <Text style={[styles.colonneBadgeText, { color: '#FFFFFF' }]}>
                          {items.length}
                        </Text>
                      </View>
                    </View>

                    {/* Body colonne — scroll vertical */}
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
                          {isDragging && isDropTarget ? 'Déposer ici' : 'Vide'}
                        </Text>
                      )}
                      {items.map(o => renderKanbanCard(o, col.statut))}

                      {col.statut === 'PROSPECTION' && (
                        <TouchableOpacity
                          style={styles.addCardBtn}
                          onPress={() => navigation.navigate('OpportuniteForm', {})}
                        >
                          <Ionicons name="add" size={14} color={theme.colors.textTertiary} />
                          <Text style={styles.addCardBtnText}>Ajouter</Text>
                        </TouchableOpacity>
                      )}
                    </ScrollView>
                  </View>
                );
              })}
            </ScrollView>

            {/* ── Card fantôme qui suit le doigt ── */}
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
    </GestureHandlerRootView>
  );
};
