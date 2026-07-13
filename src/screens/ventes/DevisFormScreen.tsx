/**
 * @file DevisFormScreen.tsx
 * @description Formulaire de creation et d'edition d'un devis.
 *              Gestion des lignes produits avec picker catalogue,
 *              calcul automatique HT / TVA / TTC en temps reel.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Modal, FlatList,
} from 'react-native';
import { SafeAreaView }                         from 'react-native-safe-area-context';
import { useNavigation, useRoute,
         RouteProp, useFocusEffect }            from '@react-navigation/native';
import { NativeStackNavigationProp }            from '@react-navigation/native-stack';
import { Ionicons }                             from '@expo/vector-icons';
import { useTranslation }                       from 'react-i18next';

import { useStyles, useTheme }       from '../../theme';
import { makeStyles }                from './DevisFormScreen.styles';
import { Input }                     from '../../components/ui/Input';
import { VentesStackParamList }      from '../../navigation/VentesStack';

import * as VenteApi    from '../../api/vente.api';
import * as CatalogueApi from '../../api/catalogue.api';
import { DevisRequest, LigneDevisRequest } from '../../types/vente.types';
import { ProduitResponse }                 from '../../types/catalogue.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<VentesStackParamList, 'DevisForm'>;
type Route = RouteProp<VentesStackParamList, 'DevisForm'>;

/** Ligne en cours d'edition dans le formulaire */
interface LigneEdition {
  id:              string;
  produit:         ProduitResponse | null;
  designation:     string;
  quantite:        string;
  prixUnitaireHt:  string;
  tauxTva:         string;
  remise:          string;
  doublonWarning?: boolean;
}

const LIGNE_VIDE = (): LigneEdition => ({
  id:            String(Date.now()),
  produit:       null,
  designation:   '',
  quantite:      '1',
  prixUnitaireHt: '',
  tauxTva:       '19',
  remise:        '0',
});

// ─────────────────────────────────────────────────────────────
// CALCUL LIGNE
// ─────────────────────────────────────────────────────────────

const calculerLigne = (l: LigneEdition) => {
  const qte    = Number(l.quantite)      || 0;
  const pu     = Number(l.prixUnitaireHt) || 0;
  const remise = Number(l.remise)        || 0;
  const tva    = Number(l.tauxTva)       || 0;

  const ht  = pu * qte * (1 - remise / 100);
  const tvaM = ht * (tva / 100);
  return { ht, tva: tvaM, ttc: ht + tvaM };
};

const calculerTotaux = (lignes: LigneEdition[]) => {
  return lignes.reduce(
    (acc, l) => {
      const { ht, tva, ttc } = calculerLigne(l);
      return { ht: acc.ht + ht, tva: acc.tva + tva, ttc: acc.ttc + ttc };
    },
    { ht: 0, tva: 0, ttc: 0 },
  );
};

const fmt3 = (v: number) =>
  v.toLocaleString('fr-TN', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) + ' TND';

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Formulaire devis avec lignes produits, picker catalogue et totaux en temps reel.
 * @author Riahi Dorsaf
 */
