/**
 * @file PlusStack.tsx
 * @description Stack Navigator pour l'onglet "Plus".
 *              Encapsule PlusMenuScreen et tous les écrans Catalogue,
 *              accessibles directement depuis le menu Plus.
 *
 * @author Riahi Dorsaf
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PlusMenuScreen }      from '../screens/plus/PlusMenuScreen';
import { CatalogueScreen }     from '../screens/catalogue/CatalogueScreen';
import { ProduitDetailScreen } from '../screens/catalogue/ProduitDetailScreen';
import { ProduitFormScreen }   from '../screens/catalogue/ProduitFormScreen';
import { CategorieFormScreen } from '../screens/catalogue/CategorieFormScreen';

import { ProduitResponse, CategorieResponse } from '../types/catalogue.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type PlusStackParamList = {
  PlusMenu:      undefined;
  CatalogueHome: undefined;
  ProduitDetail: { produitId: number };
  ProduitForm:   { produit?: ProduitResponse };
  CategorieForm: { categorie?: CategorieResponse };
};

const Stack = createNativeStackNavigator<PlusStackParamList>();

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Stack de navigation pour l'onglet Plus.
 * PlusMenuScreen est l'écran d'accueil, les écrans Catalogue
 * sont accessibles via navigation depuis le menu.
 *
 * @author Riahi Dorsaf
 */
export const PlusStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown:    false,
      gestureEnabled: true,
      animation:      'slide_from_right',
    }}
  >
    <Stack.Screen name="PlusMenu"      component={PlusMenuScreen}      />
    <Stack.Screen name="CatalogueHome" component={CatalogueScreen}     />
    <Stack.Screen name="ProduitDetail" component={ProduitDetailScreen} />
    <Stack.Screen name="ProduitForm"   component={ProduitFormScreen}   />
    <Stack.Screen name="CategorieForm" component={CategorieFormScreen} />
  </Stack.Navigator>
);