/**
 * @file CategorieFormScreen.tsx
 * @description Formulaire de création et modification d'une catégorie de catalogue.
 *              - Nom obligatoire
 *              - Description optionnelle
 *              - Prévisualisation icône auto en temps réel
 *              - Suppression intelligente (mode édition uniquement) :
 *                Si la catégorie contient des produits actifs, propose 2 actions
 *                via 2 endpoints PATCH séparés (bonne pratique REST).
 * @author Riahi Dorsaf
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView }              from 'react-native-safe-area-context';
import { useNavigation, useRoute,
         RouteProp }                 from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons }                  from '@expo/vector-icons';

import { useStyles, useTheme }     from '../../theme';
import { makeStyles }              from './CategorieFormScreen.styles';
import { Input }                   from '../../components/ui/Input';
import { Button }                  from '../../components/ui/Button';
import { CatalogueStackParamList } from '../../navigation/CatalogueStack';

import * as CatalogueApi from '../../api/catalogue.api';
import {
  CategorieFormState,
  INITIAL_CATEGORIE_FORM,
  CategorieRequest,
  CATEGORIE_ICONE_MAP,
  CATEGORIE_ICONE_DEFAULT,
} from '../../types/catalogue.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav    = NativeStackNavigationProp<CatalogueStackParamList, 'CategorieForm'>;
type Route  = RouteProp<CatalogueStackParamList, 'CategorieForm'>;
type Errors = Partial<Record<keyof CategorieFormState, string>>;

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const iconeDepuisNom = (nom: string): string => {
  if (!nom.trim()) return CATEGORIE_ICONE_DEFAULT;
  const lower = nom.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORIE_ICONE_MAP)) {
    if (lower.includes(key)) return icon;
  }
  return CATEGORIE_ICONE_DEFAULT;
};

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Formulaire catégorie (création et modification).
 * @author Riahi Dorsaf
 */
