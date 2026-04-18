/**
 * @file RecapitulationScreen.tsx
 * @description Étape 3 (finale) du formulaire d'inscription — affiche un récapitulatif
 *              de toutes les informations saisies avant soumission, puis un écran de
 *              confirmation en cas de succès.
 * @author Riahi Dorsaf
 */

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen }  from '../../components/layout/Screen';
import { Card }    from '../../components/layout/Card';
import { Button }  from '../../components/ui/Button';
import { useStyles } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useInscriptionContext } from '../../context/InscriptionContext';
import { makeStyles } from './RecapitulationScreen.styles';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Recapitulation'>;
};

// ─────────────────────────────────────────────────────────────
// SOUS-COMPOSANT : StepIndicator
// ─────────────────────────────────────────────────────────────

/**
 * Indicateur de progression en étapes (stepper visuel).
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
// SOUS-COMPOSANT : Row
// ─────────────────────────────────────────────────────────────

/**
 * Ligne de récapitulatif affichant un label et sa valeur en regard.
 *
 * @param label - Libellé du champ
 * @param value - Valeur à afficher (affiche '—' si vide)
 * @param mono  - Si true, applique une police monospace à la valeur
 * @author Riahi Dorsaf
 */
const Row: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => {
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.rowRow}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, mono && styles.rowMono]}>{value || '—'}</Text>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// ÉCRAN PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Écran de récapitulation — troisième et dernière étape du tunnel d'inscription.
 * Présente un résumé des sections Entreprise et Propriétaire avec des liens
 * de modification. Bascule vers un écran de confirmation après soumission réussie.
 *
 * @param navigation - Prop de navigation React Navigation
 * @author Riahi Dorsaf
 */
export const RecapitulationScreen: React.FC<Props> = ({ navigation }) => {
  const { form, isSubmitting, submitError, submit, reset } = useInscriptionContext();
  const styles = useStyles(makeStyles);
  const [submitted, setSubmitted] = useState(false);

  /**
   * Soumet le formulaire d'inscription complet et bascule vers la vue succès.
   * @author Riahi Dorsaf
   */
  const handleSubmit = async () => {
    const success = await submit();
    if (success) setSubmitted(true);
  };

  if (submitted) {
    return (
      <Screen scrollable={false} padded={false}>
        <View style={styles.successContainer}>
          <View style={styles.successIconWrapper}>
            <Text style={styles.successIcon}>🎉</Text>
          </View>
          <Text style={styles.successTitle}>Demande envoyée !</Text>
          <Text style={styles.successSubtitle}>
            Votre compte <Text style={{ fontWeight: '700' }}>{form.nomEntreprise}</Text> est en cours de validation.
          </Text>
          <Card style={styles.successInfoCard}>
            <View style={styles.successInfoRow}>
              <Text>📧</Text>
              <Text style={styles.successInfoText}>
                Un email de confirmation a été envoyé à{' '}
                <Text style={styles.successEmailHighlight}>{form.email}</Text>
              </Text>
            </View>
            <View style={styles.successInfoRow}>
              <Text>⏱️</Text>
              <Text style={styles.successInfoText}>
                Vous serez notifié dès que votre compte sera validé.
              </Text>
            </View>
          </Card>
          <Button
            label="Retour à l'accueil"
            onPress={() => { reset(); navigation.navigate('Onboarding'); }}
            fullWidth
            size="lg"
            style={styles.successBtn}
          />
          <Button
            label="Se connecter"
            onPress={() => { reset(); navigation.navigate('Login'); }}
            variant="outline"
            fullWidth
            size="lg"
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <StepIndicator current={3} total={3} />
      <Text style={styles.title}>Récapitulatif</Text>
      <Text style={styles.subtitle}>Vérifiez vos informations avant de soumettre</Text>

      {submitError && (
        <View style={styles.alertError}>
          <Text style={styles.alertText}>⚠️ {submitError}</Text>
        </View>
      )}

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🏢</Text>
          <Text style={styles.sectionTitle}>Entreprise</Text>
          <Text style={styles.editLink} onPress={() => navigation.navigate('InformationsEntreprise')}>
            Modifier
          </Text>
        </View>
        <Row label="Nom"       value={form.nomEntreprise} />
        <Row label="Matricule" value={form.matriculeFiscale} mono />
        <Row label="Secteur"   value={form.secteurActivite} />
        <Row label="Taille"    value={form.tailleEntreprise} />
        <Row label="Téléphone" value={form.telephoneEntreprise} />
        <Row label="Adresse"   value={`${form.adresse}, ${form.ville}, ${form.pays}`} />
        {form.siteWeb ? <Row label="Site web" value={form.siteWeb} /> : null}
      </Card>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>👤</Text>
          <Text style={styles.sectionTitle}>Propriétaire</Text>
          <Text style={styles.editLink} onPress={() => navigation.navigate('InformationsProprietaire')}>
            Modifier
          </Text>
        </View>
        <Row label="Prénom"       value={form.prenom} />
        <Row label="Nom"          value={form.nom} />
        <Row label="Email"        value={form.email} />
        <Row label="Téléphone"    value={form.telephone} />
        <Row label="Mot de passe" value="••••••••" />
      </Card>

      <View style={styles.terms}>
        <Text style={styles.termsText}>
          En soumettant ce formulaire, vous acceptez que vos informations soient traitées pour la création de votre compte CRM.
        </Text>
      </View>

      <View style={styles.btnRow}>
        <Button
          label="Retour"
          onPress={() => navigation.goBack()}
          variant="secondary"
          size="lg"
          style={styles.btnBack}
        />
        <Button
          label="Envoyer ma demande"
          onPress={handleSubmit}
          loading={isSubmitting}
          size="lg"
          style={styles.btnNext}
        />
      </View>
    </Screen>
  );
};
