/**
 * @file FactureDetailScreen.tsx
 * @description Fiche detail d'une facture avec lignes produits, totaux HT/TVA/TTC,
 *              alertes echeance, actions emettre/payer/annuler et export PDF.
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
import { useStyles, useTheme }       from '../../theme';
import { makeStyles }                from './FactureDetailScreen.styles';
import { SkeletonCard }             from '../../components/ui/Skeleton';
import { Badge }                     from '../../components/ui/Badge';
import { EnvoiDocumentSheet }        from '../../components/ui/EnvoiDocumentSheet';
import { VentesStackParamList }      from '../../navigation/VentesStack';

import * as VenteApi  from '../../api/vente.api';
import * as ClientApi from '../../api/client.api';
import {
  genererPdfUri, partagerPdf, telechargerPdf, envoyerParMail, corpsMailTexte, sujetMail, fmtTnd,
} from '../../utils/envoiDocument';
import { genererHtmlDocument } from '../../utils/documentPdf';
import {
  FactureResponse,
  STATUT_FACTURE_CONFIG,
} from '../../types/vente.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<VentesStackParamList, 'FactureDetail'>;
type Route = RouteProp<VentesStackParamList, 'FactureDetail'>;

// ─────────────────────────────────────────────────────────────
// GENERATEUR HTML PDF (facture) — delegue au template partage
// ─────────────────────────────────────────────────────────────

const genererHtmlFacture = (f: FactureResponse): string =>
  genererHtmlDocument({
    marque:     f.proprietaireNom ?? 'Easy Sales CRM',
    numero:     f.numero,
    dateLigne:  [
      f.dateEmission ? 'Emise le ' + f.dateEmission.split('T')[0] : '',
      f.dateEcheance ? 'Echeance : ' + f.dateEcheance : '',
    ].filter(Boolean).join(' | '),
    clientNom:  f.clientNom,
    refLigne:   f.devisNumero ? 'Ref devis : ' + f.devisNumero : undefined,
    lignes:     f.lignes,
    montantHt:  f.montantHt,
    montantTva: f.montantTva,
    montantTtc: f.montantTtc,
    notes:      f.notes,
  });

// ─────────────────────────────────────────────────────────────
// HELPERS PURS
// ─────────────────────────────────────────────────────────────

const factureConcerneStock = (facture: FactureResponse): boolean =>
  facture.lignes?.some(l => l.typeProduit === 'STOCKABLE') ?? false;

const messageConfirmationLivraison = (facture: FactureResponse): string =>
  factureConcerneStock(facture)
    ? 'Cette action decrementera le stock des produits concernes. Confirmer ?'
    : 'Confirmer la livraison de cette facture ?';

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Fiche facture avec actions emettre/payer/annuler et export PDF.
 * @author Riahi Dorsaf
 */
