/**
 * @file App.tsx
 * @description Point d'entrée principal de l'application CRM Mobile.
 *
 *              RESPONSABILITÉS DE CE FICHIER :
 *              1. Hydrater le thème au démarrage (lire AsyncStorage)
 *              2. Bloquer l'affichage jusqu'à ce que le thème soit prêt
 *                 (évite le flash de thème incorrect)
 *              3. Configurer les notifications locales (expo-notifications)
 *              4. Monter les providers globaux (Auth)
 *              5. Lancer la navigation principale
 *
 *              ORDRE D'EXÉCUTION AU DÉMARRAGE :
 *              App monte → useEffect → configureNotifications() + hydrate()
 *                    → isHydrated = true → AppNavigator s'affiche avec le bon thème
 *
 * @author Riahi Dorsaf
 */

import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Import side-effect : initialise i18next AVANT tout rendu
import './src/i18n';
import { useLanguageStore } from './src/i18n/languageStore';
import { AuthProvider }   from './src/context/AuthContext';
import { AppNavigator }   from './src/navigation/AppNavigator';
import { useThemeStore }  from './src/theme/themeStore';
import { useTheme }       from './src/theme/themeStore';
import {
  configureNotifications,
} from './src/services/NotificationService';

/**
 * Composant racine de l'application.
 * Gère l'hydratation du thème et la configuration
 * des notifications avant tout affichage.
 */
export default function App() {
  // Récupère l'action hydrate et l'état isHydrated depuis le store
  const hydrate    = useThemeStore(state => state.hydrate);
  const isHydrated = useThemeStore(state => state.isHydrated);

  // Hydratation de la langue (AsyncStorage ou langue du téléphone)
  const hydrateLanguage    = useLanguageStore(state => state.hydrate);
  const isLanguageHydrated = useLanguageStore(state => state.isHydrated);

  // Récupère le thème courant pour styliser l'écran de chargement
  const theme = useTheme();

  /**
   * Initialisation au montage de l'application.
   * useEffect avec [] = exécuté UNE SEULE FOIS au démarrage.
   *
   * 1. configureNotifications() — définit le comportement des
   *    notifications locales quand l'app est au premier plan.
   *    Doit être appelé le plus tôt possible dans le cycle de vie.
   *
   * 2. hydrate() — lit le schéma de thème sauvegardé dans
   *    AsyncStorage et met à jour le store Zustand.
   */
  useEffect(() => {
    configureNotifications();
    hydrate();
    hydrateLanguage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Écran de chargement — affiché pendant la lecture AsyncStorage.
   */
  // On attend le thème ET la langue (évite un flash FR→EN)
  if (!isHydrated || !isLanguageHydrated) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    /**
     * SafeAreaProvider — OBLIGATOIRE à la racine pour que les
     * SafeAreaView de react-native-safe-area-context connaissent
     * les insets de l'appareil. Sans lui, l'app plante au démarrage.
     */
    <SafeAreaProvider>
      {/**
       * StatusBar via expo-status-bar — compatible edge-to-edge (SDK 54).
       * Sous edge-to-edge, les props backgroundColor/translucent de la
       * StatusBar de react-native sont ignorées : on ne pilote donc que
       * la couleur des icônes (style) selon le thème. Les insets sont
       * gérés par les <SafeAreaView edges={['top']}> de chaque écran.
       */}
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />

      {/**
       * AuthProvider — fournit le contexte d'authentification
       * à toute l'application (currentUser, login, logout...).
       * Doit envelopper AppNavigator pour que tous les écrans
       * aient accès au contexte auth.
       */}
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

/**
 * Styles statiques de l'écran de chargement.
 * On n'utilise PAS useStyles ici car le thème n'est pas
 * encore hydraté à ce moment — c'est le seul endroit dans
 * l'app où on accepte une couleur hardcodée (#FFFFFF).
 */
const styles = StyleSheet.create({
  splash: {
    flex:            1,
    backgroundColor: '#FFFFFF',
    alignItems:      'center',
    justifyContent:  'center',
  },
});