/**
 * @file VentesStack.tsx
 * @description Stack Navigator pour le module Ventes.
 *
 *              Sprint 2 : affiche VentesPlaceholderScreen (placeholder).
 *              Sprint 3 : remplacer le contenu par les vrais écrans
 *                         Leads, Opportunités, Devis, etc.
 *
 * @author Riahi Dorsaf
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { VentesPlaceholderScreen } from '../screens/plus/placeholders/VentesPlaceholderScreen';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

/**
 * Sprint 3 : ajouter ici les routes réelles.
 * Ex : LeadsList, LeadDetail, OpportuniteForm, DevisDetail…
 */
export type VentesStackParamList = {
  VentesHome: undefined;
};

const Stack = createNativeStackNavigator<VentesStackParamList>();

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Stack Navigator pour l'onglet Ventes.
 *
 * Sprint 2 : placeholder — remplacer par les vrais écrans en Sprint 3.
 *
 * @author Riahi Dorsaf
 */
export const VentesStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown:    false,
      gestureEnabled: true,
      animation:      'slide_from_right',
    }}
  >
    <Stack.Screen
      name="VentesHome"
      component={VentesPlaceholderScreen}
    />
  </Stack.Navigator>
);