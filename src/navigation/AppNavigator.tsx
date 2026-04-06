import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth }   from '../context/AuthContext';
import { AuthStack } from './AuthStack';
import { AppStack }  from './AppStack';
import { colors }    from '../theme';

export const AppNavigator: React.FC = () => {
  const { currentUser, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {currentUser ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: colors.bgSurface, alignItems: 'center', justifyContent: 'center' },
});