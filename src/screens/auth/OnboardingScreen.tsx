import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { colors, spacing, typography, radius } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthStack';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Onboarding'> };

const { width } = Dimensions.get('window');

const FEATURES = [
  { icon: '👥', label: 'Gérez vos clients' },
  { icon: '📊', label: 'Suivez vos ventes' },
  { icon: '📱', label: 'Tout sur mobile'   },
  { icon: '🤖', label: 'Assisté par IA'   },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => (
  <Screen scrollable={false} padded={false} bg={colors.bgSurface}>

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

const styles = StyleSheet.create({
  hero:         { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing[6], paddingTop: spacing[12] },
  logo:         { width: 80, height: 80, borderRadius: radius.xl, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[6], shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  logoText:     { fontSize: 40, fontWeight: '800', color: colors.white },
  appName:      { fontSize: typography.size['2xl'], fontWeight: '700', color: colors.textPrimary, marginBottom: spacing[3], textAlign: 'center' },
  tagline:      { fontSize: typography.size.md, color: colors.textSecondary, textAlign: 'center', lineHeight: typography.size.md * 1.6, marginBottom: spacing[10] },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing[3], rowGap: spacing[3], justifyContent: 'center', width: '100%' },
  featureItem:  { width: (width - spacing[6] * 2 - spacing[3]) / 2 - 1, backgroundColor: colors.bgApp, borderRadius: radius.lg, padding: spacing[4], alignItems: 'center', columnGap: spacing[2], rowGap: spacing[2], borderWidth: 1, borderColor: colors.border },
  featureIcon:  { fontSize: 28 },
  featureLabel: { fontSize: typography.size.sm, fontWeight: '500', color: colors.textSecondary, textAlign: 'center' },
  actions:      { paddingHorizontal: spacing[5], paddingBottom: spacing[10], columnGap: spacing[3], rowGap: spacing[3] },
  btnPrimary:   { marginBottom: spacing[1] },
  disclaimer:   { fontSize: typography.size.xs, color: colors.textTertiary, textAlign: 'center', marginTop: spacing[3] },
});