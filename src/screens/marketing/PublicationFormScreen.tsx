/**
 * @file PublicationFormScreen.tsx
 * @description Création / édition d'une publication marketing. L'assistant IA est piloté
 *              par le catalogue : l'utilisateur choisit une cible (toute la boutique ou une
 *              catégorie), puis éventuellement des produits de cette catégorie. Le backend
 *              récupère les données + calcule les prix promo. L'utilisateur ne ressaisit
 *              jamais les données produit ; il peut toujours ajouter une consigne libre.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Switch, Modal, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './PublicationFormScreen.styles';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FacebookPostPreview } from '../../components/marketing/FacebookPostPreview';
import { MarketingStackParamList } from '../../navigation/MarketingStack';
import { toLocalDateTimeString, parseLocalDateTime } from '../../utils/dateUtils';

import * as MarketingApi from '../../api/marketing.api';
import * as CatalogueApi from '../../api/catalogue.api';
import {
  CompteSocialConnecte, GenererPublicationRequest, TYPE_RESEAU_CONFIG,
} from '../../types/marketing.types';
import { ProduitResponse, CategorieResponse } from '../../types/catalogue.types';

type Nav = NativeStackNavigationProp<MarketingStackParamList, 'PublicationForm'>;
type Rt = RouteProp<MarketingStackParamList, 'PublicationForm'>;

const TONALITES = ['professionnel', 'humoristique', 'promotionnel'];
const NB_CHIPS = 3; // nombre de raccourcis affichés avant le bouton « Autre… »

/**
 * Formulaire de publication avec assistant IA piloté par le catalogue.
 * @author Riahi Dorsaf
 */
