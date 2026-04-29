/**
 * @file MarketingStack.tsx
 * @description Stack Navigator pour le module Marketing.
 *
 *              Sprint 2 : affiche MarketingPlaceholderScreen (placeholder).
 *              Sprint 4 : remplacer le contenu par les vrais écrans
 *                         Publications, Réseaux sociaux, etc.
 *
 * @author Riahi Dorsaf
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MarketingPlaceholderScreen } from '../screens/plus/placeholders/MarketingPlaceholderScreen';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

/**
 * Sprint 4 : ajouter ici les routes réelles.
 * Ex : PublicationsList, PublicationForm, ReseauxSociaux…
 */
export type MarketingStackParamList = {
  MarketingHome: undefined;
};

const Stack = createNativeStackNavigator<MarketingStackParamList>();

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Stack Navigator pour l'onglet Marketing.
 *
 * Sprint 2 : placeholder — remplacer par les vrais écrans en Sprint 4.
 *
 * @author Riahi Dorsaf
 */
export const MarketingStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown:    false,
      gestureEnabled: true,
      animation:      'slide_from_right',
    }}
  >
    <Stack.Screen
      name="MarketingHome"
      component={MarketingPlaceholderScreen}
    />
  </Stack.Navigator>
);