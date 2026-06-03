/**
 * @file ReseauxScreen.tsx
 * @description Onglet "Réseaux sociaux" — gestion des comptes connectés via OAuth Meta.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './ReseauxScreen.styles';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';

import * as MarketingApi from '../../api/marketing.api';
import {
  CompteSocialConnecte,
  TypeReseau,
  TYPE_RESEAU_CONFIG,
} from '../../types/marketing.types';

const RESEAUX_DISPONIBLES: TypeReseau[] = ['FACEBOOK', 'INSTAGRAM', 'TIKTOK'];

/**
 * Liste des comptes sociaux connectés + boutons de connexion OAuth.
 * @author Riahi Dorsaf
 */
export const ReseauxScreen: React.FC = () => {
  const styles = useStyles(makeStyles);
  const theme = useTheme();

  const [comptes, setComptes] = useState<CompteSocialConnecte[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const charger = useCallback(async () => {
    try {
      const res = await MarketingApi.listerReseaux();
      if (res.success) setComptes(res.data);
    } catch {
      setMessage('Impossible de charger les comptes connectés.');
    }
  }, []);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  const connecter = async (reseau: TypeReseau) => {
    if (reseau !== 'FACEBOOK' && reseau !== 'INSTAGRAM') {
      setMessage('Connexion ' + TYPE_RESEAU_CONFIG[reseau].label + ' bientôt disponible.');
      return;
    }
    try {
      const res = await MarketingApi.getOAuthFacebookUrl();
      if (res.success) await Linking.openURL(res.data);
    } catch {
      setMessage('Impossible de démarrer la connexion OAuth.');
    }
  };

  const deconnecter = async (id: number) => {
    try {
      await MarketingApi.deconnecterReseau(id);
      setComptes(prev => prev.filter(c => c.id !== id));
    } catch {
      setMessage('Échec de la déconnexion du compte.');
    }
  };

  const renderBoutonConnexion = (reseau: TypeReseau) => {
    const conf = TYPE_RESEAU_CONFIG[reseau];
    return (
      <TouchableOpacity
        key={reseau}
        style={styles.connectBtn}
        onPress={() => connecter(reseau)}
        activeOpacity={0.8}
      >
        <View style={[styles.connectIcon, { backgroundColor: conf.bg }]}>
          <Ionicons name={conf.icon as any} size={22} color={conf.color} />
        </View>
        <Text style={styles.connectLabel}>Connecter {conf.label}</Text>
        <Ionicons name="add-circle-outline" size={22} color={theme.colors.primary} />
      </TouchableOpacity>
    );
  };

  const renderCompte = (compte: CompteSocialConnecte) => {
    const conf = TYPE_RESEAU_CONFIG[compte.typeReseau];
    return (
      <View key={compte.id} style={styles.compteItem}>
        <View style={[styles.connectIcon, { backgroundColor: conf.bg }]}>
          <Ionicons name={conf.icon as any} size={22} color={conf.color} />
        </View>
        <View style={styles.compteInfo}>
          <Text style={styles.compteNom} numberOfLines={1}>{compte.nomCompte}</Text>
          <Badge label={compte.statutConnexion} variant="success" />
        </View>
        <TouchableOpacity onPress={() => deconnecter(compte.id)} hitSlop={8}>
          <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {message && (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

      <Text style={styles.sectionTitre}>Connecter un réseau</Text>
      {RESEAUX_DISPONIBLES.map(renderBoutonConnexion)}

      <Text style={styles.sectionTitre}>Comptes connectés</Text>
      {comptes.length === 0 ? (
        <EmptyState
          icon="link-outline"
          titre="Aucun compte connecté"
          soustitre="Connectez Facebook ou Instagram pour publier"
        />
      ) : (
        comptes.map(renderCompte)
      )}
    </ScrollView>
  );
};