export const PublicationFormScreen: React.FC = () => {
  const styles = useStyles(makeStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const publication = route.params?.publication;
  const estEdition = !!publication;

  const [titre, setTitre] = useState(publication?.titre ?? '');
  const [texte, setTexte] = useState(publication?.texte ?? '');
  const [mediaUrl, setMediaUrl] = useState(publication?.mediaUrl ?? '');

  // ── Assistant IA (piloté catalogue) ────────────────────────────
  const [produits, setProduits] = useState<ProduitResponse[]>([]);
  const [categories, setCategories] = useState<CategorieResponse[]>([]);
  const [boutique, setBoutique] = useState(false);          // « Toute la boutique »
  const [categorieSel, setCategorieSel] = useState<number | null>(null);
  const [produitsSel, setProduitsSel] = useState<number[]>([]);
  const [remise, setRemise] = useState('');
  const [consigne, setConsigne] = useState('');
  const [tonalite, setTonalite] = useState('professionnel');
  const [picker, setPicker] = useState<'categorie' | 'produit' | null>(null);
  const [recherche, setRecherche] = useState('');

  const [comptes, setComptes] = useState<CompteSocialConnecte[]>([]);
  const [selection, setSelection] = useState<number[]>(
    publication?.diffusions?.map(d => d.compteSocial.id) ?? []);
  const [programmer, setProgrammer] = useState(!!publication?.dateProgrammation);
  const [dateProgrammation, setDateProgrammation] = useState<Date>(
    publication?.dateProgrammation
      ? parseLocalDateTime(publication.dateProgrammation)
      : new Date());
  const [showDate, setShowDate] = useState(false);
  const [showHeure, setShowHeure] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [generation, setGeneration] = useState(false);
  const [amelioration, setAmelioration] = useState(false);
  const [ameliorerOuvert, setAmeliorerOuvert] = useState(false);
  const [ameliorerConsigne, setAmeliorerConsigne] = useState('');
  const [enregistrement, setEnregistrement] = useState(false);

  const chargerDonnees = useCallback(async () => {
    try {
      const [reseaux, prods, cats] = await Promise.all([
        MarketingApi.listerReseaux(),
        CatalogueApi.listerProduits(undefined, 'ACTIF'),
        CatalogueApi.listerCategories(),
      ]);
      if (reseaux.success) setComptes(reseaux.data);
      if (prods.success) setProduits(prods.data);
      if (cats.success) setCategories(cats.data);
    } catch {
      // silencieux
    }
  }, []);

  useEffect(() => { chargerDonnees(); }, [chargerDonnees]);

  // ── Sélection cible / produits ─────────────────────────────────
  const produitsCategorie = categorieSel == null
    ? []
    : produits.filter(p => p.categorieId === categorieSel);

  const choisirBoutique = () => {
    setBoutique(true); setCategorieSel(null); setProduitsSel([]);
  };
  const choisirCategorie = (id: number) => {
    setBoutique(false); setCategorieSel(id); setProduitsSel([]);
  };
  const basculerProduit = (id: number) =>
    setProduitsSel(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const basculerCompte = (id: number) =>
    setSelection(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const ouvrirPicker = (type: 'categorie' | 'produit') => { setRecherche(''); setPicker(type); };

  /** Raccourcis à afficher : les N premiers + la sélection éventuellement au-delà. */
  const raccourcisCategories = (): CategorieResponse[] => {
    const base = categories.slice(0, NB_CHIPS);
    if (categorieSel != null && !base.some(c => c.id === categorieSel)) {
      const sel = categories.find(c => c.id === categorieSel);
      if (sel) base.push(sel);
    }
    return base;
  };
  const raccourcisProduits = (): ProduitResponse[] => {
    const base = produitsCategorie.slice(0, NB_CHIPS);
    produitsSel.forEach(id => {
      if (!base.some(p => p.id === id)) {
        const sel = produitsCategorie.find(p => p.id === id);
        if (sel) base.push(sel);
      }
    });
    return base;
  };

  /** Déduit un titre à partir du texte généré (1re ligne, sans hashtags, tronquée). */
  const titreDepuisTexte = (t: string): string => {
    const premiere = t.split('\n').map(l => l.trim()).find(l => l.length > 0) ?? '';
    let s = premiere.replace(/#\S+/g, '').replace(/\s+/g, ' ').trim();
    if (s.length > 70) s = `${s.slice(0, 67).trim()}…`;
    return s || 'Publication';
  };

  const construireRequete = (): GenererPublicationRequest => {
    const commun = {
      remise: remise.trim() ? Number(remise) : undefined,
      consigne: consigne.trim() || undefined,
      tonalite,
      langue: 'fr',
    };
    if (produitsSel.length > 0) return { portee: 'PRODUITS', produitIds: produitsSel, ...commun };
    if (categorieSel != null)   return { portee: 'CATEGORIE', categorieId: categorieSel, ...commun };
    if (boutique)               return { portee: 'BOUTIQUE', ...commun };
    return { portee: 'LIBRE', ...commun };
  };

  const genererIa = async () => {
    setGeneration(true);
    setErreur(null);
    try {
      const res = await MarketingApi.genererPublication(construireRequete());
      if (res.success) {
        setTexte(res.data.contenuAmeliore);
        setTitre(titreDepuisTexte(res.data.contenuAmeliore)); // titre auto, éditable
      }
    } catch {
      setErreur('La génération IA a échoué. Réessayez.');
    } finally {
      setGeneration(false);
    }
  };

  /** Raffine le texte courant selon la consigne d'amélioration (relançable à volonté). */
  const ameliorerIa = async () => {
    if (!texte.trim()) return;
    setAmelioration(true);
    setErreur(null);
    try {
      const res = await MarketingApi.ameliorerContenu({
        texte: texte.trim(),
        consigne: ameliorerConsigne.trim() || undefined,
        tonalite,
      });
      if (res.success) setTexte(res.data.contenuAmeliore);
    } catch {
      setErreur('L\'amélioration IA a échoué. Réessayez.');
    } finally {
      setAmelioration(false);
    }
  };

  const valider = (): boolean => {
    if (!texte.trim()) { setErreur('Le texte est obligatoire.'); return false; }
    return true;
  };

  const enregistrer = async () => {
    if (!valider()) return;
    setEnregistrement(true);
    setErreur(null);
    try {
      const payload = construirePayload();
      const res = estEdition
        ? await MarketingApi.modifierPublication(publication!.id, payload)
        : await MarketingApi.creerPublication(payload);
      if (res.success) navigation.goBack();
    } catch {
      setErreur('Échec de l\'enregistrement de la publication.');
    } finally {
      setEnregistrement(false);
    }
  };

  const construirePayload = () => ({
    titre: titre.trim() || titreDepuisTexte(texte),
    texte: texte.trim(),
    mediaUrl: mediaUrl.trim() || undefined,
    dateProgrammation: programmer ? toLocalDateTimeString(dateProgrammation) : undefined,
    comptesSociauxIds: selection.length > 0 ? selection : undefined,
  });

  const fmtDate = (d: Date) =>
    d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const fmtHeure = (d: Date) =>
    d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  // ── Aperçu Facebook ────────────────────────────────────────────
  const pageNom = comptes.find(c => c.typeReseau === 'FACEBOOK')?.nomCompte ?? 'Votre page';

  const renderChip = (
    key: string | number, label: string, actif: boolean, onPress: () => void,
  ) => (
    <TouchableOpacity
      key={key}
      style={[styles.chip, actif && styles.chipActif]}
      onPress={onPress}
    >
      <Text style={[styles.chipLabel, actif && styles.chipLabelActif]}>{label}</Text>
    </TouchableOpacity>
  );

  const renderAutreChip = (onPress: () => void) => (
    <TouchableOpacity style={styles.chip} onPress={onPress}>
      <Ionicons name="ellipsis-horizontal" size={13} color={theme.colors.textTertiary} />
      <Text style={styles.chipLabel}>Autre…</Text>
    </TouchableOpacity>
  );

  // ── Modal de sélection (catégorie ou produit) ──────────────────
  const listeModal = picker === 'categorie'
    ? categories.filter(c => c.nom.toLowerCase().includes(recherche.toLowerCase()))
    : produitsCategorie.filter(p => p.nom.toLowerCase().includes(recherche.toLowerCase()));

  const estActifModal = (id: number) =>
    picker === 'categorie' ? categorieSel === id : produitsSel.includes(id);

  const onTapModal = (id: number) => {
    if (picker === 'categorie') { choisirCategorie(id); setPicker(null); }
    else basculerProduit(id);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {estEdition ? t('marketing.form.titleEdit') : t('marketing.form.titleNew')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {erreur && (
          <View style={styles.erreurBox}>
            <Text style={styles.erreurText}>{erreur}</Text>
          </View>
        )}

        <View style={styles.iaBox}>
          <View style={styles.iaTitreRow}>
            <Ionicons name="sparkles-outline" size={18} color={theme.colors.primary} />
            <Text style={styles.iaTitre}>Assistant IA</Text>
          </View>

          {/* Cible : toute la boutique OU une catégorie */}
          <Text style={styles.label}>Ce post concerne</Text>
          <View style={styles.chipsRow}>
            {renderChip('boutique', 'Tout', boutique, choisirBoutique)}
            {raccourcisCategories().map(cat =>
              renderChip(cat.id, cat.nom, categorieSel === cat.id, () => choisirCategorie(cat.id)))}
            {categories.length > NB_CHIPS && renderAutreChip(() => ouvrirPicker('categorie'))}
          </View>

          {/* Produits de la catégorie (optionnel) */}
          {categorieSel != null && (
            <>
              <Text style={styles.label}>Produits ciblés (optionnel)</Text>
              {produitsCategorie.length === 0 ? (
                <Text style={styles.aucunReseau}>Aucun produit dans cette catégorie.</Text>
              ) : (
                <View style={styles.chipsRow}>
                  {raccourcisProduits().map(pr =>
                    renderChip(pr.id, pr.nom, produitsSel.includes(pr.id), () => basculerProduit(pr.id)))}
                  {produitsCategorie.length > NB_CHIPS && renderAutreChip(() => ouvrirPicker('produit'))}
                </View>
              )}
            </>
          )}

          {/* Remise + consigne libre : toujours visibles */}
          <Input
            label={t('marketing.form.discount')}
            value={remise}
            onChangeText={setRemise}
            placeholder="Ex : 20"
            keyboardType="numeric"
          />
          <Input
            label={t('marketing.form.prompt')}
            value={consigne}
            onChangeText={setConsigne}
            placeholder={t('marketing.form.promptPlaceholder')}
          />

          {/* Tonalité */}
          <Text style={styles.label}>Tonalité</Text>
          <View style={styles.chipsRow}>
            {TONALITES.map(t => renderChip(t, t, tonalite === t, () => setTonalite(t)))}
          </View>

          <Button
            label={t('marketing.form.generate')}
            onPress={genererIa}
            variant="secondary"
            loading={generation}
            fullWidth
          />
        </View>

        <Input label={t('marketing.form.titleLabel')} value={titre} onChangeText={setTitre}
          placeholder={t('marketing.form.titlePlaceholder')} />
        <Input label={t('marketing.form.contentLabel')} value={texte} onChangeText={setTexte} required
          placeholder={t('marketing.form.contentPlaceholder')} multiline
          numberOfLines={6} style={styles.textarea} />
        {texte.trim().length > 0 && (
          <>
            <View style={styles.ameliorerRow}>
              <Ionicons name="sparkles-outline" size={15} color={theme.colors.primary} />
              <TouchableOpacity onPress={() => setAmeliorerOuvert(v => !v)}>
                <Text style={styles.ameliorerLien}>Améliorer avec l'IA</Text>
              </TouchableOpacity>
            </View>
            {ameliorerOuvert && (
              <View style={styles.ameliorerBox}>
                <Input
                  label={t('marketing.form.improveLabel')}
                  value={ameliorerConsigne}
                  onChangeText={setAmeliorerConsigne}
                  placeholder={t('marketing.form.improvePlaceholder')}
                  multiline
                />
                <Button
                  label={t('marketing.form.improveBtn')}
                  onPress={ameliorerIa}
                  variant="secondary"
                  loading={amelioration}
                  fullWidth
                />
              </View>
            )}
          </>
        )}
        {/* ── Aperçu façon post Facebook ─────────────────────────── */}
        <FacebookPostPreview pageNom={pageNom} texte={texte} mediaUrl={mediaUrl} />

        <Text style={styles.label}>Réseaux ciblés</Text>
        {comptes.length === 0 ? (
          <Text style={styles.aucunReseau}>Aucun compte connecté. Connectez un réseau d'abord.</Text>
        ) : (
          <View style={styles.chipsRow}>
            {comptes.map(c => {
              const conf = TYPE_RESEAU_CONFIG[c.typeReseau];
              const actif = selection.includes(c.id);
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.chip, actif && styles.chipActif]}
                  onPress={() => basculerCompte(c.id)}
                >
                  <Ionicons name={conf.icon as any} size={14}
                    color={actif ? theme.colors.primary : theme.colors.textTertiary} />
                  <Text style={[styles.chipLabel, actif && styles.chipLabelActif]}>
                    {c.nomCompte}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.switchRow}>
          <Text style={styles.label}>Programmer la publication</Text>
          <Switch
            value={programmer}
            onValueChange={setProgrammer}
            trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
          />
        </View>
        {programmer && (
          <>
            <View style={styles.rowDateHeure}>
              <View style={[styles.fieldGroup, styles.fieldDate]}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowDate(true)}>
                  <Text style={styles.pickerBtnTxt}>{fmtDate(dateProgrammation)}</Text>
                  <Ionicons name="calendar-outline" size={16} color={theme.colors.textTertiary} />
                </TouchableOpacity>
              </View>
              <View style={[styles.fieldGroup, styles.fieldHeure]}>
                <Text style={styles.label}>Heure</Text>
                <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowHeure(true)}>
                  <Text style={styles.pickerBtnTxt}>{fmtHeure(dateProgrammation)}</Text>
                  <Ionicons name="time-outline" size={16} color={theme.colors.textTertiary} />
                </TouchableOpacity>
              </View>
            </View>
            {showDate && (
              <DateTimePicker value={dateProgrammation} mode="date" minimumDate={new Date()}
                onChange={(_, s) => { setShowDate(false); if (s) setDateProgrammation(s); }} />
            )}
            {showHeure && (
              <DateTimePicker value={dateProgrammation} mode="time" is24Hour
                onChange={(_, s) => { setShowHeure(false); if (s) setDateProgrammation(s); }} />
            )}
          </>
        )}

        <View style={styles.submitWrapper}>
          <Button
            label={estEdition
              ? t('marketing.form.save')
              : (programmer ? t('marketing.form.scheduleDraft') : t('marketing.form.createDraft'))}
            onPress={enregistrer}
            loading={enregistrement}
            fullWidth
          />
        </View>
      </ScrollView>

      {/* Modal de sélection (catégorie / produit) */}
      <Modal visible={picker !== null} transparent animationType="fade"
        onRequestClose={() => setPicker(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setPicker(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitre}>
              {picker === 'categorie' ? t('marketing.form.chooseCategory') : t('marketing.form.chooseProducts')}
            </Text>
            <Input
              value={recherche}
              onChangeText={setRecherche}
              placeholder={t('marketing.form.searchPlaceholder')}
              autoCapitalize="none"
            />
            <ScrollView style={styles.modalListe} keyboardShouldPersistTaps="handled">
              {listeModal.length === 0 ? (
                <Text style={styles.aucunReseau}>{t('marketing.form.noResult')}</Text>
              ) : (
                listeModal.map(item => {
                  const actif = estActifModal(item.id);
                  return (
                    <TouchableOpacity key={item.id} style={styles.modalItem}
                      onPress={() => onTapModal(item.id)}>
                      <Text style={[styles.modalItemText, actif && styles.modalItemTextActif]}>
                        {item.nom}
                      </Text>
                      {actif && (
                        <Ionicons name="checkmark" size={18} color={theme.colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
            <Button label={t('marketing.form.doneBtn')} onPress={() => setPicker(null)} fullWidth />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};
