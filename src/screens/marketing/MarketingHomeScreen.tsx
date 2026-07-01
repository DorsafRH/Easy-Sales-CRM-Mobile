/**
 * @file MarketingHomeScreen.tsx
 * @description Écran principal du module Marketing — 4 onglets internes :
 *              Dashboard, Publications, Calendrier, Réseaux.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

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

const ONGLETS: Array<{ key: Onglet; label: string; icon: string }> = [
  { key: 'dashboard',    label: 'Dashboard',    icon: 'stats-chart-outline' },
  { key: 'publications', label: 'Publications', icon: 'newspaper-outline'   },
  { key: 'calendrier',   label: 'Calendrier',   icon: 'calendar-outline'    },
  { key: 'reseaux',      label: 'Réseaux',      icon: 'share-social-outline' },
];

/**
 * Écran d'accueil Marketing avec navigation par onglets.
 * @author Riahi Dorsaf
 */
export const MarketingHomeScreen: React.FC = () => {
  const styles = useStyles(makeStyles);
  const theme = useTheme();
  const navigation = useNavigation<Nav>();

  const [publications, setPublications] = useState<PublicationMarketing[]>([]);
  const [onglet, setOnglet] = useState<Onglet>('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const renderPublications = () => (
    <FlatList
      data={publications}
      keyExtractor={item => String(item.id)}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl()}
      ListEmptyComponent={
        <EmptyState icon="newspaper-outline" titre="Aucune publication"
          soustitre="Appuyez sur + pour en créer une" />
      }
    />
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
        <Text style={styles.headerTitle}>Marketing Hub</Text>
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
