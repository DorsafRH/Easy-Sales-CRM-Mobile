/**
 * @file ProduitDetailScreen.tsx
 * @description Fiche produit complète avec :
 *              - Icône auto selon catégorie + code produit
 *              - Prix HT / TVA / TTC
 *              - Badge statut + type
 *              - Stock disponible (si STOCKABLE)
 *              - Bouton "Modifier"
 *              - Bouton "Ajouter au devis" (placeholder Sprint 3)
 *              - Bouton "Archiver"
 * @author Riahi Dorsaf
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView }              from 'react-native-safe-area-context';
import { useNavigation, useRoute,
         RouteProp }                 from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, Feather }         from '@expo/vector-icons';

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

const formatPrix = (value?: number | null): string => {
  if (value == null) return '—';
  return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 3 })} TND`;
};

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Fiche produit complète.
 * @author Riahi Dorsaf
 */
export const ProduitDetailScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { produitId } = route.params;

  const [produit,   setProduit]   = useState<ProduitResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // ── Archiver ─────────────────────────────────────────────
  const handleArchiver = () => {
    Alert.alert(
      'Archiver le produit',
      "Ce produit n'apparaîtra plus dans les listes actives.",
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Archiver',
          style: 'destructive',
          onPress: async () => {
            await CatalogueApi.archiverProduit(produitId);
            navigation.goBack();
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!produit) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerFlex} />
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('ProduitForm', { produit })}
        >
          <Feather name="edit-2" size={18} color={theme.colors.textPrimary} />
        </TouchableOpacity>
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
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.heroNom}>{produit.nom}</Text>
          <Text style={styles.heroCode}>{produit.codeProduit}</Text>
          <View style={styles.badgesRow}>
            <Badge
              label={produit.type === 'SERVICE' ? 'Service' : 'Stockable'}
              variant="primary"
            />
            <Badge
              label={produit.statut}
              variant={variantFromValue(produit.statut)}
              withDot
            />
          </View>
        </View>

        {/* ── Prix ── */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Prix HT</Text>
              <Text style={styles.rowValueCA}>{formatPrix(produit.prixHT)}</Text>
            </View>
            {produit.tauxTVA != null && (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>TVA</Text>
                <Text style={styles.rowValue}>{produit.tauxTVA}%</Text>
              </View>
            )}
            {produit.prixTTC != null && (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Prix TTC</Text>
                <Text style={styles.rowValue}>{formatPrix(produit.prixTTC)}</Text>
              </View>
            )}
            {produit.unite && (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Unité</Text>
                <Text style={styles.rowValue}>{produit.unite}</Text>
              </View>
            )}
            {produit.type === 'STOCKABLE' && (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Stock</Text>
                <Text style={styles.rowValue}>
                  {produit.stockDisponible ?? 0} unité(s)
                </Text>
              </View>
            )}
            {produit.categorieNom && (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Catégorie</Text>
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
          <Button
            label="Ajouter au devis"
            onPress={() => {
              Alert.alert('Sprint 3', 'Cette fonctionnalité sera disponible en Sprint 3.');
            }}
            variant="primary"
            fullWidth
            size="lg"
          />

          {produit.statut !== 'ARCHIVE' && (
            <TouchableOpacity style={styles.archiveBtn} onPress={handleArchiver}>
              <Text style={styles.archiveBtnText}>Archiver ce produit</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};