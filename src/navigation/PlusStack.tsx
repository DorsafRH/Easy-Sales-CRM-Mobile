/**
 * @file PlusStack.tsx
 * @description Stack Navigator pour l'onglet "Plus".
 *              Contient le Catalogue et l'Agenda des réunions.
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
import { AgendaScreen }           from '../screens/agenda/AgendaScreen';
import { PlanifierReunionScreen } from '../screens/agenda/PlanifierReunionScreen';
import { ReunionDetailScreen }    from '../screens/agenda/ReunionDetailScreen';

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
  /** Écran Agenda — liste des réunions de la semaine */
  AgendaHome:    undefined;
  /**
   * Formulaire de création / modification d'une réunion.
   * @param reunionId  - fourni en mode édition
   * @param clientId   - pré-sélectionne le client (depuis fiche client)
   * @param clientNom  - nom affiché dans le formulaire
   */
  PlanifierReunion: {
    reunionId?:  number;
    clientId?:   number;
    clientNom?:  string;
  };
  /** Fiche détail d'une réunion */
  ReunionDetail: { reunionId: number };
};

const Stack = createNativeStackNavigator<PlusStackParamList>();

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Stack de navigation pour l'onglet Plus.
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
    <Stack.Screen name="PlusMenu"         component={PlusMenuScreen}         />
    <Stack.Screen name="CatalogueHome"    component={CatalogueScreen}        />
    <Stack.Screen name="ProduitDetail"    component={ProduitDetailScreen}    />
    <Stack.Screen name="ProduitForm"      component={ProduitFormScreen}      />
    <Stack.Screen name="CategorieForm"    component={CategorieFormScreen}    />
    <Stack.Screen name="AgendaHome"       component={AgendaScreen}           />
    <Stack.Screen name="PlanifierReunion" component={PlanifierReunionScreen} />
    <Stack.Screen name="ReunionDetail"    component={ReunionDetailScreen}    />
  </Stack.Navigator>
);