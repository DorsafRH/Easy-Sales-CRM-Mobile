/**
 * @file ProduitFormScreen.tsx
 * @description Formulaire de création / modification d'un produit.
 *              Adaptatif selon le type : SERVICE (sans stock) ou STOCKABLE (avec stock).
 *              Validation inline sur chaque champ.
 *              Picker d'unités prédéfinies avec option "Autre" libre.
 * @author Riahi Dorsaf
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Modal, FlatList, ActivityIndicator,
} from 'react-native';
import { SafeAreaView }                  from 'react-native-safe-area-context';
import { useNavigation, useRoute,
         RouteProp }                     from '@react-navigation/native';
import { NativeStackNavigationProp }     from '@react-navigation/native-stack';
import { Ionicons }                      from '@expo/vector-icons';

import { useStyles, useTheme }       from '../../theme';
import { makeStyles }                from './ProduitFormScreen.styles';
import { Input }                     from '../../components/ui/Input';
import { Button }                    from '../../components/ui/Button';
import { CatalogueStackParamList }   from '../../navigation/CatalogueStack';

import * as CatalogueApi from '../../api/catalogue.api';
import {
  CategorieResponse,
  ProduitFormState,
  INITIAL_PRODUIT_FORM,
  UNITES_SERVICE,
  UNITES_STOCKABLE,
} from '../../types/catalogue.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<CatalogueStackParamList, 'ProduitForm'>;
type Route = RouteProp<CatalogueStackParamList, 'ProduitForm'>;

/** Erreurs de validation par champ */
interface FormErrors {
  nom?:             string;
  prixHT?:          string;
  tauxTVA?:         string;
  stockDisponible?: string;
  stockMinimum?:    string;
}

// ─────────────────────────────────────────────────────────────
// HELPERS DE VALIDATION
// ─────────────────────────────────────────────────────────────

/**
 * Valide les champs communs SERVICE et STOCKABLE.
 * Retourne les erreurs détectées.
 */
const validerChampCommuns = (form: ProduitFormState): FormErrors => {
  const errors: FormErrors = {};
  if (!form.nom.trim()) {
    errors.nom = 'Le nom est obligatoire.';
  } else if (form.nom.trim().length < 2) {
    errors.nom = 'Le nom doit contenir au moins 2 caractères.';
  }
  if (!form.prixHT) {
    errors.prixHT = 'Le prix HT est obligatoire.';
  } else if (parseFloat(form.prixHT) < 0) {
    errors.prixHT = 'Le prix ne peut pas être négatif.';
  }
  if (form.tauxTVA) {
    const tva = parseFloat(form.tauxTVA);
    if (isNaN(tva) || tva < 0 || tva > 100) {
      errors.tauxTVA = 'La TVA doit être entre 0 et 100.';
    }
  }
  return errors;
};

/**
 * Valide les champs spécifiques au type STOCKABLE.
 * Retourne les erreurs détectées.
 */
const validerChampStock = (form: ProduitFormState): FormErrors => {
  const errors: FormErrors = {};
  const stock = parseInt(form.stockDisponible, 10);
  if (isNaN(stock) || stock < 0) {
    errors.stockDisponible = 'Le stock doit être un nombre positif ou nul.';
  }
  if (form.stockMinimum) {
    const min = parseInt(form.stockMinimum, 10);
    if (isNaN(min) || min < 0) {
      errors.stockMinimum = 'Le seuil doit être un nombre positif ou nul.';
    } else if (!isNaN(stock) && min > stock) {
      errors.stockMinimum = 'Le seuil ne peut pas dépasser le stock disponible.';
    }
  }
  return errors;
};

/**
 * Valide l'ensemble du formulaire.
 * Combine les erreurs communes et celles spécifiques au type.
 */
const valider = (form: ProduitFormState): FormErrors => {
  const erreurs = validerChampCommuns(form);
  if (form.type === 'STOCKABLE') {
    Object.assign(erreurs, validerChampStock(form));
  }
  return erreurs;
};

// ─────────────────────────────────────────────────────────────
// HELPERS DE CONSTRUCTION DE LA REQUÊTE
// ─────────────────────────────────────────────────────────────

