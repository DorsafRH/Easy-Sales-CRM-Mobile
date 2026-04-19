/**
 * @file ResetPasswordScreen.tsx
 * @description Écran de réinitialisation du mot de passe.
 *              L'utilisateur saisit le token reçu par email
 *              et son nouveau mot de passe.
 * @author Riahi Dorsaf
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

import { Card }      from '../../components/layout/Card';
import { Input }     from '../../components/ui/Input';
import { Button }    from '../../components/ui/Button';
import { useStyles } from '../../theme';
import { makeStyles } from './ResetPasswordScreen.styles';
import { AuthStackParamList } from '../../navigation/AuthStack';
import * as AuthApi from '../../api/auth.api';
import { colors as staticColors } from '../../theme';
import { layout } from '../../theme/dimensions';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;
  route:      RouteProp<AuthStackParamList, 'ResetPassword'>;
};

/**
 * Calcule la force du mot de passe.
 * @param pwd - Mot de passe à évaluer
 * @returns Niveau, couleur et largeur de la barre
 */
const getStrength = (pwd: string) => {
  let score = 0;
  if (pwd.length >= 8)             score++;
  if (pwd.length >= 12)            score++;
  if (/[A-Z]/.test(pwd))          score++;
  if (/[0-9]/.test(pwd))          score++;
  if (/[^A-Za-z0-9]/.test(pwd))  score++;

  if (score <= 1) return {
    level: 'Faible',
    color: staticColors.danger,
    width: '25%' as const,
  };
  if (score <= 3) return {
    level: 'Moyen',
    color: staticColors.warning,
    width: '60%' as const,
  };
  return {
    level: 'Fort',
    color: staticColors.success,
    width: '100%' as const,
  };
};

/**
 * Écran de réinitialisation du mot de passe.
 *
 * @param navigation - Prop de navigation React Navigation
 * @author Riahi Dorsaf
 */
export const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const styles = useStyles(makeStyles);
  const { code } = route.params;

  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmer,        setConfirmer]        = useState('');
  const [isLoading,        setIsLoading]        = useState(false);
  const [isSuccess,        setIsSuccess]        = useState(false);
  const [error,            setError]            = useState<string | null>(null);
  const [errors,           setErrors]           = useState({
    nouveauMotDePasse: '',
    confirmer:         '',
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true // bloque le retour Android
    );
    return () => backHandler.remove();
  }, []);

  /**
   * Valide tous les champs du formulaire.
   * @returns true si tous les champs sont valides
   */
  const validate = (): boolean => {
    const e = { nouveauMotDePasse: '', confirmer: '' };
    let valid = true;

    if (!nouveauMotDePasse) {
      e.nouveauMotDePasse = 'Le mot de passe est obligatoire.';
      valid = false;
    } else if (nouveauMotDePasse.length < 8) {
      e.nouveauMotDePasse = 'Minimum 8 caractères.';
      valid = false;
    }
    if (nouveauMotDePasse !== confirmer) {
      e.confirmer = 'Les mots de passe ne correspondent pas.';
      valid = false;
    }

    setErrors(e);
    return valid;
  };

  /**
   * Soumet la réinitialisation du mot de passe au backend.
   * @author Riahi Dorsaf
   */
  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthApi.resetPassword({
        token:             code,
        nouveauMotDePasse,
      });

      if (response.success) {
        setIsSuccess(true);
      } else {
        setError(response.message ?? 'Une erreur est survenue.');
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
        'Token invalide ou expiré. Veuillez recommencer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const strength = nouveauMotDePasse ? getStrength(nouveauMotDePasse) : null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          Platform.OS === 'android' ? '#FFFFFF' : 'transparent'
        }
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: layout.buttonHeight * 2 }]}
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
            <Text style={styles.icon}>🔑</Text>
          </View>

          {/* Titre */}
          <Text style={styles.title}>Nouveau mot de passe</Text>
          <Text style={styles.subtitle}>
            Saisissez le token reçu par email et
            choisissez un nouveau mot de passe sécurisé.
          </Text>

          {/* Succès */}
          {isSuccess ? (
            <View>
              <View style={styles.alertError}>
                <Text style={[styles.alertErrorText, {
                  color: staticColors.successText
                }]}>
                  ✅ Mot de passe réinitialisé avec succès !
                </Text>
              </View>
              <Button
                label="Se connecter"
                onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
                fullWidth
                size="lg"
              />
            </View>
          ) : (
            <>
              {/* Erreur globale */}
              {error && (
                <View style={styles.alertError}>
                  <Text style={styles.alertErrorText}>⚠️ {error}</Text>
                </View>
              )}

              {/* Formulaire */}
              <Card style={styles.card}>
                <Input
                  label="Nouveau mot de passe"
                  placeholder="Minimum 8 caractères"
                  value={nouveauMotDePasse}
                  onChangeText={v => {
                    setNouveauMotDePasse(v);
                    setErrors(e => ({ ...e, nouveauMotDePasse: '' }));
                  }}
                  error={errors.nouveauMotDePasse}
                  required
                  isPassword
                />

                {/* Indicateur de force */}
                {strength && (
                  <View style={styles.strengthWrapper}>
                    <View style={styles.strengthBar}>
                      <View style={[
                        styles.strengthFill,
                        {
                          width:           strength.width,
                          backgroundColor: strength.color,
                        },
                      ]} />
                    </View>
                    <Text style={[
                      styles.strengthLabel,
                      { color: strength.color },
                    ]}>
                      Sécurité : {strength.level}
                    </Text>
                  </View>
                )}

                <Input
                  label="Confirmer le mot de passe"
                  placeholder="Répétez votre mot de passe"
                  value={confirmer}
                  onChangeText={v => {
                    setConfirmer(v);
                    setErrors(e => ({ ...e, confirmer: '' }));
                  }}
                  error={errors.confirmer}
                  required
                  isPassword
                />

                <Button
                  label="Réinitialiser le mot de passe"
                  onPress={handleSubmit}
                  loading={isLoading}
                  fullWidth
                  size="lg"
                  style={styles.btnSubmit}
                />
              </Card>

            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};