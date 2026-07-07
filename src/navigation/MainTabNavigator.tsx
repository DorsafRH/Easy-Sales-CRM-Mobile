/**
 * @file MainTabNavigator.tsx
 * @description Bottom Tab Navigator principal.
 *   FIX : unmountOnBlur via cast (type BottomTabNavigationOptions incomplet dans certaines versions)
 * @author Riahi Dorsaf
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions, StackActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

/**
 * Listener tabPress qui ramène toujours l'onglet à son écran racine.
 *
 * Une action rapide fait `navigate('Clients', { screen: 'ClientForm' })`, ce
 * qui empile ClientForm ET colle le param `{ screen: 'ClientForm' }` sur la
 * route de l'onglet. Sans traitement, chaque appui sur le bouton d'onglet
 * ré-appliquerait ce param (merge par défaut) et rouvrirait le formulaire.
 *
 * On corrige en deux temps : on vide la pile imbriquée (popToTop) puis on
 * bascule sur l'onglet en effaçant tout param résiduel (merge: false).
 */
const resetTab = (rootScreen: string) =>
  ({ navigation, route }: { navigation: any; route: any }) => ({
    tabPress: (e: any) => {
      e.preventDefault();
      const nestedKey = route.state?.key;
      if (nestedKey) {
        navigation.dispatch({ ...StackActions.popToTop(), target: nestedKey });
      }
      // On force explicitement l'écran racine (merge: false) pour écraser tout
      // param { screen: 'XxxForm' } résiduel. La pile ayant déjà été vidée, ce
      // navigate ne ré-empile rien : il est idempotent sur la racine.
      navigation.dispatch(
        CommonActions.navigate({ name: route.name, params: { screen: rootScreen }, merge: false }),
      );
    },
  });

export const MainTabNavigator: React.FC = () => {
  const theme = useTheme();
  // Inset bas (barre gestuelle Android / home indicator iOS) — indispensable
  // en edge-to-edge (SDK 54) sinon la tabBar déborde sous la barre système.
  const insets = useSafeAreaInsets();

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
          paddingBottom:   insets.bottom + 4,
          paddingTop:      4,
          height:          60 + insets.bottom,
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
      {/*
       * popToTopOnBlur — vide la pile de l'onglet dès qu'on le quitte.
       * Sans ça, un formulaire ouvert via une action rapide
       * (navigate vers ClientForm / LeadForm / PublicationForm) resterait
       * dans l'historique et réapparaîtrait au retour matériel / au re-clic.
       */}
      <Tab.Screen name="Clients"   component={ClientsStack}    options={{ tabBarLabel: 'Clients',   popToTopOnBlur: true }} listeners={resetTab('ClientsList')} />
      <Tab.Screen name="Ventes"    component={VentesStack}     options={{ tabBarLabel: 'Ventes',    popToTopOnBlur: true }} listeners={resetTab('VentesHome')} />
      <Tab.Screen name="Marketing" component={MarketingStack}  options={{ tabBarLabel: 'Marketing', popToTopOnBlur: true }} listeners={resetTab('MarketingHome')} />

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