import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatutCompteScreen }  from '../screens/app/StatutCompteScreen';
import { EditProfileScreen }   from '../screens/app/EditProfileScreen';
import { EditCompanyScreen }   from '../screens/app/EditCompanyScreen';

export type AppStackParamList = {
  StatutCompte: undefined;
  EditProfile:  undefined;
  EditCompany:  undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown:    false,
      contentStyle:   { backgroundColor: '#F3F4F6' },
      gestureEnabled: true,
    }}
  >
    <Stack.Screen name="StatutCompte" component={StatutCompteScreen} />
    <Stack.Screen name="EditProfile"  component={EditProfileScreen} />
    <Stack.Screen name="EditCompany"  component={EditCompanyScreen} />
  </Stack.Navigator>
);