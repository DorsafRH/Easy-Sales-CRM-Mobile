/**
 * @file MarketingHomeScreen.tsx
 * @description Écran principal du module Marketing — 4 onglets internes :
 *              Dashboard, Publications, Calendrier, Réseaux.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, RefreshControl, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './MarketingHomeScreen.styles';
import { Badge } from '../../components/ui/Badge';
import { FAB } from '../../components/ui/FAB';
import { EmptyState } from '../../components/ui/EmptyState';
import { CalendrierScreen } from './CalendrierScreen';
import { ReseauxScreen } from './ReseauxScreen';
import { MarketingDashboard } from './MarketingDashboard';
import { MarketingStackParamList } from '../../navigation/MarketingStack';

import * as MarketingApi from '../../api/marketing.api';
import {
  PublicationMarketing,
  STATUT_PUBLICATION_CONFIG,
} from '../../types/marketing.types';

type Nav = NativeStackNavigationProp<MarketingStackParamList, 'MarketingHome'>;
type Onglet = 'dashboard' | 'publications' | 'calendrier' | 'reseaux';
type FiltreStatut = 'TOUS' | 'PUBLIEE' | 'PROGRAMMEE' | 'BROUILLON';

const PAGE_SIZE = 8;
// FILTRES et ONGLETS construits dans le composant (labels traduits via tr())

/**
 * Écran d'accueil Marketing avec navigation par onglets.
 * @author Riahi Dorsaf
 */
