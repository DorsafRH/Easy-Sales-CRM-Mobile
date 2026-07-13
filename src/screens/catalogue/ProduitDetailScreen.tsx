/**
 * @file ProduitDetailScreen.tsx
 * @description Fiche produit complète avec :
 *              - Icône auto selon catégorie + code produit
 *              - Prix HT / TVA / TTC + badge statut + type
 *              - Stock disponible (si STOCKABLE)
 *              - Bouton "Modifier"
 *              - Toggle Actif/Inactif directement depuis la fiche (Bug 7)
 *              - Bouton "Ajouter au devis" (placeholder Sprint 3)
 *              - Bouton "Archiver" (si statut ≠ ARCHIVE)
 *              - Bouton "Désarchiver" (si statut = ARCHIVE) → statut INACTIF (Bug 6)
 * @author Riahi Dorsaf
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView }              from 'react-native-safe-area-context';
import { useNavigation, useRoute,
         RouteProp }                 from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, Feather }         from '@expo/vector-icons';
import { useTranslation }            from 'react-i18next';

import { useStyles, useTheme }     from '../../theme';
import { makeStyles }              from './ProduitDetailScreen.styles';
import { Badge, variantFromValue } from '../../components/ui/Badge';
import { Button }                  from '../../components/ui/Button';
import { CatalogueStackParamList } from '../../navigation/CatalogueStack';

import * as CatalogueApi from '../../api/catalogue.api';
import {
  ProduitResponse,
  CATEGORIE_ICONE_MAP,
  CATEGORIE_ICONE_DEFAULT,
} from '../../types/catalogue.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<CatalogueStackParamList, 'ProduitDetail'>;
type Route = RouteProp<CatalogueStackParamList, 'ProduitDetail'>;

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

const makeFormatPrix = (locale: string) => (value?: number | null): string => {
  if (value == null) return '—';
  return `${value.toLocaleString(locale, { maximumFractionDigits: 3 })} TND`;
};

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Fiche produit complète avec toggle statut et gestion archivage.
 * @author Riahi Dorsaf
 */
