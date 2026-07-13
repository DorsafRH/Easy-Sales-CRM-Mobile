/**
 * @file PlusMenuScreen.tsx
 * @description Ecran "Plus" — menu liste structuré en groupes.
 *              Inclut le toggle dark/light mode.
 * @author Riahi Dorsaf
 */

import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView }              from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp }     from '@react-navigation/native-stack';
import { Ionicons }                      from '@expo/vector-icons';
import { useTranslation }                from 'react-i18next';

import { useStyles, useTheme, useThemeStore } from '../../theme';
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
        {item.sub ? <Text style={styles.menuItemSub}>{item.sub}</Text> : null}
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
 * Ecran "Plus" — menu de navigation structure avec toggle dark mode.
 * @author Riahi Dorsaf
 */
export const PlusMenuScreen: React.FC = () => {
  const styles  = useStyles(makeStyles);
  const theme   = useTheme();
  const { t }   = useTranslation();
  const { currentUser, logout, refreshUser } = useAuth();

  // Store Zustand pour le toggle dark mode
  const isDark        = useThemeStore(s => s.scheme === 'dark');
  const toggleScheme  = useThemeStore(s => s.toggleScheme);

  const navigationPlus = useNavigation<NativeStackNavigationProp<PlusStackParamList>>();
  const navigationApp  = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  useFocusEffect(useCallback(() => { refreshUser(); }, [refreshUser]));

  const prenom        = currentUser?.prenom ?? '';
  const nom           = currentUser?.nom    ?? '';
  const nomComplet    = `${prenom} ${nom}`.trim();
  const nomEntreprise = currentUser?.nomEntreprise ?? '';

  const handleDeconnexion = () => {
    Alert.alert(t('screens.moreMenu.logoutTitle'), t('screens.moreMenu.logoutConfirm'), [
      { text: t('screens.moreMenu.logoutCancel'), style: 'cancel' },
      { text: t('screens.moreMenu.logoutAction'), style: 'destructive', onPress: logout },
    ]);
  };

  // ── Groupes de menus ──────────────────────────────────────

  const crmItems: MenuItem[] = [
    {
      label:     t('screens.moreMenu.clients'),
      sub:       t('screens.moreMenu.clientsSub'),
      icon:      'people-outline',
      iconBg:    theme.colors.primaryLight,
      iconColor: theme.colors.primary,
      onPress:   () => navigationPlus.getParent()?.navigate('Clients' as never),
    },
    {
      label:     t('screens.moreMenu.catalogue'),
      sub:       t('screens.moreMenu.catalogueSub'),
      icon:      'grid-outline',
      iconBg:    '#EFF6FF',
      iconColor: '#0369A1',
      onPress:   () => navigationPlus.navigate('CatalogueHome'),
    },
    {
      label:     t('screens.moreMenu.agenda'),
      sub:       t('screens.moreMenu.agendaSub'),
      icon:      'calendar-outline',
      iconBg:    '#F0FDF4',
      iconColor: '#16A34A',
      onPress:   () => navigationPlus.navigate('AgendaHome'),
    },
  ];

  const ventesItems: MenuItem[] = [
    {
      label:    t('screens.moreMenu.leadsOpport'),
      sub:      t('screens.moreMenu.leadsOpportSub'),
      icon:     'trending-up-outline',
      iconBg:   '#F0FDF4',
      iconColor:'#16A34A',
      onPress:  () => navigationPlus.getParent()?.navigate('Ventes' as never),
    },
    {
      label:    t('screens.moreMenu.quotes'),
      sub:      t('screens.moreMenu.quotesSub'),
      icon:     'document-text-outline',
      iconBg:   '#ECFDF5',
      iconColor:'#059669',
      onPress:  () => (navigationPlus.getParent() as any)?.navigate(
        'Ventes',
        { screen: 'DevisList' },
      ),
    },
  ];

  const marketingItems: MenuItem[] = [
    {
      label:    t('screens.moreMenu.publications'),
      sub:      t('screens.moreMenu.publicationsSub'),
      icon:     'megaphone-outline',
      iconBg:   '#FFF7ED',
      iconColor:'#EA580C',
      onPress:  () => (navigationPlus.getParent() as any)?.navigate(
        'Marketing',
        { screen: 'MarketingHome', params: { onglet: 'publications' } },
      ),
    },
    {
      label:    t('screens.moreMenu.socialNetworks'),
      sub:      t('screens.moreMenu.socialNetworksSub'),
      icon:     'share-social-outline',
      iconBg:   '#F3E8FF',
      iconColor:'#7C3AED',
      onPress:  () => (navigationPlus.getParent() as any)?.navigate(
        'Marketing',
        { screen: 'MarketingHome', params: { onglet: 'reseaux' } },
      ),
    },
  ];

  const compteItems: MenuItem[] = [
    {
      label:     t('screens.moreMenu.myProfile'),
      sub:       nomComplet,
      icon:      'person-outline',
      iconBg:    theme.colors.bgApp,
      iconColor: theme.colors.textSecondary,
      onPress:   () => navigationApp.navigate('EditProfile'),
    },
    {
      label:     t('screens.moreMenu.myCompany'),
      sub:       nomEntreprise || t('screens.moreMenu.myCompanySub'),
      icon:      'business-outline',
      iconBg:    theme.colors.bgApp,
      iconColor: theme.colors.textSecondary,
      onPress:   () => navigationApp.navigate('EditCompany'),
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Carte utilisateur ── */}
        <View style={styles.userCard}>
          <Avatar nom={nomComplet || '?'} size="lg" />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{nomComplet}</Text>
            {nomEntreprise ? <Text style={styles.userEntreprise}>{nomEntreprise}</Text> : null}
          </View>
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => navigationApp.navigate('EditProfile')}
          >
            <Ionicons name="pencil-outline" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>{t('screens.moreMenu.sectionCrm')}</Text>
        <View style={styles.menuGroup}>
          {crmItems.map((item, i) => (
            <MenuItemRow key={item.label} item={item} isLast={i === crmItems.length - 1} />
          ))}
        </View>

        <Text style={styles.sectionLabel}>{t('screens.moreMenu.sectionSales')}</Text>
        <View style={styles.menuGroup}>
          {ventesItems.map((item, i) => (
            <MenuItemRow key={item.label} item={item} isLast={i === ventesItems.length - 1} />
          ))}
        </View>

        <Text style={styles.sectionLabel}>{t('screens.moreMenu.sectionMarketing')}</Text>
        <View style={styles.menuGroup}>
          {marketingItems.map((item, i) => (
            <MenuItemRow key={item.label} item={item} isLast={i === marketingItems.length - 1} />
          ))}
        </View>

        <Text style={styles.sectionLabel}>{t('screens.moreMenu.sectionAccount')}</Text>
        <View style={styles.menuGroup}>
          {compteItems.map((item, i) => (
            <MenuItemRow key={item.label} item={item} isLast={i === compteItems.length - 1} />
          ))}
        </View>

        {/* ── Apparence — Dark Mode ── */}
        <Text style={styles.sectionLabel}>{t('screens.moreMenu.sectionAppearance')}</Text>
        <View style={styles.menuGroup}>
          <View style={[styles.menuItem, styles.menuItemLast]}>
            <View style={[styles.menuIconWrapper, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny-outline'}
                size={20}
                color={isDark ? '#93C5FD' : '#D97706'}
              />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemLabel}>
                {isDark ? t('screens.moreMenu.darkMode') : t('screens.moreMenu.lightMode')}
              </Text>
              <Text style={styles.menuItemSub}>
                {isDark ? t('screens.moreMenu.darkModeSub') : t('screens.moreMenu.lightModeSub')}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleScheme}
              trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
              thumbColor={theme.colors.white}
            />
          </View>
        </View>

        {/* ── Deconnexion ── */}
        <View style={[styles.logoutGroup, { marginTop: theme.spacing[5] }]}>
          <TouchableOpacity
            style={styles.logoutItem}
            onPress={handleDeconnexion}
            activeOpacity={0.7}
          >
            <View style={styles.logoutIconWrapper}>
              <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} />
            </View>
            <Text style={styles.logoutLabel}>{t('screens.moreMenu.logout')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Easy Sales CRM v3.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};