export const MarketingHomeScreen: React.FC = () => {
  const styles = useStyles(makeStyles);
  const theme = useTheme();
  const { t: tr } = useTranslation();

  const FILTRES: Array<{ key: FiltreStatut; label: string }> = [
    { key: 'TOUS',       label: tr('marketing.home.filterAll')       },
    { key: 'PUBLIEE',    label: tr('marketing.home.filterPublished') },
    { key: 'PROGRAMMEE', label: tr('marketing.home.filterScheduled') },
    { key: 'BROUILLON',  label: tr('marketing.home.filterDraft')    },
  ];

  const ONGLETS: Array<{ key: Onglet; label: string; icon: string }> = [
    { key: 'dashboard',    label: tr('marketing.home.tabDashboard'),    icon: 'stats-chart-outline'  },
    { key: 'publications', label: tr('marketing.home.tabPublications'), icon: 'newspaper-outline'    },
    { key: 'calendrier',   label: tr('marketing.home.tabCalendar'),     icon: 'calendar-outline'     },
    { key: 'reseaux',      label: tr('marketing.home.tabNetworks'),     icon: 'share-social-outline' },
  ]; // « tr » pour éviter le conflit avec le param t de majRecherche
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<MarketingStackParamList, 'MarketingHome'>>();

  const [publications, setPublications] = useState<PublicationMarketing[]>([]);
  const [onglet, setOnglet] = useState<Onglet>(route.params?.onglet ?? 'dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filtreStatut, setFiltreStatut] = useState<FiltreStatut>('TOUS');
  const [recherche, setRecherche] = useState('');
  const [page, setPage] = useState(1);

  const majFiltre = (f: FiltreStatut) => { setFiltreStatut(f); setPage(1); };
  const majRecherche = (t: string) => { setRecherche(t); setPage(1); };

  const charger = useCallback(async () => {
    try {
      const res = await MarketingApi.listerPublications();
      if (res.success) setPublications(res.data);
    } catch {
      // silencieux
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // Ouvre l'onglet demandé depuis un autre écran (ex. menu Plus), même si
  // l'écran Marketing était déjà monté.
  useEffect(() => {
    if (route.params?.onglet) setOnglet(route.params.onglet);
  }, [route.params?.onglet]);

  const ouvrir = (id: number) =>
    navigation.navigate('PublicationDetail', { publicationId: id });

  const renderTabs = () => (
    <View style={styles.tabs}>
      {ONGLETS.map(tab => {
        const actif = tab.key === onglet;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, actif && styles.tabActif]}
            onPress={() => setOnglet(tab.key)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={tab.icon as any}
              size={18}
              color={actif ? theme.colors.primary : theme.colors.textTertiary}
            />
            <Text style={[styles.tabLabel, actif && styles.tabLabelActif]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderItem = ({ item }: { item: PublicationMarketing }) => {
    const conf = STATUT_PUBLICATION_CONFIG[item.statut];
    return (
      <TouchableOpacity style={styles.pubItem} onPress={() => ouvrir(item.id)} activeOpacity={0.75}>
        <View style={styles.pubRow}>
          <Text style={styles.pubTitre} numberOfLines={1}>{item.titre}</Text>
          <Badge label={conf.label} variant="neutral" />
        </View>
        <Text style={styles.pubMeta} numberOfLines={2}>
          {item.texte ?? 'Aucun texte'}
        </Text>
      </TouchableOpacity>
    );
  };

  const compter = (statut: string) =>
    publications.filter(p => p.statut === statut).length;

  const statCol = (icon: string, value: number, label: string, color: string) => (
    <View style={styles.statCol}>
      <Ionicons name={icon as any} size={18} color={color} />
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLbl}>{label}</Text>
    </View>
  );

  const renderStatsPublications = () => (
    <View style={styles.statsCard}>
      {statCol('checkmark-done-outline', compter('PUBLIEE'), 'Publiées',
        STATUT_PUBLICATION_CONFIG.PUBLIEE.color)}
      <View style={styles.statDivider} />
      {statCol('time-outline', compter('PROGRAMMEE'), 'Programmées',
        STATUT_PUBLICATION_CONFIG.PROGRAMMEE.color)}
      <View style={styles.statDivider} />
      {statCol('create-outline', compter('BROUILLON'), 'Brouillons',
        STATUT_PUBLICATION_CONFIG.BROUILLON.color)}
    </View>
  );

  const term = recherche.trim().toLowerCase();
  const publicationsFiltrees = publications.filter(p => {
    if (filtreStatut !== 'TOUS' && p.statut !== filtreStatut) return false;
    if (!term) return true;
    return `${p.titre ?? ''} ${p.texte ?? ''}`.toLowerCase().includes(term);
  });
  const publicationsAffichees = publicationsFiltrees.slice(0, page * PAGE_SIZE);
  const filtreActif = filtreStatut !== 'TOUS' || term.length > 0;

  const chargerPlus = () => {
    if (publicationsAffichees.length < publicationsFiltrees.length) {
      setPage(p => p + 1);
    }
  };

  const renderRecherche = () => (
    <>
      <View style={styles.filterRow}>
        {FILTRES.map(f => {
          const actif = filtreStatut === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, actif && styles.filterChipActif]}
              onPress={() => majFiltre(f.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterChipText, actif && styles.filterChipTextActif]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color={theme.colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par titre, mot ou #hashtag"
          placeholderTextColor={theme.colors.textTertiary}
          value={recherche}
          onChangeText={majRecherche}
          autoCapitalize="none"
        />
        {recherche.length > 0 && (
          <TouchableOpacity onPress={() => majRecherche('')} hitSlop={8}>
            <Ionicons name="close-circle" size={16} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  const renderPublications = () => (
    <View style={styles.tabBody}>
      {renderRecherche()}
      <FlatList
        data={publicationsAffichees}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl()}
        ListHeaderComponent={renderStatsPublications()}
        onEndReached={chargerPlus}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          <EmptyState
            icon="newspaper-outline"
            titre={filtreActif ? 'Aucun résultat' : 'Aucune publication'}
            soustitre={filtreActif
              ? 'Modifiez la recherche ou le filtre'
              : 'Appuyez sur + pour en créer une'}
          />
        }
      />
    </View>
  );

  const refreshControl = () => (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={() => { setIsRefreshing(true); charger(); }}
      tintColor={theme.colors.primary}
    />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{tr('screens.marketingHome.title')}</Text>
        <Text style={styles.headerSub}>{tr('screens.marketingHome.subtitle')}</Text>
      </View>
      {renderTabs()}
      <View style={styles.body}>
        {onglet === 'dashboard' && <MarketingDashboard />}
        {onglet === 'publications' && renderPublications()}
        {onglet === 'calendrier' && (
          <CalendrierScreen publications={publications} onOpen={ouvrir} />
        )}
        {onglet === 'reseaux' && <ReseauxScreen />}
      </View>
      {onglet === 'publications' && (
        <FAB
          onPress={() => navigation.navigate('PublicationForm', {})}
          accessibilityLabel="Nouvelle publication"
        />
      )}
    </SafeAreaView>
  );
};