export const FactureDetailScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const { t, i18n } = useTranslation();
  const locale      = i18n.language === 'en' ? 'en-US' : 'fr-FR';
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { factureId } = route.params;

  const [facture,      setFacture]      = useState<FactureResponse | null>(null);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isExporting,  setIsExporting]  = useState(false);
  const [envoiVisible, setEnvoiVisible] = useState(false);
  const [pdfUri,       setPdfUri]       = useState<string | null>(null);
  const [clientEmail,     setClientEmail]     = useState<string | null>(null);
  const [clientTelephone, setClientTelephone] = useState<string | null>(null);

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
      // non bloquant : saisie manuelle possible
    }
  }, []);

  const charger = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await VenteApi.obtenirFacture(factureId);
      if (res.success) {
        setFacture(res.data);
        chargerContactClient(res.data.clientId);
      }
    } catch {
      Alert.alert(t('ventes.leadDetail.error'), t('ventes.facture.loadError'));
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }, [factureId, navigation, chargerContactClient]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // ── Actions ───────────────────────────────────────────────

  const handleChangerStatut = async (statut: 'EMISE' | 'PAYEE' | 'ANNULEE' | 'EN_RETARD') => {
    const labels: Record<string, string> = {
      EMISE:    t('ventes.facture.issue'),
      PAYEE:    t('ventes.facture.markPaid'),
      ANNULEE:  t('ventes.facture.cancel'),
      EN_RETARD: t('ventes.facture.reportLate'),
    };
    Alert.alert(labels[statut], t('ventes.facture.confirmAction'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('ventes.leadDetail.confirm'),
        style: statut === 'ANNULEE' ? 'destructive' : 'default',
        onPress: async () => {
          try {
            const res = await VenteApi.changerStatutFacture(factureId, statut);
            if (res.success) {
              setFacture(res.data);
              if (statut === 'ANNULEE' && res.data.opportuniteId != null) {
                proposerSuiteOpportunite(res.data.opportuniteId);
              }
            }
          } catch (e: any) {
            Alert.alert(t('ventes.leadDetail.error'), e?.response?.data?.message ?? t('ventes.leadDetail.loseError'));
          }
        },
      },
    ]);
  };

  // Apres annulation d'une facture liee a une opportunite : on demande quoi faire de
  // l'opportunite (rouvrir pour re-facturer, marquer perdue, ou laisser tel quel).
  const proposerSuiteOpportunite = (opportuniteId: number) => {
    const majOpportunite = async (statut: 'NEGOCIATION' | 'PERDUE') => {
      try {
        await VenteApi.changerStatutOpportunite(opportuniteId, statut);
        Alert.alert(
          t('ventes.facture.oppUpdatedTitle'),
          statut === 'NEGOCIATION'
            ? t('ventes.facture.oppReopened')
            : t('ventes.facture.oppLost'),
        );
      } catch (e: any) {
        Alert.alert(t('ventes.leadDetail.error'), e?.response?.data?.message ?? t('ventes.facture.oppUpdateError'));
      }
    };
    Alert.alert(
      t('ventes.facture.oppTitle'),
      t('ventes.facture.oppMsg'),
      [
        { text: t('ventes.facture.oppLater'), style: 'cancel' },
        { text: t('ventes.facture.oppMarkLost'), style: 'destructive', onPress: () => majOpportunite('PERDUE') },
        { text: t('ventes.facture.oppReopen'), onPress: () => majOpportunite('NEGOCIATION') },
      ],
    );
  };

  const handleMarquerLivre = () => {
    Alert.alert(
      t('ventes.facture.markDelivered'),
      factureConcerneStock(facture!) ? t('ventes.facture.stockWarning') : t('ventes.facture.confirmDelivery'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('ventes.leadDetail.confirm'),
          onPress: async () => {
            try {
              const res = await VenteApi.changerStatutFacture(factureId, 'LIVREE');
              if (res.success) setFacture(res.data);
            } catch (e: any) {
              Alert.alert(t('ventes.leadDetail.error'), e?.response?.data?.message ?? t('ventes.leadDetail.loseError'));
            }
          },
        },
      ],
    );
  };

  const handlePayerDepuisLivre = async () => {
    try {
      const res = await VenteApi.changerStatutFacture(factureId, 'PAYEE');
      if (res.success) setFacture(res.data);
    } catch (e: any) {
      Alert.alert('Erreur', e?.response?.data?.message ?? 'Impossible de changer le statut.');
    }
  };

  const envoyerMail = async (pdfUri: string) => {
    if (!facture || !clientEmail?.trim()) return;
    await envoyerParMail({
      pdfUri,
      email:     clientEmail.trim(),
      sujet:     sujetMail('facture', facture.proprietaireNom),
      corps:     corpsMailTexte({
        typeDoc: 'facture',
        montantTtc: fmtTnd(facture.montantTtc), clientNom: facture.clientNom,
        marque: facture.proprietaireNom,
      }),
    });
  };

  // Bouton unique « Envoyer » : genere le PDF puis ouvre la feuille de partage
  // (Mail si email, WhatsApp si telephone, Exporter toujours dispo). Pas de
  // changement de statut : la facture suit son propre cycle (emise/payee...).
  const handleEnvoyer = async () => {
    if (!facture) return;
    setIsExporting(true);
    try {
      const uri = await genererPdfUri(genererHtmlFacture(facture));
      setPdfUri(uri);
      setEnvoiVisible(true);
    } catch {
      Alert.alert(t('ventes.leadDetail.error'), t('ventes.facture.pdfError'));
    } finally {
      setIsExporting(false);
    }
  };

  // Telecharger / enregistrer le PDF sur le telephone (Android : dossier choisi ;
  // iOS : Fichiers).
  const handleTelechargerPdf = async () => {
    if (!facture) return;
    setIsExporting(true);
    try {
      const uri = await genererPdfUri(genererHtmlFacture(facture));
      const res = await telechargerPdf(uri, `Facture ${facture.numero}`);
      if (res === 'enregistre') {
        Alert.alert(t('ventes.devis.pdfSavedTitle'), t('ventes.facture.pdfSavedMsg'));
      }
    } catch {
      Alert.alert(t('ventes.leadDetail.error'), t('ventes.facture.pdfError'));
    } finally {
      setIsExporting(false);
    }
  };

  // ── Alerte echeance ───────────────────────────────────────

  const getAlertEcheance = () => {
    if (!facture?.dateEcheance || facture.statut === 'PAYEE' || facture.statut === 'ANNULEE') {
      return null;
    }
    const echeance  = new Date(facture.dateEcheance);
    const maintenant = new Date();
    const diffJours  = Math.ceil((echeance.getTime() - maintenant.getTime()) / (1000 * 60 * 60 * 24));

    if (diffJours < 0) {
      return { message: t('ventes.facture.duePassed', { nb: Math.abs(diffJours) }), color: theme.colors.danger, bg: '#FEF2F2', icon: 'warning-outline' };
    }
    if (diffJours <= 7) {
      return { message: t('ventes.facture.dueSoon', { nb: diffJours }), color: '#D97706', bg: '#FFFBEB', icon: 'time-outline' };
    }
    return null;
  };

  // ── Rendu ─────────────────────────────────────────────────

  if (isLoading || !facture) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <SkeletonCard style={{ margin: 16 }} />
        <SkeletonCard style={{ margin: 16, marginTop: 0 }} />
        <SkeletonCard style={{ margin: 16, marginTop: 0 }} />
      </SafeAreaView>
    );
  }

  const conf          = STATUT_FACTURE_CONFIG[facture.statut];
  const alertEcheance = getAlertEcheance();
  const estBrouillon  = facture.statut === 'BROUILLON';
  const estEmise      = facture.statut === 'EMISE';
  const estEnRetard   = facture.statut === 'EN_RETARD';
  const estLivree     = facture.statut === 'LIVREE';
  const peutAnnuler   = estEmise || estEnRetard || estLivree;

  const fmt = fmtTnd;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerNumero}>{facture.numero}</Text>
            <Text style={styles.headerDate}>{facture.clientNom} — {facture.dateRelative}</Text>
          </View>
          <Badge label={t(conf.labelKey)} variant="neutral" />
        </View>

        {/* ── Hero montant ── */}
        <View style={styles.heroSection}>
          <Text style={styles.heroLabel}>{t('ventes.devis.totalTtc')}</Text>
          <Text style={styles.heroMontant}>{fmt(facture.montantTtc)}</Text>
          <View style={[styles.heroStatut, { backgroundColor: conf.bg }]}>
            <Text style={[styles.heroStatutText, { color: conf.color }]}>{t(conf.labelKey)}</Text>
          </View>
        </View>

        {/* ── Alerte echeance ── */}
        {alertEcheance && (
          <View style={styles.section}>
            <View style={[styles.echeanceAlert, {
              borderColor: alertEcheance.color,
              backgroundColor: alertEcheance.bg,
            }]}>
              <Ionicons name={alertEcheance.icon as any} size={20} color={alertEcheance.color} />
              <Text style={[styles.echeanceText, { color: alertEcheance.color }]}>
                {alertEcheance.message}
              </Text>
            </View>
          </View>
        )}

        {/* ── Informations ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ventes.opport.infoTitle')}</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('ventes.opport.client')}</Text>
              <Text style={styles.infoValue}>{facture.clientNom}</Text>
            </View>
            {facture.devisNumero ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('ventes.facture.originQuote')}</Text>
                <Text style={styles.infoValue}>{facture.devisNumero}</Text>
              </View>
            ) : null}
            {facture.dateEmission ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('ventes.facture.issueDate')}</Text>
                <Text style={styles.infoValue}>{facture.dateEmission.split('T')[0]}</Text>
              </View>
            ) : null}
            {facture.statut === 'LIVREE' && facture.dateLivraison ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('ventes.facture.deliveryDate')}</Text>
                <Text style={styles.infoValue}>
                  {new Date(facture.dateLivraison).toLocaleDateString(locale, {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })}
                </Text>
              </View>
            ) : null}
            {facture.dateEcheance ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('ventes.facture.dueDate')}</Text>
                <Text style={styles.infoValue}>{facture.dateEcheance}</Text>
              </View>
            ) : null}
            {facture.datePaiement ? (
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <Text style={styles.infoLabel}>{t('ventes.facture.paidOn')}</Text>
                <Text style={[styles.infoValue, { color: '#16A34A' }]}>
                  {facture.datePaiement.split('T')[0]}
                </Text>
              </View>
            ) : (
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <Text style={styles.infoLabel}>{t('ventes.opport.createdAt')}</Text>
                <Text style={styles.infoValue}>{facture.dateRelative}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Lignes ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ventes.devis.articles', { nb: facture.lignes.length })}</Text>
          <View style={styles.card}>
            {facture.lignes.map(ligne => (
              <View key={ligne.id} style={styles.ligneItem}>
                <View style={styles.ligneTopRow}>
                  <Text style={styles.ligneNom} numberOfLines={1}>{ligne.designation}</Text>
                  <Text style={styles.ligneMontant}>{fmt(ligne.montantTtc)}</Text>
                </View>
                <Text style={styles.ligneSub}>
                  {ligne.quantite} x {fmt(ligne.prixUnitaireHt)}
                  {ligne.remise > 0 ? ` — ${t('ventes.devis.discount')} ${ligne.remise}%` : ''}
                  {ligne.tauxTva > 0 ? ` — ${t('ventes.devis.vat')} ${ligne.tauxTva}%` : ''}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Totaux ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ventes.facture.summary')}</Text>
          <View style={styles.totauxCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('ventes.devis.subtotalHt')}</Text>
              <Text style={styles.totalValue}>{fmt(facture.montantHt)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('ventes.devis.vat')}</Text>
              <Text style={styles.totalValue}>{fmt(facture.montantTva)}</Text>
            </View>
            <View style={styles.totalTtcRow}>
              <Text style={styles.totalTtcLabel}>{t('ventes.devis.totalTtc')}</Text>
              <Text style={styles.totalTtcValue}>{fmt(facture.montantTtc)}</Text>
            </View>
          </View>
        </View>

        {/* ── Actions ── */}
        <View style={styles.actionsSection}>
          {/* Bouton unique « Envoyer » : Mail / WhatsApp / Exporter (PDF joint) */}
          <TouchableOpacity style={styles.pdfBtn} onPress={handleEnvoyer} disabled={isExporting}>
            {isExporting ? (
              <ActivityIndicator size="small" color={theme.colors.textSecondary} />
            ) : (
              <>
                <Ionicons name="send-outline" size={18} color={theme.colors.textSecondary} />
                <Text style={styles.pdfBtnText}>{t('ventes.facture.sendInvoice')}</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Telecharger le PDF sur le telephone */}
          <TouchableOpacity style={styles.pdfBtn} onPress={handleTelechargerPdf} disabled={isExporting}>
            <Ionicons name="download-outline" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.pdfBtnText}>{t('ventes.devis.downloadPdf')}</Text>
          </TouchableOpacity>

          {/* Emettre la facture */}
          {estBrouillon && (
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => handleChangerStatut('EMISE')}
            >
              <Ionicons name="send-outline" size={18} color={theme.colors.white} />
              <Text style={styles.primaryBtnText}>{t('ventes.facture.issue')}</Text>
            </TouchableOpacity>
          )}

          {/* Marquer livree — avec avertissement stock */}
          {estEmise && (
            <TouchableOpacity style={styles.btnLivre} onPress={handleMarquerLivre}>
              <Ionicons name="cube-outline" size={18} color={theme.colors.info} />
              <Text style={styles.btnLivreText}>{t('ventes.facture.markDelivered')}</Text>
            </TouchableOpacity>
          )}

          {/* Marquer payee depuis LIVREE — sans confirmation */}
          {estLivree && (
            <TouchableOpacity style={styles.successBtn} onPress={handlePayerDepuisLivre}>
              <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.white} />
              <Text style={styles.successBtnText}>{t('ventes.facture.markPaid')}</Text>
            </TouchableOpacity>
          )}

          {/* Marquer payee depuis EMISE / EN_RETARD */}
          {(estEmise || estEnRetard) && (
            <TouchableOpacity
              style={styles.successBtn}
              onPress={() => handleChangerStatut('PAYEE')}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.white} />
              <Text style={styles.successBtnText}>{t('ventes.facture.markAsPaid')}</Text>
            </TouchableOpacity>
          )}

          {/* Signaler retard */}
          {estEmise && (
            <TouchableOpacity
              style={[styles.dangerBtn, { borderColor: '#D97706' }]}
              onPress={() => handleChangerStatut('EN_RETARD')}
            >
              <Text style={[styles.dangerBtnText, { color: '#D97706' }]}>
                {t('ventes.facture.reportLatePayment')}
              </Text>
            </TouchableOpacity>
          )}

          {/* Annuler */}
          {peutAnnuler && (
            <TouchableOpacity
              style={styles.dangerBtn}
              onPress={() => handleChangerStatut('ANNULEE')}
            >
              <Text style={styles.dangerBtnText}>{t('ventes.facture.cancel')}</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>

      {/* ── Feuille d'envoi (Mail / WhatsApp / Exporter) ── */}
      <EnvoiDocumentSheet
        visible={envoiVisible}
        onClose={() => setEnvoiVisible(false)}
        titre={t('ventes.facture.sendTitle', { numero: facture.numero })}
        hasEmail={!!clientEmail?.trim()}
        hasPhone={!!clientTelephone?.trim()}
        onMail={() => pdfUri && envoyerMail(pdfUri)}
        onWhatsapp={() => pdfUri && partagerPdf(pdfUri, `${t('ventes.facture.factureLabel')} ${facture.numero}`)}
        onExport={() => pdfUri && partagerPdf(pdfUri, `${t('ventes.facture.factureLabel')} ${facture.numero}`)}
      />
    </SafeAreaView>
  );
};