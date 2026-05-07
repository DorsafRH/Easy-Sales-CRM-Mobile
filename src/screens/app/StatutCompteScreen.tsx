/**
 * @file StatutCompteScreen.tsx
 * @description Écran de statut du compte.
 *              Si le statut est ACTIVE, appelle marquerCompteActif() pour
 *              mémoriser le statut dans SecureStore puis redirige vers MainTab.
 *              Sinon, affiche le statut EN_ATTENTE / REFUSE / SUSPENDU.
 * @author Riahi Dorsaf
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card }        from '../../components/layout/Card';
import { Button }      from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth }     from '../../context/AuthContext';
import { useStyles, useTheme, AppTheme } from '../../theme';
import * as EntrepriseApi from '../../api/entreprise.api';
import { EntrepriseCompteResponse } from '../../types/entreprise.types';
import { makeStyles } from './StatutCompteScreen.styles';
import { AppStackParamList } from '../../navigation/AppStack';

type StatutKey = 'EN_ATTENTE' | 'ACTIVE' | 'REFUSE' | 'SUSPENDU';

const getStatutContent = (theme: AppTheme): Record<StatutKey, {
  emoji: string; title: string; subtitle: string; bg: string;
}> => ({
  EN_ATTENTE: {
    emoji:    '⏳',
    title:    "Votre demande est en cours d'examen",
    subtitle: "Notre équipe examine votre dossier. Vous serez notifié par email.",
    bg:       theme.colors.warningLight,
  },
  ACTIVE: {
    emoji:    '🎉',
    title:    "Votre compte est actif !",
    subtitle: "Bienvenue sur CRM Mobile. Vous avez accès à toutes les fonctionnalités.",
    bg:       theme.colors.successLight,
  },
  REFUSE: {
    emoji:    '❌',
    title:    "Votre demande a été refusée",
    subtitle: "Consultez le motif de refus ci-dessous.",
    bg:       theme.colors.dangerLight,
  },
  SUSPENDU: {
    emoji:    '⚠️',
    title:    "Votre compte est suspendu",
    subtitle: "Contactez le support pour plus d'informations.",
    bg:       theme.colors.statutSuspenduLight,
  },
});

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  } catch { return iso; }
};

const InfoRow: React.FC<{ label: string; value: string; mono?: boolean }> = ({
  label, value, mono,
}) => {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, mono && styles.infoMono]}>{value}</Text>
    </View>
  );
};

export const StatutCompteScreen: React.FC = () => {
  const { currentUser, logout, marquerCompteActif } = useAuth();
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [entreprise,   setEntreprise]   = useState<EntrepriseCompteResponse | null>(null);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError,     setHasError]     = useState(false);

  const charger = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setHasError(false);
    try {
      const r = await EntrepriseApi.consulterMonStatut();
      if (r.success) {
        setEntreprise(r.data);
      } else {
        setHasError(true);
      }
    } catch {
      // Ne pas defaulter à EN_ATTENTE si l'API échoue —
      // afficher un état d'erreur avec bouton Réessayer
      setHasError(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { charger(); }, [charger]);

  // ── Redirection automatique si ACTIVE ────────────────────────
  useEffect(() => {
    if (entreprise?.statutCompte === 'ACTIVE') {
      // 1. Mémorise que le compte est ACTIVE dans SecureStore
      //    → les prochaines ouvertures iront directement au Dashboard
      // 2. Redirige vers MainTab
      marquerCompteActif().then(() => {
        navigation.replace('MainTab');
      });
    }
  }, [entreprise, navigation, marquerCompteActif]);

  const handleLogout = () => Alert.alert(
    'Déconnexion',
    'Voulez-vous vous déconnecter ?',
    [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: logout },
    ],
  );

  // ── Chargement ────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loading}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Erreur réseau ─────────────────────────────────────────
  if (hasError) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loading}>⚠️ Impossible de contacter le serveur.</Text>
          <Button
            label="Réessayer"
            onPress={() => charger()}
            variant="primary"
            style={{ marginTop: 16 }}
          />
          <Button
            label="Se déconnecter"
            onPress={handleLogout}
            variant="ghost"
            style={{ marginTop: 8 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const statut        = (entreprise?.statutCompte ?? 'EN_ATTENTE') as StatutKey;
  const statutContent = getStatutContent(theme);
  const content       = statutContent[statut];

  // Si ACTIVE, ne rien rendre (redirection déjà déclenchée)
  if (statut === 'ACTIVE') return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => charger(true)}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* ── Top Bar ── */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Bonjour, {currentUser?.prenom} 👋</Text>
            <Text style={styles.companyName}>
              {currentUser?.nomEntreprise ?? entreprise?.nomEntreprise}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>↩</Text>
          </TouchableOpacity>
        </View>

        {/* ── Carte statut ── */}
        <View style={[styles.statusCard, { backgroundColor: content.bg }]}>
          <Text style={styles.statusEmoji}>{content.emoji}</Text>
          <StatusBadge statut={statut} />
          <Text style={styles.statusTitle}>{content.title}</Text>
          <Text style={styles.statusSubtitle}>{content.subtitle}</Text>
          {statut === 'REFUSE' && entreprise?.motifRefus && (
            <View style={styles.motifBox}>
              <Text style={styles.motifLabel}>Motif :</Text>
              <Text style={styles.motifText}>{entreprise.motifRefus}</Text>
            </View>
          )}
          <Text style={styles.refreshHint}>↓ Tirez vers le bas pour actualiser</Text>
        </View>

        {/* ── Infos compte ── */}
        {entreprise && (
          <Card style={styles.infoCard}>
            <Text style={styles.cardTitle}>Informations du compte</Text>
            <InfoRow label="Entreprise" value={entreprise.nomEntreprise} />
            <InfoRow label="Matricule"  value={entreprise.matriculeFiscale} mono />
            <InfoRow label="Secteur"    value={entreprise.secteurActivite} />
            <InfoRow label="Demande le" value={formatDate(entreprise.dateCreation)} />
            {entreprise.dateValidation && (
              <InfoRow label="Décision le" value={formatDate(entreprise.dateValidation)} />
            )}
          </Card>
        )}

        <Button
          label="Se déconnecter"
          onPress={handleLogout}
          variant="ghost"
          fullWidth
          style={styles.btnLogout}
        />
      </ScrollView>
    </SafeAreaView>
  );
};