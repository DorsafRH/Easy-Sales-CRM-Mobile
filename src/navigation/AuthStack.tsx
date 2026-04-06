import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { OnboardingScreen }               from '../screens/auth/OnboardingScreen';
import { LoginScreen }                    from '../screens/auth/LoginScreen';
import { InformationsEntrepriseScreen }   from '../screens/auth/InformationsEntrepriseScreen';
import { InformationsProprietaireScreen } from '../screens/auth/InformationsProprietaireScreen';
import { RecapitulationScreen }           from '../screens/auth/RecapitulationScreen';
import { InscriptionProvider }            from '../context/InscriptionContext';
import { colors } from '../theme';

export type AuthStackParamList = {
  Onboarding:               undefined;
  Login:                    undefined;
  InformationsEntreprise:   undefined;
  InformationsProprietaire: undefined;
  Recapitulation:           undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => (
  <InscriptionProvider>
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerStyle:         { backgroundColor: colors.bgSurface },
        headerTintColor:     colors.textPrimary,
        headerTitleStyle:    { fontWeight: '600', fontSize: 16 },
        headerShadowVisible: false,
        contentStyle:        { backgroundColor: colors.bgApp },
      }}
    >
      <Stack.Screen name="Onboarding"               component={OnboardingScreen}               options={{ headerShown: false }} />
      <Stack.Screen name="Login"                    component={LoginScreen}                    options={{ headerShown: false }} />
      <Stack.Screen name="InformationsEntreprise"   component={InformationsEntrepriseScreen}   options={{ title: 'Votre entreprise' }} />
      <Stack.Screen name="InformationsProprietaire" component={InformationsProprietaireScreen} options={{ title: 'Vos informations' }} />
      <Stack.Screen name="Recapitulation"           component={RecapitulationScreen}           options={{ title: 'Récapitulatif' }} />
    </Stack.Navigator>
  </InscriptionProvider>
);