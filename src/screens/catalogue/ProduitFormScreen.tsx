/**
 * @file ProduitFormScreen.tsx
 * @description Formulaire de création et modification d'un produit.
 *
 *              FONCTIONNALITÉS :
 *              - Sélecteur type (SERVICE / STOCKABLE) avec icône + description
 *              - Champs dynamiques : stockDisponible visible uniquement si STOCKABLE
 *              - Picker catégorie (Modal bottom sheet) avec option "Créer une catégorie"
 *              - Sélection automatique de la nouvelle catégorie au retour de CategorieForm
 *              - Sélecteur statut (ACTIF / INACTIF)
 *              - Validation : nom obligatoire, prixHT obligatoire > 0
 *
 * @author Riahi Dorsaf
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView }              from 'react-native-safe-area-context';
import { useNavigation, useRoute,
         RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons }                  from '@expo/vector-icons';

import { useStyles, useTheme }     from '../../theme';
import { makeStyles }              from './ProduitFormScreen.styles';
import { Input }                   from '../../components/ui/Input';
import { Button }                  from '../../components/ui/Button';
import { CatalogueStackParamList } from '../../navigation/CatalogueStack';

import * as CatalogueApi from '../../api/catalogue.api';
import {
  ProduitFormState,
  INITIAL_PRODUIT_FORM,
  TypeProduit,
  StatutProduit,
  ProduitRequest,
  CategorieResponse,
} from '../../types/catalogue.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav    = NativeStackNavigationProp<CatalogueStackParamList, 'ProduitForm'>;
type Route  = RouteProp<CatalogueStackParamList, 'ProduitForm'>;
type Errors = Partial<Record<keyof ProduitFormState | 'prixHTNum', string>>;

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Formulaire produit (création et modification).
 * @author Riahi Dorsaf
 */