export const CategorieFormScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { categorie } = route.params ?? {};

  const isEditing = !!categorie;

  const [form, setForm] = useState<CategorieFormState>(() => {
    if (categorie) {
      return {
        nom:         categorie.nom,
        description: categorie.description ?? '',
      };
    }
    return INITIAL_CATEGORIE_FORM;
  });

  const [errors,     setErrors]     = useState<Errors>({});
  const [apiError,   setApiError]   = useState<string | null>(null);
  const [isSaving,   setIsSaving]   = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Update champ ──────────────────────────────────────────
  const setField = <K extends keyof CategorieFormState>(key: K) =>
    (value: CategorieFormState[K]) => {
      setForm(f => ({ ...f, [key]: value }));
      setErrors(e => ({ ...e, [key]: undefined }));
      setApiError(null);
    };

  // ── Validation ────────────────────────────────────────────
  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.nom.trim()) e.nom = 'Le nom de la catégorie est obligatoire.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Soumission ────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSaving(true);
    setApiError(null);
    try {
      const request: CategorieRequest = {
        nom:         form.nom.trim(),
        description: form.description.trim() || undefined,
      };
      if (isEditing) {
        await CatalogueApi.modifierCategorie(categorie!.id, request);
      } else {
        await CatalogueApi.creerCategorie(request);
      }
      navigation.goBack();
    } catch (err: any) {
      setApiError(err?.response?.data?.message ?? 'Une erreur est survenue.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Suppression ───────────────────────────────────────────

  /**
   * Effectue la suppression finale après le pré-traitement des produits.
   * Appelé après PATCH desactiver-produits ou PATCH retirer-categorie.
   */
  const supprimerDefinitivement = async () => {
    try {
      await CatalogueApi.supprimerCategorie(categorie!.id);
      navigation.goBack();
    } catch (err: any) {
      Alert.alert(
        'Erreur',
        err?.response?.data?.message ?? 'La suppression a échoué.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Gère la suppression de la catégorie selon le nombre de produits actifs :
   *
   * - Catégorie vide → confirmation simple → DELETE /{id}
   * - Catégorie avec produits → Alert 3 choix :
   *     1. "Désactiver les produits" → PATCH /desactiver-produits → DELETE /{id}
   *     2. "Retirer la catégorie"    → PATCH /retirer-categorie   → DELETE /{id}
   *     3. "Annuler"
   *
   * Bonne pratique REST : 2 endpoints PATCH séparés avec responsabilité unique,
   * pas un paramètre ?action= sur le DELETE.
   */
  const handleSupprimer = () => {
    const nbProduits = categorie?.nbProduits ?? 0;

    if (nbProduits === 0) {
      // ── Catégorie vide : suppression directe ──
      Alert.alert(
        'Supprimer la catégorie',
        `Voulez-vous supprimer "${categorie?.nom}" ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text:  'Supprimer',
            style: 'destructive',
            onPress: async () => {
              setIsDeleting(true);
              await supprimerDefinitivement();
            },
          },
        ],
      );
    } else {
      // ── Catégorie avec produits : propose 2 actions ──
      Alert.alert(
        'Supprimer la catégorie',
        `"${categorie?.nom}" contient ${nbProduits} produit(s) actif(s).\n\nQue voulez-vous faire avec ces produits ?`,
        [
          {
            text:    'Désactiver les produits',
            onPress: async () => {
              setIsDeleting(true);
              try {
                // PATCH /categories/{id}/desactiver-produits
                await CatalogueApi.desactiverProduitsCategorie(categorie!.id);
                // DELETE /categories/{id}
                await supprimerDefinitivement();
              } catch (err: any) {
                setIsDeleting(false);
                Alert.alert(
                  'Erreur',
                  err?.response?.data?.message ?? 'Une erreur est survenue.',
                );
              }
            },
          },
          {
            text:    'Retirer la catégorie',
            onPress: async () => {
              setIsDeleting(true);
              try {
                // PATCH /categories/{id}/retirer-categorie
                await CatalogueApi.retirerCategorieProduits(categorie!.id);
                // DELETE /categories/{id}
                await supprimerDefinitivement();
              } catch (err: any) {
                setIsDeleting(false);
                Alert.alert(
                  'Erreur',
                  err?.response?.data?.message ?? 'Une erreur est survenue.',
                );
              }
            },
          },
          {
            text:  'Annuler',
            style: 'cancel',
          },
        ],
      );
    }
  };

  const icone = iconeDepuisNom(form.nom);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
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
          {/* ── Erreur API ── */}
          {apiError && (
            <View style={styles.alertError}>
              <Text style={styles.alertErrorText}>⚠️ {apiError}</Text>
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informations</Text>

            {/* Prévisualisation icône */}
            {form.nom.trim().length > 0 && (
              <View style={styles.iconPreviewRow}>
                <View style={styles.iconPreviewBox}>
                  <Ionicons
                    name={icone as any}
                    size={24}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.iconPreviewText}>
                  Icône attribuée automatiquement
                </Text>
              </View>
            )}

            <Input
              label="Nom de la catégorie"
              placeholder="Ex : Logiciels, Services de conseil…"
              value={form.nom}
              onChangeText={setField('nom')}
              error={errors.nom}
              required
              autoCapitalize="sentences"
            />
            <Input
              label="Description"
              placeholder="Description optionnelle de cette catégorie…"
              value={form.description}
              onChangeText={setField('description')}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.hint}>
              💡 L'icône est attribuée automatiquement selon les mots-clés du nom
              (logiciel, service, formation, marketing…).
            </Text>
          </View>

          {/* ── Bouton enregistrer ── */}
          <Button
            label={isEditing ? 'Enregistrer' : 'Créer la catégorie'}
            onPress={handleSubmit}
            loading={isSaving}
            fullWidth
            size="lg"
            style={styles.btnSubmit}
          />

          {/* ── Bouton supprimer (mode édition uniquement) ── */}
          {isEditing && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleSupprimer}
              disabled={isDeleting}
              activeOpacity={0.75}
            >
              <Text style={styles.deleteBtnText}>
                {isDeleting ? 'Suppression en cours…' : 'Supprimer la catégorie'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};