/**
 * @file VentesStack.tsx
 * @description Stack Navigator pour le module Ventes.
 *
 *              Sprint 2 : placeholder — l'Agenda a été déplacé dans PlusStack.
 *              Sprint 3 : remplacer par Leads, Opportunités, Devis.
 *
 * @author Riahi Dorsaf
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { VentesPlaceholderScreen } from '../screens/plus/placeholders/VentesPlaceholderScreen';

export type VentesStackParamList = {
  VentesHome: undefined;
};

const Stack = createNativeStackNavigator<VentesStackParamList>();

/**
 * Stack Ventes — placeholder Sprint 2.
 * @author Riahi Dorsaf
 */
export const VentesStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: true }}>
    <Stack.Screen name="VentesHome" component={VentesPlaceholderScreen} />
  </Stack.Navigator>
);