export const ProduitFormScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { produit } = route.params ?? {};

  const isEditing = !!produit;

  // ── État formulaire ───────────────────────────────────────
  const [form, setForm] = useState<ProduitFormState>(() => {
    if (produit) {
      return {
        nom:             produit.nom,
        description:     produit.description ?? '',
        type:            produit.type,
        prixHT:          String(produit.prixHT),
        tauxTVA:         produit.tauxTVA != null ? String(produit.tauxTVA) : '19',
        unite:           produit.unite ?? '',
        stockDisponible: produit.stockDisponible != null
          ? String(produit.stockDisponible) : '0',
        categorieId:     produit.categorieId ?? null,
        statut:          produit.statut,
      };
    }
    return INITIAL_PRODUIT_FORM;
  });

  const [errors,       setErrors]       = useState<Errors>({});
  const [apiError,     setApiError]     = useState<string | null>(null);
  const [isSaving,     setIsSaving]     = useState(false);
  const [categories,   setCategories]   = useState<CategorieResponse[]>([]);
  const [showCatModal, setShowCatModal] = useState(false);

  /**
   * Référence aux IDs connus avant de naviguer vers CategorieFormScreen.
   * Permet de détecter la nouvelle catégorie créée au retour
   * et de la sélectionner automatiquement.
   */
  const idsAvantNavigation = useRef<Set<number>>(new Set());

  // ── Chargement catégories ─────────────────────────────────
  const chargerCategories = useCallback(async () => {
    try {
      const res = await CatalogueApi.listerCategories();
      if (res.success) setCategories(res.data);
    } catch {
      // silencieux
    }
  }, []);

  useEffect(() => { chargerCategories(); }, [chargerCategories]);

  /**
   * Au retour de CategorieFormScreen, recharge les catégories
   * et sélectionne automatiquement celle qui vient d'être créée.
   *
   * LOGIQUE DE DÉTECTION :
   * On compare les IDs actuels avec ceux mémorisés avant la navigation.
   * La différence = la nouvelle catégorie créée.
   */
  useFocusEffect(
    useCallback(() => {
      // Ne rien faire au premier montage, seulement au retour de navigation
      if (idsAvantNavigation.current.size === 0) return;

      const detecterNouvelleCategorie = async () => {
        try {
          const res = await CatalogueApi.listerCategories();
          if (!res.success) return;

          setCategories(res.data);

          // Trouve la catégorie dont l'ID n'était pas dans la liste avant
          const nouvelleCategorie = res.data.find(
            c => !idsAvantNavigation.current.has(c.id),
          );

          if (nouvelleCategorie) {
            // Sélectionne automatiquement la nouvelle catégorie
            setForm(f => ({ ...f, categorieId: nouvelleCategorie.id }));
          }
        } catch {
          // silencieux
        } finally {
          // Réinitialise la référence pour le prochain cycle
          idsAvantNavigation.current = new Set();
        }
      };

      detecterNouvelleCategorie();
    }, []),
  );

  // ── Update champ ──────────────────────────────────────────
  const setField = <K extends keyof ProduitFormState>(key: K) =>
    (value: ProduitFormState[K]) => {
      setForm(f => ({ ...f, [key]: value }));
      setErrors(e => ({ ...e, [key]: undefined, prixHTNum: undefined }));
      setApiError(null);
    };

  const catSelectionnee = categories.find(c => c.id === form.categorieId);

  // ── Navigation vers CategorieFormScreen ───────────────────
  const handleCreerCategorie = () => {
    // Mémorise les IDs actuels avant de naviguer
    idsAvantNavigation.current = new Set(categories.map(c => c.id));
    setShowCatModal(false);
    navigation.navigate('CategorieForm', {});
  };

  // ── Validation ────────────────────────────────────────────
  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.nom.trim()) e.nom = 'Le nom est obligatoire.';
    const prixNum = parseFloat(form.prixHT.replace(',', '.'));
    if (!form.prixHT.trim() || isNaN(prixNum) || prixNum <= 0) {
      e.prixHTNum = 'Entrez un prix HT valide (> 0).';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Soumission ────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSaving(true);
    setApiError(null);
    try {
      const prixHT  = parseFloat(form.prixHT.replace(',', '.'));
      const tauxTVA = form.tauxTVA.trim() ? parseFloat(form.tauxTVA) : undefined;
      const stock   = form.type === 'STOCKABLE' && form.stockDisponible.trim()
        ? parseInt(form.stockDisponible, 10) : undefined;

      const request: ProduitRequest = {
        nom:             form.nom.trim(),
        description:     form.description.trim() || undefined,
        type:            form.type,
        prixHT,
        tauxTVA,
        unite:           form.unite.trim() || undefined,
        stockDisponible: stock,
        categorieId:     form.categorieId ?? undefined,
        statut:          form.statut,
      };

      if (isEditing) {
        await CatalogueApi.modifierProduit(produit!.id, request);
      } else {
        await CatalogueApi.creerProduit(request);
      }
      navigation.goBack();
    } catch (err: any) {
      setApiError(
        err?.response?.data?.message ?? 'Une erreur est survenue. Veuillez réessayer.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Sélecteur type ── */}
          <View style={styles.typeRow}>
            {(['SERVICE', 'STOCKABLE'] as TypeProduit[]).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.typeBtn, form.type === t && styles.typeBtnActive]}
                onPress={() => setField('type')(t)}
              >
                <Ionicons
                  name={t === 'SERVICE' ? 'settings-outline' : 'cube-outline'}
                  size={20}
                  color={form.type === t ? theme.colors.primary : theme.colors.textSecondary}
                />
                <Text style={[
                  styles.typeBtnText,
                  form.type === t && styles.typeBtnTextActive,
                ]}>
                  {t === 'SERVICE' ? 'Service' : 'Stockable'}
                </Text>
                <Text style={[
                  styles.typeBtnSub,
                  form.type === t && styles.typeBtnSubActive,
                ]}>
                  {t === 'SERVICE' ? 'Immatériel' : 'Avec stock'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Erreur API ── */}
          {apiError && (
            <View style={styles.alertError}>
              <Text style={styles.alertErrorText}>⚠️ {apiError}</Text>
            </View>
          )}

          {/* ── Informations générales ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informations générales</Text>

            <Input
              label="Nom du produit"
              placeholder="Ex : Consultation initiale"
              value={form.nom}
              onChangeText={setField('nom')}
              error={errors.nom}
              required
              autoCapitalize="sentences"
            />
            <Input
              label="Description"
              placeholder="Description optionnelle…"
              value={form.description}
              onChangeText={setField('description')}
              multiline
              numberOfLines={3}
            />

            {/* Picker catégorie */}
            <TouchableOpacity
              style={styles.categorieSelector}
              onPress={() => setShowCatModal(true)}
            >
              <Text style={[
                styles.categorieLabel,
                catSelectionnee && styles.categorieLabelSelected,
              ]}>
                {catSelectionnee
                  ? catSelectionnee.nom
                  : 'Sélectionner une catégorie…'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* ── Prix & TVA ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Tarification</Text>

            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Input
                  label="Prix HT (TND)"
                  placeholder="0.000"
                  value={form.prixHT}
                  onChangeText={setField('prixHT')}
                  error={errors.prixHTNum}
                  required
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.rowItem}>
                <Input
                  label="TVA (%)"
                  placeholder="19"
                  value={form.tauxTVA}
                  onChangeText={setField('tauxTVA')}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <Input
              label="Unité"
              placeholder="Ex : heure, jour, pièce"
              value={form.unite}
              onChangeText={setField('unite')}
            />
          </View>

          {/* ── Stock (STOCKABLE uniquement) ── */}
          {form.type === 'STOCKABLE' && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Stock</Text>
              <Input
                label="Quantité disponible"
                placeholder="0"
                value={form.stockDisponible}
                onChangeText={setField('stockDisponible')}
                keyboardType="number-pad"
              />
            </View>
          )}

          {/* ── Statut ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Statut</Text>
            <View style={styles.statutRow}>
              {(['ACTIF', 'INACTIF'] as StatutProduit[]).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.statutBtn, form.statut === s && styles.statutBtnActive]}
                  onPress={() => setField('statut')(s)}
                >
                  <Text style={[
                    styles.statutBtnText,
                    form.statut === s && styles.statutBtnTextActive,
                  ]}>
                    {s === 'ACTIF' ? 'Actif' : 'Inactif'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── Bouton submit ── */}
          <Button
            label={isEditing ? 'Enregistrer les modifications' : 'Créer le produit'}
            onPress={handleSubmit}
            loading={isSaving}
            fullWidth
            size="lg"
            style={styles.btnSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Modal picker catégorie ── */}
      <Modal
        visible={showCatModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCatModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCatModal(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Choisir une catégorie</Text>

            <FlatList
              data={[
                {
                  id: null,
                  nom: 'Aucune catégorie',
                  nbProduits: 0,
                  description: null,
                  dateCreation: '',
                } as any,
                ...categories,
              ]}
              keyExtractor={(item) => String(item.id ?? 'none')}
              renderItem={({ item }) => {
                const isSelected =
                  item.id === form.categorieId ||
                  (item.id === null && form.categorieId === null);
                return (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setField('categorieId')(item.id ?? null);
                      setShowCatModal(false);
                    }}
                  >
                    <Text style={[
                      styles.modalItemText,
                      isSelected && styles.modalItemTextSelected,
                    ]}>
                      {item.nom}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={theme.colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}

              // ── Bouton créer une catégorie en bas de la liste ──
              ListFooterComponent={
                <TouchableOpacity
                  style={styles.modalCreateBtn}
                  onPress={handleCreerCategorie}
                >
                  <View style={styles.modalCreateBtnIconWrapper}>
                    <Ionicons name="add" size={20} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.modalCreateBtnText}>
                    Créer une nouvelle catégorie
                  </Text>
                </TouchableOpacity>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};