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
import { EnvoiDocumentSheet }           from '../../components/ui/EnvoiDocumentSheet';
import { VentesStackParamList }         from '../../navigation/VentesStack';

import * as VenteApi  from '../../api/vente.api';
import * as ClientApi from '../../api/client.api';
import {
  genererPdfUri, partagerPdf, telechargerPdf, envoyerParMail, corpsMailTexte, sujetMail, fmtTnd,
} from '../../utils/envoiDocument';
import { genererHtmlDocument } from '../../utils/documentPdf';
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
// GENERATEUR HTML PDF (devis) — delegue au template partage
// ─────────────────────────────────────────────────────────────

const genererHtmlDevis = (d: DevisResponse): string =>
  genererHtmlDocument({
    marque:     'Easy Sales CRM',
    numero:     d.numero,
    dateLigne:  [
      d.dateCreation ? 'Etabli le ' + d.dateCreation.split('T')[0] : '',
      d.validiteJours ? 'Validite : ' + d.validiteJours + ' jours' : '',
    ].filter(Boolean).join(' | '),
    clientNom:  d.clientNom,
    lignes:     d.lignes,
    montantHt:  d.montantHt,
    montantTva: d.montantTva,
    montantTtc: d.montantTtc,
    notes:      d.notes,
  });

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
  // isEnvoi : generation du PDF en cours avant l'ouverture de la feuille d'envoi
  const [isEnvoi,          setIsEnvoi]          = useState(false);
  const [envoiVisible,     setEnvoiVisible]     = useState(false);
  const [pdfUri,           setPdfUri]           = useState<string | null>(null);
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

  // Passe le devis a ENVOYE apres un envoi mail/WhatsApp (uniquement si encore
  // modifiable : brouillon ou deja envoye). On ne regresse pas un devis accepte/refuse.
  const marquerEnvoye = async () => {
    if (!devis || (devis.statut !== 'BROUILLON' && devis.statut !== 'ENVOYE')) return;
    try {
      const res = await VenteApi.changerStatutDevis(devisId, 'ENVOYE');
      if (res.success) setDevis(res.data);
    } catch {
      // l'envoi a deja eu lieu : on n'interrompt pas l'utilisateur
    }
  };

  const envoyerMail = async (pdfUri: string) => {
    if (!devis || !clientEmail?.trim()) return;
    const res = await envoyerParMail({
      pdfUri,
      email:     clientEmail.trim(),
      sujet:     sujetMail('devis'),
      corps:     corpsMailTexte({
        typeDoc: 'devis',
        montantTtc: fmtTnd(devis.montantTtc), clientNom: devis.clientNom,
      }),
    });
    if (res !== 'cancelled') {
      await marquerEnvoye();
      Alert.alert('Devis envoyé');
    }
  };

  const envoyerWhatsapp = async (pdfUri: string) => {
    if (!devis) return;
    await partagerPdf(pdfUri, `Devis ${devis.numero}`);
    await marquerEnvoye();
  };

  // Bouton unique « Envoyer » : genere le PDF puis ouvre la feuille de partage
  // (Mail si email, WhatsApp si telephone, Exporter toujours dispo).
  const handleEnvoyer = async () => {
    if (!devis) return;
    setIsEnvoi(true);
    try {
      const uri = await genererPdfUri(genererHtmlDevis(devis));
      setPdfUri(uri);
      setEnvoiVisible(true);
    } catch {
      Alert.alert('Erreur', 'Impossible de générer le PDF du devis.');
    } finally {
      setIsEnvoi(false);
    }
  };

  // Telecharger / enregistrer le PDF sur le telephone (Android : dossier choisi ;
  // iOS : Fichiers). Sans envoi ni changement de statut.
  const handleTelechargerPdf = async () => {
    if (!devis) return;
    setIsEnvoi(true);
    try {
      const uri = await genererPdfUri(genererHtmlDevis(devis));
      const res = await telechargerPdf(uri, `Devis ${devis.numero}`);
      if (res === 'enregistre') {
        Alert.alert('PDF enregistré', 'Le devis a été enregistré dans vos Téléchargements.');
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de générer le PDF du devis.');
    } finally {
      setIsEnvoi(false);
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

  const fmt = fmtTnd;

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

          {/* Bouton unique « Envoyer » : ouvre Mail / WhatsApp / Exporter (PDF joint) */}
          <TouchableOpacity style={styles.btnPrimary} onPress={handleEnvoyer} disabled={isEnvoi}>
            {isEnvoi ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <>
                <Ionicons name="send-outline" size={18} color={theme.colors.white} />
                <Text style={styles.btnPrimaryText}>
                  {estEnvoye ? 'Renvoyer le devis' : 'Envoyer le devis'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Telecharger le PDF sur le telephone */}
          <TouchableOpacity style={styles.btnSecondary} onPress={handleTelechargerPdf} disabled={isEnvoi}>
            <Ionicons name="download-outline" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.btnSecondaryText}>Télécharger le PDF</Text>
          </TouchableOpacity>

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

      {/* ── Feuille d'envoi (Mail / WhatsApp / Exporter) ── */}
      <EnvoiDocumentSheet
        visible={envoiVisible}
        onClose={() => setEnvoiVisible(false)}
        titre={`Envoyer le devis ${devis.numero}`}
        hasEmail={!!clientEmail?.trim()}
        hasPhone={!!clientTelephone?.trim()}
        onMail={() => pdfUri && envoyerMail(pdfUri)}
        onWhatsapp={() => pdfUri && envoyerWhatsapp(pdfUri)}
        onExport={() => pdfUri && partagerPdf(pdfUri, `Devis ${devis.numero}`)}
      />
    </SafeAreaView>
  );
};