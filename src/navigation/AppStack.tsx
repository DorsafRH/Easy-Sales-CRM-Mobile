/**
 * @file AppStack.tsx
 * @description Stack de navigation pour les utilisateurs authentifiés.
 *              Sprint 2 : route vers MainTabNavigator si le compte est ACTIVE,
 *              vers StatutCompteScreen pour les autres statuts.
 *
 *              LOGIQUE DE ROUTAGE :
 *              - ACTIVE   → MainTabNavigator (dashboard + modules)
 *              - Autres   → StatutCompteScreen (en attente / refusé / suspendu)
 *
 * @author Riahi Dorsaf
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Écrans Sprint 1 (conservés)
import { StatutCompteScreen }  from '../screens/app/StatutCompteScreen';
import { EditProfileScreen }   from '../screens/app/EditProfileScreen';
import { EditCompanyScreen }   from '../screens/app/EditCompanyScreen';

// Navigation Sprint 2
import { MainTabNavigator }   from './MainTabNavigator';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type AppStackParamList = {
  /** Écran de statut — affiché si compte non ACTIVE */
  StatutCompte:   undefined;
  /** Application principale — affiché si compte ACTIVE */
  MainTab:        undefined;
  /** Modification profil (accessible depuis PlusMenuScreen) */
  EditProfile:    undefined;
  /** Modification entreprise (accessible depuis PlusMenuScreen) */
  EditCompany:    undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Stack de navigation pour les utilisateurs authentifiés.
 * L'écran initial est StatutCompteScreen.
 *
 * Note : la redirection vers MainTab est effectuée dans StatutCompteScreen
 * dès que le statut du compte est ACTIVE (via navigation.replace('MainTab')).
 *
 * @author Riahi Dorsaf
 */
export const AppStack: React.FC = () => (
  <Stack.Navigator
    initialRouteName="StatutCompte"
    screenOptions={{
      headerShown:    false,
      contentStyle:   { backgroundColor: '#F3F4F6' },
      gestureEnabled: true,
    }}
  >
    <Stack.Screen
      name="StatutCompte"
      component={StatutCompteScreen}
    />
    <Stack.Screen
      name="MainTab"
      component={MainTabNavigator}
      options={{ gestureEnabled: false }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
    />
    <Stack.Screen
      name="EditCompany"
      component={EditCompanyScreen}
    />
  </Stack.Navigator>
);