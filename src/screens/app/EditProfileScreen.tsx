/**
 * @file EditProfileScreen.tsx
 * @description Fiche profil avec mode lecture/édition.
 *              Le bouton "Modifier" s'active uniquement si un champ a changé.
 * @author Riahi Dorsaf
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { SafeAreaView }              from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card }    from '../../components/layout/Card';
import { Input }   from '../../components/ui/Input';
import { Button }  from '../../components/ui/Button';
import { useStyles } from '../../theme';
import { makeStyles } from './EditProfileScreen.styles';
import { AppStackParamList } from '../../navigation/AppStack';
import { useAuth } from '../../context/AuthContext';
import * as ProprietaireApi from '../../api/proprietaire.api';
import { ModifierProfilRequest } from '../../types/proprietaire.types';

type Props = {
  navigation: NativeStackNavigationProp<AppStackParamList, 'EditProfile'>;
};

export const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const styles          = useStyles(makeStyles);
  const { currentUser } = useAuth();

  // ── Données originales (référence pour détecter les changements) ──
  const [original, setOriginal] = useState({ nom: '', prenom: '', telephone: '' });

  // ── État formulaire ───────────────────────────────────────────────
  const [nom,       setNom]       = useState('');
  const [prenom,    setPrenom]    = useState('');
  const [telephone, setTelephone] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving,  setIsSaving]  = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [errors,    setErrors]    = useState({ nom: '', prenom: '', telephone: '' });

  // ── Chargement des données ────────────────────────────────────────
  useEffect(() => {
    const charger = async () => {
      try {
        const response = await ProprietaireApi.consulterProfil();
        if (response.success) {
          const d = response.data;
          const data = {
            nom:       d.nom       ?? '',
            prenom:    d.prenom    ?? '',
            telephone: d.telephone ?? '',
          };
          setOriginal(data);
          setNom(data.nom);
          setPrenom(data.prenom);
          setTelephone(data.telephone);
        }
      } catch {
        // silencieux
      } finally {
        setIsLoading(false);
      }
    };
    charger();
  }, []);

  // ── Détection de changement ───────────────────────────────────────
  const hasChanged = useMemo(() => (
    nom.trim()       !== original.nom       ||
    prenom.trim()    !== original.prenom    ||
    telephone.trim() !== original.telephone
  ), [nom, prenom, telephone, original]);

  // ── Initiales avatar ──────────────────────────────────────────────
  const initiales = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();

  // ── Annuler édition ───────────────────────────────────────────────
  const handleAnnuler = () => {
    setNom(original.nom);
    setPrenom(original.prenom);
    setTelephone(original.telephone);
    setErrors({ nom: '', prenom: '', telephone: '' });
    setError(null);
    setIsEditing(false);
  };

  // ── Validation ────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e = { nom: '', prenom: '', telephone: '' };
    let valid = true;
    if (!nom.trim())       { e.nom       = 'Le nom est obligatoire.';       valid = false; }
    if (!prenom.trim())    { e.prenom    = 'Le prénom est obligatoire.';    valid = false; }
    if (!telephone.trim()) { e.telephone = 'Le téléphone est obligatoire.'; valid = false; }
    setErrors(e);
    return valid;
  };

  // ── Soumission ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate() || !hasChanged) return;
    setIsSaving(true);
    setError(null);
    try {
      const request: ModifierProfilRequest = {
        nom: nom.trim(), prenom: prenom.trim(), telephone: telephone.trim(),
      };
      const response = await ProprietaireApi.modifierProfil(request);
      if (response.success) {
        setOriginal({ nom: nom.trim(), prenom: prenom.trim(), telephone: telephone.trim() });
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
        <Text style={styles.headerTitle}>Mon profil</Text>
        {isEditing && (
          <TouchableOpacity style={styles.annulerBtn} onPress={handleAnnuler}>
            <Text style={styles.annulerText}>Annuler</Text>
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initiales || '?'}</Text>
            </View>
            <Text style={styles.avatarName}>{prenom} {nom}</Text>
            <Text style={styles.avatarEmail}>{currentUser?.email}</Text>
          </View>

          {/* Alerte succès */}
          {isSuccess && (
            <View style={styles.alertSuccess}>
              <Text style={styles.alertSuccessText}>✅ Profil mis à jour avec succès !</Text>
            </View>
          )}

          {/* Alerte erreur */}
          {error && (
            <View style={styles.alertError}>
              <Text style={styles.alertErrorText}>⚠️ {error}</Text>
            </View>
          )}

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Données personnelles</Text>

            {isEditing ? (
              /* ── Mode édition ── */
              <>
                <Input label="Prénom" placeholder="Ahmed" value={prenom}
                  onChangeText={v => { setPrenom(v); setErrors(e => ({ ...e, prenom: '' })); }}
                  error={errors.prenom} required autoCapitalize="words" />

                <Input label="Nom" placeholder="Ben Ali" value={nom}
                  onChangeText={v => { setNom(v); setErrors(e => ({ ...e, nom: '' })); }}
                  error={errors.nom} required autoCapitalize="words" />

                <Input label="Téléphone" placeholder="+216 20 000 000" value={telephone}
                  onChangeText={v => { setTelephone(v); setErrors(e => ({ ...e, telephone: '' })); }}
                  error={errors.telephone} required keyboardType="phone-pad" />

                {/* Email non modifiable */}
                <View style={styles.emailField}>
                  <Text style={styles.emailLabel}>Email (non modifiable)</Text>
                  <View style={styles.emailValue}>
                    <Text style={styles.emailText}>{currentUser?.email}</Text>
                    <Text style={styles.emailLock}>🔒</Text>
                  </View>
                </View>

                <Button
                  label="Enregistrer les modifications"
                  onPress={handleSubmit}
                  loading={isSaving}
                  disabled={!hasChanged}
                  fullWidth
                  size="lg"
                  style={styles.btnSubmit}
                />
              </>
            ) : (
              /* ── Mode lecture ── */
              <>
                <FicheRow label="Prénom"    value={prenom} />
                <FicheRow label="Nom"       value={nom} />
                <FicheRow label="Téléphone" value={telephone || '—'} />
                <FicheRow label="Email"     value={currentUser?.email ?? '—'} />

                <Button
                  label="✏️  Modifier le profil"
                  onPress={() => setIsEditing(true)}
                  fullWidth
                  size="lg"
                  style={styles.btnSubmit}
                />
              </>
            )}
          </Card>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ── Sous-composant fiche ──────────────────────────────────────────────────────
const FicheRow: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.ficheRow}>
      <Text style={styles.ficheLabel}>{label}</Text>
      <Text style={[styles.ficheValue, mono && styles.ficheMono]}>{value}</Text>
    </View>
  );
};