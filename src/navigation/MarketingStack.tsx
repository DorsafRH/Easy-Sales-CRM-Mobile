/**
 * @file MarketingStack.tsx
 * @description Stack Navigator du module Marketing (Sprint 4).
 *              Écran principal à 4 onglets + formulaire et détail de publication.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MarketingHomeScreen }     from '../screens/marketing/MarketingHomeScreen';
import { PublicationFormScreen }   from '../screens/marketing/PublicationFormScreen';
import { PublicationDetailScreen } from '../screens/marketing/PublicationDetailScreen';

import { PublicationMarketing } from '../types/marketing.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type MarketingStackParamList = {
  /** onglet — ouvre directement un onglet interne (défaut : dashboard) */
  MarketingHome:     { onglet?: 'dashboard' | 'publications' | 'calendrier' | 'reseaux' } | undefined;
  /** Formulaire de création / édition — publication fournie en mode édition */
  PublicationForm:   { publication?: PublicationMarketing };
  /** Détail d'une publication et statut de diffusion par réseau */
  PublicationDetail: { publicationId: number };
};

const Stack = createNativeStackNavigator<MarketingStackParamList>();

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Stack Navigator pour l'onglet Marketing.
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
    <Stack.Screen name="MarketingHome"     component={MarketingHomeScreen} />
    <Stack.Screen name="PublicationForm"   component={PublicationFormScreen} />
    <Stack.Screen name="PublicationDetail" component={PublicationDetailScreen} />
  </Stack.Navigator>
);
