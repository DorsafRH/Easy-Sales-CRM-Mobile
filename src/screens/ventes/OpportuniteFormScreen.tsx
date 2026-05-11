/**
 * @file OpportuniteFormScreen.tsx
 * @description Formulaire de creation et d'edition d'une opportunite commerciale.
 *              Champs : titre, description, montant, probabilite, statut, date cloture.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView }                         from 'react-native-safe-area-context';
import { useNavigation, useRoute,
         RouteProp, useFocusEffect }            from '@react-navigation/native';
import { NativeStackNavigationProp }            from '@react-navigation/native-stack';
import { Ionicons }                             from '@expo/vector-icons';

import { useStyles, useTheme }       from '../../theme';
import { makeStyles }                from './OpportuniteFormScreen.styles';
import { Input }                     from '../../components/ui/Input';
import { VentesStackParamList }      from '../../navigation/VentesStack';

import * as VenteApi from '../../api/vente.api';
import {
  OpportuniteRequest,
  StatutOpportunite,
  KANBAN_COLONNES,
} from '../../types/vente.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<VentesStackParamList, 'OpportuniteForm'>;
type Route = RouteProp<VentesStackParamList, 'OpportuniteForm'>;

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Formulaire creation / edition opportunite.
 * @author Riahi Dorsaf
 */
export const OpportuniteFormScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { opportuniteId, leadId, clientId } = route.params ?? {};

  const estEdition = !!opportuniteId;

  const [titre,         setTitre]         = useState('');
  const [description,   setDescription]   = useState('');
  const [montant,       setMontant]       = useState('');
  const [probabilite,   setProbabilite]   = useState('');
  const [statut,        setStatut]        = useState<StatutOpportunite>('PROSPECTION');
  const [dateCloture,   setDateCloture]   = useState('');
  const [titreError,    setTitreError]    = useState('');
  const [isLoading,     setIsLoading]     = useState(estEdition);
  const [isSaving,      setIsSaving]      = useState(false);

  // ── Chargement en mode edition ────────────────────────────

  const charger = useCallback(async () => {
    if (!opportuniteId) return;
    setIsLoading(true);
    try {
      const res = await VenteApi.obtenirOpportunite(opportuniteId);
      if (res.success) {
        const o = res.data;
        setTitre(o.titre);
        setDescription(o.description ?? '');
        setMontant(o.montantEstime ? String(o.montantEstime) : '');
        setProbabilite(o.probabilite ? String(o.probabilite) : '');
        setStatut(o.statut);
        setDateCloture(o.dateCloturePrevue ?? '');
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de charger l opportunite.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }, [opportuniteId, navigation]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // ── Soumission ────────────────────────────────────────────

  const handleSoumettre = async () => {
    if (!titre.trim()) {
      setTitreError('Le titre est obligatoire');
      return;
    }
    setTitreError('');

    if (!clientId && !estEdition) {
      Alert.alert('Erreur', 'Aucun client associe. Creez d abord un client.');
      return;
    }

    const request: OpportuniteRequest = {
      titre:            titre.trim(),
      description:      description.trim() || undefined,
      montantEstime:    montant ? Number(montant) : undefined,
      probabilite:      probabilite ? Number(probabilite) : undefined,
      statut,
      dateCloturePrevue: dateCloture || undefined,
      clientId:         clientId ?? 0,
      leadId:           leadId ?? undefined,
    };

    setIsSaving(true);
    try {
      if (estEdition && opportuniteId) {
        await VenteApi.modifierOpportunite(opportuniteId, request);
      } else {
        await VenteApi.creerOpportunite(request);
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Erreur', e?.response?.data?.message ?? 'Impossible de sauvegarder.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {estEdition ? 'Modifier l opportunite' : 'Nouvelle opportunite'}
          </Text>
        </View>

        {/* ── Informations ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.fieldGroup}>
            <Input
              label="Titre *"
              value={titre}
              onChangeText={v => { setTitre(v); if (v.trim()) setTitreError(''); }}
              placeholder="Ex: Refonte site web Societe ABC"
              error={titreError}
            />
            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Contexte et details de l opportunite..."
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* ── Commercial ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Donnees commerciales</Text>
          <View style={styles.fieldGroup}>
            <Input
              label="Montant estime (TND)"
              value={montant}
              onChangeText={setMontant}
              placeholder="Ex: 15000"
              keyboardType="numeric"
            />
            <Input
              label="Probabilite de gain (%)"
              value={probabilite}
              onChangeText={setProbabilite}
              placeholder="Ex: 70"
              keyboardType="numeric"
            />
            <Input
              label="Date de cloture prevue (YYYY-MM-DD)"
              value={dateCloture}
              onChangeText={setDateCloture}
              placeholder="Ex: 2026-06-30"
            />
          </View>
        </View>

        {/* ── Statut ── */}
        <View style={styles.section}>
          <Text style={styles.selectLabel}>Statut dans le pipeline</Text>
          <View style={styles.statutGrid}>
            {KANBAN_COLONNES.map(col => (
              <TouchableOpacity
                key={col.statut}
                style={[
                  styles.statutChip,
                  statut === col.statut && { borderColor: col.color, backgroundColor: col.bg },
                ]}
                onPress={() => setStatut(col.statut)}
              >
                <Text style={[
                  styles.statutChipText,
                  statut === col.statut && { color: col.color, fontWeight: '700' },
                ]}>
                  {col.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
                {estEdition ? 'Enregistrer les modifications' : 'Creer l opportunite'}
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
