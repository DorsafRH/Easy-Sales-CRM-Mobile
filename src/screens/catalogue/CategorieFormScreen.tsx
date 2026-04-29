/**
 * @file CategorieFormScreen.tsx
 * @description Formulaire de création et modification d'une catégorie de catalogue.
 *              - Nom obligatoire
 *              - Description optionnelle
 *              - Prévisualisation icône auto en temps réel selon les mots-clés du nom
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

type Nav   = NativeStackNavigationProp<CatalogueStackParamList, 'CategorieForm'>;
type Route = RouteProp<CatalogueStackParamList, 'CategorieForm'>;
type Errors = Partial<Record<keyof CategorieFormState, string>>;

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Détermine l'icône prévisualisée depuis le nom en cours de saisie.
 * Utilise le même algorithme que CatalogueScreen pour la cohérence.
 */
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

  const [errors,   setErrors]   = useState<Errors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
      setApiError(
        err?.response?.data?.message ?? 'Une erreur est survenue.',
      );
    } finally {
      setIsSaving(false);
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

            {/* Prévisualisation icône (visible dès qu'on tape) */}
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

          <Button
            label={isEditing ? 'Enregistrer' : 'Créer la catégorie'}
            onPress={handleSubmit}
            loading={isSaving}
            fullWidth
            size="lg"
            style={styles.btnSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};