export const DevisFormScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const { t }      = useTranslation();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { devisId, opportuniteId, clientId } = route.params ?? {};

  const estEdition = !!devisId;

  // ── Etat formulaire ───────────────────────────────────────
  const [notes,        setNotes]        = useState('');
  const [validite,     setValidite]     = useState('30');
  const [lignes,       setLignes]       = useState<LigneEdition[]>([LIGNE_VIDE()]);
  const [produits,     setProduits]     = useState<ProduitResponse[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [lignePickerId, setLignePickerId] = useState<string | null>(null);
  const [isLoading,    setIsLoading]    = useState(estEdition);
  const [isSaving,     setIsSaving]     = useState(false);

  // ── Chargement initial ────────────────────────────────────

  const charger = useCallback(async () => {
    setIsLoading(true);
    try {
      // Charger le catalogue de produits
      const produitsRes = await CatalogueApi.listerProduits(undefined, 'ACTIF');
      if (produitsRes.success) setProduits(produitsRes.data ?? []);

      // En mode edition, pré-remplir les lignes
      if (devisId) {
        const devisRes = await VenteApi.obtenirDevis(devisId);
        if (devisRes.success) {
          const d = devisRes.data;
          setNotes(d.notes ?? '');
          setValidite(String(d.validiteJours));
          if (d.lignes.length > 0) {
            setLignes(d.lignes.map(l => ({
              id:             String(l.id),
              produit:        null,
              designation:    l.designation,
              quantite:       String(l.quantite),
              prixUnitaireHt: String(l.prixUnitaireHt),
              tauxTva:        String(l.tauxTva),
              remise:         String(l.remise),
            })));
          }
        }
      }
    } catch {
      Alert.alert(t('ventes.leadDetail.error'), t('ventes.devisForm.loadError'));
    } finally {
      setIsLoading(false);
    }
  }, [devisId]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  // ── Gestion des lignes ────────────────────────────────────

  const ouvrirPicker = (ligneId: string) => {
    setLignePickerId(ligneId);
    setPickerVisible(true);
  };

  const selectionnerProduit = (produit: ProduitResponse) => {
    if (!lignePickerId) return;

    // Avertissement doublon : STOCKABLE déjà présent dans une autre ligne
    const estDoublon =
      produit.type === 'STOCKABLE' &&
      lignes.some(l => l.id !== lignePickerId && l.produit?.id === produit.id);

    setLignes(prev => prev.map(l =>
      l.id === lignePickerId
        ? {
            ...l,
            produit,
            designation:    produit.nom,
            quantite:       produit.type === 'SERVICE' ? '1' : l.quantite,
            prixUnitaireHt: String(produit.prixHT ?? ''),
            tauxTva:        String(produit.tauxTVA ?? '19'),
            doublonWarning: estDoublon,
          }
        : l,
    ));
    setPickerVisible(false);
    setLignePickerId(null);
  };

  const mettreAJourLigne = (id: string, champ: keyof LigneEdition, valeur: string) => {
    setLignes(prev => prev.map(l => l.id === id ? { ...l, [champ]: valeur } : l));
  };

  const ajouterLigne = () => setLignes(prev => [...prev, LIGNE_VIDE()]);

  const supprimerLigne = (id: string) => {
    if (lignes.length <= 1) {
      Alert.alert(t('ventes.leadDetail.confirm'), t('ventes.devisForm.errNoLines'));
      return;
    }
    setLignes(prev => prev.filter(l => l.id !== id));
  };

  // ── Soumission ────────────────────────────────────────────

  const handleSoumettre = async () => {
    // Validation basique
    const lignesInvalides = lignes.filter(l => !l.produit && !l.designation.trim());
    if (lignesInvalides.length > 0) {
      Alert.alert(t('ventes.leadDetail.error'), t('ventes.devisForm.errNoProduct'));
      return;
    }
    if (!clientId && !estEdition) {
      Alert.alert(t('ventes.leadDetail.error'), t('ventes.devisForm.errNoClient'));
      return;
    }

    // Logique d'envoi extraite pour éviter la duplication
    const doSubmit = async () => {
      const lignesRequest: LigneDevisRequest[] = lignes.map(l => ({
        produitId:      l.produit?.id ?? 0,
        designation:    l.designation.trim() || l.produit?.nom,
        quantite:       Number(l.quantite) || 1,
        prixUnitaireHt: Number(l.prixUnitaireHt) || undefined,
        tauxTva:        Number(l.tauxTva) || 0,
        remise:         Number(l.remise) || 0,
      }));
      const request: DevisRequest = {
        clientId:      clientId ?? 0,
        opportuniteId: opportuniteId ?? undefined,
        notes:         notes.trim() || undefined,
        validiteJours: Number(validite) || 30,
        lignes:        lignesRequest,
      };
      setIsSaving(true);
      try {
        if (estEdition && devisId) {
          const res = await VenteApi.modifierDevis(devisId, request);
          if (res.success) navigation.goBack();
        } else {
          const res = await VenteApi.creerDevis(request);
          if (res.success) {
            navigation.replace('DevisDetail', { devisId: res.data.id });
          }
        }
      } catch (e: any) {
        Alert.alert(t('ventes.leadDetail.error'), e?.response?.data?.message ?? t('ventes.devisForm.saveError'));
      } finally {
        setIsSaving(false);
      }
    };

    // Correction 3 — Blocage soft si rupture de stock
    const lignesEnRupture = lignes.filter(
      l => l.produit?.type === 'STOCKABLE' && l.produit.stockDisponible === 0,
    );
    if (lignesEnRupture.length > 0) {
      Alert.alert(
        t('catalogue.stockOut'),
        t('ventes.devisForm.errNoLines'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('ventes.devisForm.create'), onPress: doSubmit },
        ],
      );
    } else {
      doSubmit();
    }
  };

  // ── Totaux en temps reel ──────────────────────────────────

  const totaux = calculerTotaux(lignes);

  // ── Rendu ─────────────────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {estEdition ? t('ventes.devisForm.titleEdit') : t('ventes.devisForm.titleNew')}
          </Text>
        </View>

        {/* ── Client pré-sélectionné (depuis opportunité) ── */}
        {clientId && !estEdition && (
          <View style={styles.clientFixeBanner}>
            <Ionicons name="person-circle-outline" size={18} color={theme.colors.primary} />
            <Text style={styles.clientFixeText}>{t('ventes.devisForm.clientSection')}</Text>
            <Ionicons name="lock-closed-outline" size={14} color={theme.colors.primary} />
          </View>
        )}

        {/* ── Parametres generaux ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ventes.devisForm.linesSection')}</Text>
          <View style={styles.fieldGroup}>
            <Input
              label={t('ventes.devisForm.validityLabel')}
              value={validite}
              onChangeText={setValidite}
              keyboardType="numeric"
              placeholder="30"
            />
            <Input
              label={t('ventes.devisForm.notesLabel')}
              value={notes}
              onChangeText={setNotes}
              placeholder={t('ventes.devisForm.notesPlaceholder')}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* ── Lignes produits ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ventes.devis.articles', { nb: lignes.length })}</Text>
          <View style={styles.lignesCard}>
            {lignes.map((ligne, index) => {
              const { ht, ttc } = calculerLigne(ligne);
              return (
                <View key={ligne.id} style={styles.ligneItem}>
                  {/* Header ligne */}
                  <View style={styles.ligneHeader}>
                    <Text style={styles.ligneNumero}>{t('ventes.devisForm.lineN', { n: index + 1 })}</Text>
                    <TouchableOpacity
                      style={styles.ligneDeleteBtn}
                      onPress={() => supprimerLigne(ligne.id)}
                    >
                      <Ionicons name="trash-outline" size={14} color={theme.colors.danger} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.ligneFields}>
                    {/* Selecteur produit */}
                    <View>
                      <Text style={styles.produitSelectLabel}>{t('ventes.devisForm.product')}</Text>
                      <TouchableOpacity
                        style={styles.produitSelectBtn}
                        onPress={() => ouvrirPicker(ligne.id)}
                      >
                        <Text style={[
                          styles.produitSelectText,
                          ligne.produit && styles.produitSelectTextActif,
                        ]} numberOfLines={1}>
                          {ligne.produit
                            ? ligne.produit.nom
                            : t('ventes.devisForm.selectProduct')}
                        </Text>
                        <Ionicons name="chevron-down" size={16} color={theme.colors.textTertiary} />
                      </TouchableOpacity>

                      {/* Correction 1 — Rupture de stock */}
                      {ligne.produit?.type === 'STOCKABLE' &&
                       ligne.produit.stockDisponible === 0 && (
                        <View style={styles.stockRuptureWarning}>
                          <Ionicons name="warning-outline" size={14} color={theme.colors.warning} />
                          <Text style={styles.stockRuptureText}>
                            {t('catalogue.stockOut')}
                          </Text>
                        </View>
                      )}

                      {/* Correction 2 — Doublon STOCKABLE */}
                      {ligne.doublonWarning && (
                        <Text style={styles.doublonWarningText}>
                          ⚠ Ce produit STOCKABLE est déjà dans le devis — vérifier la quantité totale
                        </Text>
                      )}
                    </View>

                    {/* Designation libre */}
                    <Input
                      label={t('ventes.devisForm.designation')}
                      value={ligne.designation}
                      onChangeText={v => mettreAJourLigne(ligne.id, 'designation', v)}
                      placeholder={t('ventes.devisForm.designationPlaceholder')}
                    />

                    {/* Quantite + Prix */}
                    <View style={styles.ligneRow}>
                      <View style={styles.ligneFieldHalf}>
                        <Input
                          label={ligne.produit?.type === 'SERVICE' ? t('catalogue.service') : t('ventes.devisForm.qty')}
                          value={ligne.quantite}
                          onChangeText={v => mettreAJourLigne(ligne.id, 'quantite', v)}
                          keyboardType="numeric"
                          placeholder="1"
                          editable={ligne.produit?.type !== 'SERVICE'}
                        />
                        {ligne.produit?.type === 'STOCKABLE' &&
                         ligne.produit.stockDisponible !== null &&
                         Number(ligne.quantite) > (ligne.produit.stockDisponible ?? 0) ? (
                          <Text style={{ fontSize: theme.typography.size.xs, color: theme.colors.danger, marginTop: 2 }}>
                            Stock disponible : {ligne.produit.stockDisponible}
                          </Text>
                        ) : ligne.produit?.type === 'STOCKABLE' &&
                           ligne.produit.stockDisponible !== null ? (
                          <Text style={{ fontSize: theme.typography.size.xs, color: theme.colors.textSecondary, marginTop: 2 }}>
                            Stock disponible : {ligne.produit.stockDisponible}
                          </Text>
                        ) : null}
                      </View>
                      <View style={styles.ligneFieldHalf}>
                        <Input
                          label={t('ventes.devisForm.priceHt')}
                          value={ligne.prixUnitaireHt}
                          onChangeText={v => mettreAJourLigne(ligne.id, 'prixUnitaireHt', v)}
                          keyboardType="numeric"
                          placeholder="0.000"
                        />
                      </View>
                    </View>

                    {/* Remise + TVA */}
                    <View style={styles.ligneRow}>
                      <View style={styles.ligneFieldHalf}>
                        <Input
                          label={t('ventes.devisForm.discount')}
                          value={ligne.remise}
                          onChangeText={v => mettreAJourLigne(ligne.id, 'remise', v)}
                          keyboardType="numeric"
                          placeholder="0"
                        />
                      </View>
                      <View style={styles.ligneFieldHalf}>
                        <Input
                          label={t('ventes.devisForm.vat')}
                          value={ligne.tauxTva}
                          onChangeText={v => mettreAJourLigne(ligne.id, 'tauxTva', v)}
                          keyboardType="numeric"
                          placeholder="19"
                        />
                      </View>
                    </View>

                    {/* Sous-total ligne */}
                    {ht > 0 && (
                      <Text style={{ fontSize: theme.typography.size.xs, color: theme.colors.textSecondary, textAlign: 'right' }}>
                        HT : {fmt3(ht)}  |  TTC : {fmt3(ttc)}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}

            {/* Bouton ajouter ligne */}
            <TouchableOpacity style={styles.addLigneBtn} onPress={ajouterLigne}>
              <Ionicons name="add-circle-outline" size={18} color={theme.colors.primary} />
              <Text style={styles.addLigneBtnText}>{t('ventes.devisForm.addLine')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Recap totaux ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ventes.facture.summary')}</Text>
          <View style={styles.totalRecap}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('ventes.devis.subtotalHt')}</Text>
              <Text style={styles.totalValue}>{fmt3(totaux.ht)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('ventes.devis.vat')}</Text>
              <Text style={styles.totalValue}>{fmt3(totaux.tva)}</Text>
            </View>
            <View style={styles.totalTtcRow}>
              <Text style={styles.totalTtcLabel}>{t('ventes.devis.totalTtc')}</Text>
              <Text style={styles.totalTtcValue}>{fmt3(totaux.ttc)}</Text>
            </View>
          </View>
        </View>

        {/* ── Actions ── */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[styles.submitBtn, isSaving && styles.submitBtnDisabled]}
            onPress={handleSoumettre}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Text style={styles.submitBtnText}>
                {estEdition ? t('ventes.devisForm.save') : t('ventes.devisForm.create')}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ── Picker produits ── */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>{t('ventes.devisForm.selectProduct')}</Text>
              <TouchableOpacity
                style={styles.pickerCloseBtn}
                onPress={() => setPickerVisible(false)}
              >
                <Ionicons name="close" size={18} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={produits}
              keyExtractor={p => String(p.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => selectionnerProduit(item)}
                  activeOpacity={0.75}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 6, marginBottom: 2 }}>
                      <Text style={styles.pickerItemNom}>{item.nom}</Text>
                      <View style={{
                        paddingHorizontal: 6,
                        paddingVertical:   2,
                        borderRadius:      10,
                        backgroundColor:   item.type === 'SERVICE' ? '#F5F3FF' : '#EFF6FF',
                      }}>
                        <Text style={{
                          fontSize:   9,
                          fontWeight: '700',
                          color:      item.type === 'SERVICE' ? '#7C3AED' : '#2563EB',
                        }}>
                          {item.type === 'SERVICE' ? t('catalogue.service') : t('catalogue.stockable')}
                        </Text>
                      </View>
                    </View>
                    {item.description ? (
                      <Text style={{ fontSize: theme.typography.size.xs, color: theme.colors.textSecondary }} numberOfLines={1}>
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={styles.pickerItemPrix}>
                    {item.prixHT ? fmt3(item.prixHT) : t('ventes.opport.notSet')}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};