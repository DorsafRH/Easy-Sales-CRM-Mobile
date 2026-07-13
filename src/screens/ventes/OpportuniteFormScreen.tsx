/**
 * @file OpportuniteFormScreen.tsx
 * @description Formulaire de création et d'édition d'une opportunité commerciale.
 *              Inclut la sélection obligatoire d'un client via ClientPickerModal.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView }                      from 'react-native-safe-area-context';
import { useNavigation, useRoute,
         RouteProp, useFocusEffect }         from '@react-navigation/native';
import { NativeStackNavigationProp }         from '@react-navigation/native-stack';
import { Ionicons }                          from '@expo/vector-icons';
import { useTranslation }                    from 'react-i18next';

import { useStyles, useTheme }   from '../../theme';
import { makeStyles }            from './OpportuniteFormScreen.styles';
import { Input }                 from '../../components/ui/Input';
import { ClientPickerModal }     from '../../components/ui/ClientPickerModal';
import { VentesStackParamList }  from '../../navigation/VentesStack';

import * as VenteApi  from '../../api/vente.api';
import * as ClientApi from '../../api/client.api';
import {
  OpportuniteRequest,
  StatutOpportunite,
  KANBAN_COLONNES,
} from '../../types/vente.types';
import { ClientResponse } from '../../types/client.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<VentesStackParamList, 'OpportuniteForm'>;
type Route = RouteProp<VentesStackParamList, 'OpportuniteForm'>;

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Formulaire création / édition opportunité avec sélection client obligatoire.
 * @author Riahi Dorsaf
 */
