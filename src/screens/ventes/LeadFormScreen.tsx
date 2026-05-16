/**
 * @file LeadFormScreen.tsx
 * @description Formulaire de creation et d'edition d'un lead.
 *              Champs : nom, email, telephone, entreprise, poste, source, besoin.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView }                         from 'react-native-safe-area-context';
import { useNavigation, useRoute,
         RouteProp, useFocusEffect }            from '@react-navigation/native';
import { NativeStackNavigationProp }            from '@react-navigation/native-stack';
import { Ionicons }                             from '@expo/vector-icons';

import { useStyles, useTheme }   from '../../theme';
import { makeStyles }            from './LeadFormScreen.styles';
import { Input }                 from '../../components/ui/Input';
import { VentesStackParamList }  from '../../navigation/VentesStack';

import * as VenteApi from '../../api/vente.api';
import {
  LeadRequest,
  SourceLead,
  SOURCE_LEAD_LABELS,
} from '../../types/vente.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<VentesStackParamList, 'LeadForm'>;
type Route = RouteProp<VentesStackParamList, 'LeadForm'>;

const SOURCES: SourceLead[] = [
  'SITE_WEB', 'LINKEDIN', 'REFERENCE', 'EMAIL',
  'SALON', 'APPEL_ENTRANT', 'AUTRE',
];

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Formulaire creation / edition lead.
 * @author Riahi Dorsaf
 */
export const LeadFormScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { leadId } = route.params ?? {};

  const estEdition = !!leadId;

  // ── Etat formulaire ───────────────────────────────────────
  const [nom,              setNom]              = useState('');
  const [email,            setEmail]            = useState('');
  const [telephone,        setTelephone]        = useState('');
  const [entreprise,       setEntreprise]       = useState('');
  const [poste,            setPoste]            = useState('');
  const [source,           setSource]           = useState<SourceLead>('AUTRE');
  const [descriptionBesoin, setDescBesoin]      = useState('');
  const [nomError,         setNomError]         = useState('');
  const [isLoading,        setIsLoading]        = useState(estEdition);
  const [isSaving,         setIsSaving]         = useState(false);

  // ── Chargement en mode edition ────────────────────────────

  const charger = useCallback(async () => {
    if (!leadId) return;
    setIsLoading(true);
    try {
      const res = await VenteApi.obtenirLead(leadId);
      if (res.success) {
        const l = res.data;
        setNom(l.nom);
        setEmail(l.email ?? '');
        setTelephone(l.telephone ?? '');
        setEntreprise(l.entreprise ?? '');
        setPoste(l.poste ?? '');
        setSource(l.source);
        setDescBesoin(l.descriptionBesoin ?? '');
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de charger le lead.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }, [leadId, navigation]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // ── Validation ────────────────────────────────────────────

  const valider = (): boolean => {
    let valide = true;
    if (!nom.trim()) {
      setNomError('Le nom est obligatoire');
      valide = false;
    } else {
      setNomError('');
    }
    return valide;
  };

  // ── Soumission ────────────────────────────────────────────

  const handleSoumettre = async () => {
    if (!valider()) return;

    const request: LeadRequest = {
      nom:              nom.trim(),
      email:            email.trim() || undefined,
      telephone:        telephone.trim() || undefined,
      entreprise:       entreprise.trim() || undefined,
      poste:            poste.trim() || undefined,
      source,
      descriptionBesoin: descriptionBesoin.trim() || undefined,
    };

    setIsSaving(true);
    try {
      if (estEdition && leadId) {
        await VenteApi.modifierLead(leadId, request);
      } else {
        await VenteApi.creerLead(request);
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Erreur', e?.response?.data?.message ?? 'Impossible de sauvegarder le lead.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Rendu ─────────────────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {estEdition ? 'Modifier le lead' : 'Nouveau lead'}
          </Text>
        </View>

        {/* ── Identite ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identite du prospect</Text>
          <View style={styles.fieldGroup}>
            <Input
              label="Nom complet *"
              value={nom}
              onChangeText={v => { setNom(v); if (v.trim()) setNomError(''); }}
              placeholder="Ex: Ahmed Ben Ali"
              error={nomError}
            />
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="ahmed@entreprise.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Telephone"
              value={telephone}
              onChangeText={setTelephone}
              placeholder="+216 XX XXX XXX"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* ── Entreprise ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entreprise</Text>
          <View style={styles.fieldGroup}>
            <Input
              label="Nom de l'entreprise"
              value={entreprise}
              onChangeText={setEntreprise}
              placeholder="Ex: Societe ABC"
            />
            <Input
              label="Poste occupe"
              value={poste}
              onChangeText={setPoste}
              placeholder="Ex: Directeur commercial"
            />
          </View>
        </View>

        {/* ── Source ── */}
        <View style={styles.section}>
          <Text style={styles.selectLabel}>Source du lead *</Text>
          <View style={styles.sourceGrid}>
            {SOURCES.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.sourceChip, source === s && styles.sourceChipSelected]}
                onPress={() => setSource(s)}
              >
                <Text style={[styles.sourceChipText, source === s && styles.sourceChipTextSelected]}>
                  {SOURCE_LEAD_LABELS[s]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Besoin ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Besoin identifie</Text>
          <Input
            label="Description du besoin"
            value={descriptionBesoin}
            onChangeText={setDescBesoin}
            placeholder="Decrire le besoin ou le contexte du prospect..."
            multiline
            numberOfLines={4}
          />
        </View>

        {/* ── Actions ── */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[styles.submitBtn, isSaving && styles.submitBtnDisabled]}
            onPress={handleSoumettre}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Text style={styles.submitBtnText}>
                {estEdition ? 'Enregistrer les modifications' : 'Creer le lead'}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>Annuler</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};