/**
 * @file CatalogueScreen.tsx
 * @description Écran Catalogue avec :
 *              - Barre de recherche (debounce 400ms)
 *              - Filtres chips [Tous / Services / Stockables]
 *              - Onglets statut [Actif / Inactif / Archivé]
 *              - Section Catégories en grille 2 colonnes
 *              - Section Produits avec icône auto + prix + badge statut
 *              - Bannière informative sur les produits archivés
 *              - FAB → ProduitFormScreen (création)
 * @author Riahi Dorsaf
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView }              from 'react-native-safe-area-context';
import { useNavigation }             from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons }                  from '@expo/vector-icons';

import { useStyles, useTheme }     from '../../theme';
import { makeStyles }              from './CatalogueScreen.styles';
import { FAB }                     from '../../components/ui/FAB';
import { SearchBar }               from '../../components/ui/SearchBar';
import { FilterChips, FilterChip } from '../../components/ui/FilterChips';
import { Badge, variantFromValue } from '../../components/ui/Badge';
import { EmptyState }              from '../../components/ui/EmptyState';
import { useDebounce }             from '../../hooks/useDebounce';
import { CatalogueStackParamList } from '../../navigation/CatalogueStack';

import * as CatalogueApi from '../../api/catalogue.api';
import {
  CategorieResponse,
  ProduitResponse,
  TypeProduit,
  StatutProduit,
  CATEGORIE_ICONE_MAP,
  CATEGORIE_ICONE_DEFAULT,
} from '../../types/catalogue.types';

// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────

const TYPE_CHIPS: FilterChip[] = [
  { value: 'TOUS',      label: 'Tous'       },
  { value: 'SERVICE',   label: 'Services'   },
  { value: 'STOCKABLE', label: 'Stockables' },
];

type StatutOnglet = 'ACTIF' | 'INACTIF' | 'ARCHIVE';

const STATUT_ONGLETS: { value: StatutOnglet; label: string }[] = [
  { value: 'ACTIF',   label: 'Actifs'   },
  { value: 'INACTIF', label: 'Inactifs' },
  { value: 'ARCHIVE', label: 'Archivés' },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const iconeCategorie = (nom?: string | null): string => {
  if (!nom) return CATEGORIE_ICONE_DEFAULT;
  const lower = nom.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORIE_ICONE_MAP)) {
    if (lower.includes(key)) return icon;
  }
  return CATEGORIE_ICONE_DEFAULT;
};

const formatPrix = (prixHT: number, unite?: string | null): string => {
  const prix = prixHT.toLocaleString('fr-FR', { maximumFractionDigits: 3 });
  return `${prix} TND${unite ? `/${unite}` : ''}`;
};

const getStockBadge = (
  produit: ProduitResponse,
): { label: string; variant: 'danger' | 'warning' | 'success' } | null => {
  if (produit.type !== 'STOCKABLE') return null;
  if (produit.stockDisponible === 0)  return { label: 'Rupture',  variant: 'danger'  };
  if (produit.enAlerte)               return { label: 'Stock bas', variant: 'warning' };
  return { label: `${produit.stockDisponible} en stock`, variant: 'success' };
};

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Écran catalogue principal.
 * @author Riahi Dorsaf
 */
