import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen }  from '../../components/layout/Screen';
import { Card }    from '../../components/layout/Card';
import { Input }   from '../../components/ui/Input';
import { Button }  from '../../components/ui/Button';
import { colors, spacing, typography, radius } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useInscriptionContext } from '../../context/InscriptionContext';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'InformationsProprietaire'>;
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

const getStrength = (pwd: string) => {
  let score = 0;
  if (pwd.length >= 8)            score++;
  if (pwd.length >= 12)           score++;
  if (/[A-Z]/.test(pwd))         score++;
  if (/[0-9]/.test(pwd))         score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { level: 'Faible', color: colors.danger,  width: '25%' as const };
  if (score <= 3) return { level: 'Moyen',  color: colors.warning, width: '60%' as const };
  return             { level: 'Fort',   color: colors.success, width: '100%' as const };
};

export const InformationsProprietaireScreen: React.FC<Props> = ({ navigation }) => {
  const { form, errors, updateField, validateStep2 } = useInscriptionContext();

  const handleSuivant = () => {
    if (validateStep2()) {
      navigation.navigate('Recapitulation');
    }
  };

  const strength = form.motDePasse ? getStrength(form.motDePasse) : null;

  return (
    <Screen>
      <StepIndicator current={2} total={3} />
      <Text style={styles.title}>Vos informations</Text>
      <Text style={styles.subtitle}>Informations du propriétaire du compte</Text>

      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowItem}><Input label="Prénom" placeholder="Ahmed" value={form.prenom} onChangeText={(v: string) => updateField('prenom', v)} error={errors.prenom} required autoCapitalize="words" /></View>
          <View style={styles.rowItem}><Input label="Nom" placeholder="Ben Ali" value={form.nom} onChangeText={(v: string) => updateField('nom', v)} error={errors.nom} required autoCapitalize="words" /></View>
        </View>
        <Input label="Email" placeholder="votre@email.com" value={form.email} onChangeText={(v: string) => updateField('email', v)} error={errors.email} required keyboardType="email-address" />
        <Input label="Téléphone" placeholder="+216 20 000 000" value={form.telephone} onChangeText={(v: string) => updateField('telephone', v)} error={errors.telephone} required keyboardType="phone-pad" />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Sécurité</Text>
          <View style={styles.dividerLine} />
        </View>

        <Input label="Mot de passe" placeholder="Minimum 8 caractères" value={form.motDePasse} onChangeText={(v: string) => updateField('motDePasse', v)} error={errors.motDePasse} required isPassword />

        {strength && (
          <View style={styles.strengthWrapper}>
            <View style={styles.strengthBar}>
              <View style={[styles.strengthFill, { width: strength.width, backgroundColor: strength.color }]} />
            </View>
            <Text style={[styles.strengthLabel, { color: strength.color }]}>Sécurité : {strength.level}</Text>
          </View>
        )}

        <Input label="Confirmer le mot de passe" placeholder="Répétez votre mot de passe" value={form.confirmMotDePasse} onChangeText={(v: string) => updateField('confirmMotDePasse', v)} error={errors.confirmMotDePasse} required isPassword />
      </Card>

      <View style={styles.btnRow}>
        <Button label="Retour" onPress={() => navigation.goBack()} variant="secondary" size="lg" style={styles.btnBack} />
        <Button label="Récapitulatif" onPress={handleSuivant} size="lg" style={styles.btnNext} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title:           { fontSize: typography.size.xl, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing[2], marginTop: spacing[4] },
  subtitle:        { fontSize: typography.size.sm, color: colors.textSecondary, marginBottom: spacing[5] },
  card:            { marginBottom: spacing[4] },
  row:             { flexDirection: 'row', columnGap: spacing[3], rowGap: spacing[3] },
  rowItem:         { flex: 1 },
  divider:         { flexDirection: 'row', alignItems: 'center', columnGap: spacing[3], rowGap: spacing[3], marginBottom: spacing[4], marginTop: spacing[2] },
  dividerLine:     { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText:     { fontSize: typography.size.xs, fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5 },
  strengthWrapper: { marginBottom: spacing[4], marginTop: -spacing[2] },
  strengthBar:     { height: 4, backgroundColor: colors.border, borderRadius: radius.full, marginBottom: spacing[1] },
  strengthFill:    { height: 4, borderRadius: radius.full },
  strengthLabel:   { fontSize: typography.size.xs, fontWeight: '500' },
  btnRow:          { flexDirection: 'row', columnGap: spacing[3], rowGap: spacing[3], marginBottom: spacing[6] },
  btnBack:         { flex: 1 },
  btnNext:         { flex: 2 },
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