export const ProduitDetailScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const { t, i18n } = useTranslation();
  const locale      = i18n.language === 'en' ? 'en-US' : 'fr-FR';
  const formatPrix  = makeFormatPrix(locale);
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { produitId } = route.params;

  const [produit,     setProduit]     = useState<ProduitResponse | null>(null);
  const [isLoading,   setIsLoading]   = useState(true);
  const [isToggling,  setIsToggling]  = useState(false);

  // ── Chargement ────────────────────────────────────────────
  const charger = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await CatalogueApi.obtenirProduit(produitId);
      if (response.success) setProduit(response.data);
    } catch {
      // silencieux
    } finally {
      setIsLoading(false);
    }
  }, [produitId]);

  useEffect(() => { charger(); }, [charger]);

  // ── Toggle Actif / Inactif ────────────────────────────────
  /**
   * Bascule le statut du produit entre ACTIF et INACTIF.
   * Utilise 2 endpoints séparés : PATCH /activer et PATCH /desactiver.
   * Bonne pratique REST : un endpoint = une responsabilité.
   */
  const handleToggleStatut = async (nouvelleValeur: boolean) => {
    setIsToggling(true);
    try {
      if (nouvelleValeur) {
        // Switch ON → activer
        await CatalogueApi.activerProduit(produitId);
        setProduit(p => p ? { ...p, statut: 'ACTIF' } : p);
      } else {
        // Switch OFF → désactiver
        await CatalogueApi.desactiverProduit(produitId);
        setProduit(p => p ? { ...p, statut: 'INACTIF' } : p);
      }
    } catch (err: any) {
      Alert.alert(
        t('ventes.leadDetail.error'),
        err?.response?.data?.message ?? t('ventes.leadDetail.loseError'),
      );
      // Rechargement pour resynchroniser avec le backend
      await charger();
    } finally {
      setIsToggling(false);
    }
  };

  // ── Archiver ─────────────────────────────────────────────
  const handleArchiver = () => {
    Alert.alert(
      t('catalogue.detail.archiveTitle'),
      t('catalogue.detail.archiveMsg', { nom: produit?.nom }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text:  t('catalogue.detail.archive'),
          style: 'destructive',
          onPress: async () => {
            try {
              await CatalogueApi.archiverProduit(produitId);
              navigation.goBack();
            } catch {
              Alert.alert(t('ventes.leadDetail.error'), t('catalogue.detail.cannotArchive'));
            }
          },
        },
      ],
    );
  };

  // ── Désarchiver ───────────────────────────────────────────
  const handleDesarchiver = () => {
    Alert.alert(
      t('catalogue.detail.unarchiveTitle'),
      t('catalogue.detail.unarchiveMsg', { nom: produit?.nom }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('catalogue.detail.unarchive'),
          onPress: async () => {
            try {
              await CatalogueApi.desarchiverProduit(produitId);
              navigation.goBack();
            } catch {
              Alert.alert(t('ventes.leadDetail.error'), t('catalogue.detail.cannotUnarchive'));
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!produit) return null;

  const estArchive = produit.statut === 'ARCHIVE';
  const estActif   = produit.statut === 'ACTIF';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerFlex} />
        {/* Bouton modifier masqué si produit archivé */}
        {!estArchive && (
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('ProduitForm', { produit })}
          >
            <Feather name="edit-2" size={18} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons
              name={iconeCategorie(produit.categorieNom) as any}
              size={40}
              color={estArchive ? theme.colors.textTertiary : theme.colors.primary}
            />
          </View>
          <Text style={styles.heroNom}>{produit.nom}</Text>
          <Text style={styles.heroCode}>{produit.codeProduit}</Text>
          <View style={styles.badgesRow}>
            <Badge
              label={produit.type === 'SERVICE' ? t('catalogue.service') : t('catalogue.stockable')}
              variant="primary"
            />
            <Badge
              label={produit.statut}
              variant={variantFromValue(produit.statut)}
              withDot
            />
            {produit.enAlerte && (
              <Badge label={t('catalogue.stockLow')} variant="warning" withDot />
            )}
          </View>
        </View>

        {/* ── Prix ── */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t('catalogue.detail.price')}</Text>
              <Text style={styles.rowValueCA}>{formatPrix(produit.prixHT)}</Text>
            </View>
            {produit.tauxTVA != null && (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{t('ventes.devis.vat')}</Text>
                <Text style={styles.rowValue}>{produit.tauxTVA}%</Text>
              </View>
            )}
            {produit.prixTTC != null && (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{t('ventes.devis.totalTtc')}</Text>
                <Text style={styles.rowValue}>{formatPrix(produit.prixTTC)}</Text>
              </View>
            )}
            {produit.unite && (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{t('catalogue.form.unitLabel')}</Text>
                <Text style={styles.rowValue}>{produit.unite}</Text>
              </View>
            )}
            {produit.type === 'STOCKABLE' && (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{t('catalogue.detail.stock')}</Text>
                <Text style={styles.rowValue}>
                  {produit.stockDisponible ?? 0}
                </Text>
              </View>
            )}
            {produit.type === 'STOCKABLE' && (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{t('catalogue.detail.minStock')}</Text>
                <Text style={[
                  styles.rowValue,
                  produit.enAlerte && { color: theme.colors.warning },
                ]}>
                  {produit.stockMinimum ?? '—'}
                </Text>
              </View>
            )}
            {produit.categorieNom && (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{t('catalogue.detail.category')}</Text>
                <Text style={styles.rowValue}>{produit.categorieNom}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Description ── */}
        {produit.description && (
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.description}>{produit.description}</Text>
            </View>
          </View>
        )}

        {/* ── Actions ── */}
        <View style={styles.actions}>

          {/* Toggle Actif/Inactif — visible uniquement si non archivé */}
          {!estArchive && (
            <View style={styles.toggleCard}>
              <View style={styles.toggleLeft}>
                <Text style={styles.toggleLabel}>
                  {estActif ? t('catalogue.tabActive').slice(0,-1) : t('catalogue.tabInactive').slice(0,-1)}
                </Text>
                <Text style={styles.toggleSub}>
                  {estActif
                    ? t('catalogue.emptyActiveSub').split(' avec')[0]
                    : t('catalogue.emptyOther')}
                </Text>
              </View>
              <Switch
                value={estActif}
                onValueChange={handleToggleStatut}
                disabled={isToggling}
                trackColor={{
                  true:  theme.colors.primary,
                  false: theme.colors.border,
                }}
                thumbColor={theme.colors.white}
              />
            </View>
          )}

          {/* Bouton Ajouter au devis — masqué si archivé */}
          {!estArchive && (
            <Button
              label={t('ventes.opport.createQuote')}
              onPress={() => {
                Alert.alert('Sprint 3', 'Cette fonctionnalité sera disponible en Sprint 3.');
              }}
              variant="primary"
              fullWidth
              size="lg"
            />
          )}

          {/* Bouton Archiver — visible si non archivé */}
          {!estArchive && (
            <TouchableOpacity style={styles.archiveBtn} onPress={handleArchiver}>
              <Text style={styles.archiveBtnText}>{t('catalogue.detail.archive')}</Text>
            </TouchableOpacity>
          )}

          {/* Bouton Désarchiver — visible uniquement si archivé */}
          {estArchive && (
            <TouchableOpacity style={styles.desarchiveBtn} onPress={handleDesarchiver}>
              <Ionicons name="archive-outline" size={18} color={theme.colors.success} />
              <Text style={styles.desarchiveBtnText}>{t('catalogue.detail.unarchive')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};