export const CatalogueScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<CatalogueStackParamList>>();

  const [categories,    setCategories]    = useState<CategorieResponse[]>([]);
  const [produits,      setProduits]      = useState<ProduitResponse[]>([]);
  const [searchText,    setSearchText]    = useState('');
  const [filtreType,    setFiltreType]    = useState('TOUS');
  const [filtreStatut,  setFiltreStatut]  = useState<StatutOnglet>('ACTIF');
  const [isLoading,     setIsLoading]     = useState(true);
  const [isRefreshing,  setIsRefreshing]  = useState(false);

  const debouncedSearch = useDebounce(searchText, 400);

  // ── Chargement ────────────────────────────────────────────
  const charger = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const type   = filtreType !== 'TOUS' ? filtreType as TypeProduit : undefined;
      const statut = filtreStatut as StatutProduit;

      const [catRes, prodRes] = await Promise.all([
        CatalogueApi.listerCategories(debouncedSearch || undefined),
        CatalogueApi.listerProduits(
          type, statut, undefined, debouncedSearch || undefined),
      ]);
      if (catRes.success)  setCategories(catRes.data);
      if (prodRes.success) setProduits(prodRes.data);
    } catch {
      // silencieux
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filtreType, filtreStatut, debouncedSearch]);

  useEffect(() => { charger(); }, [charger]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Catalogue</Text>
        </View>
        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Rechercher un produit…"
          />
        </View>
        <FilterChips
          chips={TYPE_CHIPS}
          selected={filtreType}
          onSelect={setFiltreType}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => charger(true)}
              tintColor={theme.colors.primary}
            />
          }
        >
          {/* ── Catégories ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Catégories ({categories.length})
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('CategorieForm', {})}
              >
                <Text style={styles.gererBtn}>+ Nouvelle</Text>
              </TouchableOpacity>
            </View>

            {categories.length === 0 ? (
              <EmptyState
                icon="folder-open-outline"
                titre="Aucune catégorie"
                soustitre="Créez votre première catégorie"
              />
            ) : (
              <View style={styles.categoriesGrid}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.categorieCard}
                    activeOpacity={0.75}
                    onPress={() =>
                      navigation.navigate('CategorieForm', { categorie: cat })
                    }
                  >
                    <View style={styles.categorieIconWrapper}>
                      <Ionicons
                        name={iconeCategorie(cat.nom) as any}
                        size={22}
                        color={theme.colors.primary}
                      />
                    </View>
                    <Text style={styles.categorieNom} numberOfLines={1}>
                      {cat.nom}
                    </Text>
                    <Text style={styles.categorieCount}>
                      {cat.nbProduits} produit{cat.nbProduits !== 1 ? 's' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* ── Produits ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Produits ({produits.length})
              </Text>
            </View>

            {/* Onglets Actif / Inactif / Archivé */}
            <View style={styles.statutTabs}>
              {STATUT_ONGLETS.map((onglet) => (
                <TouchableOpacity
                  key={onglet.value}
                  style={[
                    styles.statutTab,
                    filtreStatut === onglet.value && styles.statutTabActive,
                  ]}
                  onPress={() => setFiltreStatut(onglet.value)}
                >
                  <Text style={[
                    styles.statutTabText,
                    filtreStatut === onglet.value && styles.statutTabTextActive,
                  ]}>
                    {onglet.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Bannière informative pour les produits archivés */}
            {filtreStatut === 'ARCHIVE' && (
              <View style={styles.archiveBanner}>
                <Ionicons
                  name="archive-outline"
                  size={16}
                  color={theme.colors.warning}
                />
                <Text style={styles.archiveBannerText}>
                  Ces produits sont archivés. Ouvrez-en un pour le désarchiver.
                </Text>
              </View>
            )}

            {/* Liste produits */}
            {produits.length === 0 ? (
              <EmptyState
                icon={filtreStatut === 'ARCHIVE' ? 'archive-outline' : 'cube-outline'}
                titre={
                  filtreStatut === 'ARCHIVE'
                    ? 'Aucun produit archivé'
                    : filtreStatut === 'INACTIF'
                    ? 'Aucun produit inactif'
                    : 'Aucun produit actif'
                }
                soustitre={
                  filtreStatut === 'ACTIF'
                    ? 'Ajoutez votre premier produit avec le bouton +'
                    : 'Aucun produit dans cette catégorie'
                }
              />
            ) : (
              produits.map((produit) => {
                const stockBadge = getStockBadge(produit);
                return (
                  <TouchableOpacity
                    key={produit.id}
                    style={[
                      styles.produitItem,
                      produit.statut === 'ARCHIVE' && styles.produitItemArchive,
                    ]}
                    onPress={() =>
                      navigation.navigate('ProduitDetail', { produitId: produit.id })
                    }
                    activeOpacity={0.75}
                  >
                    <View style={styles.produitIconWrapper}>
                      <Ionicons
                        name={iconeCategorie(produit.categorieNom) as any}
                        size={22}
                        color={theme.colors.textSecondary}
                      />
                    </View>

                    <View style={styles.produitInfo}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 6, marginBottom: 2 }}>
                        <Text style={[styles.produitNom, { marginBottom: 0, flex: 1 }]} numberOfLines={1}>
                          {produit.nom}
                        </Text>
                        {stockBadge && (
                          <Badge label={stockBadge.label} variant={stockBadge.variant} />
                        )}
                      </View>
                      <Text style={styles.produitCategorie}>
                        {produit.categorieNom ??
                          (produit.type === 'SERVICE' ? 'Service' : 'Stockable')}
                      </Text>
                    </View>

                    <View style={styles.produitRight}>
                      <Text style={styles.produitPrix}>
                        {formatPrix(produit.prixHT, produit.unite)}
                      </Text>
                      <Badge
                        label={produit.statut}
                        variant={variantFromValue(produit.statut)}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      )}

      {/* FAB masqué sur l'onglet Archivés */}
      {filtreStatut !== 'ARCHIVE' && (
        <FAB
          onPress={() => navigation.navigate('ProduitForm', {})}
          accessibilityLabel="Ajouter un produit"
        />
      )}
    </SafeAreaView>
  );
};