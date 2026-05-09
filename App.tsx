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
  Platform,
  StatusBar,
} from 'react-native';
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Écran de chargement — affiché pendant la lecture AsyncStorage.
   * Typiquement < 100ms, imperceptible pour l'utilisateur.
   * MAIS indispensable pour éviter le flash de thème incorrect.
   */
  if (!isHydrated) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />
      </View>
    );
  }

  return (
    <>
      {/**
       * StatusBar adaptée à la plateforme et au thème.
       * iOS     : barStyle change selon light/dark
       * Android : backgroundColor visible, translucent évite le décalage
       */}
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={
          Platform.OS === 'android'
            ? theme.colors.bgSurface
            : 'transparent'
        }
        translucent={Platform.OS === 'android'}
      />

      {/**
       * AuthProvider — fournit le contexte d'authentification
       * à toute l'application (currentUser, login, logout...).
       * Doit envelopper AppNavigator pour que tous les écrans
       * aient accès au contexte auth.
       */}
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </>
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