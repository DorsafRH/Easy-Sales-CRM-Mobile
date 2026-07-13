/**
 * @file LeadsListScreen.tsx
 * @description Liste des leads avec recherche, filtres par statut et score.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView }                  from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp }     from '@react-navigation/native-stack';
import { Ionicons }                      from '@expo/vector-icons';
import { useTranslation }                from 'react-i18next';

import { useStyles, useTheme }   from '../../theme';
import { makeStyles }            from './LeadsListScreen.styles';
import { SkeletonListItem }      from '../../components/ui/Skeleton';
import { SearchBar }             from '../../components/ui/SearchBar';
import { FilterChips }           from '../../components/ui/FilterChips';
import { Badge }                 from '../../components/ui/Badge';
import { EmptyState }            from '../../components/ui/EmptyState';
import { FAB }                   from '../../components/ui/FAB';
import { ScoreBar }              from '../../components/ui/ScoreBar';
import { useDebounce }           from '../../hooks/useDebounce';
import { VentesStackParamList }  from '../../navigation/VentesStack';

import * as VenteApi from '../../api/vente.api';
import {
  LeadResponse,
  StatutLead,
  STATUT_LEAD_CONFIG,
} from '../../types/vente.types';

// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────

type Nav = NativeStackNavigationProp<VentesStackParamList, 'LeadsList'>;

// Chips de filtre construits dans le composant (labels traduits via t())

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Liste des leads avec recherche et filtres par statut.
 * @author Riahi Dorsaf
 */
export const LeadsListScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const { t }      = useTranslation();
  const navigation = useNavigation<Nav>();

  const FILTRE_CHIPS = [
    { value: 'TOUS',        label: t('ventes.leadsList.filterAll')       },
    { value: 'NOUVEAU',     label: t('ventes.leadsList.filterNew')       },
    { value: 'CONTACTE',    label: t('ventes.leadsList.filterContacted') },
    { value: 'QUALIFIE',    label: t('ventes.leadsList.filterQualified') },
    { value: 'PROPOSITION', label: t('ventes.statutLead.PROPOSITION')    },
    { value: 'NEGOCIATION', label: t('ventes.statutLead.NEGOCIATION')    },
  ];

  const [leads,        setLeads]        = useState<LeadResponse[]>([]);
  const [searchText,   setSearchText]   = useState('');
  const [filtre,       setFiltre]       = useState('TOUS');
  const [isLoading,    setIsLoading]    = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const debouncedSearch = useDebounce(searchText, 400);

  // ── Chargement ────────────────────────────────────────────

  const charger = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true); else setIsLoading(true);
    try {
      const statut = filtre !== 'TOUS' ? filtre as StatutLead : undefined;
      const res = await VenteApi.listerLeads(statut, debouncedSearch || undefined);
      if (res.success) setLeads(res.data);
    } catch {
      // silencieux
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filtre, debouncedSearch]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // ── Rendu item ────────────────────────────────────────────

  const renderItem = ({ item }: { item: LeadResponse }) => {
    const conf = STATUT_LEAD_CONFIG[item.statut];
    return (
      <TouchableOpacity
        style={styles.leadItem}
        onPress={() => navigation.navigate('LeadDetail', { leadId: item.id })}
        activeOpacity={0.75}
      >
        <View style={styles.leadTopRow}>
          <Text style={styles.leadNom} numberOfLines={1}>{item.nom}</Text>
          <Badge label={t(conf.labelKey)} variant="neutral" />
        </View>
        <Text style={styles.leadMeta}>
          {item.entreprise ?? item.email ?? item.telephone ?? t('ventes.leadsList.noContactInfo')}
        </Text>
        <View style={styles.scoreWrapper}>
          <ScoreBar score={item.score} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('ventes.leadsList.title')}</Text>
          <Text style={styles.headerCount}>
            {isLoading
              ? '...'
              : t(leads.length !== 1 ? 'ventes.leadsList.countPlural' : 'ventes.leadsList.count', { nb: leads.length })}
          </Text>
        </View>
        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder={t('ventes.leadsList.searchPlaceholder')}
          />
        </View>
        <FilterChips
          chips={FILTRE_CHIPS}
          selected={filtre}
          onSelect={setFiltre}
        />
      </View>

      {isLoading ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <SkeletonListItem />
          <SkeletonListItem />
          <SkeletonListItem />
          <SkeletonListItem />
        </View>
      ) : (
        <FlatList
          data={leads}
          keyExtractor={item => String(item.id)}
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
              titre={t('ventes.home.noLeads')}
              soustitre={t('ventes.home.noLeadsSub')}
            />
          }
        />
      )}

      <FAB
        onPress={() => navigation.navigate('LeadForm', {})}
        accessibilityLabel={t('ventes.leadsList.fabLabel')}
      />
    </SafeAreaView>
  );
};