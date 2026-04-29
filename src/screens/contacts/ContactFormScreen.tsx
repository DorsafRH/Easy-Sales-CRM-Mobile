/**
 * @file ContactFormScreen.tsx
 * @description Formulaire de création et modification d'un contact.
 *              Toggle "Contact principal" avec règle : un seul principal par client.
 * @author Riahi Dorsaf
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView }              from 'react-native-safe-area-context';
import { useNavigation, useRoute,
         RouteProp }                 from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons }                  from '@expo/vector-icons';

import { useStyles, useTheme }   from '../../theme';
import { Input }                 from '../../components/ui/Input';
import { Button }                from '../../components/ui/Button';
import { ClientsStackParamList } from '../../navigation/ClientsStack';
import { makeStyles } from './ContactFormScreen.styles';

import * as ContactApi from '../../api/contact.api';
import {
  ContactFormState,
  INITIAL_CONTACT_FORM,
  ContactFormErrors,
  ContactRequest,
} from '../../types/contact.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<ClientsStackParamList, 'ContactForm'>;
type Route = RouteProp<ClientsStackParamList, 'ContactForm'>;
/**
 * Formulaire contact (création et modification).
 * @author Riahi Dorsaf
 */
export const ContactFormScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { clientId, contact } = route.params;

  const isEditing = !!contact;

  const [form, setForm] = useState<ContactFormState>(() => {
    if (contact) {
      return {
        nom:         contact.nom       ?? '',
        prenom:      contact.prenom    ?? '',
        email:       contact.email     ?? '',
        telephone:   contact.telephone ?? '',
        poste:       contact.poste     ?? '',
        isPrincipal: contact.isPrincipal,
      };
    }
    return INITIAL_CONTACT_FORM;
  });

  const [errors,   setErrors]   = useState<ContactFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const setField = <K extends keyof ContactFormState>(key: K) =>
    (value: ContactFormState[K]) => {
      setForm(f => ({ ...f, [key]: value }));
      setErrors(e => ({ ...e, [key]: undefined }));
      setApiError(null);
    };

  const validate = (): boolean => {
    const e: ContactFormErrors = {};
    if (!form.nom.trim()) e.nom = 'Le nom est obligatoire.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSaving(true);
    setApiError(null);
    try {
      const request: ContactRequest = {
        nom:         form.nom.trim(),
        prenom:      form.prenom.trim()    || undefined,
        email:       form.email.trim()     || undefined,
        telephone:   form.telephone.trim() || undefined,
        poste:       form.poste.trim()     || undefined,
        isPrincipal: form.isPrincipal,
      };

      if (isEditing) {
        await ContactApi.modifierContact(clientId, contact!.id, request);
      } else {
        await ContactApi.creerContact(clientId, request);
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

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditing ? 'Modifier le contact' : 'Nouveau contact'}
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
          {apiError && (
            <View style={styles.alertError}>
              <Text style={styles.alertErrorText}>⚠️ {apiError}</Text>
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informations</Text>

            <Input
              label="Nom"
              placeholder="Ben Ali"
              value={form.nom}
              onChangeText={setField('nom')}
              error={errors.nom}
              required
              autoCapitalize="words"
            />
            <Input
              label="Prénom"
              placeholder="Ahmed"
              value={form.prenom}
              onChangeText={setField('prenom')}
              autoCapitalize="words"
            />
            <Input
              label="Poste / Fonction"
              placeholder="Directeur commercial"
              value={form.poste}
              onChangeText={setField('poste')}
              autoCapitalize="words"
            />
            <Input
              label="Téléphone"
              placeholder="+216 XX XXX XXX"
              value={form.telephone}
              onChangeText={setField('telephone')}
              keyboardType="phone-pad"
            />
            <Input
              label="Email"
              placeholder="contact@exemple.com"
              value={form.email}
              onChangeText={setField('email')}
              keyboardType="email-address"
            />

            {/* Toggle principal */}
            <View style={styles.principalRow}>
              <View>
                <Text style={styles.principalLabel}>Contact principal</Text>
                <Text style={styles.principalHint}>
                  Un seul contact principal par client
                </Text>
              </View>
              <Switch
                value={form.isPrincipal}
                onValueChange={setField('isPrincipal')}
                trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
                thumbColor={theme.colors.white}
              />
            </View>
          </View>

          <Button
            label={isEditing ? 'Enregistrer' : 'Créer le contact'}
            onPress={handleSubmit}
            loading={isSaving}
            fullWidth
            size="lg"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};