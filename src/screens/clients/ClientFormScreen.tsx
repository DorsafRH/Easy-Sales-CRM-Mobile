/**
 * @file ClientFormScreen.tsx
 * @description Formulaire de création et modification d'un client.
 *              Mode création : typeClient sélectionnable (INDIVIDUEL / ENTREPRISE).
 *              Mode modification : typeClient figé.
 *              Champs dynamiques selon le type sélectionné.
 * @author Riahi Dorsaf
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import { SafeAreaView }              from 'react-native-safe-area-context';
import { useNavigation, useRoute,
         RouteProp }                 from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons }                  from '@expo/vector-icons';

import { useStyles, useTheme }  from '../../theme';
import { makeStyles }           from './ClientFormScreen.styles';
import { Input }                from '../../components/ui/Input';
import { Button }               from '../../components/ui/Button';
import { ClientsStackParamList } from '../../navigation/ClientsStack';

import * as ClientApi from '../../api/client.api';
import {
  ClientFormState,
  INITIAL_CLIENT_FORM,
  TypeClient,
  ClientRequest,
} from '../../types/client.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<ClientsStackParamList, 'ClientForm'>;
type Route = RouteProp<ClientsStackParamList, 'ClientForm'>;
type Errors = Partial<Record<keyof ClientFormState, string>>;

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Formulaire client (création et modification).
 * @author Riahi Dorsaf
 */
