/**
 * @file EditCompanyScreen.tsx
 * @description Fiche entreprise avec mode lecture/édition.
 * @author Riahi Dorsaf
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { SafeAreaView }              from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card }   from '../../components/layout/Card';
import { Input }  from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useStyles } from '../../theme';
import { makeStyles } from './EditCompanyScreen.styles';
import { AppStackParamList } from '../../navigation/AppStack';
import * as ProprietaireApi from '../../api/proprietaire.api';
import { ModifierEntrepriseRequest, TailleEntreprise } from '../../types/proprietaire.types';
import { useTranslation } from 'react-i18next';

type Props = {
  navigation: NativeStackNavigationProp<AppStackParamList, 'EditCompany'>;
};

type FormData = {
  nomEntreprise: string; secteurActivite: string;
  tailleEntreprise: TailleEntreprise | '';
  telephone: string; adresse: string; ville: string; pays: string; siteWeb: string;
};

const TAILLES: { value: TailleEntreprise; label: string; desc: string }[] = [
  { value: 'TPE', label: 'TPE', desc: '< 10 employés'   },
  { value: 'PME', label: 'PME', desc: '10-250 employés' },
  { value: 'GE',  label: 'GE',  desc: '> 250 employés'  },
];

const EMPTY: FormData = {
  nomEntreprise: '', secteurActivite: '', tailleEntreprise: '',
  telephone: '', adresse: '', ville: '', pays: '', siteWeb: '',
};

export const EditCompanyScreen: React.FC<Props> = ({ navigation }) => {
  const styles = useStyles(makeStyles);
  const { t }  = useTranslation();

  const [original,  setOriginal]  = useState<FormData>(EMPTY);
  const [form,      setForm]      = useState<FormData>(EMPTY);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving,  setIsSaving]  = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [errors,    setErrors]    = useState({ nomEntreprise: '', tailleEntreprise: '' });

  // ── Chargement ────────────────────────────────────────────────
  useEffect(() => {
    const charger = async () => {
      try {
        const response = await ProprietaireApi.consulterProfil();
        if (response.success) {
          const d = response.data;
          const data: FormData = {
            nomEntreprise:    d.nomEntreprise      ?? '',
            secteurActivite:  d.secteurActivite    ?? '',
            tailleEntreprise: d.tailleEntreprise   ?? '',
            telephone:        d.telephoneEntreprise ?? '',
            adresse:          d.adresse            ?? '',
            ville:            d.ville              ?? '',
            pays:             d.pays               ?? '',
            siteWeb:          d.siteWeb            ?? '',
          };
          setOriginal(data);
          setForm(data);
        }
      } catch {
        // silencieux
      } finally {
        setIsLoading(false);
      }
    };
    charger();
  }, []);

  // ── Détection changement ──────────────────────────────────────
  const hasChanged = useMemo(() =>
    JSON.stringify(form) !== JSON.stringify(original),
  [form, original]);

  const setField = (key: keyof FormData) => (value: string) =>
    setForm(f => ({ ...f, [key]: value }));

  // ── Annuler ───────────────────────────────────────────────────
  const handleAnnuler = () => {
    setForm(original);
    setErrors({ nomEntreprise: '', tailleEntreprise: '' });
    setError(null);
    setIsEditing(false);
  };

  // ── Validation ────────────────────────────────────────────────
  const validate = (): boolean => {
    const e = { nomEntreprise: '', tailleEntreprise: '' };
    let valid = true;
    if (!form.nomEntreprise.trim())  { e.nomEntreprise = "Le nom est obligatoire."; valid = false; }
    if (!form.tailleEntreprise)      { e.tailleEntreprise = 'La taille est obligatoire.'; valid = false; }
    setErrors(e);
    return valid;
  };

  // ── Soumission ────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate() || !hasChanged) return;
    setIsSaving(true);
    setError(null);
    try {
      const request: ModifierEntrepriseRequest = {
        nomEntreprise:    form.nomEntreprise.trim(),
        secteurActivite:  form.secteurActivite.trim(),
        tailleEntreprise: form.tailleEntreprise as TailleEntreprise,
        telephone:        form.telephone.trim(),
        adresse:          form.adresse.trim(),
        ville:            form.ville.trim(),
        pays:             form.pays.trim(),
        siteWeb:          form.siteWeb.trim(),
      };
      const response = await ProprietaireApi.modifierEntreprise(request);
      if (response.success) {
        setOriginal({ ...form });
        setIsSuccess(true);
        setIsEditing(false);
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        setError(response.message ?? 'Une erreur est survenue.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Une erreur est survenue.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content"
        backgroundColor={Platform.OS === 'android' ? '#FFFFFF' : 'transparent'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('company.title')}</Text>
        {isEditing && (
          <TouchableOpacity style={styles.annulerBtn} onPress={handleAnnuler}>
            <Text style={styles.annulerText}>{t('profile.cancel')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Info */}
          {isEditing && (
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text style={styles.infoText}>
                Toute modification sera notifiée au Super Admin pour suivi.
              </Text>
            </View>
          )}

          {isSuccess && (
            <View style={styles.alertSuccess}>
              <Text style={styles.alertSuccessText}>✅ Données entreprise mises à jour !</Text>
            </View>
          )}
          {error && (
            <View style={styles.alertError}>
              <Text style={styles.alertErrorText}>⚠️ {error}</Text>
            </View>
          )}

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Informations entreprise</Text>

            {isEditing ? (
              /* ── Mode édition ── */
              <>
                <Input label={t('company.name')} placeholder="Ex : TechCorp SARL"
                  value={form.nomEntreprise} required autoCapitalize="words"
                  error={errors.nomEntreprise}
                  onChangeText={v => { setField('nomEntreprise')(v); setErrors(e => ({ ...e, nomEntreprise: '' })); }} />

                <Input label={t('company.sector')} placeholder="Ex : Technologies"
                  value={form.secteurActivite} autoCapitalize="words"
                  onChangeText={setField('secteurActivite')} />

                {/* Taille */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    {t('company.size')} <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.tailleRow}>
                    {TAILLES.map(t => (
                      <TouchableOpacity key={t.value}
                        style={[styles.tailleCard, form.tailleEntreprise === t.value && styles.tailleCardActive]}
                        onPress={() => { setForm(f => ({ ...f, tailleEntreprise: t.value })); setErrors(e => ({ ...e, tailleEntreprise: '' })); }}>
                        <Text style={[styles.tailleLabel, form.tailleEntreprise === t.value && styles.tailleLabelActive]}>{t.label}</Text>
                        <Text style={[styles.tailleDesc,  form.tailleEntreprise === t.value && styles.tailleDescActive]}>{t.desc}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {errors.tailleEntreprise ? <Text style={styles.errorText}>{errors.tailleEntreprise}</Text> : null}
                </View>

                <Input label={t('company.phone')} placeholder="+216 71 000 000"
                  value={form.telephone} keyboardType="phone-pad"
                  onChangeText={setField('telephone')} />

                <Input label={t('company.address')} placeholder="12 Rue des Roses"
                  value={form.adresse} onChangeText={setField('adresse')} />

                <View style={styles.row}>
                  <View style={styles.rowItem}>
                    <Input label={t('company.city')} placeholder="Tunis"
                      value={form.ville} onChangeText={setField('ville')} />
                  </View>
                  <View style={styles.rowItem}>
                    <Input label={t('company.country')} placeholder="Tunisie"
                      value={form.pays} onChangeText={setField('pays')} />
                  </View>
                </View>

                <Input label={t('company.website')} placeholder="https://mon-site.com"
                  value={form.siteWeb} keyboardType="url"
                  onChangeText={setField('siteWeb')} />

                <Button label={t('company.save')}
                  onPress={handleSubmit} loading={isSaving}
                  disabled={!hasChanged} fullWidth size="lg" style={styles.btnSubmit} />
              </>
            ) : (
              /* ── Mode lecture ── */
              <>
                <FicheRow label={t('company.name')}    value={form.nomEntreprise    || '—'} />
                <FicheRow label={t('company.sector')}  value={form.secteurActivite  || '—'} />
                <FicheRow label={t('company.size')}    value={form.tailleEntreprise || '—'} />
                <FicheRow label={t('company.phone')}   value={form.telephone        || '—'} />
                <FicheRow label={t('company.address')} value={form.adresse          || '—'} />
                <FicheRow label={t('company.city')}    value={form.ville            || '—'} />
                <FicheRow label={t('company.country')} value={form.pays             || '—'} />
                <FicheRow label={t('company.website')} value={form.siteWeb          || '—'} />

                <Button label={t('company.edit')}
                  onPress={() => setIsEditing(true)}
                  fullWidth size="lg" style={styles.btnSubmit} />
              </>
            )}
          </Card>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const FicheRow: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.ficheRow}>
      <Text style={styles.ficheLabel}>{label}</Text>
      <Text style={styles.ficheValue}>{value}</Text>
    </View>
  );
};