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
  RefreshControl,
} from 'react-native';
import { SafeAreaView }              from 'react-native-safe-area-context';
import { useNavigation }             from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons }                  from '@expo/vector-icons';
import { useTranslation }            from 'react-i18next';

import { useStyles, useTheme }     from '../../theme';
import { makeStyles }              from './CatalogueScreen.styles';
import { SkeletonListItem }        from '../../components/ui/Skeleton';
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

type StatutOnglet = 'ACTIF' | 'INACTIF' | 'ARCHIVE';
// Chips et onglets construits dans le composant (traduits via t())

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

const makeFormatPrix = (locale: string) => (prixHT: number, unite?: string | null): string => {
  const prix = prixHT.toLocaleString(locale, { maximumFractionDigits: 3 });
  return `${prix} TND${unite ? `/${unite}` : ''}`;
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
  const { t, i18n } = useTranslation();
  const locale      = i18n.language === 'en' ? 'en-US' : 'fr-FR';
  const formatPrix  = makeFormatPrix(locale);
  const navigation = useNavigation<NativeStackNavigationProp<CatalogueStackParamList>>();

  const TYPE_CHIPS: FilterChip[] = [
    { value: 'TOUS',      label: t('catalogue.filterAll')       },
    { value: 'SERVICE',   label: t('catalogue.filterServices')  },
    { value: 'STOCKABLE', label: t('catalogue.filterStockable') },
  ];

  const STATUT_ONGLETS: { value: StatutOnglet; label: string }[] = [
    { value: 'ACTIF',   label: t('catalogue.tabActive')   },
    { value: 'INACTIF', label: t('catalogue.tabInactive') },
    { value: 'ARCHIVE', label: t('catalogue.tabArchived') },
  ];

  const getStockBadge = (
    produit: ProduitResponse,
  ): { label: string; variant: 'danger' | 'warning' | 'success' } | null => {
    if (produit.type !== 'STOCKABLE') return null;
    if (produit.stockDisponible === 0) return { label: t('catalogue.stockOut'), variant: 'danger' };
    if (produit.enAlerte)              return { label: t('catalogue.stockLow'), variant: 'warning' };
    return { label: t('catalogue.stockIn', { nb: produit.stockDisponible }), variant: 'success' };
  };

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
          <Text style={styles.headerTitle}>{t('catalogue.title')}</Text>
        </View>
        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder={t('catalogue.searchPlaceholder')}
          />
        </View>
        <FilterChips
          chips={TYPE_CHIPS}
          selected={filtreType}
          onSelect={setFiltreType}
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
                {t('catalogue.categoriesTitle', { nb: categories.length })}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('CategorieForm', {})}
              >
                <Text style={styles.gererBtn}>{t('catalogue.newCategory')}</Text>
              </TouchableOpacity>
            </View>

            {categories.length === 0 ? (
              <EmptyState
                icon="folder-open-outline"
                titre={t('catalogue.noCategory')}
                soustitre={t('catalogue.noCategorySub')}
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
                      {cat.nbProduits} {cat.nbProduits !== 1 ? t('catalogue.productPlural') : t('catalogue.productSingular')}
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
                {t('catalogue.productsTitle', { nb: produits.length })}
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
                  {t('catalogue.archiveBanner')}
                </Text>
              </View>
            )}

            {/* Liste produits */}
            {produits.length === 0 ? (
              <EmptyState
                icon={filtreStatut === 'ARCHIVE' ? 'archive-outline' : 'cube-outline'}
                titre={
                  filtreStatut === 'ARCHIVE'
                    ? t('catalogue.emptyArchived')
                    : filtreStatut === 'INACTIF'
                    ? t('catalogue.emptyInactive')
                    : t('catalogue.emptyActive')
                }
                soustitre={
                  filtreStatut === 'ACTIF'
                    ? t('catalogue.emptyActiveSub')
                    : t('catalogue.emptyOther')
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
                          (produit.type === 'SERVICE' ? t('catalogue.service') : t('catalogue.stockable'))}
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
          accessibilityLabel={t('catalogue.fabLabel')}
        />
      )}
    </SafeAreaView>
  );
};