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
  id:            string;
  produit:       ProduitResponse | null;
  designation:   string;
  quantite:      string;
  prixUnitaireHt: string;
  tauxTva:       string;
  remise:        string;
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
      Alert.alert('Erreur', 'Impossible de charger les donnees.');
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
    setLignes(prev => prev.map(l =>
      l.id === lignePickerId
        ? {
            ...l,
            produit,
            designation:    produit.nom,
            prixUnitaireHt: String(produit.prixHT ?? ''),
            tauxTva:        String(produit.tauxTVA ?? '19'),
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
      Alert.alert('Attention', 'Le devis doit contenir au moins une ligne.');
      return;
    }
    setLignes(prev => prev.filter(l => l.id !== id));
  };

  // ── Soumission ────────────────────────────────────────────

  const handleSoumettre = async () => {
    // Validation : toutes les lignes doivent avoir un produit et une qte
    const lignesInvalides = lignes.filter(l => !l.produit && !l.designation.trim());
    if (lignesInvalides.length > 0) {
      Alert.alert('Erreur', 'Chaque ligne doit avoir un produit selectionne.');
      return;
    }

    if (!clientId && !estEdition) {
      Alert.alert('Erreur', 'Aucun client associe a ce devis.');
      return;
    }

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
      Alert.alert('Erreur', e?.response?.data?.message ?? 'Impossible de sauvegarder le devis.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Totaux en temps reel ──────────────────────────────────

  const totaux = calculerTotaux(lignes);

  // ── Rendu ─────────────────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {estEdition ? 'Modifier le devis' : 'Nouveau devis'}
          </Text>
        </View>

        {/* ── Parametres generaux ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parametres</Text>
          <View style={styles.fieldGroup}>
            <Input
              label="Validite (jours)"
              value={validite}
              onChangeText={setValidite}
              keyboardType="numeric"
              placeholder="30"
            />
            <Input
              label="Notes / Conditions"
              value={notes}
              onChangeText={setNotes}
              placeholder="Conditions particulieres, notes pour le client..."
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* ── Lignes produits ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Articles ({lignes.length})</Text>
          <View style={styles.lignesCard}>
            {lignes.map((ligne, index) => {
              const { ht, ttc } = calculerLigne(ligne);
              return (
                <View key={ligne.id} style={styles.ligneItem}>
                  {/* Header ligne */}
                  <View style={styles.ligneHeader}>
                    <Text style={styles.ligneNumero}>Article {index + 1}</Text>
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
                      <Text style={styles.produitSelectLabel}>Produit *</Text>
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
                            : 'Selectionner un produit du catalogue'}
                        </Text>
                        <Ionicons name="chevron-down" size={16} color={theme.colors.textTertiary} />
                      </TouchableOpacity>
                    </View>

                    {/* Designation libre */}
                    <Input
                      label="Designation"
                      value={ligne.designation}
                      onChangeText={v => mettreAJourLigne(ligne.id, 'designation', v)}
                      placeholder="Description de la prestation"
                    />

                    {/* Quantite + Prix */}
                    <View style={styles.ligneRow}>
                      <View style={styles.ligneFieldHalf}>
                        <Input
                          label="Qte"
                          value={ligne.quantite}
                          onChangeText={v => mettreAJourLigne(ligne.id, 'quantite', v)}
                          keyboardType="numeric"
                          placeholder="1"
                        />
                      </View>
                      <View style={styles.ligneFieldHalf}>
                        <Input
                          label="Prix HT (TND)"
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
                          label="Remise (%)"
                          value={ligne.remise}
                          onChangeText={v => mettreAJourLigne(ligne.id, 'remise', v)}
                          keyboardType="numeric"
                          placeholder="0"
                        />
                      </View>
                      <View style={styles.ligneFieldHalf}>
                        <Input
                          label="TVA (%)"
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
              <Text style={styles.addLigneBtnText}>Ajouter un article</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Recap totaux ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recapitulatif</Text>
          <View style={styles.totalRecap}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total HT</Text>
              <Text style={styles.totalValue}>{fmt3(totaux.ht)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA</Text>
              <Text style={styles.totalValue}>{fmt3(totaux.tva)}</Text>
            </View>
            <View style={styles.totalTtcRow}>
              <Text style={styles.totalTtcLabel}>Total TTC</Text>
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
                {estEdition ? 'Enregistrer les modifications' : 'Creer le devis'}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>Annuler</Text>
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
              <Text style={styles.pickerTitle}>Selectionner un produit</Text>
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
                    <Text style={styles.pickerItemNom}>{item.nom}</Text>
                    {item.description ? (
                      <Text style={{ fontSize: theme.typography.size.xs, color: theme.colors.textSecondary }} numberOfLines={1}>
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={styles.pickerItemPrix}>
                    {item.prixHT ? fmt3(item.prixHT) : 'Prix libre'}
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