export const ClientFormScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { client } = route.params ?? {};

  const isEditing  = !!client;

  // ── Initialisation du formulaire ──────────────────────────
  const [form,       setForm]       = useState<ClientFormState>(() => {
    if (client) {
      return {
        typeClient:    client.typeClient,
        email:         client.email    ?? '',
        telephone:     client.telephone ?? '',
        adresse:       client.adresse  ?? '',
        ville:         client.ville    ?? '',
        pays:          client.pays     ?? 'Tunisie',
        nom:           client.nom      ?? '',
        prenom:        client.prenom   ?? '',
        raisonSociale: client.raisonSociale ?? '',
      };
    }
    return INITIAL_CLIENT_FORM;
  });

  const [errors,    setErrors]    = useState<Errors>({});
  const [apiError,  setApiError]  = useState<string | null>(null);
  const [isSaving,  setIsSaving]  = useState(false);

  // ── Update champ ──────────────────────────────────────────
  const setField = <K extends keyof ClientFormState>(key: K) =>
    (value: ClientFormState[K]) => {
      setForm(f => ({ ...f, [key]: value }));
      setErrors(e => ({ ...e, [key]: undefined }));
      setApiError(null);
    };

  // ── Import depuis le répertoire du téléphone ──────────────
  /**
   * Ouvre le sélecteur de contacts du téléphone (le même répertoire
   * que celui utilisé par WhatsApp) et pré-remplit le formulaire avec
   * le contact choisi. N'importe QUE les données du répertoire : il
   * n'existe aucune API pour lire spécifiquement les contacts WhatsApp.
   *
   * Note : on ne force pas le type ENTREPRISE — un contact du répertoire
   * est par nature une personne, donc on bascule sur INDIVIDUEL.
   * @author Riahi Dorsaf
   */
  const handleImportFromContacts = async () => {
    try {
      // 1. Demande de permission (READ_CONTACTS)
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Accès aux contacts refusé',
          "Autorisez l'accès aux contacts dans les réglages pour importer un client depuis votre répertoire.",
        );
        return;
      }

      // 2. Ouverture du sélecteur natif — l'utilisateur choisit UN contact
      const contact = await Contacts.presentContactPickerAsync();
      if (!contact) return; // annulé par l'utilisateur

      // 3. Extraction des champs utiles
      const prenom = contact.firstName?.trim() ?? '';
      const nom    = contact.lastName?.trim() ?? '';
      // Repli : si ni prénom ni nom, on range le nom complet dans "nom"
      const nomComplet = contact.name?.trim() ?? '';

      const telephone =
        contact.phoneNumbers?.[0]?.number?.replace(/\s+/g, ' ').trim() ?? '';
      const email = contact.emails?.[0]?.email?.trim() ?? '';

      // 4. Pré-remplissage (mode INDIVIDUEL, champs restent éditables).
      //    Si le contact n'a ni prénom ni nom séparés, on met le nom
      //    complet dans "nom" pour ne rien perdre.
      setForm(f => ({
        ...f,
        typeClient: 'INDIVIDUEL',
        prenom,
        nom:        nom || (prenom ? '' : nomComplet),
        telephone:  telephone || f.telephone,
        email:      email || f.email,
      }));
      setErrors({});
      setApiError(null);

      if (!telephone) {
        Alert.alert(
          'Téléphone manquant',
          "Ce contact n'a pas de numéro. Renseignez-le manuellement avant d'enregistrer.",
        );
      }
    } catch (err) {
      Alert.alert(
        'Import impossible',
        "Une erreur est survenue lors de la lecture du répertoire.",
      );
    }
  };

  // ── Validation ────────────────────────────────────────────
  const validate = (): boolean => {
    const e: Errors = {};
    if (form.typeClient === 'INDIVIDUEL') {
      if (!form.nom.trim())    e.nom    = 'Le nom est obligatoire.';
      if (!form.prenom.trim()) e.prenom = 'Le prénom est obligatoire.';
    } else {
      if (!form.raisonSociale.trim())
        e.raisonSociale = 'La raison sociale est obligatoire.';
    }
    // Telephone obligatoire ; email optionnel (aucune validation requise).
    if (!form.telephone.trim()) e.telephone = 'Le téléphone est obligatoire';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Soumission ────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSaving(true);
    setApiError(null);
    try {
      const request: ClientRequest = {
        typeClient:    form.typeClient,
        email:         form.email.trim()     || undefined,
        telephone:     form.telephone.trim() || undefined,
        adresse:       form.adresse.trim()   || undefined,
        ville:         form.ville.trim()     || undefined,
        pays:          form.pays.trim()      || undefined,
        nom:           form.nom.trim()       || undefined,
        prenom:        form.prenom.trim()    || undefined,
        raisonSociale: form.raisonSociale.trim() || undefined,
      };

      if (isEditing) {
        await ClientApi.modifierClient(client!.id, request);
      } else {
        await ClientApi.creerClient(request);
      }
      navigation.goBack();
    } catch (err: any) {
      setApiError(
        err?.response?.data?.message ??
        'Une erreur est survenue. Veuillez réessayer.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Modifier le client' : 'Nouveau client'}
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
          {/* ── Import depuis le répertoire (création uniquement) ── */}
          {!isEditing && (
            <TouchableOpacity
              style={styles.importBtn}
              onPress={handleImportFromContacts}
              activeOpacity={0.8}
            >
              <Ionicons
                name="people-outline"
                size={18}
                color={theme.colors.primary}
              />
              <Text style={styles.importBtnText}>
                Importer depuis mes contacts
              </Text>
            </TouchableOpacity>
          )}

          {/* ── Sélecteur type ── */}
          {!isEditing && (
            <View style={styles.typeRow}>
              {(['INDIVIDUEL', 'ENTREPRISE'] as TypeClient[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeBtn,
                    form.typeClient === t && styles.typeBtnActive,
                  ]}
                  onPress={() => setField('typeClient')(t)}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      form.typeClient === t && styles.typeBtnTextActive,
                    ]}
                  >
                    {t === 'INDIVIDUEL' ? 'Individuel' : 'Entreprise'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── Erreur API ── */}
          {apiError && (
            <View style={styles.alertError}>
              <Text style={styles.alertErrorText}>⚠️ {apiError}</Text>
            </View>
          )}

          {/* ── Champs spécifiques au type ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {form.typeClient === 'INDIVIDUEL'
                ? 'Informations personnelles'
                : 'Informations entreprise'}
            </Text>

            {form.typeClient === 'INDIVIDUEL' ? (
              <>
                <View style={styles.row}>
                  <View style={styles.rowItem}>
                    <Input
                      label="Prénom"
                      placeholder="Ahmed"
                      value={form.prenom}
                      onChangeText={setField('prenom')}
                      error={errors.prenom}
                      required
                      autoCapitalize="words"
                    />
                  </View>
                  <View style={styles.rowItem}>
                    <Input
                      label="Nom"
                      placeholder="Ben Ali"
                      value={form.nom}
                      onChangeText={setField('nom')}
                      error={errors.nom}
                      required
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              </>
            ) : (
              <Input
                label="Raison sociale"
                placeholder="Ex : TechCorp SARL"
                value={form.raisonSociale}
                onChangeText={setField('raisonSociale')}
                error={errors.raisonSociale}
                required
                autoCapitalize="words"
              />
            )}
          </View>

          {/* ── Coordonnées ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Coordonnées</Text>

            <Input
              label="Email"
              placeholder="contact@exemple.com"
              value={form.email}
              onChangeText={setField('email')}
              keyboardType="email-address"
            />
            <Input
              label="Téléphone"
              placeholder="+216 XX XXX XXX"
              value={form.telephone}
              onChangeText={setField('telephone')}
              keyboardType="phone-pad"
              error={errors.telephone}
              required
            />
            <Input
              label="Adresse"
              placeholder="Rue, quartier"
              value={form.adresse}
              onChangeText={setField('adresse')}
            />
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Input
                  label="Ville"
                  placeholder="Tunis"
                  value={form.ville}
                  onChangeText={setField('ville')}
                />
              </View>
              <View style={styles.rowItem}>
                <Input
                  label="Pays"
                  placeholder="Tunisie"
                  value={form.pays}
                  onChangeText={setField('pays')}
                />
              </View>
            </View>
          </View>

          {/* ── Bouton ── */}
          <Button
            label={isEditing ? 'Enregistrer les modifications' : 'Créer le client'}
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