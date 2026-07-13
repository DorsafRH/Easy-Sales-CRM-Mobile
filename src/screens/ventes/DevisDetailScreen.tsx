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
import { useTranslation }                       from 'react-i18next';

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
  const { t }      = useTranslation();
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
      Alert.alert(t('ventes.leadDetail.error'), t('ventes.devis.loadError'));
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
      Alert.alert(t('ventes.devis.sentAlert'));
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
      Alert.alert(t('ventes.leadDetail.error'), t('ventes.devis.pdfError'));
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
        Alert.alert(t('ventes.devis.pdfSavedTitle'), t('ventes.devis.pdfSavedMsg'));
      }
    } catch {
      Alert.alert(t('ventes.leadDetail.error'), t('ventes.devis.pdfError'));
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
      Alert.alert(t('ventes.leadDetail.error'), e?.response?.data?.message ?? t('ventes.devis.acceptError'));
    }
  };

  const handleRefuser = () => {
    Alert.alert(t('ventes.devis.refuseTitle'), t('ventes.devis.refuseConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('ventes.devis.refuse'),
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await VenteApi.changerStatutDevis(devisId, 'REFUSE');
            if (res.success) setDevis(res.data);
          } catch (e: any) {
            Alert.alert(t('ventes.leadDetail.error'), e?.response?.data?.message ?? t('ventes.devis.refuseError'));
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
      Alert.alert(t('ventes.leadDetail.error'), e?.response?.data?.message ?? t('ventes.leadDetail.convertError'));
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
          <Badge label={t(conf.labelKey)} variant="neutral" />
        </View>

        {/* ── Infos generales ── */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('ventes.opport.infoTitle')}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('ventes.opport.client')}</Text>
              <Text style={styles.infoValue}>{devis.clientNom}</Text>
            </View>
            {devis.opportuniteTitre ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('ventes.devis.opportunity')}</Text>
                <Text style={styles.infoValue}>{devis.opportuniteTitre}</Text>
              </View>
            ) : null}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('ventes.devis.validity')}</Text>
              <Text style={styles.infoValue}>{devis.validiteJours} {t('ventes.devis.days')}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>{t('ventes.opport.createdAt')}</Text>
              <Text style={styles.infoValue}>{devis.dateRelative}</Text>
            </View>
          </View>
        </View>

        {/* ── Lignes articles ── */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('ventes.devis.articles', { nb: devis.lignes.length })}</Text>
            {devis.lignes.map(ligne => (
              <View key={ligne.id} style={styles.ligneItem}>
                <View style={styles.ligneTopRow}>
                  <Text style={styles.ligneNom} numberOfLines={1}>{ligne.designation}</Text>
                  <Text style={styles.ligneMontant}>{fmt(ligne.montantTtc)}</Text>
                </View>
                <Text style={styles.ligneSub}>
                  {ligne.quantite} x {fmt(ligne.prixUnitaireHt)}
                  {ligne.remise > 0 ? `  —  ${t('ventes.devis.discount')} ${ligne.remise}%` : ''}
                  {ligne.tauxTva > 0 ? `  —  ${t('ventes.devis.vat')} ${ligne.tauxTva}%` : ''}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Totaux ── */}
        <View style={styles.section}>
          <View style={styles.totauxCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('ventes.devis.subtotalHt')}</Text>
              <Text style={styles.totalValue}>{fmt(devis.montantHt)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('ventes.devis.vat')}</Text>
              <Text style={styles.totalValue}>{fmt(devis.montantTva)}</Text>
            </View>
            <View style={styles.totalTtcRow}>
              <Text style={styles.totalTtcLabel}>{t('ventes.devis.totalTtc')}</Text>
              <Text style={styles.totalTtcValue}>{fmt(devis.montantTtc)}</Text>
            </View>
          </View>
        </View>

        {/* ── Notes ── */}
        {devis.notes ? (
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t('ventes.devis.notes')}</Text>
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
                  {estEnvoye ? t('ventes.devis.resend') : t('ventes.devis.send')}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Telecharger le PDF sur le telephone */}
          <TouchableOpacity style={styles.btnSecondary} onPress={handleTelechargerPdf} disabled={isEnvoi}>
            <Ionicons name="download-outline" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.btnSecondaryText}>{t('ventes.devis.downloadPdf')}</Text>
          </TouchableOpacity>

          {/* Devis lié à une opportunité : on facture depuis la fiche opportunité */}
          {estLieOpp && !estBrouillon && (
            <View style={styles.infoOppRow}>
              <Ionicons name="information-circle-outline" size={16} color={theme.colors.textTertiary} />
              <Text style={styles.infoOppText}>
                {t('ventes.devis.invoiceFromOpp')}
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
                <Text style={[styles.actionBtnText, { color: '#16A34A' }]}>{t('ventes.devis.accept')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { borderColor: theme.colors.danger }]}
                onPress={handleRefuser}
              >
                <Ionicons name="close-outline" size={16} color={theme.colors.danger} />
                <Text style={[styles.actionBtnText, { color: theme.colors.danger }]}>{t('ventes.devis.refuse')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Accepte → Convertir en facture (devis AUTONOME, masque si deja converti) */}
          {estAccepte && !estLieOpp && !devis.dejaConverti && (
            <TouchableOpacity style={styles.btnPrimary} onPress={() => setSmartVisible(true)}>
              <Ionicons name="receipt-outline" size={18} color={theme.colors.white} />
              <Text style={styles.btnPrimaryText}>{t('ventes.devis.convertToInvoice')}</Text>
            </TouchableOpacity>
          )}

          {/* Modifier — tant que le devis n'est pas verrouillé (brouillon ou envoyé) */}
          {(estBrouillon || estEnvoye) && (
            <TouchableOpacity
              style={styles.btnDanger}
              onPress={() => navigation.navigate('DevisForm', { devisId })}
            >
              <Text style={styles.btnDangerText}>{t('ventes.devis.editDevis')}</Text>
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
        title={t('ventes.devis.smartTitle')}
        subtitle={t('ventes.devis.smartSubtitle')}
        confirmLabel={t('ventes.devis.smartConfirm')}
        dismissLabel={t('ventes.devis.smartDismiss')}
        onConfirm={handleConvertirEnFacture}
        onDismiss={() => setSmartVisible(false)}
      />

      {/* ── Feuille d'envoi (Mail / WhatsApp / Exporter) ── */}
      <EnvoiDocumentSheet
        visible={envoiVisible}
        onClose={() => setEnvoiVisible(false)}
        titre={t('ventes.devis.sendTitle', { numero: devis.numero })}
        hasEmail={!!clientEmail?.trim()}
        hasPhone={!!clientTelephone?.trim()}
        onMail={() => pdfUri && envoyerMail(pdfUri)}
        onWhatsapp={() => pdfUri && envoyerWhatsapp(pdfUri)}
        onExport={() => pdfUri && partagerPdf(pdfUri, `${t('ventes.devis.devisLabel')} ${devis.numero}`)}
      />
    </SafeAreaView>
  );
};