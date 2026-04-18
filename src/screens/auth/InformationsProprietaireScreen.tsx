/**
 * @file InformationsProprietaireScreen.tsx
 * @description Étape 2 du formulaire d'inscription — collecte les informations
 *              personnelles du propriétaire du compte et ses identifiants de connexion.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen }  from '../../components/layout/Screen';
import { Card }    from '../../components/layout/Card';
import { Input }   from '../../components/ui/Input';
import { Button }  from '../../components/ui/Button';
import { useInscriptionContext } from '../../context/InscriptionContext';
import { useStyles, useTheme, AppTheme } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { makeStyles } from './InformationsProprietaireScreen.styles';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'InformationsProprietaire'>;
};

// ─────────────────────────────────────────────────────────────
// UTILITAIRE : force du mot de passe
// ─────────────────────────────────────────────────────────────

/**
 * Calcule la force d'un mot de passe et retourne le niveau,
 * la couleur sémantique issue du thème et la largeur de la barre.
 *
 * @param pwd   - Mot de passe à évaluer
 * @param theme - Thème courant pour résoudre les couleurs sémantiques
 * @returns Objet contenant level, color et width pour l'indicateur visuel
 * @author Riahi Dorsaf
 */
const getStrength = (pwd: string, theme: AppTheme) => {
  let score = 0;
  if (pwd.length >= 8)            score++;
  if (pwd.length >= 12)           score++;
  if (/[A-Z]/.test(pwd))         score++;
  if (/[0-9]/.test(pwd))         score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { level: 'Faible', color: theme.colors.danger,  width: '25%' as const };
  if (score <= 3) return { level: 'Moyen',  color: theme.colors.warning, width: '60%' as const };
  return             { level: 'Fort',   color: theme.colors.success, width: '100%' as const };
};

// ─────────────────────────────────────────────────────────────
// SOUS-COMPOSANT : StepIndicator
// ─────────────────────────────────────────────────────────────

/**
 * Indicateur de progression en étapes (stepper visuel).
 * Affiche des pastilles numérotées reliées par des lignes,
 * avec états : à venir, actif et complété.
 *
 * @param current - Numéro de l'étape courante (1-indexé)
 * @param total   - Nombre total d'étapes
 * @author Riahi Dorsaf
 */
const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => {
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.stepWrapper}>
      {Array.from({ length: total }, (_, i) => i + 1).map((step, idx) => (
        <React.Fragment key={step}>
          <View style={[
            styles.stepDot,
            step === current && styles.stepDotActive,
            step < current  && styles.stepDotDone,
          ]}>
            <Text style={[
              styles.stepDotText,
              (step === current || step < current) && styles.stepDotTextLight,
            ]}>
              {step < current ? '✓' : step}
            </Text>
          </View>
          {idx < total - 1 && (
            <View style={[styles.stepLine, step < current && styles.stepLineDone]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// ÉCRAN PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Écran d'informations propriétaire — deuxième étape du tunnel d'inscription.
 * Collecte : prénom, nom, email, téléphone, mot de passe et confirmation.
 * Affiche un indicateur visuel de force du mot de passe en temps réel.
 *
 * @param navigation - Prop de navigation React Navigation
 * @author Riahi Dorsaf
 */
export const InformationsProprietaireScreen: React.FC<Props> = ({ navigation }) => {
  const { form, errors, updateField, validateStep2 } = useInscriptionContext();
  const styles = useStyles(makeStyles);
  const theme  = useTheme();

  /**
   * Valide l'étape 2 et navigue vers le récapitulatif si valide.
   * @author Riahi Dorsaf
   */
  const handleSuivant = () => {
    if (validateStep2()) {
      navigation.navigate('Recapitulation');
    }
  };

  const strength = form.motDePasse ? getStrength(form.motDePasse, theme) : null;

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StepIndicator current={2} total={3} />
        <Text style={styles.title}>Vos informations</Text>
        <Text style={styles.subtitle}>Informations du propriétaire du compte</Text>

        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Input
                label="Prénom"
                placeholder="Ahmed"
                value={form.prenom}
                onChangeText={(v: string) => updateField('prenom', v)}
                error={errors.prenom}
                required
                autoCapitalize="words"
              />
            </View>
            <View style={styles.rowItem}>
              <Input
                label="Nom"
                placeholder="Ben Ali"
                value={form.nom}
                onChangeText={(v: string) => updateField('nom', v)}
                error={errors.nom}
                required
                autoCapitalize="words"
              />
            </View>
          </View>

          <Input
            label="Email"
            placeholder="votre@email.com"
            value={form.email}
            onChangeText={(v: string) => updateField('email', v)}
            error={errors.email}
            required
            keyboardType="email-address"
          />
          <Input
            label="Téléphone"
            placeholder="+216 20 000 000"
            value={form.telephone}
            onChangeText={(v: string) => updateField('telephone', v)}
            error={errors.telephone}
            required
            keyboardType="phone-pad"
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Sécurité</Text>
            <View style={styles.dividerLine} />
          </View>

          <Input
            label="Mot de passe"
            placeholder="Minimum 8 caractères"
            value={form.motDePasse}
            onChangeText={(v: string) => updateField('motDePasse', v)}
            error={errors.motDePasse}
            required
            isPassword
          />

          {strength && (
            <View style={styles.strengthWrapper}>
              <View style={styles.strengthBar}>
                <View style={[styles.strengthFill, { width: strength.width, backgroundColor: strength.color }]} />
              </View>
              <Text style={[styles.strengthLabel, { color: strength.color }]}>
                Sécurité : {strength.level}
              </Text>
            </View>
          )}

          <Input
            label="Confirmer le mot de passe"
            placeholder="Répétez votre mot de passe"
            value={form.confirmMotDePasse}
            onChangeText={(v: string) => updateField('confirmMotDePasse', v)}
            error={errors.confirmMotDePasse}
            required
            isPassword
          />
        </Card>

        <View style={styles.btnRow}>
          <Button
            label="Retour"
            onPress={() => navigation.goBack()}
            variant="secondary"
            size="lg"
            style={styles.btnBack}
          />
          <Button
            label="Récapitulatif"
            onPress={handleSuivant}
            size="lg"
            style={styles.btnNext}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};
