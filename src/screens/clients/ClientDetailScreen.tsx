/**
 * @file ClientDetailScreen.tsx
 * @description Fiche détail client avec :
 *   - Actions directes de contact (Appeler, WhatsApp, Email)
 *   - Bouton "Planifier une réunion" → navigation cross-tab vers Plus > PlanifierReunion
 *     avec le client pré-rempli dans le formulaire.
 *   FIX : CommonActions.navigate('PlanifierReunion') remplacé par
 *         CommonActions.navigate({ name: 'Plus', params: { screen, params } })
 *         pour naviguer correctement depuis ClientsStack vers PlusStack.
 * @author Riahi Dorsaf
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Alert, Linking,
} from 'react-native';
import { SafeAreaView }              from 'react-native-safe-area-context';
import { useNavigation, useRoute,
         RouteProp, CommonActions }  from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, Feather }         from '@expo/vector-icons';

import { useStyles, useTheme }     from '../../theme';
import { makeStyles }              from './ClientDetailScreen.styles';
import { SkeletonCard }            from '../../components/ui/Skeleton';
import { Avatar }                  from '../../components/ui/Avatar';
import { Badge, variantFromValue } from '../../components/ui/Badge';
import { ClientsStackParamList }   from '../../navigation/ClientsStack';

import * as ClientApi      from '../../api/client.api';
import * as ContactApi     from '../../api/contact.api';
import * as VenteApi       from '../../api/vente.api';
import { ClientResponse }  from '../../types/client.types';
import { ContactResponse } from '../../types/contact.types';
import {
  OpportuniteResponse,
  DevisResponse,
  FactureResponse,
  STATUT_DEVIS_CONFIG,
  STATUT_FACTURE_CONFIG,
  KANBAN_COLONNES,
} from '../../types/vente.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav   = NativeStackNavigationProp<ClientsStackParamList, 'ClientDetail'>;
type Route = RouteProp<ClientsStackParamList, 'ClientDetail'>;

const formatCA = (v: number) =>
  `${(v ?? 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} TND`;

// ─────────────────────────────────────────────────────────────
// SOUS-COMPOSANT InfoRow
// ─────────────────────────────────────────────────────────────

const InfoRow: React.FC<{ icon: string; label: string; value: string }> = ({
  icon, label, value,
}) => {
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

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Fiche client avec navigation cross-tab pour planifier une réunion.
 * @author Riahi Dorsaf
 */
