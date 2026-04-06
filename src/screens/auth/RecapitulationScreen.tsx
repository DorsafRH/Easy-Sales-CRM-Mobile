import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen }  from '../../components/layout/Screen';
import { Card }    from '../../components/layout/Card';
import { Button }  from '../../components/ui/Button';
import { colors, spacing, typography, radius } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useInscriptionContext } from '../../context/InscriptionContext';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Recapitulation'>;
};

const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <View style={stepStyles.wrapper}>
    {Array.from({ length: total }, (_, i) => i + 1).map((step, idx) => (
      <React.Fragment key={step}>
        <View style={[stepStyles.dot, step === current && stepStyles.dotActive, step < current && stepStyles.dotDone]}>
          <Text style={[stepStyles.dotText, (step === current || step < current) && stepStyles.dotTextLight]}>
            {step < current ? '✓' : step}
          </Text>
        </View>
        {idx < total - 1 && <View style={[stepStyles.line, step < current && stepStyles.lineDone]} />}
      </React.Fragment>
    ))}
  </View>
);

const Row: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <View style={rowStyles.row}>
    <Text style={rowStyles.label}>{label}</Text>
    <Text style={[rowStyles.value, mono && rowStyles.mono]}>{value || '—'}</Text>
  </View>
);

export const RecapitulationScreen: React.FC<Props> = ({ navigation }) => {
  const { form, isSubmitting, submitError, submit, reset } = useInscriptionContext();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const success = await submit();
    if (success) setSubmitted(true);
  };

  if (submitted) {
    return (
      <Screen scrollable={false} padded={false} bg={colors.bgSurface}>
        <View style={successStyles.container}>
          <View style={successStyles.iconWrapper}>
            <Text style={successStyles.icon}>🎉</Text>
          </View>
          <Text style={successStyles.title}>Demande envoyée !</Text>
          <Text style={successStyles.subtitle}>
            Votre compte <Text style={{ fontWeight: '700' }}>{form.nomEntreprise}</Text> est en cours de validation.
          </Text>
          <Card style={successStyles.infoCard}>
            <View style={successStyles.infoRow}>
              <Text>📧</Text>
              <Text style={successStyles.infoText}>
                Un email de confirmation a été envoyé à{' '}
                <Text style={{ color: colors.primary }}>{form.email}</Text>
              </Text>
            </View>
            <View style={successStyles.infoRow}>
              <Text>⏱️</Text>
              <Text style={successStyles.infoText}>Vous serez notifié dès que votre compte sera validé.</Text>
            </View>
          </Card>
          <Button label="Retour à l'accueil" onPress={() => { reset(); navigation.navigate('Onboarding'); }} fullWidth size="lg" style={successStyles.btn} />
          <Button label="Se connecter" onPress={() => { reset(); navigation.navigate('Login'); }} variant="outline" fullWidth size="lg" />
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
          <Text style={styles.editLink} onPress={() => navigation.navigate('InformationsEntreprise')}>Modifier</Text>
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
          <Text style={styles.editLink} onPress={() => navigation.navigate('InformationsProprietaire')}>Modifier</Text>
        </View>
        <Row label="Prénom"    value={form.prenom} />
        <Row label="Nom"       value={form.nom} />
        <Row label="Email"     value={form.email} />
        <Row label="Téléphone" value={form.telephone} />
        <Row label="Mot de passe" value="••••••••" />
      </Card>

      <View style={styles.terms}>
        <Text style={styles.termsText}>
          En soumettant ce formulaire, vous acceptez que vos informations soient traitées pour la création de votre compte CRM.
        </Text>
      </View>

      <View style={styles.btnRow}>
        <Button label="Retour" onPress={() => navigation.goBack()} variant="secondary" size="lg" style={styles.btnBack} />
        <Button label="Envoyer ma demande" onPress={handleSubmit} loading={isSubmitting} size="lg" style={styles.btnNext} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title:        { fontSize: typography.size.xl, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing[2], marginTop: spacing[4] },
  subtitle:     { fontSize: typography.size.sm, color: colors.textSecondary, marginBottom: spacing[5] },
  alertError:   { backgroundColor: colors.dangerLight, borderWidth: 1, borderColor: colors.danger, borderRadius: radius.md, padding: spacing[3], marginBottom: spacing[4] },
  alertText:    { fontSize: typography.size.sm, color: colors.dangerText },
  section:      { marginBottom: spacing[4] },
  sectionHeader:{ flexDirection: 'row', alignItems: 'center', columnGap: spacing[2], rowGap: spacing[2], marginBottom: spacing[4], paddingBottom: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.border },
  sectionIcon:  { fontSize: 18 },
  sectionTitle: { flex: 1, fontSize: typography.size.base, fontWeight: '600', color: colors.textPrimary },
  editLink:     { fontSize: typography.size.sm, color: colors.primary, fontWeight: '500' },
  terms:        { backgroundColor: colors.bgApp, borderRadius: radius.md, padding: spacing[4], marginBottom: spacing[4] },
  termsText:    { fontSize: typography.size.xs, color: colors.textTertiary, lineHeight: typography.size.xs * 1.7, textAlign: 'center' },
  btnRow:       { flexDirection: 'row', columnGap: spacing[3], rowGap: spacing[3], marginBottom: spacing[6] },
  btnBack:      { flex: 1 },
  btnNext:      { flex: 2 },
});

const rowStyles = StyleSheet.create({
  row:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing[2], borderBottomWidth: 1, borderBottomColor: colors.bgApp },
  label: { fontSize: typography.size.sm, color: colors.textSecondary, flex: 1 },
  value: { fontSize: typography.size.sm, color: colors.textPrimary, fontWeight: '500', flex: 1.5, textAlign: 'right' },
  mono:  { fontFamily: 'monospace' },
});

const successStyles = StyleSheet.create({
  container:   { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing[5], paddingVertical: spacing[8] },
  iconWrapper: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.successLight, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[6] },
  icon:        { fontSize: 48 },
  title:       { fontSize: typography.size.xl, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing[3], textAlign: 'center' },
  subtitle:    { fontSize: typography.size.base, color: colors.textSecondary, textAlign: 'center', lineHeight: typography.size.base * 1.6, marginBottom: spacing[6] },
  infoCard:    { width: '100%', marginBottom: spacing[6], columnGap: spacing[3], rowGap: spacing[3] },
  infoRow:     { flexDirection: 'row', columnGap: spacing[3], rowGap: spacing[3], alignItems: 'flex-start' },
  infoText:    { flex: 1, fontSize: typography.size.sm, color: colors.textSecondary, lineHeight: typography.size.sm * 1.6 },
  btn:         { width: '100%', marginBottom: spacing[3] },
});

const stepStyles = StyleSheet.create({
  wrapper:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: spacing[4] },
  dot:           { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.bgSurface, alignItems: 'center', justifyContent: 'center' },
  dotActive:     { borderColor: colors.primary, backgroundColor: colors.primary },
  dotDone:       { borderColor: colors.success, backgroundColor: colors.success },
  dotText:       { fontSize: typography.size.sm, fontWeight: '600', color: colors.textTertiary },
  dotTextLight:  { color: colors.white },
  line:          { flex: 1, height: 2, backgroundColor: colors.border, marginHorizontal: spacing[1] },
  lineDone:      { backgroundColor: colors.success },
});