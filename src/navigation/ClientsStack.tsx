/**
 * @file ClientsStack.tsx
 * @description Stack Navigator pour le module Clients & Contacts.
 *              Gère la navigation :
 *              ClientsList → ClientDetail → ClientForm
 *                                        → ContactDetail → ContactForm
 * @author Riahi Dorsaf
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ClientsListScreen }    from '../screens/clients/ClientsListScreen';
import { ClientDetailScreen }   from '../screens/clients/ClientDetailScreen';
import { ClientFormScreen }     from '../screens/clients/ClientFormScreen';
import { ImportClientsScreen }  from '../screens/clients/ImportClientsScreen';
import { ContactDetailScreen }  from '../screens/contacts/ContactDetailScreen';
import { ContactFormScreen }    from '../screens/contacts/ContactFormScreen';
import { ClientResponse }       from '../types/client.types';
import { ContactResponse }      from '../types/contact.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type ClientsStackParamList = {
  ClientsList:    undefined;
  ClientDetail:   { clientId: number };
  ClientForm:     { client?: ClientResponse };
  ImportClients:  undefined;
  ContactDetail:  { contactId: number; clientId: number };
  ContactForm:    { clientId: number; contact?: ContactResponse };
};

const Stack = createNativeStackNavigator<ClientsStackParamList>();

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Stack de navigation pour le module Clients & Contacts.
 * Tous les écrans n'ont pas de header natif (géré manuellement dans chaque écran).
 *
 * @author Riahi Dorsaf
 */
export const ClientsStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown:    false,
      contentStyle:   { backgroundColor: '#F3F4F6' },
      gestureEnabled: true,
      animation:      'slide_from_right',
    }}
  >
    <Stack.Screen name="ClientsList"   component={ClientsListScreen}   />
    <Stack.Screen name="ClientDetail"  component={ClientDetailScreen}  />
    <Stack.Screen name="ClientForm"    component={ClientFormScreen}    />
    <Stack.Screen name="ImportClients" component={ImportClientsScreen} />
    <Stack.Screen name="ContactDetail" component={ContactDetailScreen} />
    <Stack.Screen name="ContactForm"   component={ContactFormScreen}   />
  </Stack.Navigator>
);