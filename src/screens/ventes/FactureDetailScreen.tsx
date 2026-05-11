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
import * as Print   from 'expo-print';
import * as Sharing from 'expo-sharing';

import { useStyles, useTheme }       from '../../theme';
import { makeStyles }                from './FactureDetailScreen.styles';
import { Badge }                     from '../../components/ui/Badge';
import { VentesStackParamList }      from '../../navigation/VentesStack';

import * as VenteApi from '../../api/vente.api';
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
// GENERATEUR HTML PDF
// ─────────────────────────────────────────────────────────────

/**
 * Genere le HTML d'impression pour la facture.
 * Compatible expo-print.
 */
const genererHtmlFacture = (f: FactureResponse): string => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 12px; color: #1F2937; padding: 32px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
    .brand { font-size: 24px; font-weight: 800; color: #2563EB; }
    .brand-sub { font-size: 11px; color: #6B7280; margin-top: 2px; }
    .facture-info { text-align: right; }
    .facture-num { font-size: 18px; font-weight: 700; color: #1F2937; }
    .facture-date { font-size: 11px; color: #6B7280; margin-top: 4px; }
    .statut-badge { display: inline-block; padding: 4px 12px; border-radius: 20px;
                    font-size: 11px; font-weight: 700; background: #F0FDF4; color: #16A34A; margin-top: 8px; }
    .divider { border: none; border-top: 1px solid #E5E7EB; margin: 24px 0; }
    .client-section { margin-bottom: 24px; }
    .section-label { font-size: 10px; font-weight: 700; color: #6B7280;
                     text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
    .client-nom { font-size: 14px; font-weight: 600; color: #1F2937; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { background: #F9FAFB; padding: 10px 12px; text-align: left;
         font-size: 10px; font-weight: 700; color: #6B7280; text-transform: uppercase;
         border-bottom: 2px solid #E5E7EB; }
    td { padding: 10px 12px; border-bottom: 1px solid #F3F4F6; vertical-align: top; }
    td.num { text-align: right; font-weight: 500; }
    .totaux { margin-left: auto; width: 280px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0;
                 border-bottom: 1px solid #F3F4F6; font-size: 12px; }
    .total-row.ttc { background: #2563EB; color: white; padding: 12px 16px;
                     border-radius: 8px; font-weight: 700; font-size: 14px;
                     margin-top: 4px; }
    .footer { margin-top: 48px; text-align: center; font-size: 10px; color: #9CA3AF; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Easy Sales CRM</div>
      <div class="brand-sub">Votre solution CRM mobile</div>
    </div>
    <div class="facture-info">
      <div class="facture-num">${f.numero}</div>
      <div class="facture-date">
        ${f.dateEmission ? 'Emise le ' + f.dateEmission.split('T')[0] : 'Brouillon'}
        ${f.dateEcheance ? ' | Echeance : ' + f.dateEcheance : ''}
      </div>
      <div class="statut-badge">${STATUT_FACTURE_CONFIG[f.statut].label}</div>
    </div>
  </div>

  <hr class="divider"/>

  <div class="client-section">
    <div class="section-label">Facturee a</div>
    <div class="client-nom">${f.clientNom}</div>
    ${f.devisNumero ? `<div style="font-size:11px;color:#6B7280;margin-top:4px;">Ref devis : ${f.devisNumero}</div>` : ''}
  </div>

  <table>
    <thead>
      <tr>
        <th>Designation</th>
        <th style="text-align:right">Qte</th>
        <th style="text-align:right">PU HT</th>
        <th style="text-align:right">Remise</th>
        <th style="text-align:right">TVA</th>
        <th style="text-align:right">Total TTC</th>
      </tr>
    </thead>
    <tbody>
      ${f.lignes.map(l => `
        <tr>
          <td>${l.designation}</td>
          <td class="num">${l.quantite}</td>
          <td class="num">${l.prixUnitaireHt.toFixed(3)}</td>
          <td class="num">${l.remise > 0 ? l.remise + '%' : '-'}</td>
          <td class="num">${l.tauxTva > 0 ? l.tauxTva + '%' : '-'}</td>
          <td class="num"><strong>${l.montantTtc.toFixed(3)} TND</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totaux">
    <div class="total-row">
      <span>Sous-total HT</span>
      <span>${f.montantHt.toFixed(3)} TND</span>
    </div>
    <div class="total-row">
      <span>TVA</span>
      <span>${f.montantTva.toFixed(3)} TND</span>
    </div>
    <div class="total-row ttc">
      <span>TOTAL TTC</span>
      <span>${f.montantTtc.toFixed(3)} TND</span>
    </div>
  </div>

  ${f.notes ? `<div style="margin-top:32px;"><div class="section-label">Notes</div><p style="color:#4B5563;font-size:12px;margin-top:4px;">${f.notes}</p></div>` : ''}

  <div class="footer">
    Facture generee par Easy Sales CRM &mdash; Merci de votre confiance
  </div>
</body>
</html>
`;

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
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { factureId } = route.params;

  const [facture,      setFacture]      = useState<FactureResponse | null>(null);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isExporting,  setIsExporting]  = useState(false);

  // ── Chargement ────────────────────────────────────────────

  const charger = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await VenteApi.obtenirFacture(factureId);
      if (res.success) setFacture(res.data);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger la facture.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }, [factureId, navigation]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // ── Actions ───────────────────────────────────────────────

  const handleChangerStatut = async (statut: 'EMISE' | 'PAYEE' | 'ANNULEE' | 'EN_RETARD') => {
    const labels: Record<string, string> = {
      EMISE:    'Emettre la facture',
      PAYEE:    'Marquer comme payee',
      ANNULEE:  'Annuler la facture',
      EN_RETARD: 'Signaler un retard',
    };
    Alert.alert(labels[statut], 'Confirmer cette action ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Confirmer',
        style: statut === 'ANNULEE' ? 'destructive' : 'default',
        onPress: async () => {
          try {
            const res = await VenteApi.changerStatutFacture(factureId, statut);
            if (res.success) setFacture(res.data);
          } catch (e: any) {
            Alert.alert('Erreur', e?.response?.data?.message ?? 'Impossible de changer le statut.');
          }
        },
      },
    ]);
  };

  const handleExportPdf = async () => {
    if (!facture) return;
    setIsExporting(true);
    try {
      const { uri } = await Print.printToFileAsync({
        html: genererHtmlFacture(facture),
        base64: false,
      });
      const peutPartager = await Sharing.isAvailableAsync();
      if (peutPartager) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Facture ${facture.numero}`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('PDF genere', 'Le partage n est pas disponible sur cet appareil.');
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de generer le PDF.');
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
      return { message: `Echeance depassee de ${Math.abs(diffJours)} jour(s)`, color: theme.colors.danger, bg: '#FEF2F2', icon: 'warning-outline' };
    }
    if (diffJours <= 7) {
      return { message: `Echeance dans ${diffJours} jour(s)`, color: '#D97706', bg: '#FFFBEB', icon: 'time-outline' };
    }
    return null;
  };

  // ── Rendu ─────────────────────────────────────────────────

  if (isLoading || !facture) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const conf          = STATUT_FACTURE_CONFIG[facture.statut];
  const alertEcheance = getAlertEcheance();
  const estBrouillon  = facture.statut === 'BROUILLON';
  const estEmise      = facture.statut === 'EMISE';
  const estEnRetard   = facture.statut === 'EN_RETARD';
  const peutAnnuler   = estEmise || estEnRetard;

  const fmt = (v: number) =>
    v.toLocaleString('fr-TN', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) + ' TND';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
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
          <Badge label={conf.label} variant="neutral" />
        </View>

        {/* ── Hero montant ── */}
        <View style={styles.heroSection}>
          <Text style={styles.heroLabel}>Montant TTC</Text>
          <Text style={styles.heroMontant}>{fmt(facture.montantTtc)}</Text>
          <View style={[styles.heroStatut, { backgroundColor: conf.bg }]}>
            <Text style={[styles.heroStatutText, { color: conf.color }]}>{conf.label}</Text>
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
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Client</Text>
              <Text style={styles.infoValue}>{facture.clientNom}</Text>
            </View>
            {facture.devisNumero ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Devis d'origine</Text>
                <Text style={styles.infoValue}>{facture.devisNumero}</Text>
              </View>
            ) : null}
            {facture.dateEmission ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date d'emission</Text>
                <Text style={styles.infoValue}>{facture.dateEmission.split('T')[0]}</Text>
              </View>
            ) : null}
            {facture.dateEcheance ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Echeance</Text>
                <Text style={styles.infoValue}>{facture.dateEcheance}</Text>
              </View>
            ) : null}
            {facture.datePaiement ? (
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <Text style={styles.infoLabel}>Paye le</Text>
                <Text style={[styles.infoValue, { color: '#16A34A' }]}>
                  {facture.datePaiement.split('T')[0]}
                </Text>
              </View>
            ) : (
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <Text style={styles.infoLabel}>Cree le</Text>
                <Text style={styles.infoValue}>{facture.dateRelative}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Lignes ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Articles ({facture.lignes.length})</Text>
          <View style={styles.card}>
            {facture.lignes.map(ligne => (
              <View key={ligne.id} style={styles.ligneItem}>
                <View style={styles.ligneTopRow}>
                  <Text style={styles.ligneNom} numberOfLines={1}>{ligne.designation}</Text>
                  <Text style={styles.ligneMontant}>{fmt(ligne.montantTtc)}</Text>
                </View>
                <Text style={styles.ligneSub}>
                  {ligne.quantite} x {fmt(ligne.prixUnitaireHt)}
                  {ligne.remise > 0 ? ` — Remise ${ligne.remise}%` : ''}
                  {ligne.tauxTva > 0 ? ` — TVA ${ligne.tauxTva}%` : ''}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Totaux ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recapitulatif</Text>
          <View style={styles.totauxCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total HT</Text>
              <Text style={styles.totalValue}>{fmt(facture.montantHt)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA</Text>
              <Text style={styles.totalValue}>{fmt(facture.montantTva)}</Text>
            </View>
            <View style={styles.totalTtcRow}>
              <Text style={styles.totalTtcLabel}>Total TTC</Text>
              <Text style={styles.totalTtcValue}>{fmt(facture.montantTtc)}</Text>
            </View>
          </View>
        </View>

        {/* ── Actions ── */}
        <View style={styles.actionsSection}>
          {/* Export PDF — disponible pour toutes les factures */}
          <TouchableOpacity style={styles.pdfBtn} onPress={handleExportPdf} disabled={isExporting}>
            {isExporting ? (
              <ActivityIndicator size="small" color={theme.colors.textSecondary} />
            ) : (
              <>
                <Ionicons name="download-outline" size={18} color={theme.colors.textSecondary} />
                <Text style={styles.pdfBtnText}>Exporter en PDF</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Emettre la facture */}
          {estBrouillon && (
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => handleChangerStatut('EMISE')}
            >
              <Ionicons name="send-outline" size={18} color={theme.colors.white} />
              <Text style={styles.primaryBtnText}>Emettre la facture</Text>
            </TouchableOpacity>
          )}

          {/* Marquer payee */}
          {(estEmise || estEnRetard) && (
            <TouchableOpacity
              style={styles.successBtn}
              onPress={() => handleChangerStatut('PAYEE')}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.white} />
              <Text style={styles.successBtnText}>Marquer comme payee</Text>
            </TouchableOpacity>
          )}

          {/* Signaler retard */}
          {estEmise && (
            <TouchableOpacity
              style={[styles.dangerBtn, { borderColor: '#D97706' }]}
              onPress={() => handleChangerStatut('EN_RETARD')}
            >
              <Text style={[styles.dangerBtnText, { color: '#D97706' }]}>
                Signaler un retard de paiement
              </Text>
            </TouchableOpacity>
          )}

          {/* Annuler */}
          {peutAnnuler && (
            <TouchableOpacity
              style={styles.dangerBtn}
              onPress={() => handleChangerStatut('ANNULEE')}
            >
              <Text style={styles.dangerBtnText}>Annuler la facture</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};