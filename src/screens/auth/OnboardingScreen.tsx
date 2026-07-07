/**
 * @file OnboardingScreen.tsx
 * @description Écran d'accueil présentant les fonctionnalités clés de l'application
 *              et proposant les actions d'authentification (connexion / inscription).
 * @author Riahi Dorsaf
 */

import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { useStyles } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { makeStyles } from './OnboardingScreen.styles';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Onboarding'> };

const FEATURES = [
  { icon: '👥', label: 'Gérez vos clients' },
  { icon: '📊', label: 'Suivez vos ventes' },
  { icon: '📱', label: 'Tout sur mobile'   },
  { icon: '🤖', label: 'Assisté par IA'   },
];

/**
 * Écran d'onboarding — point d'entrée de l'application pour les utilisateurs
 * non authentifiés. Présente les fonctionnalités principales et oriente
 * vers la connexion ou la création de compte.
 *
 * @param navigation - Prop de navigation React Navigation
 * @author Riahi Dorsaf
 */
export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const styles = useStyles(makeStyles);

  return (
    <Screen scrollable={false} padded={false}>

      <View style={styles.hero}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>C</Text>
        </View>
        <Text style={styles.appName}>CRM Mobile</Text>
        <Text style={styles.tagline}>La solution CRM légère et{'\n'}accessible pour les PME</Text>

        <View style={styles.featuresGrid}>
          {FEATURES.map(f => (
            <View key={f.label} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label="Se connecter"
          onPress={() => navigation.navigate('Login')}
          variant="primary"
          size="lg"
          fullWidth
          style={styles.btnPrimary}
        />
        <Button
          label="Créer un compte entreprise"
          onPress={() => navigation.navigate('InformationsEntreprise')}
          variant="outline"
          size="lg"
          fullWidth
        />
        <Text style={styles.disclaimer}>
          Solution CRM pour les PME — Simple, mobile et accessible
        </Text>
      </View>

    </Screen>
  );
};