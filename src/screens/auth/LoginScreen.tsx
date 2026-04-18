/**
 * @file LoginScreen.tsx
 * @description Écran de connexion permettant à l'utilisateur de s'authentifier
 *              via son email et mot de passe.
 * @author Riahi Dorsaf
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen }  from '../../components/layout/Screen';
import { Card }    from '../../components/layout/Card';
import { Button }  from '../../components/ui/Button';
import { Input }   from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useStyles } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { makeStyles } from './LoginScreen.styles';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'> };

/**
 * Écran de connexion — permet à l'utilisateur de s'authentifier avec son
 * email et mot de passe. Gère la validation côté client et affiche les
 * erreurs retournées par l'API.
 *
 * @param navigation - Prop de navigation React Navigation
 * @author Riahi Dorsaf
 */
export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, isLoading, loginError, clearLoginError } = useAuth();
  const styles = useStyles(makeStyles);
  const [email,      setEmail]      = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [errors,     setErrors]     = useState({ email: '', motDePasse: '' });

  /**
   * Valide les champs du formulaire avant soumission.
   * @returns true si le formulaire est valide, false sinon
   * @author Riahi Dorsaf
   */
  const validate = (): boolean => {
    const e = { email: '', motDePasse: '' };
    let valid = true;
    if (!email.trim()) { e.email = "L'email est obligatoire."; valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { e.email = "Format invalide."; valid = false; }
    if (!motDePasse) { e.motDePasse = "Le mot de passe est obligatoire."; valid = false; }
    setErrors(e);
    return valid;
  };

  /**
   * Soumet le formulaire de connexion après validation.
   * @author Riahi Dorsaf
   */
  const handleLogin = async () => {
    clearLoginError();
    if (!validate()) return;
    await login(email.trim(), motDePasse);
  };

  return (
    <Screen scrollable={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
      </KeyboardAvoidingView>
    </Screen>
  );
};
