/**
 * @file ActivitesScreen.tsx
 * @description Écran liste complète des activités CRM.
 *              Tap → navigation vers la fiche dans le bon onglet :
 *              - CLIENT  → Clients > ClientDetail
 *              - CONTACT → Clients > ContactDetail
 *              - PRODUIT → Plus > ProduitDetail
 *              - REUNION → Plus > ReunionDetail  ← AJOUT
 * @author Riahi Dorsaf
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView }  from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons }      from '@expo/vector-icons';

import { useStyles, useTheme } from '../../theme';
import { makeStyles }          from './ActivitesScreen.styles';
import { EmptyState }          from '../../components/ui/EmptyState';

import * as ReportingApi from '../../api/reporting.api';
import {
  ActiviteResponse,
  ACTIVITE_ICONE,
  ACTIVITE_BG,
  ACTIVITE_ICON_COLOR,
} from '../../types/reporting.types';

/**
 * Écran liste complète des activités CRM avec navigation vers les fiches.
 * @author Riahi Dorsaf
 */
export const ActivitesScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<any>();

  const [activites,     setActivites]     = useState<ActiviteResponse[]>([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [isRefreshing,  setIsRefreshing]  = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page,          setPage]          = useState(0);
  const [isLast,        setIsLast]        = useState(false);

  // ── Chargement ────────────────────────────────────────────────
  const charger = useCallback(async (refresh = false) => {
    if (refresh) { setIsRefreshing(true); setPage(0); setIsLast(false); }
    else          setIsLoading(true);
    try {
      const response = await ReportingApi.getActivites(0, 20);
      if (response.success) {
        setActivites(response.data.content);
        setIsLast(response.data.last);
        setPage(1);
      }
    } catch { /* silencieux */ }
    finally { setIsLoading(false); setIsRefreshing(false); }
  }, []);

  const chargerPlus = async () => {
    if (isLast || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const response = await ReportingApi.getActivites(page, 20);
      if (response.success) {
        setActivites(prev => [...prev, ...response.data.content]);
        setIsLast(response.data.last);
        setPage(p => p + 1);
      }
    } catch { /* silencieux */ }
    finally { setIsLoadingMore(false); }
  };

  React.useEffect(() => { charger(); }, [charger]);

  // ── Navigation vers la fiche selon le type d'entité ──────────
  const naviguerVers = useCallback((activite: ActiviteResponse) => {
    switch (activite.entiteType) {

      case 'CLIENT':
        // Onglet Clients → ClientDetail
        navigation.navigate('Clients', {
          screen: 'ClientDetail',
          params: { clientId: activite.entiteId },
        });
        break;

      case 'CONTACT':
        // Onglet Clients → ContactDetail (le parent client doit être connu)
        if (activite.entiteParentId) {
          navigation.navigate('Clients', {
            screen: 'ContactDetail',
            params: {
              contactId: activite.entiteId,
              clientId:  activite.entiteParentId,
            },
          });
        }
        break;

      case 'PRODUIT':
        // Onglet Plus → ProduitDetail
        navigation.navigate('Plus', {
          screen: 'ProduitDetail',
          params: { produitId: activite.entiteId },
        });
        break;

      case 'REUNION':
        // Onglet Plus → ReunionDetail
        navigation.navigate('Plus', {
          screen: 'ReunionDetail',
          params: { reunionId: activite.entiteId },
        });
        break;

      default:
        break;
    }
  }, [navigation]);

  // ── Rendu item ────────────────────────────────────────────────
  const renderItem = ({ item }: { item: ActiviteResponse }) => {
    const icone     = ACTIVITE_ICONE[item.type]      ?? 'ellipse-outline';
    const bg        = ACTIVITE_BG[item.type]          ?? '#EFF6FF';
    const iconColor = ACTIVITE_ICON_COLOR[item.type]  ?? '#2563EB';

    // Détermine si l'item est navigable
    const estNavigable = ['CLIENT', 'CONTACT', 'PRODUIT', 'REUNION'].includes(item.entiteType);

    return (
      <TouchableOpacity
        style={styles.activiteItem}
        onPress={() => naviguerVers(item)}
        activeOpacity={estNavigable ? 0.75 : 1}
      >
        <View style={[styles.iconWrapper, { backgroundColor: bg }]}>
          <Ionicons name={icone as any} size={20} color={iconColor} />
        </View>

        <View style={styles.content}>
          <Text style={styles.titre} numberOfLines={1}>{item.titre}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.date}>{item.dateRelative}</Text>
        </View>

        {estNavigable && (
          <Ionicons
            name="chevron-forward"
            size={16}
            color={theme.colors.textTertiary}
            style={styles.chevron}
          />
        )}
      </TouchableOpacity>
    );
  };

  // ── Rendu ─────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Toutes les activités</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={activites}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => charger(true)}
              tintColor={theme.colors.primary}
            />
          }
          onEndReached={chargerPlus}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <EmptyState
              icon="time-outline"
              titre="Aucune activité"
              soustitre="Vos actions apparaîtront ici"
            />
          }
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};