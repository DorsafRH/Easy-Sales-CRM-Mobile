/**
 * @file DevisDetailScreen.tsx
 * @description Fiche devis avec lignes produits, totaux HT/TVA/TTC,
 *              actions Envoyer/Accepter/Refuser et conversion en facture.
 *              Smart automation : propose de creer une facture apres acceptation.
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

import { useStyles, useTheme }          from '../../theme';
import { makeStyles }                   from './DevisDetailScreen.styles';
import { Badge }                        from '../../components/ui/Badge';
import { SmartActionSheet }             from '../../components/ui/SmartActionSheet';
import { ExportContactModal }           from '../../components/ui/ExportContactModal';
import { VentesStackParamList }         from '../../navigation/VentesStack';

import * as VenteApi  from '../../api/vente.api';
import * as ClientApi from '../../api/client.api';
import {
  DevisResponse,
  STATUT_DEVIS_CONFIG,
} from '../../types/vente.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<VentesStackParamList, 'DevisDetail'>;
type Route = RouteProp<VentesStackParamList, 'DevisDetail'>;

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Fiche devis avec lignes produits et smart automation conversion facture.
 * @author Riahi Dorsaf
 */
export const DevisDetailScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { devisId } = route.params;

  const [devis,        setDevis]        = useState<DevisResponse | null>(null);
  const [isLoading,    setIsLoading]    = useState(true);
  // smartVisible controle la visibilite du SmartActionSheet
  const [smartVisible, setSmartVisible] = useState(false);
  // exportVisible controle la feuille d'export (mail / WhatsApp)
  const [exportVisible,    setExportVisible]    = useState(false);
  const [clientEmail,      setClientEmail]      = useState<string | null>(null);
  const [clientTelephone,  setClientTelephone]  = useState<string | null>(null);

  // ── Chargement ────────────────────────────────────────────

  // Recupere les coordonnees du client pour preremplir l'export.
  const chargerContactClient = useCallback(async (clientId: number) => {
    try {
      const res = await ClientApi.obtenirClient(clientId);
      if (res.success) {
        setClientEmail(res.data.email);
        setClientTelephone(res.data.telephone);
      }
    } catch {
      // non bloquant : l'utilisateur pourra saisir manuellement
    }
  }, []);

  const charger = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await VenteApi.obtenirDevis(devisId);
      if (res.success) {
        setDevis(res.data);
        chargerContactClient(res.data.clientId);
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de charger le devis.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }, [devisId, navigation, chargerContactClient]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // ── Actions statut ────────────────────────────────────────

  const handleEnvoyer = async () => {
    const etaitEnvoye = devis?.statut === 'ENVOYE';
    try {
      const res = await VenteApi.changerStatutDevis(devisId, 'ENVOYE');
      if (res.success) {
        setDevis(res.data);
        Alert.alert(
          etaitEnvoye ? 'Devis renvoyé' : 'Devis envoyé',
          etaitEnvoye
            ? 'Le devis a de nouveau été envoyé au client.'
            : 'Le devis a bien été envoyé au client.',
        );
      }
    } catch (e: any) {
      Alert.alert('Erreur', e?.response?.data?.message ?? 'Impossible d envoyer le devis.');
    }
  };

  const handleAccepter = async () => {
    try {
      const res = await VenteApi.changerStatutDevis(devisId, 'ACCEPTE');
      if (res.success) {
        setDevis(res.data);
        // Smart automation : proposer de convertir en facture
        setSmartVisible(true);
      }
    } catch (e: any) {
      Alert.alert('Erreur', e?.response?.data?.message ?? 'Erreur lors de l acceptation.');
    }
  };

  const handleRefuser = () => {
    Alert.alert('Refuser le devis', 'Confirmer le refus ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Refuser',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await VenteApi.changerStatutDevis(devisId, 'REFUSE');
            if (res.success) setDevis(res.data);
          } catch (e: any) {
            Alert.alert('Erreur', e?.response?.data?.message ?? 'Impossible de refuser.');
          }
        },
      },
    ]);
  };

  const handleConvertirEnFacture = async () => {
    setSmartVisible(false);
    try {
      const res = await VenteApi.convertirDevisEnFacture(devisId);
      if (res.success) {
        navigation.replace('FactureDetail', { factureId: res.data.id });
      }
    } catch (e: any) {
      Alert.alert('Erreur', e?.response?.data?.message ?? 'Erreur lors de la conversion.');
    }
  };

  // ── Rendu ─────────────────────────────────────────────────

  if (isLoading || !devis) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const conf         = STATUT_DEVIS_CONFIG[devis.statut];
  const estBrouillon = devis.statut === 'BROUILLON';
  const estEnvoye    = devis.statut === 'ENVOYE';
  const estAccepte   = devis.statut === 'ACCEPTE';
  // Devis rattaché à une opportunité : la décision « accepter / facturer » se prend
  // UNIQUEMENT depuis la fiche opportunité (« Gagner »). Ici on ne gère que le document.
  const estLieOpp    = devis.opportuniteId != null;

  const fmt = (v: number) =>
    v.toLocaleString('fr-TN', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) + ' TND';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerNumero}>{devis.numero}</Text>
            <Text style={styles.headerDate}>{devis.clientNom} — {devis.dateRelative}</Text>
          </View>
          <Badge label={conf.label} variant="neutral" />
        </View>

        {/* ── Infos generales ── */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informations</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Client</Text>
              <Text style={styles.infoValue}>{devis.clientNom}</Text>
            </View>
            {devis.opportuniteTitre ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Opportunite</Text>
                <Text style={styles.infoValue}>{devis.opportuniteTitre}</Text>
              </View>
            ) : null}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Validite</Text>
              <Text style={styles.infoValue}>{devis.validiteJours} jours</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Cree le</Text>
              <Text style={styles.infoValue}>{devis.dateRelative}</Text>
            </View>
          </View>
        </View>

        {/* ── Lignes articles ── */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Articles ({devis.lignes.length})</Text>
            {devis.lignes.map(ligne => (
              <View key={ligne.id} style={styles.ligneItem}>
                <View style={styles.ligneTopRow}>
                  <Text style={styles.ligneNom} numberOfLines={1}>{ligne.designation}</Text>
                  <Text style={styles.ligneMontant}>{fmt(ligne.montantTtc)}</Text>
                </View>
                <Text style={styles.ligneSub}>
                  {ligne.quantite} x {fmt(ligne.prixUnitaireHt)}
                  {ligne.remise > 0 ? `  —  Remise ${ligne.remise}%` : ''}
                  {ligne.tauxTva > 0 ? `  —  TVA ${ligne.tauxTva}%` : ''}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Totaux ── */}
        <View style={styles.section}>
          <View style={styles.totauxCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total HT</Text>
              <Text style={styles.totalValue}>{fmt(devis.montantHt)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA</Text>
              <Text style={styles.totalValue}>{fmt(devis.montantTva)}</Text>
            </View>
            <View style={styles.totalTtcRow}>
              <Text style={styles.totalTtcLabel}>Total TTC</Text>
              <Text style={styles.totalTtcValue}>{fmt(devis.montantTtc)}</Text>
            </View>
          </View>
        </View>

        {/* ── Notes ── */}
        {devis.notes ? (
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Notes</Text>
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={[styles.infoValue, { textAlign: 'left', marginLeft: 0 }]}>
                  {devis.notes}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* ── Actions ── */}
        <View style={styles.actionsSection}>

          {/* Exporter — toujours visible, quel que soit le statut/contact */}
          <TouchableOpacity style={styles.btnExport} onPress={() => setExportVisible(true)}>
            <Ionicons name="share-outline" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.btnExportText}>Exporter</Text>
          </TouchableOpacity>

          {/* Brouillon → Envoyer */}
          {estBrouillon && (
            <TouchableOpacity style={styles.btnPrimary} onPress={handleEnvoyer}>
              <Ionicons name="send-outline" size={18} color={theme.colors.white} />
              <Text style={styles.btnPrimaryText}>Envoyer le devis</Text>
            </TouchableOpacity>
          )}

          {/* Envoye → Renvoyer (version revisee) */}
          {estEnvoye && (
            <TouchableOpacity style={styles.btnPrimary} onPress={handleEnvoyer}>
              <Ionicons name="send-outline" size={18} color={theme.colors.white} />
              <Text style={styles.btnPrimaryText}>Renvoyer le devis</Text>
            </TouchableOpacity>
          )}

          {/* Devis lié à une opportunité : on facture depuis la fiche opportunité */}
          {estLieOpp && !estBrouillon && (
            <View style={styles.infoOppRow}>
              <Ionicons name="information-circle-outline" size={16} color={theme.colors.textTertiary} />
              <Text style={styles.infoOppText}>
                Pour facturer, marquez l'opportunité comme gagnée depuis sa fiche.
              </Text>
            </View>
          )}

          {/* Envoye → Accepter / Refuser (devis AUTONOME uniquement) */}
          {estEnvoye && !estLieOpp && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { borderColor: '#16A34A', backgroundColor: '#F0FDF4' },
                ]}
                onPress={handleAccepter}
              >
                <Ionicons name="checkmark-outline" size={16} color="#16A34A" />
                <Text style={[styles.actionBtnText, { color: '#16A34A' }]}>Accepte</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { borderColor: theme.colors.danger }]}
                onPress={handleRefuser}
              >
                <Ionicons name="close-outline" size={16} color={theme.colors.danger} />
                <Text style={[styles.actionBtnText, { color: theme.colors.danger }]}>Refuse</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Accepte → Convertir en facture (devis AUTONOME, masque si deja converti) */}
          {estAccepte && !estLieOpp && !devis.dejaConverti && (
            <TouchableOpacity style={styles.btnPrimary} onPress={() => setSmartVisible(true)}>
              <Ionicons name="receipt-outline" size={18} color={theme.colors.white} />
              <Text style={styles.btnPrimaryText}>Convertir en facture</Text>
            </TouchableOpacity>
          )}

          {/* Modifier — tant que le devis n'est pas verrouillé (brouillon ou envoyé) */}
          {(estBrouillon || estEnvoye) && (
            <TouchableOpacity
              style={styles.btnDanger}
              onPress={() => navigation.navigate('DevisForm', { devisId })}
            >
              <Text style={styles.btnDangerText}>Modifier le devis</Text>
            </TouchableOpacity>
          )}

        </View>
      </ScrollView>

      {/* ── Smart Automation ── */}
      <SmartActionSheet
        visible={smartVisible}
        iconName="receipt-outline"
        iconColor="#2563EB"
        iconBg="#EFF6FF"
        title="Devis accepte !"
        subtitle="Voulez-vous generer la facture maintenant ?"
        confirmLabel="Creer la facture"
        dismissLabel="Plus tard"
        onConfirm={handleConvertirEnFacture}
        onDismiss={() => setSmartVisible(false)}
      />

      {/* ── Export mail / WhatsApp ── */}
      <ExportContactModal
        visible={exportVisible}
        onClose={() => setExportVisible(false)}
        clientEmail={clientEmail}
        clientTelephone={clientTelephone}
        subject={`Devis ${devis.numero}`}
        mailBody={`Bonjour,\n\nVeuillez trouver les details de votre devis ${devis.numero} d'un montant de ${fmt(devis.montantTtc)}.\n\nCordialement.`}
        whatsappText={`Bonjour, voici votre devis ${devis.numero} d'un montant de ${fmt(devis.montantTtc)}.`}
      />
    </SafeAreaView>
  );
};