import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatutCompteScreen } from '../screens/app/StatutCompteScreen';
import { colors } from '../theme';

export type AppStackParamList = {
  StatutCompte: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle:         { backgroundColor: colors.bgSurface },
      headerTintColor:     colors.textPrimary,
      headerTitleStyle:    { fontWeight: '600', fontSize: 16 },
      headerShadowVisible: false,
      contentStyle:        { backgroundColor: colors.bgApp },
    }}
  >
    <Stack.Screen
      name="StatutCompte"
      component={StatutCompteScreen}
      options={{ title: 'Mon compte', headerBackVisible: false }}
    />
  </Stack.Navigator>
);