/**
 * Détermine l'unité finale selon la sélection de l'utilisateur.
 * Si "Autre" est sélectionné, retourne la valeur libre saisie.
 */
const resolverUnite = (form: ProduitFormState): string | undefined => {
  if (!form.unite) return undefined;
  if (form.unite === 'Autre') {
    return form.uniteAutre.trim() || undefined;
  }
  return form.unite;
};

/**
 * Construit le body de la requête API depuis l'état du formulaire.
 */
const construireRequete = (form: ProduitFormState) => ({
  nom:             form.nom.trim(),
  description:     form.description.trim() || undefined,
  type:            form.type,
  prixHT:          parseFloat(form.prixHT),
  tauxTVA:         form.tauxTVA ? parseFloat(form.tauxTVA) : undefined,
  unite:           resolverUnite(form),
  stockDisponible: form.type === 'STOCKABLE'
    ? parseInt(form.stockDisponible || '0', 10)
    : undefined,
  stockMinimum:    form.type === 'STOCKABLE' && form.stockMinimum
    ? parseInt(form.stockMinimum, 10)
    : undefined,
  categorieId:     form.categorieId ?? undefined,
  statut:          form.statut,
});

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Formulaire de création / modification d'un produit.
 * Adaptatif : les champs stock n'apparaissent que pour STOCKABLE.
 */
