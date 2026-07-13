/**
 * @file ClientPickerModal.tsx
 * @description Modal de sélection d'un client existant.
 *              Réutilisable dans OpportuniteForm et conversion Lead.
 *              Inclut recherche en temps réel et affichage type client.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  FlatList, ActivityIndicator, StyleSheet,
} from 'react-native';
import { Ionicons }          from '@expo/vector-icons';
import { useFocusEffect }    from '@react-navigation/native';

import { useStyles, useTheme } from '../../theme';
import { useTranslation }      from 'react-i18next';
import { SearchBar }           from './SearchBar';
import { Avatar }              from './Avatar';
import { useDebounce }         from '../../hooks/useDebounce';

import * as ClientApi from '../../api/client.api';
import { ClientResponse } from '../../types/client.types';
import { AppTheme }       from '../../theme';

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    overlay: {
      flex:            1,
      backgroundColor: theme.colors.overlay,
      justifyContent:  'flex-end',
    },
    sheet: {
      backgroundColor:      theme.colors.bgSurface,
      borderTopLeftRadius:  theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      maxHeight:            '80%',
      paddingBottom:        theme.spacing[6],
    },
    handle: {
      alignSelf:       'center',
      width:           40,
      height:          4,
      borderRadius:    2,
      backgroundColor: theme.colors.border,
      marginTop:       theme.spacing[3],
      marginBottom:    theme.spacing[2],
    },
    header: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      paddingHorizontal: theme.spacing[5],
      paddingVertical:   theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize:   theme.typography.size.lg,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },
    closeBtn: {
      width:           36,
      height:          36,
      borderRadius:    18,
      backgroundColor: theme.colors.bgApp,
      alignItems:      'center',
      justifyContent:  'center',
    },
    searchWrapper: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical:   theme.spacing[3],
    },
    listContent: {
      paddingHorizontal: theme.spacing[4],
      paddingBottom:     theme.spacing[4],
    },
    item: {
      flexDirection:     'row',
      alignItems:        'center',
      paddingVertical:   theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
      columnGap:         theme.spacing[3],
    },
    itemInfo: { flex: 1 },
    itemNom: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
      marginBottom: 2,
    },
    itemMeta: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },
    typeBadge: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical:   2,
      borderRadius:      theme.radius.full,
    },
    typeBadgeText: {
      fontSize:   9,
      fontWeight: '700',
    },
    emptyContainer: {
      alignItems:    'center',
      paddingVertical: theme.spacing[8],
      rowGap:        theme.spacing[2],
    },
    emptyText: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textTertiary,
    },
    loadingContainer: {
      paddingVertical: theme.spacing[8],
      alignItems:      'center',
    },
  });

// ─────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────

interface ClientPickerModalProps {
  visible:    boolean;
  onSelect:   (client: ClientResponse) => void;
  onClose:    () => void;
  titre?:     string;
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Modal bottom sheet de sélection d'un client existant.
 * Recherche en temps réel sur nomAffichage et email.
 * Réutilisable dans OpportuniteForm et conversion Lead.
 *
 * @author Riahi Dorsaf
 */
export const ClientPickerModal: React.FC<ClientPickerModalProps> = ({
  visible,
  onSelect,
  onClose,
  titre,
}) => {
  const styles  = useStyles(makeStyles);
  const theme   = useTheme();
  const { t }   = useTranslation();

  const [clients,   setClients]   = useState<ClientResponse[]>([]);
  const [search,    setSearch]    = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  // ── Chargement ────────────────────────────────────────────

  const charger = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await ClientApi.listerClients(
        undefined,
        debouncedSearch || undefined,
        0,
        50,
      );
      if (res.success) setClients(res.data.content);
    } catch {
      // silencieux
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  // Recharger à chaque ouverture et changement de recherche
  React.useEffect(() => {
    if (visible) charger();
  }, [visible, charger]);

  // Réinitialiser la recherche à la fermeture
  const handleClose = () => {
    setSearch('');
    onClose();
  };

  // ── Rendu item ────────────────────────────────────────────

  const renderItem = ({ item }: { item: ClientResponse }) => {
    const estEntreprise = item.typeClient === 'ENTREPRISE';
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => { setSearch(''); onSelect(item); }}
        activeOpacity={0.75}
      >
        <Avatar nom={item.nomAffichage} size="sm" />
        <View style={styles.itemInfo}>
          <Text style={styles.itemNom} numberOfLines={1}>
            {item.nomAffichage}
          </Text>
          <Text style={styles.itemMeta} numberOfLines={1}>
            {item.email ?? item.telephone ?? t('components.clientPicker.noContactInfo')}
          </Text>
        </View>
        <View style={[
          styles.typeBadge,
          { backgroundColor: estEntreprise ? '#EFF6FF' : '#F0FDF4' },
        ]}>
          <Text style={[
            styles.typeBadgeText,
            { color: estEntreprise ? '#2563EB' : '#16A34A' },
          ]}>
            {estEntreprise ? t('clients.badgeCompany') : t('clients.badgeIndividual')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <TouchableOpacity activeOpacity={1}>
          <View style={styles.sheet}>
            <View style={styles.handle} />

            {/* ── Header ── */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{titre ?? t('components.clientPicker.defaultTitle')}</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                <Ionicons name="close" size={18} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* ── Recherche ── */}
            <View style={styles.searchWrapper}>
              <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder={t('components.clientPicker.searchPlaceholder')}
              />
            </View>

            {/* ── Liste ── */}
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            ) : (
              <FlatList
                data={clients}
                keyExtractor={item => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Ionicons
                      name="people-outline"
                      size={36}
                      color={theme.colors.textTertiary}
                    />
                    <Text style={styles.emptyText}>
                      {search ? t('components.clientPicker.noClientFound') : t('components.clientPicker.noClientRegistered')}
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};