import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen }  from '../../components/layout/Screen';
import { Card }    from '../../components/layout/Card';
import { Button }  from '../../components/ui/Button';
import { Input }   from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, radius } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthStack';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'> };

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, isLoading, loginError, clearLoginError } = useAuth();
  const [email,      setEmail]      = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [errors,     setErrors]     = useState({ email: '', motDePasse: '' });

  const validate = (): boolean => {
    const e = { email: '', motDePasse: '' };
    let valid = true;
    if (!email.trim()) { e.email = "L'email est obligatoire."; valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { e.email = "Format invalide."; valid = false; }
    if (!motDePasse) { e.motDePasse = "Le mot de passe est obligatoire."; valid = false; }
    setErrors(e);
    return valid;
  };

  const handleLogin = async () => {
    clearLoginError();
    if (!validate()) return;
    await login(email.trim(), motDePasse);
  };

  return (
    <Screen bg={colors.bgSurface} scrollable={false}>
      <View style={styles.logoSection}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>C</Text>
        </View>
        <Text style={styles.welcomeTitle}>Bon retour 👋</Text>
        <Text style={styles.welcomeSubtitle}>Connectez-vous à votre espace CRM</Text>
      </View>

      <Card style={styles.card}>
        {loginError && (
          <View style={styles.alertError}>
            <Text style={styles.alertText}>⚠️ {loginError}</Text>
          </View>
        )}
        <Input
          label="Adresse email"
          placeholder="votre@email.com"
          value={email}
          onChangeText={v => { setEmail(v); setErrors(e => ({ ...e, email: '' })); }}
          error={errors.email}
          keyboardType="email-address"
          required
        />
        <Input
          label="Mot de passe"
          placeholder="••••••••"
          value={motDePasse}
          onChangeText={v => { setMotDePasse(v); setErrors(e => ({ ...e, motDePasse: '' })); }}
          error={errors.motDePasse}
          isPassword
          required
        />
        <Button
          label="Se connecter"
          onPress={handleLogin}
          loading={isLoading}
          fullWidth
          size="lg"
          style={styles.btnSubmit}
        />
      </Card>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Pas encore de compte ?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('InformationsEntreprise')}>
          <Text style={styles.footerLink}> Créer un compte</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  logoSection:     { alignItems: 'center', paddingTop: spacing[10], paddingBottom: spacing[8] },
  logo:            { width: 64, height: 64, borderRadius: radius.lg, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[4], shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  logoText:        { fontSize: 32, fontWeight: '800', color: colors.white },
  welcomeTitle:    { fontSize: typography.size.xl, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing[2] },
  welcomeSubtitle: { fontSize: typography.size.base, color: colors.textSecondary, textAlign: 'center' },
  card:            { marginHorizontal: spacing[1] },
  alertError:      { backgroundColor: colors.dangerLight, borderWidth: 1, borderColor: colors.danger, borderRadius: radius.md, padding: spacing[3], marginBottom: spacing[4] },
  alertText:       { fontSize: typography.size.sm, color: colors.dangerText },
  btnSubmit:       { marginTop: spacing[2] },
  footer:          { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing[6] },
  footerText:      { fontSize: typography.size.sm, color: colors.textSecondary },
  footerLink:      { fontSize: typography.size.sm, fontWeight: '600', color: colors.primary },
});