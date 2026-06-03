/**
 * @file PublicationFormScreen.tsx
 * @description Création / édition d'une publication marketing,
 *              avec génération de contenu par IA et sélection des réseaux.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './PublicationFormScreen.styles';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { MarketingStackParamList } from '../../navigation/MarketingStack';

import * as MarketingApi from '../../api/marketing.api';
import { CompteSocialConnecte, TYPE_RESEAU_CONFIG } from '../../types/marketing.types';

type Nav = NativeStackNavigationProp<MarketingStackParamList, 'PublicationForm'>;
type Rt = RouteProp<MarketingStackParamList, 'PublicationForm'>;

const TONALITES = ['professionnel', 'humoristique', 'urgent'];

/**
 * Formulaire de publication avec assistant IA.
 * @author Riahi Dorsaf
 */
export const PublicationFormScreen: React.FC = () => {
  const styles = useStyles(makeStyles);
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const publication = route.params?.publication;
  const estEdition = !!publication;

  const [titre, setTitre] = useState(publication?.titre ?? '');
  const [texte, setTexte] = useState(publication?.texte ?? '');
  const [mediaUrl, setMediaUrl] = useState(publication?.mediaUrl ?? '');
  const [sujetIa, setSujetIa] = useState('');
  const [tonalite, setTonalite] = useState('professionnel');
  const [comptes, setComptes] = useState<CompteSocialConnecte[]>([]);
  const [selection, setSelection] = useState<number[]>([]);
  const [programmer, setProgrammer] = useState(!!publication?.dateProgrammation);
  const [dateProgrammation, setDateProgrammation] = useState(
    publication?.dateProgrammation ?? '');
  const [erreur, setErreur] = useState<string | null>(null);
  const [generation, setGeneration] = useState(false);
  const [enregistrement, setEnregistrement] = useState(false);

  const chargerComptes = useCallback(async () => {
    try {
      const res = await MarketingApi.listerReseaux();
      if (res.success) setComptes(res.data);
    } catch {
      // silencieux
    }
  }, []);

  useEffect(() => { chargerComptes(); }, [chargerComptes]);

  const basculerCompte = (id: number) =>
    setSelection(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const genererIa = async () => {
    if (!sujetIa.trim() && !titre.trim()) {
      setErreur('Renseignez un sujet pour générer le contenu.');
      return;
    }
    setGeneration(true);
    setErreur(null);
    try {
      const res = await MarketingApi.genererContenu({
        sujet: sujetIa.trim() || titre.trim(),
        typeContenu: 'post_facebook',
        tonalite,
        langue: 'fr',
      });
      if (res.success) setTexte(res.data.contenuAmeliore);
    } catch {
      setErreur('La génération IA a échoué. Réessayez.');
    } finally {
      setGeneration(false);
    }
  };

  const valider = (): boolean => {
    if (!titre.trim()) { setErreur('Le titre est obligatoire.'); return false; }
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
    titre: titre.trim(),
    texte: texte.trim(),
    mediaUrl: mediaUrl.trim() || undefined,
    dateProgrammation: programmer && dateProgrammation.trim()
      ? dateProgrammation.trim() : undefined,
    comptesSociauxIds: selection.length > 0 ? selection : undefined,
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {estEdition ? 'Modifier la publication' : 'Nouvelle publication'}
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
          <Input
            label="Sujet"
            value={sujetIa}
            onChangeText={setSujetIa}
            placeholder="Ex : Promotion Ramadan 50%"
          />
          <Text style={styles.label}>Tonalité</Text>
          <View style={styles.chipsRow}>
            {TONALITES.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.chip, tonalite === t && styles.chipActif]}
                onPress={() => setTonalite(t)}
              >
                <Text style={[styles.chipLabel, tonalite === t && styles.chipLabelActif]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button
            label="Générer avec IA"
            onPress={genererIa}
            variant="secondary"
            loading={generation}
            fullWidth
          />
        </View>

        <Input label="Titre" value={titre} onChangeText={setTitre} required
          placeholder="Titre de la publication" />
        <Input label="Texte" value={texte} onChangeText={setTexte} required
          placeholder="Contenu de la publication" multiline
          numberOfLines={6} style={styles.textarea} />
        <Input label="URL média (optionnel)" value={mediaUrl} onChangeText={setMediaUrl}
          placeholder="https://..." autoCapitalize="none" />

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
          <Input
            label="Date (AAAA-MM-JJTHH:mm:ss)"
            value={dateProgrammation}
            onChangeText={setDateProgrammation}
            placeholder="2026-06-10T09:00:00"
            autoCapitalize="none"
          />
        )}

        <View style={styles.submitWrapper}>
          <Button
            label={estEdition ? 'Enregistrer' : 'Créer la publication'}
            onPress={enregistrer}
            loading={enregistrement}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
