/**
 * @file MainTabNavigator.tsx
 * @description Bottom Tab Navigator principal.
 *   FIX : unmountOnBlur via cast (type BottomTabNavigationOptions incomplet dans certaines versions)
 * @author Riahi Dorsaf
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { ClientsStack }    from './ClientsStack';
import { VentesStack }     from './VentesStack';
import { MarketingStack }  from './MarketingStack';
import { PlusStack }       from './PlusStack';

export type MainTabParamList = {
  Accueil:   undefined;
  Clients:   undefined;
  Ventes:    undefined;
  Marketing: undefined;
  Plus:      undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        headerShown:             false,
        tabBarActiveTintColor:   theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.bgSurface,
          borderTopColor:  theme.colors.border,
          borderTopWidth:  1,
          paddingBottom:   4,
          paddingTop:      4,
          height:          60,
        },
        tabBarLabelStyle: {
          fontSize:   11,
          fontWeight: '500',
        },
        tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => {
          const size = 24;
          switch (route.name) {
            case 'Accueil':   return <Ionicons name={focused ? 'home'      : 'home-outline'}      size={size} color={color} />;
            case 'Clients':   return <Ionicons name={focused ? 'people'    : 'people-outline'}    size={size} color={color} />;
            case 'Ventes':    return <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={size} color={color} />;
            case 'Marketing': return <Ionicons name={focused ? 'megaphone' : 'megaphone-outline'} size={size} color={color} />;
            case 'Plus':      return <Ionicons name={focused ? 'grid'      : 'grid-outline'}      size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Accueil"   component={DashboardScreen} options={{ tabBarLabel: 'Accueil'   }} />
      <Tab.Screen name="Clients"   component={ClientsStack}    options={{ tabBarLabel: 'Clients'   }} />
      <Tab.Screen name="Ventes"    component={VentesStack}     options={{ tabBarLabel: 'Ventes'    }} />
      <Tab.Screen name="Marketing" component={MarketingStack}  options={{ tabBarLabel: 'Marketing' }} />

      {/*
       * FIX : unmountOnBlur: true — le PlusStack est détruit à chaque sortie.
       * listeners tabPress — réinitialise vers PlusMenu quand l'onglet est re-sélectionné
       * (gère le cas où l'utilisateur est déjà sur Plus/CatalogueHome et re-appuie sur l'onglet).
       */}
      <Tab.Screen
        name="Plus"
        component={PlusStack}
        options={{ tabBarLabel: 'Plus', unmountOnBlur: true } as any}
        listeners={({ navigation }: { navigation: any }) => ({
          tabPress: (e: any) => {
            e.preventDefault();
            navigation.dispatch(
              CommonActions.navigate({
                name: 'Plus',
                params: { screen: 'PlusMenu' },
              }),
            );
          },
        })}
      />
    </Tab.Navigator>
  );
};