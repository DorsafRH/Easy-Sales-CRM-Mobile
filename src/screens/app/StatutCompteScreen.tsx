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
import { useTranslation } from 'react-i18next';
import { AppStackParamList } from '../../navigation/AppStack';

type StatutKey = 'EN_ATTENTE' | 'ACTIVE' | 'REFUSE' | 'SUSPENDU';

type TFn = (key: string) => string;
const getStatutContent = (theme: AppTheme, t: TFn): Record<StatutKey, {
  emoji: string; title: string; subtitle: string; bg: string;
}> => ({
  EN_ATTENTE: {
    emoji:    '⏳',
    title:    t('account.statut.EN_ATTENTE.title'),
    subtitle: t('account.statut.EN_ATTENTE.subtitle'),
    bg:       theme.colors.warningLight,
  },
  ACTIVE: {
    emoji:    '🎉',
    title:    t('account.statut.ACTIVE.title'),
    subtitle: t('account.statut.ACTIVE.subtitle'),
    bg:       theme.colors.successLight,
  },
  REFUSE: {
    emoji:    '❌',
    title:    t('account.statut.REFUSE.title'),
    subtitle: t('account.statut.REFUSE.subtitle'),
    bg:       theme.colors.dangerLight,
  },
  SUSPENDU: {
    emoji:    '⚠️',
    title:    t('account.statut.SUSPENDU.title'),
    subtitle: t('account.statut.SUSPENDU.subtitle'),
    bg:       theme.colors.statutSuspenduLight,
  },
});

const formatDate = (iso: string, locale = 'fr-FR') => {
  try {
    return new Date(iso).toLocaleDateString(locale, {
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
  const { t, i18n } = useTranslation();
  const locale      = i18n.language === 'en' ? 'en-US' : 'fr-FR';
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
      { text: t('account.logout'), style: 'destructive', onPress: logout },
    ],
  );

  // ── Chargement ────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.center}>
          <Text style={styles.loading}>{t('account.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Erreur réseau ─────────────────────────────────────────
  if (hasError) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.center}>
          <Text style={styles.loading}>{t('account.serverError')}</Text>
          <Button
            label={t('account.retry')}
            onPress={() => charger()}
            variant="primary"
            style={{ marginTop: 16 }}
          />
          <Button
            label={t('account.logout')}
            onPress={handleLogout}
            variant="ghost"
            style={{ marginTop: 8 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const statut        = (entreprise?.statutCompte ?? 'EN_ATTENTE') as StatutKey;
  const statutContent = getStatutContent(theme, t);
  const content       = statutContent[statut];

  // Si ACTIVE, ne rien rendre (redirection déjà déclenchée)
  if (statut === 'ACTIVE') return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
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
            <Text style={styles.greeting}>{t('dashboard.greeting', { name: currentUser?.prenom })}</Text>
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
              <Text style={styles.motifLabel}>{t('account.motif')}</Text>
              <Text style={styles.motifText}>{entreprise.motifRefus}</Text>
            </View>
          )}
          <Text style={styles.refreshHint}>{t('account.refreshHint')}</Text>
        </View>

        {/* ── Infos compte ── */}
        {entreprise && (
          <Card style={styles.infoCard}>
            <Text style={styles.cardTitle}>{t('account.infoTitle')}</Text>
            <InfoRow label={t('account.company')} value={entreprise.nomEntreprise} />
            <InfoRow label={t('account.fiscal')}  value={entreprise.matriculeFiscale} mono />
            <InfoRow label={t('account.sector')}  value={entreprise.secteurActivite} />
            <InfoRow label={t('account.requestedOn')} value={formatDate(entreprise.dateCreation, locale)} />
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