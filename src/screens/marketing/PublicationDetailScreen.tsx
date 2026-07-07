/**
 * @file PublicationDetailScreen.tsx
 * @description Détail d'une publication : contenu, statut global et diffusion par réseau.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './PublicationDetailScreen.styles';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { FacebookPostPreview } from '../../components/marketing/FacebookPostPreview';
import { PublicationStatsSection } from '../../components/marketing/PublicationStatsSection';
import { parseLocalDateTime } from '../../utils/dateUtils';
import { MarketingStackParamList } from '../../navigation/MarketingStack';

import * as MarketingApi from '../../api/marketing.api';
import {
  DiffusionPublication,
  PublicationMarketing,
  STATUT_DIFFUSION_CONFIG,
  STATUT_PUBLICATION_CONFIG,
  TYPE_RESEAU_CONFIG,
} from '../../types/marketing.types';

type Nav = NativeStackNavigationProp<MarketingStackParamList, 'PublicationDetail'>;
type Rt = RouteProp<MarketingStackParamList, 'PublicationDetail'>;

/**
 * Détail d'une publication et statut de diffusion par réseau.
 * @author Riahi Dorsaf
 */
export const PublicationDetailScreen: React.FC = () => {
  const styles = useStyles(makeStyles);
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { publicationId } = route.params;

  const [publication, setPublication] = useState<PublicationMarketing | null>(null);
  const [action, setAction] = useState(false);

  const charger = useCallback(async () => {
    try {
      const res = await MarketingApi.obtenirPublication(publicationId);
      if (res.success) setPublication(res.data);
    } catch {
      // silencieux
    }
  }, [publicationId]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  const publier = async () => {
    setAction(true);
    try {
      const res = await MarketingApi.publierPublication(publicationId);
      if (res.success) setPublication(res.data);
    } catch {
      // silencieux
    } finally {
      setAction(false);
    }
  };

  const annuler = async () => {
    setAction(true);
    try {
      const res = await MarketingApi.annulerPublication(publicationId);
      if (res.success) setPublication(res.data);
    } catch {
      // silencieux
    } finally {
      setAction(false);
    }
  };

  const supprimer = async () => {
    setAction(true);
    try {
      await MarketingApi.supprimerPublication(publicationId);
      navigation.goBack();
    } catch {
      setAction(false);
    }
  };

  const renderDiffusion = (diffusion: DiffusionPublication) => {
    const reseau = TYPE_RESEAU_CONFIG[diffusion.compteSocial.typeReseau];
    const conf = STATUT_DIFFUSION_CONFIG[diffusion.statutDiffusion];
    return (
      <View key={diffusion.id} style={styles.diffusionItem}>
        <View style={[styles.reseauIcon, { backgroundColor: reseau.bg }]}>
          <Ionicons name={reseau.icon as any} size={18} color={reseau.color} />
        </View>
        <View style={styles.diffusionInfo}>
          <Text style={styles.diffusionNom} numberOfLines={1}>
            {diffusion.compteSocial.nomCompte}
          </Text>
          {diffusion.messageErreur && (
            <Text style={styles.diffusionErreur} numberOfLines={2}>
              {diffusion.messageErreur}
            </Text>
          )}
        </View>
        <Badge label={conf.label} variant="neutral" />
      </View>
    );
  };

  if (!publication) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <EmptyState icon="hourglass-outline" titre="Chargement..."
          soustitre="Récupération de la publication" />
      </SafeAreaView>
    );
  }

  const confStatut = STATUT_PUBLICATION_CONFIG[publication.statut];
  const pageNom = publication.diffusions
    .find(d => d.compteSocial.typeReseau === 'FACEBOOK')?.compteSocial.nomCompte ?? 'Votre page';

  const fmtDateHeure = (s: string) => {
    const d = parseLocalDateTime(s);
    return `${d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}`
      + ` à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  };
  const infoDate = publication.statut === 'PROGRAMMEE' && publication.dateProgrammation
    ? { icon: 'time-outline', texte: `Programmée le ${fmtDateHeure(publication.dateProgrammation)}` }
    : publication.datePublication
      ? { icon: 'checkmark-circle-outline', texte: `Publiée le ${fmtDateHeure(publication.datePublication)}` }
      : null;
  const modifiable = publication.statut === 'BROUILLON'
    || publication.statut === 'PROGRAMMEE';
  const enEchec = publication.statut === 'ECHEC';
  const publiable = publication.statut === 'BROUILLON'
    || publication.statut === 'PROGRAMMEE' || enEchec;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{publication.titre}</Text>
        {modifiable && (
          <TouchableOpacity
            onPress={() => navigation.navigate('PublicationForm', { publication })}
            hitSlop={8}
          >
            <Ionicons name="create-outline" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statutRow}>
          <Badge label={confStatut.label} variant="neutral" />
          {infoDate && (
            <View style={styles.dateInfo}>
              <Ionicons name={infoDate.icon as any} size={14} color={confStatut.color} />
              <Text style={[styles.dateInfoText, { color: confStatut.color }]}>{infoDate.texte}</Text>
            </View>
          )}
        </View>

        {publication.texte?.trim() ? (
          <FacebookPostPreview
            pageNom={pageNom}
            texte={publication.texte}
            mediaUrl={publication.mediaUrl}
          />
        ) : (
          <View style={styles.card}>
            <Text style={styles.texte}>Aucun texte</Text>
          </View>
        )}

        <Text style={styles.sectionTitre}>Diffusion par réseau</Text>
        {publication.diffusions.length === 0 ? (
          <Text style={styles.aucune}>Aucun réseau ciblé pour cette publication.</Text>
        ) : (
          publication.diffusions.map(renderDiffusion)
        )}

        <View style={styles.actions}>
          {publiable && (
            <Button label={enEchec ? 'Réessayer la publication' : 'Publier maintenant'}
              onPress={publier} loading={action} fullWidth />
          )}
          {publiable && (
            <Button label="Annuler la publication" onPress={annuler}
              variant="outline" disabled={action} fullWidth />
          )}
          <Button label="Supprimer" onPress={supprimer}
            variant="danger" disabled={action} fullWidth />
        </View>

        {publication.statut === 'PUBLIEE' && (
          <PublicationStatsSection publicationId={publicationId} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
