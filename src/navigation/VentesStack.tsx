/**
 * @file VentesStack.tsx
 * @description Stack Navigator complet pour le module Ventes Sprint 3.
 *              Leads, Opportunites (Kanban), Devis, Factures.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { VentesHomeScreen }       from '../screens/ventes/VentesHomeScreen';
import { LeadsListScreen }        from '../screens/ventes/LeadsListScreen';
import { LeadDetailScreen }       from '../screens/ventes/LeadDetailScreen';
import { LeadFormScreen }         from '../screens/ventes/LeadFormScreen';
import { OpportunitesKanbanScreen } from '../screens/ventes/OpportunitesKanbanScreen';
import { OpportuniteDetailScreen } from '../screens/ventes/OpportuniteDetailScreen';
import { OpportuniteFormScreen }  from '../screens/ventes/OpportuniteFormScreen';
import { DevisListScreen }        from '../screens/ventes/DevisListScreen';
import { DevisDetailScreen }      from '../screens/ventes/DevisDetailScreen';
import { DevisFormScreen }        from '../screens/ventes/DevisFormScreen';
import { FactureDetailScreen }    from '../screens/ventes/FactureDetailScreen';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type VentesStackParamList = {
  VentesHome:         undefined;
  LeadsList:          undefined;
  LeadDetail:         { leadId: number };
  LeadForm:           { leadId?: number; clientId?: number };
  OpportunitesKanban: undefined;
  OpportuniteDetail:  { opportuniteId: number };
  OpportuniteForm:    { opportuniteId?: number; leadId?: number; clientId?: number };
  DevisList:          undefined;
  DevisDetail:        { devisId: number };
  DevisForm:          { devisId?: number; opportuniteId?: number; clientId?: number };
  FactureDetail:      { factureId: number };
};

const Stack = createNativeStackNavigator<VentesStackParamList>();

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Stack de navigation pour l'onglet Ventes.
 * @author Riahi Dorsaf
 */
export const VentesStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown:    false,
      contentStyle:   { backgroundColor: '#F3F4F6' },
      gestureEnabled: true,
      animation:      'slide_from_right',
    }}
  >
    <Stack.Screen name="VentesHome"         component={VentesHomeScreen}         />
    <Stack.Screen name="LeadsList"          component={LeadsListScreen}          />
    <Stack.Screen name="LeadDetail"         component={LeadDetailScreen}         />
    <Stack.Screen name="LeadForm"           component={LeadFormScreen}           />
    <Stack.Screen name="OpportunitesKanban" component={OpportunitesKanbanScreen} />
    <Stack.Screen name="OpportuniteDetail"  component={OpportuniteDetailScreen}  />
    <Stack.Screen name="OpportuniteForm"    component={OpportuniteFormScreen}    />
    <Stack.Screen name="DevisList"          component={DevisListScreen}          />
    <Stack.Screen name="DevisDetail"        component={DevisDetailScreen}        />
    <Stack.Screen name="DevisForm"          component={DevisFormScreen}          />
    <Stack.Screen name="FactureDetail"      component={FactureDetailScreen}      />
  </Stack.Navigator>
);