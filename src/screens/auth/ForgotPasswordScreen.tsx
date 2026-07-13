/**
 * @file ForgotPasswordScreen.tsx
 * @description Écran de mot de passe oublié.
 *              L'utilisateur saisit son email — le backend envoie
 *              un token UUID par email pour réinitialiser le mot de passe.
 * @author Riahi Dorsaf
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Card }   from '../../components/layout/Card';
import { Input }  from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useStyles } from '../../theme';
import { makeStyles } from './ForgotPasswordScreen.styles';
import { useTranslation } from 'react-i18next';
import { AuthStackParamList } from '../../navigation/AuthStack';
import * as AuthApi from '../../api/auth.api';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
};

/**
 * Écran mot de passe oublié.
 * Envoie une demande de réinitialisation au backend.
 *
 * @param navigation - Prop de navigation React Navigation
 * @author Riahi Dorsaf
 */
export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const styles = useStyles(makeStyles);
  const { t }  = useTranslation();

  const [email,      setEmail]      = useState('');
  const [isLoading,  setIsLoading]  = useState(false);
  const [isSuccess,  setIsSuccess]  = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');

  /**
   * Valide le champ email avant envoi.
   * @returns true si valide, false sinon
   */
  const validate = (): boolean => {
    if (!email.trim()) {
      setEmailError("L'email est obligatoire.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Format d'email invalide.");
      return false;
    }
    setEmailError('');
    return true;
  };

  /**
   * Envoie la demande de réinitialisation au backend.
   * En cas de succès, affiche un message de confirmation.
   * @author Riahi Dorsaf
   */
  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthApi.forgotPassword({
        email: email.trim(),
      });

      if (response.success) {
          navigation.navigate('VerifyCode', { email: email.trim() });
      } else {
        setError(response.message ?? 'Une erreur est survenue.');
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
        'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === 'android' ? '#FFFFFF' : 'transparent'}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Bouton retour */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          {/* Icône */}
          <View style={styles.iconWrapper}>
            <Text style={styles.icon}>🔐</Text>
          </View>

          {/* Titre */}
          <Text style={styles.title}>{t('auth.forgot.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.forgot.subtitle')}</Text>

          {/* Message succès */}
          {isSuccess && (
            <View style={styles.alertSuccess}>
              <Text style={styles.alertSuccessText}>
                {t('auth.forgot.success')}
              </Text>
            </View>
          )}

          {/* Message erreur */}
          {error && (
            <View style={styles.alertError}>
              <Text style={styles.alertErrorText}>⚠️ {error}</Text>
            </View>
          )}

          {/* Formulaire */}
          {!isSuccess && (
            <Card style={styles.card}>
              <Input
                label={t('auth.forgot.emailLabel')}
                placeholder="votre@email.com"
                value={email}
                onChangeText={v => {
                  setEmail(v);
                  setEmailError('');
                  setError(null);
                }}
                error={emailError}
                keyboardType="email-address"
                required
              />
              <Button
                label={t('auth.forgot.sendBtn')}
                onPress={handleSubmit}
                loading={isLoading}
                fullWidth
                size="lg"
                style={styles.btnSubmit}
              />
            </Card>
          )}

          {/* Retour login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.forgot.remember')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>{t('auth.forgot.login')}</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};