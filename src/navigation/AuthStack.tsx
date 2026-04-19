/**
 * @file AuthStack.tsx
 * @description Stack de navigation pour les écrans non authentifiés.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { OnboardingScreen }               from '../screens/auth/OnboardingScreen';
import { LoginScreen }                    from '../screens/auth/LoginScreen';
import { InformationsEntrepriseScreen }   from '../screens/auth/InformationsEntrepriseScreen';
import { InformationsProprietaireScreen } from '../screens/auth/InformationsProprietaireScreen';
import { RecapitulationScreen }           from '../screens/auth/RecapitulationScreen';
import { ForgotPasswordScreen }           from '../screens/auth/ForgotPasswordScreen';
import { VerifyCodeScreen }               from '../screens/auth/VerifyCodeScreen';
import { ResetPasswordScreen }            from '../screens/auth/ResetPasswordScreen';
import { InscriptionProvider }            from '../context/InscriptionContext';

export type AuthStackParamList = {
  Onboarding:               undefined;
  Login:                    undefined;
  InformationsEntreprise:   undefined;
  InformationsProprietaire: undefined;
  Recapitulation:           undefined;
  ForgotPassword:           undefined;
  VerifyCode:               { email: string };
  ResetPassword:            { code: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * Stack de navigation pour les écrans d'authentification.
 * @author Riahi Dorsaf
 */
export const AuthStack: React.FC = () => (
  <InscriptionProvider>
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown:  false,
        contentStyle: { backgroundColor: '#F3F4F6' },
      }}
    >
      <Stack.Screen name="Onboarding"               component={OnboardingScreen} />
      <Stack.Screen name="Login"                    component={LoginScreen} />
      <Stack.Screen name="InformationsEntreprise"   component={InformationsEntrepriseScreen} />
      <Stack.Screen name="InformationsProprietaire" component={InformationsProprietaireScreen} />
      <Stack.Screen name="Recapitulation"           component={RecapitulationScreen} />
      <Stack.Screen name="ForgotPassword"           component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyCode"               component={VerifyCodeScreen} />
      <Stack.Screen name="ResetPassword"            component={ResetPasswordScreen} options={{ headerShown: false, gestureEnabled: false }} />
    </Stack.Navigator>
  </InscriptionProvider>
);