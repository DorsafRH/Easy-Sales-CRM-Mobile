import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card }        from '../../components/layout/Card';
import { Button }      from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth }     from '../../context/AuthContext';
import * as EntrepriseApi from '../../api/entreprise.api';
import { EntrepriseCompteResponse } from '../../types/entreprise.types';
import { colors, spacing, typography, radius } from '../../theme';

const STATUT_CONTENT = {
  EN_ATTENTE: { emoji: '⏳', title: "Votre demande est en cours d'examen",   subtitle: "Notre équipe examine votre dossier. Vous serez notifié par email.", bg: colors.warningLight },
  ACTIVE:     { emoji: '🎉', title: "Votre compte est actif !",               subtitle: "Bienvenue sur CRM Mobile. Vous avez accès à toutes les fonctionnalités.", bg: colors.successLight },
  REFUSE:     { emoji: '❌', title: "Votre demande a été refusée",            subtitle: "Consultez le motif de refus ci-dessous.", bg: colors.dangerLight },
  SUSPENDU:   { emoji: '⚠️', title: "Votre compte est suspendu",             subtitle: "Contactez le support pour plus d'informations.", bg: '#F5F3FF' },
};

const MODULES = [
  { icon: '👥', label: 'Clients & Contacts',  sprint: 'Sprint 2' },
  { icon: '📦', label: 'Catalogue produits',   sprint: 'Sprint 2' },
  { icon: '🎯', label: 'Leads & Opportunités', sprint: 'Sprint 3' },
  { icon: '📄', label: 'Devis & Factures',     sprint: 'Sprint 3' },
  { icon: '📱', label: 'Marketing réseaux',    sprint: 'Sprint 4' },
  { icon: '🤖', label: 'Assistant IA',         sprint: 'Sprint 4' },
];

export const StatutCompteScreen: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [entreprise,   setEntreprise]   = useState<EntrepriseCompteResponse | null>(null);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const charger = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true); else setIsLoading(true);
    try {
      const r = await EntrepriseApi.consulterMonStatut();
      if (r.success) setEntreprise(r.data);
    } catch {
      // silencieux
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { charger(); }, [charger]);

  const handleLogout = () => Alert.alert(
    'Déconnexion',
    'Voulez-vous vous déconnecter ?',
    [{ text: 'Annuler', style: 'cancel' }, { text: 'Se déconnecter', style: 'destructive', onPress: logout }]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}><Text style={styles.loading}>Chargement...</Text></View>
      </SafeAreaView>
    );
  }

  const statut  = entreprise?.statutCompte ?? 'EN_ATTENTE';
  const content = STATUT_CONTENT[statut];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => charger(true)} tintColor={colors.primary} />}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Bonjour, {currentUser?.prenom} 👋</Text>
            <Text style={styles.companyName}>{currentUser?.nomEntreprise ?? entreprise?.nomEntreprise}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>↩</Text>
          </TouchableOpacity>
        </View>

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

        {entreprise && (
          <Card style={styles.infoCard}>
            <Text style={styles.cardTitle}>Informations du compte</Text>
            <InfoRow label="Entreprise" value={entreprise.nomEntreprise} />
            <InfoRow label="Matricule"  value={entreprise.matriculeFiscale} mono />
            <InfoRow label="Secteur"    value={entreprise.secteurActivite} />
            <InfoRow label="Demande le" value={formatDate(entreprise.dateCreation)} />
            {entreprise.dateValidation && <InfoRow label="Décision le" value={formatDate(entreprise.dateValidation)} />}
          </Card>
        )}

        {statut === 'ACTIVE' && (
          <Card style={styles.modulesCard}>
            <Text style={styles.cardTitle}>Modules à venir</Text>
            <View style={styles.modulesGrid}>
              {MODULES.map(m => (
                <View key={m.label} style={styles.moduleItem}>
                  <View style={styles.moduleIcon}><Text style={styles.moduleEmoji}>{m.icon}</Text></View>
                  <Text style={styles.moduleLabel}>{m.label}</Text>
                  <Text style={styles.moduleSprint}>{m.sprint}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        <Button label="Se déconnecter" onPress={handleLogout} variant="ghost" fullWidth style={styles.btnLogout} />
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <View style={infoStyles.row}>
    <Text style={infoStyles.label}>{label}</Text>
    <Text style={[infoStyles.value, mono && infoStyles.mono]}>{value}</Text>
  </View>
);

const formatDate = (iso: string) => {
  try { return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }); }
  catch { return iso; }
};

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.bgApp },
  scroll:        { flex: 1 },
  content:       { paddingHorizontal: spacing[5], paddingTop: spacing[4], paddingBottom: spacing[10] },
  center:        { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loading:       { fontSize: typography.size.base, color: colors.textSecondary },
  topBar:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[5] },
  greeting:      { fontSize: typography.size.sm, color: colors.textSecondary, marginBottom: 2 },
  companyName:   { fontSize: typography.size.lg, fontWeight: '700', color: colors.textPrimary },
  logoutBtn:     { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  logoutIcon:    { fontSize: 18, color: colors.textSecondary },
  statusCard:    { borderRadius: radius.xl, padding: spacing[6], alignItems: 'center', marginBottom: spacing[4], borderWidth: 1, borderColor: colors.border },
  statusEmoji:   { fontSize: 36, marginBottom: spacing[4] },
  statusTitle:   { fontSize: typography.size.lg, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginBottom: spacing[3], marginTop: spacing[4] },
  statusSubtitle:{ fontSize: typography.size.sm, color: colors.textSecondary, textAlign: 'center', lineHeight: typography.size.sm * 1.6, marginBottom: spacing[4] },
  motifBox:      { width: '100%', backgroundColor: colors.dangerLight, borderRadius: radius.md, padding: spacing[4], borderLeftWidth: 3, borderLeftColor: colors.danger, marginBottom: spacing[4] },
  motifLabel:    { fontSize: typography.size.xs, fontWeight: '600', color: colors.dangerText, marginBottom: spacing[2] },
  motifText:     { fontSize: typography.size.sm, color: colors.dangerText },
  refreshHint:   { fontSize: typography.size.xs, color: colors.textTertiary, marginTop: spacing[2] },
  infoCard:      { marginBottom: spacing[4] },
  cardTitle:     { fontSize: typography.size.base, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing[4] },
  modulesCard:   { marginBottom: spacing[4] },
  modulesGrid:   { flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing[3], rowGap: spacing[3] },
  moduleItem:    { width: '45%', alignItems: 'center', columnGap: spacing[2], rowGap: spacing[2] },
  moduleIcon:    { width: 52, height: 52, borderRadius: radius.lg, backgroundColor: colors.bgApp, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  moduleEmoji:   { fontSize: 24 },
  moduleLabel:   { fontSize: typography.size.sm, fontWeight: '500', color: colors.textTertiary, textAlign: 'center' },
  moduleSprint:  { fontSize: typography.size.xs, color: colors.primary, fontWeight: '500' },
  btnLogout:     { marginTop: spacing[2] },
});

const infoStyles = StyleSheet.create({
  row:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing[2], borderBottomWidth: 1, borderBottomColor: colors.bgApp },
  label: { fontSize: typography.size.sm, color: colors.textSecondary },
  value: { fontSize: typography.size.sm, fontWeight: '500', color: colors.textPrimary, flex: 1, textAlign: 'right' },
  mono:  { fontFamily: 'monospace', fontSize: typography.size.xs },
});