export const OpportuniteFormScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const { t }      = useTranslation();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { opportuniteId, leadId, clientId: clientIdParam } = route.params ?? {};

  const estEdition = !!opportuniteId;

  // ── État formulaire ───────────────────────────────────────
  const [clientSelectionne, setClientSelectionne] = useState<ClientResponse | null>(null);
  const [titre,             setTitre]             = useState('');
  const [description,       setDescription]       = useState('');
  const [montant,           setMontant]           = useState('');
  const [probabilite,       setProbabilite]       = useState('');
  const [statut,            setStatut]            = useState<StatutOpportunite>('PROSPECTION');
  const [dateCloture,       setDateCloture]       = useState('');
  const [titreError,        setTitreError]        = useState('');
  const [clientError,       setClientError]       = useState('');
  const [pickerVisible,     setPickerVisible]     = useState(false);
  const [isLoading,         setIsLoading]         = useState(estEdition || !!clientIdParam);
  const [isSaving,          setIsSaving]          = useState(false);

  // ── Chargement initial ────────────────────────────────────

  const charger = useCallback(async () => {
    setIsLoading(true);
    try {
      // Si clientId passé en paramètre (depuis conversion lead), charger ce client
      if (clientIdParam && !estEdition) {
        const clientRes = await ClientApi.obtenirClient(clientIdParam);
        if (clientRes.success) setClientSelectionne(clientRes.data);
      }
      // En mode édition, charger l'opportunité et son client
      if (opportuniteId) {
        const res = await VenteApi.obtenirOpportunite(opportuniteId);
        if (res.success) {
          const o = res.data;
          setTitre(o.titre);
          setDescription(o.description ?? '');
          setMontant(o.montantEstime ? String(o.montantEstime) : '');
          setProbabilite(o.probabilite ? String(o.probabilite) : '');
          setStatut(o.statut);
          setDateCloture(o.dateCloturePrevue ?? '');
          const clientRes = await ClientApi.obtenirClient(o.clientId);
          if (clientRes.success) setClientSelectionne(clientRes.data);
        }
      }
    } catch {
      Alert.alert(t('ventes.leadDetail.error'), t('ventes.opportForm.loadError'));
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }, [opportuniteId, clientIdParam, estEdition, navigation]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // ── Validation ────────────────────────────────────────────

  const valider = (): boolean => {
    let valide = true;
    if (!clientSelectionne) {
      setClientError(t('ventes.opportForm.errClient'));
      valide = false;
    } else {
      setClientError('');
    }
    if (!titre.trim()) {
      setTitreError(t('ventes.opportForm.errTitle'));
      valide = false;
    } else {
      setTitreError('');
    }
    return valide;
  };

  // ── Soumission ────────────────────────────────────────────

  const handleSoumettre = async () => {
    if (!valider()) return;

    const request: OpportuniteRequest = {
      titre:             titre.trim(),
      description:       description.trim() || undefined,
      montantEstime:     montant ? Number(montant) : undefined,
      probabilite:       probabilite ? Number(probabilite) : undefined,
      statut,
      dateCloturePrevue: dateCloture || undefined,
      clientId:          clientSelectionne!.id,
      leadId:            leadId ?? undefined,
    };

    setIsSaving(true);
    try {
      if (estEdition && opportuniteId) {
        await VenteApi.modifierOpportunite(opportuniteId, request);
        navigation.goBack();
      } else {
        const res = await VenteApi.creerOpportunite(request);
        if (res.success) {
          navigation.replace('OpportuniteDetail', { opportuniteId: res.data.id });
        }
      }
    } catch (e: any) {
      Alert.alert(t('ventes.leadDetail.error'), e?.response?.data?.message ?? t('ventes.opportForm.saveError'));
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header avec flèche retour ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {estEdition ? t('ventes.opportForm.titleEdit') : t('ventes.opportForm.titleNew')}
          </Text>
        </View>

        {/* ── Sélection client obligatoire ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ventes.opportForm.clientSection')}</Text>
          <TouchableOpacity
            style={[
              styles.clientSelectBtn,
              !!clientSelectionne  && styles.clientSelectBtnActif,
              !!clientError        && styles.clientSelectBtnError,
            ]}
            onPress={() => setPickerVisible(true)}
            activeOpacity={0.75}
          >
            <View style={styles.clientSelectLeft}>
              <Ionicons
                name={clientSelectionne ? 'person-circle-outline' : 'person-add-outline'}
                size={22}
                color={clientSelectionne ? theme.colors.primary : theme.colors.textTertiary}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.clientSelectText,
                    !!clientSelectionne && styles.clientSelectTextActif,
                  ]}
                  numberOfLines={1}
                >
                  {clientSelectionne
                    ? clientSelectionne.nomAffichage
                    : t('ventes.opportForm.selectClient')}
                </Text>
                {clientSelectionne && (
                  <Text style={styles.clientSelectMeta} numberOfLines={1}>
                    {clientSelectionne.typeClient === 'ENTREPRISE'
                      ? t('clients.badgeCompany')
                      : t('clients.badgeIndividual')}
                    {clientSelectionne.email
                      ? '  •  ' + clientSelectionne.email
                      : ''}
                  </Text>
                )}
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.textTertiary}
            />
          </TouchableOpacity>
          {!!clientError && (
            <Text style={styles.fieldError}>{clientError}</Text>
          )}
        </View>

        {/* ── Informations ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ventes.opportForm.infoSection')}</Text>
          <View style={styles.fieldGroup}>
            <Input
              label={t('ventes.opportForm.titleLabel')}
              value={titre}
              onChangeText={v => { setTitre(v); if (v.trim()) setTitreError(''); }}
              placeholder={t('ventes.opportForm.titlePlaceholder')}
              error={titreError}
            />
            <Input
              label={t('ventes.opportForm.descLabel')}
              value={description}
              onChangeText={setDescription}
              placeholder={t('ventes.opportForm.descPlaceholder')}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* ── Données commerciales ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ventes.opportForm.commercialSection')}</Text>
          <View style={styles.fieldGroup}>
            <Input
              label={t('ventes.opportForm.amountLabel')}
              value={montant}
              onChangeText={setMontant}
              placeholder="Ex: 15000"
              keyboardType="numeric"
            />
            <Input
              label={t('ventes.opportForm.probabilityLabel')}
              value={probabilite}
              onChangeText={setProbabilite}
              placeholder="Ex: 70"
              keyboardType="numeric"
            />
            <Input
              label={t('ventes.opportForm.closureDateLabel')}
              value={dateCloture}
              onChangeText={setDateCloture}
              placeholder="Ex: 2026-06-30"
            />
          </View>
        </View>

        {/* ── Statut pipeline ── */}
        <View style={styles.section}>
          <Text style={styles.selectLabel}>{t('ventes.opportForm.pipelineLabel')}</Text>
          <View style={styles.statutGrid}>
            {KANBAN_COLONNES.map(col => (
              <TouchableOpacity
                key={col.statut}
                style={[
                  styles.statutChip,
                  statut === col.statut && {
                    borderColor:     col.color,
                    backgroundColor: col.bg,
                  },
                ]}
                onPress={() => setStatut(col.statut)}
              >
                <Text style={[
                  styles.statutChipText,
                  statut === col.statut && { color: col.color, fontWeight: '700' },
                ]}>
                  {t(col.labelKey)}
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
                {estEdition ? t('ventes.opportForm.save') : t('ventes.opportForm.create')}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ── Modal sélection client ── */}
      <ClientPickerModal
        visible={pickerVisible}
        onSelect={client => {
          setClientSelectionne(client);
          setClientError('');
          setPickerVisible(false);
        }}
        onClose={() => setPickerVisible(false)}
      />
    </SafeAreaView>
  );
};