/**
 * @file ClientDetailScreen.tsx
 * @description Fiche détail d'un client avec :
 *              - Avatar large + badge type + infos de contact
 *              - Boutons d'action directs : Appeler / WhatsApp / Email sur le client
 *              - Section Contacts (liste avec badge Principal + bouton appel)
 *              - Section Opportunités (placeholder Sprint 3)
 *              - Bouton modifier + soft delete
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

import { useStyles, useTheme }     from '../../theme';
import { makeStyles }              from './ClientDetailScreen.styles';
import { Avatar }                  from '../../components/ui/Avatar';
import { Badge, variantFromValue } from '../../components/ui/Badge';
import { ClientsStackParamList }   from '../../navigation/ClientsStack';

import * as ClientApi      from '../../api/client.api';
import * as ContactApi     from '../../api/contact.api';
import { ClientResponse }  from '../../types/client.types';
import { ContactResponse } from '../../types/contact.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<ClientsStackParamList, 'ClientDetail'>;
type Route = RouteProp<ClientsStackParamList, 'ClientDetail'>;

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const formatCA = (value: number): string =>
  `${(value ?? 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} TND`;

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Fiche client complète avec actions directes de contact.
 * @author Riahi Dorsaf
 */
export const ClientDetailScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { clientId } = route.params;

  const [client,    setClient]    = useState<ClientResponse | null>(null);
  const [contacts,  setContacts]  = useState<ContactResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Chargement ────────────────────────────────────────────────
  const charger = useCallback(async () => {
    setIsLoading(true);
    try {
      const [clientRes, contactsRes] = await Promise.all([
        ClientApi.obtenirClient(clientId),
        ContactApi.listerContacts(clientId),
      ]);
      if (clientRes.success)   setClient(clientRes.data);
      if (contactsRes.success) setContacts(contactsRes.data);
    } catch {
      // silencieux
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => { charger(); }, [charger]);

  // ── Actions de contact directes ───────────────────────────────
  const handleAppeler = () => {
    if (!client?.telephone) return;
    Linking.openURL(`tel:${client.telephone}`);
  };

  const handleWhatsApp = () => {
    if (!client?.telephone) return;
    const numero = client.telephone.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${numero}`);
  };

  const handleEmail = () => {
    if (!client?.email) return;
    Linking.openURL(`mailto:${client.email}`);
  };

  // ── Soft delete ───────────────────────────────────────────────
  const handleSupprimer = () => {
    Alert.alert(
      'Supprimer le client',
      `Voulez-vous supprimer "${client?.nomAffichage}" ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await ClientApi.supprimerClient(clientId);
              navigation.goBack();
            } catch {
              Alert.alert('Erreur', 'Impossible de supprimer ce client.');
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

  if (!client) return null;

  const aUnTelephone = !!client.telephone;
  const aUnEmail     = !!client.email;

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
            onPress={() => navigation.navigate('ClientForm', { client })}
          >
            <Feather name="edit-2" size={18} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          <Avatar nom={client.nomAffichage} size="xl" />
          <Text style={styles.headerNom}>{client.nomAffichage}</Text>
          <Text style={styles.headerMeta}>
            {client.ville ?? ''}
            {client.ville && client.typeClient ? ' · ' : ''}
          </Text>
          <Badge
            label={client.typeClient === 'ENTREPRISE' ? 'Entreprise' : 'Individuel'}
            variant={variantFromValue(client.typeClient)}
          />
        </View>

        {/* ── Boutons d'action directs sur le client ── */}
        <View style={styles.actionsRow}>
          {/* Appeler */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              styles.actionBtnAppeler,
              !aUnTelephone && styles.actionBtnDisabled,
            ]}
            onPress={handleAppeler}
            disabled={!aUnTelephone}
            activeOpacity={0.75}
          >
            <Ionicons name="call-outline" size={18} color={theme.colors.primary} />
            <Text style={[styles.actionBtnText, { color: theme.colors.primary }]}>
              Appeler
            </Text>
          </TouchableOpacity>

          {/* WhatsApp */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              styles.actionBtnWhatsapp,
              !aUnTelephone && styles.actionBtnDisabled,
            ]}
            onPress={handleWhatsApp}
            disabled={!aUnTelephone}
            activeOpacity={0.75}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#16A34A" />
            <Text style={[styles.actionBtnText, { color: '#16A34A' }]}>
              WhatsApp
            </Text>
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              styles.actionBtnEmail,
              !aUnEmail && styles.actionBtnDisabled,
            ]}
            onPress={handleEmail}
            disabled={!aUnEmail}
            activeOpacity={0.75}
          >
            <Ionicons name="mail-outline" size={18} color={theme.colors.textSecondary} />
            <Text style={[styles.actionBtnText, { color: theme.colors.textSecondary }]}>
              Email
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Infos ── */}
        <View style={styles.section}>
          <View style={styles.card}>
            {client.telephone && (
              <InfoRow icon="call-outline" label="Téléphone" value={client.telephone} />
            )}
            {client.email && (
              <InfoRow icon="mail-outline" label="Email" value={client.email} />
            )}
            {client.adresse && (
              <InfoRow
                icon="location-outline"
                label="Adresse"
                value={`${client.adresse}${client.ville ? ', ' + client.ville : ''}`}
              />
            )}
            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={18} color={theme.colors.primary} />
              <Text style={styles.infoLabel}>CA total</Text>
              <Text style={styles.infoValueCA}>{formatCA(client.chiffreAffaires)}</Text>
            </View>
          </View>
        </View>

        {/* ── Contacts ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Contacts ({contacts.length})
            </Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => navigation.navigate('ContactForm', { clientId })}
            >
              <Ionicons name="add" size={18} color={theme.colors.primary} />
              <Text style={styles.addBtnText}>Ajouter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {contacts.length === 0 ? (
              <View style={styles.opportunitesPlaceholder}>
                <Text style={styles.opportunitesText}>Aucun contact</Text>
              </View>
            ) : (
              contacts.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  style={styles.contactItem}
                  onPress={() =>
                    navigation.navigate('ContactDetail', {
                      contactId: contact.id,
                      clientId,
                    })
                  }
                >
                  <Avatar nom={contact.nomComplet} size="sm" />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactNom}>
                      {contact.nomComplet}
                      {contact.isPrincipal && (
                        <Text style={{ color: theme.colors.primary }}> ★</Text>
                      )}
                    </Text>
                    {contact.poste && (
                      <Text style={styles.contactPoste}>{contact.poste}</Text>
                    )}
                  </View>
                  {contact.telephone && (
                    <TouchableOpacity
                      style={styles.contactCallBtn}
                      onPress={() => Linking.openURL(`tel:${contact.telephone}`)}
                    >
                      <Ionicons name="call-outline" size={18} color={theme.colors.primary} />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        {/* ── Opportunités (placeholder Sprint 3) ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Opportunités</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.opportunitesPlaceholder}>
              <Text style={styles.opportunitesText}>
                Disponible en Sprint 3
              </Text>
            </View>
          </View>
        </View>

        {/* ── Supprimer ── */}
        <TouchableOpacity style={styles.deleteBtn} onPress={handleSupprimer}>
          <Text style={styles.deleteBtnText}>Supprimer le client</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────────────────────
// SOUS-COMPOSANT
// ─────────────────────────────────────────────────────────────

const InfoRow: React.FC<{
  icon:  string;
  label: string;
  value: string;
}> = ({ icon, label, value }) => {
  const styles = useStyles(makeStyles);
  const theme  = useTheme();
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon as any} size={18} color={theme.colors.textSecondary} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};