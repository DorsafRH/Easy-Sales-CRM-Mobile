/**
 * @file FacebookPostPreview.tsx
 * @description Aperçu fidèle d'un post Facebook (en-tête page, texte, image, réactions,
 *              actions). Réutilisé dans le formulaire et la fiche de publication.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './FacebookPostPreview.styles';

interface Props {
  /** Nom de la page affichée en en-tête. */
  pageNom: string;
  /** Texte du post. */
  texte: string;
  /** URL éventuelle de l'image du post. */
  mediaUrl?: string | null;
  /** Affiche le petit libellé « Aperçu Facebook » au-dessus de la carte. */
  showLabel?: boolean;
}

const ACTIONS = [
  { icon: 'thumbs-up-outline', label: "J'aime" },
  { icon: 'chatbubble-outline', label: 'Commenter' },
  { icon: 'arrow-redo-outline', label: 'Partager' },
];

/**
 * Carte imitant un post Facebook, alimentée par le texte (et l'image) de la publication.
 * @author Riahi Dorsaf
 */
export const FacebookPostPreview: React.FC<Props> = ({
  pageNom, texte, mediaUrl, showLabel = true,
}) => {
  const styles = useStyles(makeStyles);
  const theme = useTheme();

  const contenu = (texte ?? '').trim();
  if (!contenu) return null;

  const initiale = (pageNom.trim().charAt(0) || 'P').toUpperCase();
  const media = mediaUrl?.trim();

  return (
    <View>
      {showLabel && (
        <View style={styles.apercuLabelRow}>
          <Ionicons name="eye-outline" size={15} color={theme.colors.textSecondary} />
          <Text style={styles.apercuLabel}>Aperçu Facebook</Text>
        </View>
      )}
      <View style={styles.fbCard}>
        <View style={styles.fbHeader}>
          <View style={styles.fbAvatar}>
            <Text style={styles.fbAvatarText}>{initiale}</Text>
          </View>
          <View style={styles.fbHeadText}>
            <Text style={styles.fbPageName} numberOfLines={1}>{pageNom}</Text>
            <View style={styles.fbMetaRow}>
              <Text style={styles.fbMeta}>À l'instant · </Text>
              <Ionicons name="earth" size={11} color={theme.colors.textTertiary} />
            </View>
          </View>
          <Ionicons name="ellipsis-horizontal" size={18} color={theme.colors.textTertiary} />
        </View>

        <Text style={styles.fbText}>{contenu}</Text>

        {!!media && (
          <Image source={{ uri: media }} style={styles.fbImage} resizeMode="cover" />
        )}

        <View style={styles.fbStatsRow}>
          <View style={styles.fbReacts}>
            <View style={[styles.fbReactBubble, { backgroundColor: '#1877F2' }]}>
              <Ionicons name="thumbs-up" size={9} color="#fff" />
            </View>
            <View style={[styles.fbReactBubble, styles.fbReactOverlap, { backgroundColor: '#E0245E' }]}>
              <Ionicons name="heart" size={9} color="#fff" />
            </View>
          </View>
          <Text style={styles.fbStatsText}>Vous et 128 autres personnes</Text>
        </View>

        <View style={styles.fbDivider} />

        <View style={styles.fbActionsRow}>
          {ACTIONS.map(a => (
            <View key={a.label} style={styles.fbAction}>
              <Ionicons name={a.icon as any} size={17} color={theme.colors.textSecondary} />
              <Text style={styles.fbActionText}>{a.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
