/**
 * @file CatalogueStack.tsx
 * @description Stack Navigator pour le module Catalogue (catégories + produits).
 *              Accessible depuis l'onglet "Plus" → Catalogue.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CatalogueScreen }      from '../screens/catalogue/CatalogueScreen';
import { ProduitDetailScreen }  from '../screens/catalogue/ProduitDetailScreen';
import { ProduitFormScreen }    from '../screens/catalogue/ProduitFormScreen';
import { CategorieFormScreen }  from '../screens/catalogue/CategorieFormScreen';
import { ProduitResponse }      from '../types/catalogue.types';
import { CategorieResponse }    from '../types/catalogue.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type CatalogueStackParamList = {
  CatalogueHome:    undefined;
  ProduitDetail:    { produitId: number };
  ProduitForm:      { produit?: ProduitResponse };
  CategorieForm:    { categorie?: CategorieResponse };
};

const Stack = createNativeStackNavigator<CatalogueStackParamList>();

/**
 * Stack de navigation pour le module Catalogue.
 * @author Riahi Dorsaf
 */
export const CatalogueStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown:    false,
      contentStyle:   { backgroundColor: '#F3F4F6' },
      gestureEnabled: true,
      animation:      'slide_from_right',
    }}
  >
    <Stack.Screen name="CatalogueHome"  component={CatalogueScreen}     />
    <Stack.Screen name="ProduitDetail"  component={ProduitDetailScreen}  />
    <Stack.Screen name="ProduitForm"    component={ProduitFormScreen}    />
    <Stack.Screen name="CategorieForm"  component={CategorieFormScreen}  />
  </Stack.Navigator>
);