export const ClientDetailScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { clientId } = route.params;

  const [client,       setClient]       = useState<ClientResponse | null>(null);
  const [contacts,     setContacts]     = useState<ContactResponse[]>([]);
  const [opportunites, setOpportunites] = useState<OpportuniteResponse[]>([]);
  const [devis,        setDevis]        = useState<DevisResponse[]>([]);
  const [factures,     setFactures]     = useState<FactureResponse[]>([]);
  const [isLoading,    setIsLoading]    = useState(true);

  const charger = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cRes, ctRes, opRes, devisRes, factRes] = await Promise.all([
        ClientApi.obtenirClient(clientId),
        ContactApi.listerContacts(clientId),
        VenteApi.listerOpportunites(),
        VenteApi.listerDevis(),
        VenteApi.listerFactures(),
      ]);
      if (cRes.success)    setClient(cRes.data);
      if (ctRes.success)   setContacts(ctRes.data);
      if (opRes.success)   setOpportunites(opRes.data.filter(o => o.clientId === clientId));
      if (devisRes.success) setDevis(devisRes.data.filter(d => d.clientId === clientId));
      if (factRes.success) setFactures(factRes.data.filter(f => f.clientId === clientId));
    } catch { /* silencieux */ }
    finally { setIsLoading(false); }
  }, [clientId]);

  useEffect(() => { charger(); }, [charger]);

  // ── Actions de contact ────────────────────────────────────────
  const handleAppeler = () => {
    if (!client?.telephone) return;
    Linking.openURL(`tel:${client.telephone}`);
  };

  const handleWhatsApp = () => {
    if (!client?.telephone) return;
    const n = client.telephone.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${n}`);
  };

  const handleEmail = () => {
    if (!client?.email) return;
    Linking.openURL(`mailto:${client.email}`);
  };

  // ── Navigation cross-tab : ClientsStack → PlusStack ───────────
  /**
   * Navigue vers PlanifierReunionScreen dans l'onglet Plus avec
   * le client courant pré-rempli.
   *
   * CommonActions.navigate({ name: 'Plus', params: { screen, params } })
   * remonte l'arbre de navigation jusqu'au TabNavigator et
   * navigue vers l'onglet Plus, puis vers PlanifierReunion.
   */
  const handlePlanifierReunion = () => {
    if (!client) return;
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Plus',
        params: {
          screen: 'PlanifierReunion',
          params: {
            clientId:  client.id,
            clientNom: client.nomAffichage,
          },
        },
      }),
    );
  };

  const handleSupprimer = () => {
    Alert.alert(
      'Supprimer le client',
      `Voulez-vous supprimer définitivement "${client?.nomAffichage}" ?`,
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

  // ── Chargement ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <SkeletonCard style={{ margin: 16 }} />
        <SkeletonCard style={{ margin: 16, marginTop: 0 }} />
      </SafeAreaView>
    );
  }

  if (!client) return null;

  const aPhone = !!client.telephone;
  const aEmail = !!client.email;

  // ─────────────────────────────────────────────────────────────
  // RENDU
  // ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Header avec avatar ── */}
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

        {/* ── Boutons contact rapides ── */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnAppeler, !aPhone && styles.actionBtnDisabled]}
            onPress={handleAppeler}
            disabled={!aPhone}
            activeOpacity={0.75}
          >
            <Ionicons name="call-outline" size={18} color={theme.colors.primary} />
            <Text style={[styles.actionBtnText, { color: theme.colors.primary }]}>Appeler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnWhatsapp, !aPhone && styles.actionBtnDisabled]}
            onPress={handleWhatsApp}
            disabled={!aPhone}
            activeOpacity={0.75}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#16A34A" />
            <Text style={[styles.actionBtnText, { color: '#16A34A' }]}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnEmail, !aEmail && styles.actionBtnDisabled]}
            onPress={handleEmail}
            disabled={!aEmail}
            activeOpacity={0.75}
          >
            <Ionicons name="mail-outline" size={18} color={theme.colors.textSecondary} />
            <Text style={[styles.actionBtnText, { color: theme.colors.textSecondary }]}>Email</Text>
          </TouchableOpacity>
        </View>

        {/* ── Bouton "Planifier une réunion" (cross-tab navigation) ── */}
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <TouchableOpacity
            style={styles.reunionBtn}
            onPress={handlePlanifierReunion}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar-outline" size={18} color="#16A34A" />
            <Text style={styles.reunionBtnText}>Planifier une réunion</Text>
          </TouchableOpacity>
        </View>

        {/* ── Informations ── */}
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
            <Text style={styles.sectionTitle}>Contacts ({contacts.length})</Text>
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
                <Text style={styles.opportunitesText}>Aucun contact associé</Text>
              </View>
            ) : (
              contacts.map(contact => (
                <TouchableOpacity
                  key={contact.id}
                  style={styles.contactItem}
                  onPress={() => navigation.navigate('ContactDetail', {
                    contactId: contact.id,
                    clientId,
                  })}
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

        {/* ── Opportunités ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Opportunités ({opportunites.length})
            </Text>
            {opportunites.length > 3 && (
              <TouchableOpacity
                onPress={() =>
                  navigation.dispatch(
                    CommonActions.navigate({ name: 'Ventes', params: { screen: 'OpportunitesKanban' } }),
                  )
                }
              >
                <Text style={styles.addBtnText}>Voir tout</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.card}>
            {opportunites.length === 0 ? (
              <View style={styles.opportunitesPlaceholder}>
                <Text style={styles.opportunitesText}>Aucune opportunité</Text>
              </View>
            ) : (
              opportunites.slice(0, 3).map((op, i) => {
                const col = KANBAN_COLONNES.find(c => c.statut === op.statut);
                return (
                  <TouchableOpacity
                    key={op.id}
                    style={[
                      styles.venteItem,
                      i === Math.min(opportunites.length, 3) - 1 && styles.venteItemLast,
                    ]}
                    onPress={() =>
                      navigation.dispatch(
                        CommonActions.navigate({
                          name: 'Ventes',
                          params: { screen: 'OpportuniteDetail', params: { opportuniteId: op.id } },
                        }),
                      )
                    }
                    activeOpacity={0.75}
                  >
                    <View style={[styles.venteIconWrapper, { backgroundColor: col?.bg ?? '#F3F4F6' }]}>
                      <Ionicons name={(col?.iconName ?? 'trending-up-outline') as any} size={16} color={col?.color ?? '#6B7280'} />
                    </View>
                    <View style={styles.venteInfo}>
                      <Text style={styles.venteTitle} numberOfLines={1}>{op.titre}</Text>
                      <Text style={styles.venteSub}>{op.dateRelative}</Text>
                    </View>
                    {op.montantEstime ? (
                      <Text style={styles.venteMontant}>
                        {op.montantEstime.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} TND
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>

        {/* ── Devis ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Devis ({devis.length})</Text>
            {devis.length > 3 && (
              <TouchableOpacity
                onPress={() =>
                  navigation.dispatch(
                    CommonActions.navigate({ name: 'Ventes', params: { screen: 'DevisList' } }),
                  )
                }
              >
                <Text style={styles.addBtnText}>Voir tout</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.card}>
            {devis.length === 0 ? (
              <View style={styles.opportunitesPlaceholder}>
                <Text style={styles.opportunitesText}>Aucun devis</Text>
              </View>
            ) : (
              devis.slice(0, 3).map((d, i) => {
                const conf = STATUT_DEVIS_CONFIG[d.statut];
                return (
                  <TouchableOpacity
                    key={d.id}
                    style={[
                      styles.venteItem,
                      i === Math.min(devis.length, 3) - 1 && styles.venteItemLast,
                    ]}
                    onPress={() =>
                      navigation.dispatch(
                        CommonActions.navigate({
                          name: 'Ventes',
                          params: { screen: 'DevisDetail', params: { devisId: d.id } },
                        }),
                      )
                    }
                    activeOpacity={0.75}
                  >
                    <View style={[styles.venteIconWrapper, { backgroundColor: conf.bg }]}>
                      <Ionicons name="document-text-outline" size={16} color={conf.color} />
                    </View>
                    <View style={styles.venteInfo}>
                      <Text style={styles.venteTitle} numberOfLines={1}>{d.numero}</Text>
                      <Text style={styles.venteSub}>{d.dateRelative}</Text>
                    </View>
                    <View style={styles.venteRight}>
                      <Text style={styles.venteMontant}>
                        {d.montantTtc.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} TND
                      </Text>
                      <View style={[styles.venteBadge, { backgroundColor: conf.bg }]}>
                        <Text style={[styles.venteBadgeText, { color: conf.color }]}>{conf.label}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>

        {/* ── Factures ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Factures ({factures.length})</Text>
          </View>
          <View style={styles.card}>
            {factures.length === 0 ? (
              <View style={styles.opportunitesPlaceholder}>
                <Text style={styles.opportunitesText}>Aucune facture</Text>
              </View>
            ) : (
              factures.slice(0, 3).map((f, i) => {
                const conf = STATUT_FACTURE_CONFIG[f.statut];
                return (
                  <TouchableOpacity
                    key={f.id}
                    style={[
                      styles.venteItem,
                      i === Math.min(factures.length, 3) - 1 && styles.venteItemLast,
                    ]}
                    onPress={() =>
                      navigation.dispatch(
                        CommonActions.navigate({
                          name: 'Ventes',
                          params: { screen: 'FactureDetail', params: { factureId: f.id } },
                        }),
                      )
                    }
                    activeOpacity={0.75}
                  >
                    <View style={[styles.venteIconWrapper, { backgroundColor: conf.bg }]}>
                      <Ionicons name="receipt-outline" size={16} color={conf.color} />
                    </View>
                    <View style={styles.venteInfo}>
                      <Text style={styles.venteTitle} numberOfLines={1}>{f.numero}</Text>
                      <Text style={styles.venteSub}>{f.dateRelative}</Text>
                    </View>
                    <View style={styles.venteRight}>
                      <Text style={styles.venteMontant}>
                        {f.montantTtc.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} TND
                      </Text>
                      <View style={[styles.venteBadge, { backgroundColor: conf.bg }]}>
                        <Text style={[styles.venteBadgeText, { color: conf.color }]}>{conf.label}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>

        {/* ── Bouton Supprimer ── */}
        <TouchableOpacity style={styles.deleteBtn} onPress={handleSupprimer}>
          <Text style={styles.deleteBtnText}>Supprimer le client</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};