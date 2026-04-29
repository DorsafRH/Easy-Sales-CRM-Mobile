/**
 * @file ClientsListScreen.tsx
 * @description Liste des clients CRM avec :
 *              - Barre de recherche temps réel (debounce 400ms)
 *              - Filtres chips [Tous / Entreprises / Individuels]
 *              - Avatar initiales colorées déterministes
 *              - CA total affiché à droite
 *              - Badge type (Entreprise / Individuel)
 *              - FAB bleu → ClientFormScreen (création)
 *              - Tap item → ClientDetailScreen
 *
 * @author Riahi Dorsaf
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView }                  from 'react-native-safe-area-context';
import { useNavigation }                 from '@react-navigation/native';
import { NativeStackNavigationProp }     from '@react-navigation/native-stack';

import { useStyles, useTheme }   from '../../theme';
import { makeStyles }            from './ClientsListScreen.styles';
import { Avatar }                from '../../components/ui/Avatar';
import { FAB }                   from '../../components/ui/FAB';
import { SearchBar }             from '../../components/ui/SearchBar';
import { FilterChips, FilterChip } from '../../components/ui/FilterChips';
import { Badge, variantFromValue } from '../../components/ui/Badge';
import { EmptyState }            from '../../components/ui/EmptyState';
import { useDebounce }           from '../../hooks/useDebounce';
import { ClientsStackParamList } from '../../navigation/ClientsStack';

import * as ClientApi    from '../../api/client.api';
import { ClientResponse, TypeClient } from '../../types/client.types';

// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────

const FILTER_CHIPS: FilterChip[] = [
  { value: 'TOUS',       label: 'Tous'       },
  { value: 'ENTREPRISE', label: 'Entreprises' },
  { value: 'INDIVIDUEL', label: 'Individuels' },
];

/**
 * Formate le CA en TND avec séparateur de milliers.
 */
const formatCA = (value: number): string => {
  if (!value) return '0 TND';
  return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} TND`;
};

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Liste des clients avec recherche debounce et filtres chips.
 * @author Riahi Dorsaf
 */
export const ClientsListScreen: React.FC = () => {
  const styles    = useStyles(makeStyles);
  const theme     = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<ClientsStackParamList>>();

  const [clients,      setClients]      = useState<ClientResponse[]>([]);
  const [total,        setTotal]        = useState(0);
  const [searchText,   setSearchText]   = useState('');
  const [filtre,       setFiltre]       = useState('TOUS');
  const [isLoading,    setIsLoading]    = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const debouncedSearch = useDebounce(searchText, 400);

  // ── Chargement ────────────────────────────────────────────────
  const charger = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const typeClient = filtre !== 'TOUS' ? filtre as TypeClient : undefined;
      const response   = await ClientApi.listerClients(
        typeClient,
        debouncedSearch || undefined,
        0,
        50,
      );
      if (response.success) {
        setClients(response.data.content);
        setTotal(response.data.totalElements);
      }
    } catch {
      // silencieux
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filtre, debouncedSearch]);

  useEffect(() => { charger(); }, [charger]);

  // ── Rendu item ────────────────────────────────────────────────
  const renderItem = ({ item }: { item: ClientResponse }) => (
    <TouchableOpacity
      style={styles.clientItem}
      onPress={() => navigation.navigate('ClientDetail', { clientId: item.id })}
      activeOpacity={0.75}
    >
      <Avatar nom={item.nomAffichage} size="md" />

      <View style={styles.clientInfo}>
        <Text style={styles.clientNom} numberOfLines={1}>
          {item.nomAffichage}
        </Text>
        <Text style={styles.clientMeta}>
          {item.ville ? `${item.ville} · ` : ''}
          {item.nbContacts} contact{item.nbContacts !== 1 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.clientRight}>
        <Text style={styles.clientCA}>{formatCA(item.chiffreAffaires)}</Text>
        <Badge
          label={item.typeClient === 'ENTREPRISE' ? 'Entreprise' : 'Individuel'}
          variant={variantFromValue(item.typeClient)}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>Clients</Text>
          <Text style={styles.headerCount}>
            {isLoading ? '…' : `${total} client${total !== 1 ? 's' : ''}`}
          </Text>
        </View>

        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Rechercher un client…"
          />
        </View>

        <View style={styles.filtersWrapper}>
          <FilterChips
            chips={FILTER_CHIPS}
            selected={filtre}
            onSelect={setFiltre}
          />
        </View>
      </View>

      {/* ── Contenu ── */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={clients}
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
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              titre="Aucun client"
              soustitre={
                debouncedSearch
                  ? 'Aucun résultat pour votre recherche'
                  : 'Ajoutez votre premier client avec le bouton +'
              }
            />
          }
        />
      )}

      {/* ── FAB ── */}
      <FAB
        onPress={() => navigation.navigate('ClientForm', {})}
        accessibilityLabel="Ajouter un client"
      />
    </SafeAreaView>
  );
};