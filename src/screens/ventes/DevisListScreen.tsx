/**
 * @file DevisListScreen.tsx
 * @description Liste des devis avec tabs statut et banniere de stats.
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

import { useStyles, useTheme } from '../../theme';
import { makeStyles }          from './DevisListScreen.styles';
import { SkeletonListItem }    from '../../components/ui/Skeleton';
import { Badge }               from '../../components/ui/Badge';
import { FAB }                 from '../../components/ui/FAB';
import { EmptyState }          from '../../components/ui/EmptyState';
import { FilterChips }         from '../../components/ui/FilterChips';
import { VentesStackParamList } from '../../navigation/VentesStack';

import * as VenteApi from '../../api/vente.api';
import {
  DevisResponse,
  StatutDevis,
  STATUT_DEVIS_CONFIG,
} from '../../types/vente.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav = NativeStackNavigationProp<VentesStackParamList, 'DevisList'>;

const FILTRE_CHIPS = [
  { value: 'TOUS',      label: 'Tous'       },
  { value: 'BROUILLON', label: 'Brouillon'  },
  { value: 'ENVOYE',    label: 'Envoyes'    },
  { value: 'ACCEPTE',   label: 'Acceptes'   },
  { value: 'REFUSE',    label: 'Refuses'    },
];

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Liste des devis avec filtres et statistiques.
 * @author Riahi Dorsaf
 */
export const DevisListScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();

  const [devis,        setDevis]        = useState<DevisResponse[]>([]);
  const [filtre,       setFiltre]       = useState('TOUS');
  const [isLoading,    setIsLoading]    = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Chargement ────────────────────────────────────────────

  const charger = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true); else setIsLoading(true);
    try {
      const res = await VenteApi.listerDevis();
      if (res.success) setDevis(res.data);
    } catch {
      // silencieux
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // ── Filtrage local ────────────────────────────────────────

  const devisFiltres = filtre === 'TOUS'
    ? devis
    : devis.filter(d => d.statut === filtre);

  // ── Stats ─────────────────────────────────────────────────

  const totalEnCours  = devis.filter(d => d.statut === 'ENVOYE').length;
  const totalAcceptes = devis.filter(d => d.statut === 'ACCEPTE').length;
  const caTotal       = devis
    .filter(d => d.statut === 'ACCEPTE')
    .reduce((acc, d) => acc + d.montantTtc, 0);

  // ── Rendu item ────────────────────────────────────────────

  const renderItem = ({ item }: { item: DevisResponse }) => {
    const conf = STATUT_DEVIS_CONFIG[item.statut];
    return (
      <TouchableOpacity
        style={styles.devisItem}
        onPress={() => navigation.navigate('DevisDetail', { devisId: item.id })}
        activeOpacity={0.75}
      >
        <View style={styles.devisInfo}>
          <Text style={styles.devisNumero}>{item.numero}</Text>
          <Text style={styles.devisClient}>{item.clientNom}</Text>
          <Text style={styles.devisDate}>{item.dateRelative}</Text>
        </View>
        <View style={styles.devisRight}>
          <Text style={styles.devisMontant}>
            {item.montantTtc.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} TND
          </Text>
          <Badge label={conf.label} variant="neutral" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Devis</Text>
        </View>
        <FilterChips chips={FILTRE_CHIPS} selected={filtre} onSelect={setFiltre} />
      </View>

      {/* ── Statistiques ── */}
      <View style={styles.statsBanner}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalEnCours}</Text>
          <Text style={styles.statLabel}>En cours</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalAcceptes}</Text>
          <Text style={styles.statLabel}>Acceptes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {caTotal.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
          </Text>
          <Text style={styles.statLabel}>CA TND</Text>
        </View>
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
          data={devisFiltres}
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
              icon="document-text-outline"
              titre="Aucun devis"
              soustitre="Creez votre premier devis depuis une opportunite"
            />
          }
        />
      )}

      <FAB
        onPress={() => navigation.navigate('DevisForm', {})}
        accessibilityLabel="Creer un devis"
      />
    </SafeAreaView>
  );
};