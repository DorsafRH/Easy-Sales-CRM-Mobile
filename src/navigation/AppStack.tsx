/**
 * @file AppStack.tsx
 * @description Stack de navigation pour les utilisateurs authentifiés.
 *
 *              LOGIQUE DE ROUTAGE :
 *              - isCompteActif = true  → MainTabNavigator directement (Dashboard)
 *              - isCompteActif = false → StatutCompteScreen (vérification statut)
 *
 *              React Navigation utilise TOUJOURS le premier Stack.Screen
 *              comme écran initial. En plaçant conditionnellement MainTab ou
 *              StatutCompte en premier, on contrôle l'écran initial sans avoir
 *              besoin de changer initialRouteName dynamiquement.
 *
 * @author Riahi Dorsaf
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StatutCompteScreen }  from '../screens/app/StatutCompteScreen';
import { EditProfileScreen }   from '../screens/app/EditProfileScreen';
import { EditCompanyScreen }   from '../screens/app/EditCompanyScreen';
import { ActivitesScreen }     from '../screens/dashboard/ActivitesScreen';
import { MainTabNavigator }    from './MainTabNavigator';
import { useAuth }             from '../context/AuthContext';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type AppStackParamList = {
  StatutCompte: undefined;
  MainTab:      undefined;
  EditProfile:  undefined;
  EditCompany:  undefined;
  /** Liste complète des activités — accessible depuis "Voir tout" du Dashboard */
  Activites:    undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Stack de navigation pour les utilisateurs authentifiés.
 * @author Riahi Dorsaf
 */
export const AppStack: React.FC = () => {
  const { isCompteActif } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown:    false,
        contentStyle:   { backgroundColor: '#F3F4F6' },
        gestureEnabled: true,
      }}
    >
      {isCompteActif ? (
        // ── Compte ACTIVE : Dashboard en premier écran ────────
        <>
          <Stack.Screen
            name="MainTab"
            component={MainTabNavigator}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="StatutCompte"
            component={StatutCompteScreen}
          />
        </>
      ) : (
        // ── Compte non confirmé : vérification du statut ──────
        <>
          <Stack.Screen
            name="StatutCompte"
            component={StatutCompteScreen}
          />
          <Stack.Screen
            name="MainTab"
            component={MainTabNavigator}
            options={{ gestureEnabled: false }}
          />
        </>
      )}

      {/* ── Écrans communs ── */}
      <Stack.Screen name="EditProfile"  component={EditProfileScreen} />
      <Stack.Screen name="EditCompany"  component={EditCompanyScreen} />
      <Stack.Screen
        name="Activites"
        component={ActivitesScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
};