export const ProduitFormScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();

  // ── Initialisation depuis les params (mode édition) ──────
  const produitExistant = route.params?.produit;
  const estEdition      = !!produitExistant;

  const [form, setForm] = useState<ProduitFormState>(() =>
    produitExistant ? {
      nom:             produitExistant.nom,
      description:     produitExistant.description ?? '',
      type:            produitExistant.type,
      prixHT:          String(produitExistant.prixHT),
      tauxTVA:         produitExistant.tauxTVA != null
        ? String(produitExistant.tauxTVA) : '19',
      unite:           produitExistant.unite ?? '',
      uniteAutre:      '',
      stockDisponible: produitExistant.stockDisponible != null
        ? String(produitExistant.stockDisponible) : '',
      stockMinimum:    produitExistant.stockMinimum != null
        ? String(produitExistant.stockMinimum) : '',
      categorieId:     produitExistant.categorieId ?? null,
      statut:          produitExistant.statut,
    } : { ...INITIAL_PRODUIT_FORM }
  );

  const [errors,       setErrors]       = useState<FormErrors>({});
  const [isSaving,     setIsSaving]     = useState(false);
  const [apiError,     setApiError]     = useState<string | null>(null);
  const [categories,   setCategories]   = useState<CategorieResponse[]>([]);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showUniteModal, setShowUniteModal] = useState(false);

  // ── Chargement des catégories ─────────────────────────────

  const chargerCategories = useCallback(async () => {
    try {
      const res = await CatalogueApi.listerCategories();
      if (res.success) setCategories(res.data);
    } catch {
      // silencieux
    }
  }, []);

  React.useEffect(() => { chargerCategories(); }, [chargerCategories]);

  // ── Mise à jour des champs ────────────────────────────────

  /** Met à jour un champ et efface l'erreur associée. */
  const setChamp = useCallback(<K extends keyof ProduitFormState>(
    key: K,
    value: ProduitFormState[K],
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  }, []);

  /** Bascule entre SERVICE et STOCKABLE. */
  const changerType = useCallback((type: 'SERVICE' | 'STOCKABLE') => {
    setForm(prev => ({
      ...prev,
      type,
      unite:           '',
      uniteAutre:      '',
      stockDisponible: '',
      stockMinimum:    '',
    }));
    setErrors({});
  }, []);

  // ── Soumission ────────────────────────────────────────────

  /** Valide puis soumet le formulaire. */
  const handleSoumettre = async () => {
    const erreurs = valider(form);
    if (Object.keys(erreurs).length > 0) {
      setErrors(erreurs);
      return;
    }
    setIsSaving(true);
    setApiError(null);
    try {
      await sauvegarder();
      navigation.goBack();
    } catch (err: any) {
      setApiError(err?.response?.data?.message ?? 'Une erreur est survenue.');
    } finally {
      setIsSaving(false);
    }
  };

  /** Appelle l'API de création ou de modification. */
  const sauvegarder = async () => {
    const requete = construireRequete(form);
    if (estEdition && produitExistant) {
      await CatalogueApi.modifierProduit(produitExistant.id, requete);
    } else {
      await CatalogueApi.creerProduit(requete);
    }
  };

  // ── Helpers de rendu ──────────────────────────────────────

  /** Nom de la catégorie sélectionnée pour affichage. */
  const nomCategorie = (): string => {
    if (!form.categorieId) return 'Sélectionner une catégorie…';
    return categories.find(c => c.id === form.categorieId)?.nom
      ?? 'Sélectionner une catégorie…';
  };

  /** Label d'unité pour affichage dans le sélecteur. */
  const labelUnite = (): string => {
    if (!form.unite) return 'Sélectionner une unité…';
    if (form.unite === 'Autre') {
      return form.uniteAutre || 'Unité personnalisée…';
    }
    return form.unite;
  };

  /** Liste des unités selon le type sélectionné. */
  const listeUnites = (): string[] =>
    form.type === 'SERVICE' ? UNITES_SERVICE : UNITES_STOCKABLE;

  // ─────────────────────────────────────────────────────────
  //  RENDU DES SECTIONS
  // ─────────────────────────────────────────────────────────

  /** Rendu du sélecteur de type SERVICE / STOCKABLE. */
  const renderSelectorType = () => (
    <View style={styles.typeRow}>
      {(['SERVICE', 'STOCKABLE'] as const).map(t => (
        <TouchableOpacity
          key={t}
          style={[styles.typeBtn, form.type === t && styles.typeBtnActive]}
          onPress={() => changerType(t)}
          activeOpacity={0.75}
        >
          <Ionicons
            name={t === 'SERVICE' ? 'settings-outline' : 'cube-outline'}
            size={22}
            color={form.type === t ? theme.colors.primary : theme.colors.textTertiary}
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
  );

  /** Rendu de la section Informations générales. */
  const renderInfosGenerales = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Informations générales</Text>
      <Input
        label="Nom du produit"
        value={form.nom}
        onChangeText={v => setChamp('nom', v)}
        error={errors.nom}
        required
      />
      <Input
        label="Description"
        value={form.description}
        onChangeText={v => setChamp('description', v)}
        multiline
        numberOfLines={3}
      />
      <TouchableOpacity
        style={styles.categorieSelector}
        onPress={() => setShowCatModal(true)}
      >
        <Text style={[
          styles.categorieLabel,
          !!form.categorieId && styles.categorieLabelSelected,
        ]}>
          {nomCategorie()}
        </Text>
        <Ionicons name="chevron-down" size={18} color={theme.colors.textTertiary} />
      </TouchableOpacity>
    </View>
  );

  /** Rendu de la section Tarification. */
  const renderTarification = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Tarification</Text>
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Input
            label="Prix HT (TND)"
            value={form.prixHT}
            onChangeText={v => setChamp('prixHT', v)}
            error={errors.prixHT}
            keyboardType="decimal-pad"
            required
          />
        </View>
        <View style={styles.rowItem}>
          <Input
            label="TVA (%)"
            value={form.tauxTVA}
            onChangeText={v => setChamp('tauxTVA', v)}
            error={errors.tauxTVA}
            keyboardType="decimal-pad"
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.categorieSelector}
        onPress={() => setShowUniteModal(true)}
      >
        <Text style={[
          styles.categorieLabel,
          form.unite && styles.categorieLabelSelected,
        ]}>
          {labelUnite()}
        </Text>
        <Ionicons name="chevron-down" size={18} color={theme.colors.textTertiary} />
      </TouchableOpacity>
      {form.unite === 'Autre' && (
        <Input
          label="Unité personnalisée"
          value={form.uniteAutre}
          onChangeText={v => setChamp('uniteAutre', v)}
        />
      )}
    </View>
  );

  /** Rendu de la section Stock — visible uniquement pour STOCKABLE. */
  const renderStock = () => {
    if (form.type !== 'STOCKABLE') return null;
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Stock</Text>
        <Input
          label="Quantité disponible"
          value={form.stockDisponible}
          onChangeText={v => setChamp('stockDisponible', v)}
          error={errors.stockDisponible}
          keyboardType="number-pad"
          required
        />
        <Input
          label="Seuil d'alerte (stock minimum)"
          value={form.stockMinimum}
          onChangeText={v => setChamp('stockMinimum', v)}
          error={errors.stockMinimum}
          keyboardType="number-pad"
        />
        <Text style={styles.stockHint}>
          Une alerte s'affiche quand le stock tombe en dessous de ce seuil.
        </Text>
      </View>
    );
  };

  /** Rendu du sélecteur de statut ACTIF / INACTIF. */
  const renderStatut = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Statut</Text>
      <View style={styles.statutRow}>
        {(['ACTIF', 'INACTIF'] as const).map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.statutBtn, form.statut === s && styles.statutBtnActive]}
            onPress={() => setChamp('statut', s)}
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
  );

  // ─────────────────────────────────────────────────────────
  //  MODALS
  // ─────────────────────────────────────────────────────────

  /** Modal de sélection de catégorie. */
  const renderModalCategorie = () => (
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
          <Text style={styles.modalTitle}>Catégorie</Text>
          <FlatList
            data={[{ id: null, nom: 'Aucune catégorie' }, ...categories]}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => renderItemCategorie(item)}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  /** Ligne d'une catégorie dans le modal. */
  const renderItemCategorie = (item: { id: number | null; nom: string }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        setChamp('categorieId', item.id);
        setShowCatModal(false);
      }}
    >
      <Text style={[
        styles.modalItemText,
        form.categorieId === item.id && styles.modalItemTextSelected,
      ]}>
        {item.nom}
      </Text>
      {form.categorieId === item.id && (
        <Ionicons name="checkmark" size={18} color={theme.colors.primary} />
      )}
    </TouchableOpacity>
  );

  /** Modal de sélection d'unité. */
  const renderModalUnite = () => (
    <Modal
      visible={showUniteModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowUniteModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowUniteModal(false)}
      >
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Unité</Text>
          <FlatList
            data={listeUnites()}
            keyExtractor={item => item}
            renderItem={({ item }) => renderItemUnite(item)}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  /** Ligne d'une unité dans le modal. */
  const renderItemUnite = (item: string) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        setChamp('unite', item);
        if (item !== 'Autre') setChamp('uniteAutre', '');
        setShowUniteModal(false);
      }}
    >
      <Text style={[
        styles.modalItemText,
        form.unite === item && styles.modalItemTextSelected,
      ]}>
        {item}
      </Text>
      {form.unite === item && (
        <Ionicons name="checkmark" size={18} color={theme.colors.primary} />
      )}
    </TouchableOpacity>
  );

  // ─────────────────────────────────────────────────────────
  //  RENDU PRINCIPAL
  // ─────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {estEdition ? 'Modifier le produit' : 'Nouveau produit'}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Sélecteur type ── */}
        {renderSelectorType()}

        {/* ── Erreur API ── */}
        {apiError && (
          <View style={styles.alertError}>
            <Text style={styles.alertErrorText}>{apiError}</Text>
          </View>
        )}

        {/* ── Sections formulaire ── */}
        {renderInfosGenerales()}
        {renderTarification()}
        {renderStock()}
        {renderStatut()}

        {/* ── Bouton soumettre ── */}
        <Button
          label={isSaving
            ? 'Enregistrement…'
            : estEdition ? 'Enregistrer les modifications' : 'Créer le produit'}
          onPress={handleSoumettre}
          variant="primary"
          fullWidth
          size="lg"
          style={styles.btnSubmit}
          disabled={isSaving}
        />
      </ScrollView>

      {/* ── Modals ── */}
      {renderModalCategorie()}
      {renderModalUnite()}

    </SafeAreaView>
  );
};