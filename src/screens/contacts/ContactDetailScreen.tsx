/**
 * @file ContactDetailScreen.tsx
 * @description Fiche contact avec :
 *              - Avatar large + poste + entreprise liée
 *              - Badge "Principal" si contact principal
 *              - 3 boutons d'action : Appeler / WhatsApp / Email (Linking)
 *              - Informations complètes
 *              - Modifier / Supprimer (sauf contact principal)
 * @author Riahi Dorsaf
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView }              from 'react-native-safe-area-context';
import { useNavigation, useRoute,
         RouteProp }                 from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, Feather }         from '@expo/vector-icons';

import { useStyles, useTheme }   from '../../theme';
import { makeStyles }            from './ContactDetailScreen.styles';
import { Avatar }                from '../../components/ui/Avatar';
import { Badge }                 from '../../components/ui/Badge';
import { ClientsStackParamList } from '../../navigation/ClientsStack';

import * as ContactApi       from '../../api/contact.api';
import { ContactResponse }   from '../../types/contact.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<ClientsStackParamList, 'ContactDetail'>;
type Route = RouteProp<ClientsStackParamList, 'ContactDetail'>;

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Fiche contact avec actions directes Linking.
 * @author Riahi Dorsaf
 */
export const ContactDetailScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { contactId, clientId } = route.params;

  const [contact,   setContact]   = useState<ContactResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Chargement ────────────────────────────────────────────────
  const charger = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await ContactApi.obtenirContact(clientId, contactId);
      if (response.success) setContact(response.data);
    } catch {
      // silencieux
    } finally {
      setIsLoading(false);
    }
  }, [clientId, contactId]);

  useEffect(() => { charger(); }, [charger]);

  // ── Actions Linking ───────────────────────────────────────────
  const handleAppeler = () => {
    if (contact?.telephone) Linking.openURL(`tel:${contact.telephone}`);
  };

  const handleWhatsApp = () => {
    if (contact?.telephone) {
      const numero = contact.telephone.replace(/\D/g, '');
      Linking.openURL(`https://wa.me/${numero}`);
    }
  };

  const handleEmail = () => {
    if (contact?.email) Linking.openURL(`mailto:${contact.email}`);
  };

  // ── Suppression ───────────────────────────────────────────────
  const handleSupprimer = () => {
    if (contact?.isPrincipal) {
      Alert.alert(
        'Action impossible',
        'Impossible de supprimer le contact principal. Définissez un autre contact comme principal d\'abord.',
      );
      return;
    }
    Alert.alert(
      'Supprimer le contact',
      `Voulez-vous supprimer "${contact?.nomComplet}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await ContactApi.supprimerContact(clientId, contactId);
              navigation.goBack();
            } catch {
              Alert.alert('Erreur', 'Impossible de supprimer ce contact.');
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!contact) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
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
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('ContactForm', { clientId, contact })}
          >
            <Feather name="edit-2" size={18} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          <Avatar nom={contact.nomComplet} size="xl" />
          <Text style={styles.headerNom}>{contact.nomComplet}</Text>
          {contact.poste && (
            <Text style={styles.headerPoste}>{contact.poste}</Text>
          )}
          <Text style={styles.headerEntreprise}>{contact.clientNomAffichage}</Text>

          {contact.isPrincipal && (
            <Badge label="Principal" variant="primary" withDot />
          )}
        </View>

        {/* ── Boutons d'action ── */}
        <View style={styles.actionsRow}>
          {/* Appeler */}
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnAppeler]}
            onPress={handleAppeler}
            disabled={!contact.telephone}
            activeOpacity={0.75}
          >
            <Ionicons name="call-outline" size={18} color={theme.colors.primary} />
            <Text style={[styles.actionBtnText, { color: theme.colors.primary }]}>
              Appeler
            </Text>
          </TouchableOpacity>

          {/* WhatsApp */}
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnWhatsapp]}
            onPress={handleWhatsApp}
            disabled={!contact.telephone}
            activeOpacity={0.75}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#16A34A" />
            <Text style={[styles.actionBtnText, { color: '#16A34A' }]}>
              WhatsApp
            </Text>
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnEmail]}
            onPress={handleEmail}
            disabled={!contact.email}
            activeOpacity={0.75}
          >
            <Ionicons name="mail-outline" size={18} color={theme.colors.textSecondary} />
            <Text style={[styles.actionBtnText, { color: theme.colors.textSecondary }]}>
              Email
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Informations ── */}
        <View style={styles.section}>
          <View style={styles.card}>
            {contact.telephone && (
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={18} color={theme.colors.textSecondary} />
                <Text style={styles.infoLabel}>Téléphone</Text>
                <Text style={styles.infoValue}>{contact.telephone}</Text>
              </View>
            )}
            {contact.email && (
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={18} color={theme.colors.textSecondary} />
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{contact.email}</Text>
              </View>
            )}
            {contact.poste && (
              <View style={styles.infoRow}>
                <Ionicons name="briefcase-outline" size={18} color={theme.colors.textSecondary} />
                <Text style={styles.infoLabel}>Poste</Text>
                <Text style={styles.infoValue}>{contact.poste}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Supprimer ── */}
        {!contact.isPrincipal && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleSupprimer}>
            <Text style={styles.deleteBtnText}>Supprimer le contact</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};