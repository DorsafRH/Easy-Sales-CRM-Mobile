/**
 * @file PlusMenuScreen.tsx
 * @description Écran "Plus" — menu liste structuré en groupes.
 * @author Riahi Dorsaf
 */

import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView }              from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp }     from '@react-navigation/native-stack';
import { Ionicons }                      from '@expo/vector-icons';

import { useStyles, useTheme }  from '../../theme';
import { makeStyles }           from './PlusMenuScreen.styles';
import { Avatar }               from '../../components/ui/Avatar';
import { useAuth }              from '../../context/AuthContext';
import { PlusStackParamList }   from '../../navigation/PlusStack';
import { AppStackParamList }    from '../../navigation/AppStack';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface MenuItem {
  label:     string;
  sub?:      string;
  icon:      string;
  iconBg:    string;
  iconColor: string;
  badge?:    string;
  onPress:   () => void;
  disabled?: boolean;
}

// ─────────────────────────────────────────────────────────────
// SOUS-COMPOSANT ITEM
// ─────────────────────────────────────────────────────────────

const MenuItemRow: React.FC<{ item: MenuItem; isLast?: boolean }> = ({ item, isLast }) => {
  const styles = useStyles(makeStyles);
  const theme  = useTheme();
  return (
    <TouchableOpacity
      style={[styles.menuItem, isLast && styles.menuItemLast]}
      onPress={item.onPress}
      disabled={item.disabled}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIconWrapper, { backgroundColor: item.iconBg }]}>
        <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
      </View>
      <View style={styles.menuItemContent}>
        <Text style={[styles.menuItemLabel, item.disabled && { color: theme.colors.textSecondary }]}>
          {item.label}
        </Text>
        {item.sub && <Text style={styles.menuItemSub}>{item.sub}</Text>}
      </View>
      {item.badge ? (
        <View style={styles.menuItemBadge}>
          <Text style={styles.menuItemBadgeText}>{item.badge}</Text>
        </View>
      ) : (
        !item.disabled && (
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
        )
      )}
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Écran "Plus" — menu de navigation structuré.
 * @author Riahi Dorsaf
 */
export const PlusMenuScreen: React.FC = () => {
  const styles  = useStyles(makeStyles);
  const theme   = useTheme();
  const { currentUser, logout, refreshUser } = useAuth();

  const navigationPlus = useNavigation<NativeStackNavigationProp<PlusStackParamList>>();
  const navigationApp  = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  useFocusEffect(useCallback(() => { refreshUser(); }, [refreshUser]));

  const prenom        = currentUser?.prenom ?? '';
  const nom           = currentUser?.nom    ?? '';
  const nomComplet    = `${prenom} ${nom}`.trim();
  const nomEntreprise = currentUser?.nomEntreprise ?? '';

  const handleDeconnexion = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnecter', style: 'destructive', onPress: logout },
    ]);
  };

  // ── Groupes de menus ──────────────────────────────────────
  const crmItems: MenuItem[] = [
    {
      label:     'Clients',
      sub:       'Gérer vos clients et contacts',
      icon:      'people-outline',
      iconBg:    theme.colors.primaryLight,
      iconColor: theme.colors.primary,
      onPress:   () => navigationPlus.getParent()?.navigate('Clients' as never),
    },
    {
      label:     'Catalogue',
      sub:       'Produits et catégories',
      icon:      'grid-outline',
      iconBg:    '#EFF6FF',
      iconColor: '#0369A1',
      onPress:   () => navigationPlus.navigate('CatalogueHome'),
    },
    {
      label:     'Agenda',
      sub:       'Réunions et rendez-vous clients',
      icon:      'calendar-outline',
      iconBg:    '#F0FDF4',
      iconColor: '#16A34A',
      onPress:   () => navigationPlus.navigate('AgendaHome'),
    },
  ];

  const ventesItems: MenuItem[] = [
    {
      label:    'Leads & Opportunités',
      sub:      'Disponible en Sprint 3',
      icon:     'trending-up-outline',
      iconBg:   '#F0FDF4',
      iconColor:'#16A34A',
      badge:    'Sprint 3',
      disabled: true,
      onPress:  () => {},
    },
    {
      label:    'Devis',
      sub:      'Disponible en Sprint 3',
      icon:     'document-text-outline',
      iconBg:   '#ECFDF5',
      iconColor:'#059669',
      badge:    'Sprint 3',
      disabled: true,
      onPress:  () => {},
    },
  ];

  const marketingItems: MenuItem[] = [
    {
      label:    'Publications',
      sub:      'Disponible en Sprint 4',
      icon:     'megaphone-outline',
      iconBg:   '#FFF7ED',
      iconColor:'#EA580C',
      badge:    'Sprint 4',
      disabled: true,
      onPress:  () => {},
    },
    {
      label:    'Réseaux sociaux',
      sub:      'Disponible en Sprint 4',
      icon:     'share-social-outline',
      iconBg:   '#F3E8FF',
      iconColor:'#7C3AED',
      badge:    'Sprint 4',
      disabled: true,
      onPress:  () => {},
    },
  ];

  const compteItems: MenuItem[] = [
    {
      label:     'Mon profil',
      sub:       nomComplet,
      icon:      'person-outline',
      iconBg:    theme.colors.bgApp,
      iconColor: theme.colors.textSecondary,
      onPress:   () => navigationApp.navigate('EditProfile'),
    },
    {
      label:     'Mon entreprise',
      sub:       nomEntreprise || 'Informations entreprise',
      icon:      'business-outline',
      iconBg:    theme.colors.bgApp,
      iconColor: theme.colors.textSecondary,
      onPress:   () => navigationApp.navigate('EditCompany'),
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Carte utilisateur ── */}
        <View style={styles.userCard}>
          <Avatar nom={nomComplet || '?'} size="lg" />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{nomComplet}</Text>
            {nomEntreprise ? <Text style={styles.userEntreprise}>{nomEntreprise}</Text> : null}
          </View>
          <TouchableOpacity style={styles.editProfileBtn} onPress={() => navigationApp.navigate('EditProfile')}>
            <Ionicons name="pencil-outline" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>CRM</Text>
        <View style={styles.menuGroup}>
          {crmItems.map((item, i) => (
            <MenuItemRow key={item.label} item={item} isLast={i === crmItems.length - 1} />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Ventes</Text>
        <View style={styles.menuGroup}>
          {ventesItems.map((item, i) => (
            <MenuItemRow key={item.label} item={item} isLast={i === ventesItems.length - 1} />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Marketing</Text>
        <View style={styles.menuGroup}>
          {marketingItems.map((item, i) => (
            <MenuItemRow key={item.label} item={item} isLast={i === marketingItems.length - 1} />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Mon compte</Text>
        <View style={styles.menuGroup}>
          {compteItems.map((item, i) => (
            <MenuItemRow key={item.label} item={item} isLast={i === compteItems.length - 1} />
          ))}
        </View>

        <View style={[styles.logoutGroup, { marginTop: theme.spacing[5] }]}>
          <TouchableOpacity style={styles.logoutItem} onPress={handleDeconnexion} activeOpacity={0.7}>
            <View style={styles.logoutIconWrapper}>
              <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} />
            </View>
            <Text style={styles.logoutLabel}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Easy Sales CRM — Sprint 2 • v2.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};