import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen }  from '../../components/layout/Screen';
import { Card }    from '../../components/layout/Card';
import { Input }   from '../../components/ui/Input';
import { Button }  from '../../components/ui/Button';
import { useInscriptionContext } from '../../context/InscriptionContext';
import { colors, spacing, typography, radius } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { TailleEntreprise } from '../../types/entreprise.types';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'InformationsEntreprise'> };

const TAILLES: { value: TailleEntreprise; label: string; desc: string }[] = [
  { value: 'TPE', label: 'TPE', desc: '< 10 employés'    },
  { value: 'PME', label: 'PME', desc: '10-250 employés'  },
  { value: 'GE',  label: 'GE',  desc: '> 250 employés'   },
];

const SECTEURS = ['Commerce', 'Services', 'Industrie', 'BTP', 'Agriculture', 'Technologies', 'Santé', 'Éducation', 'Transport', 'Autre'];

export const InformationsEntrepriseScreen: React.FC<Props> = ({ navigation }) => {
  const { form, errors, updateField, validateStep1 } = useInscriptionContext();

  const handleSuivant = () => {
    if (validateStep1()) {
      navigation.navigate('InformationsProprietaire');
    }
  };

  return (
    <Screen>
      <StepIndicator current={1} total={3} />
      <Text style={styles.title}>Votre entreprise</Text>
      <Text style={styles.subtitle}>Renseignez les informations légales</Text>

      <Card style={styles.card}>
        <Input label="Nom de l'entreprise" placeholder="Ex : TechCorp SARL" value={form.nomEntreprise} onChangeText={v => updateField('nomEntreprise', v)} error={errors.nomEntreprise} required autoCapitalize="words" />
        <Input label="Matricule fiscale" placeholder="Ex : 1234567ABC" value={form.matriculeFiscale} onChangeText={v => updateField('matriculeFiscale', v.toUpperCase())} error={errors.matriculeFiscale} required autoCapitalize="characters" />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Secteur d'activité <Text style={styles.required}>*</Text></Text>
          <View style={styles.sectorGrid}>
            {SECTEURS.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, form.secteurActivite === s && styles.chipActive]}
                onPress={() => updateField('secteurActivite', s)}
              >
                <Text style={[styles.chipText, form.secteurActivite === s && styles.chipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.secteurActivite && <Text style={styles.error}>{errors.secteurActivite}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Taille <Text style={styles.required}>*</Text></Text>
          <View style={styles.tailleRow}>
            {TAILLES.map(t => (
              <TouchableOpacity
                key={t.value}
                style={[styles.tailleCard, form.tailleEntreprise === t.value && styles.tailleCardActive]}
                onPress={() => updateField('tailleEntreprise', t.value)}
              >
                <Text style={[styles.tailleLabel, form.tailleEntreprise === t.value && styles.tailleLabelActive]}>{t.label}</Text>
                <Text style={[styles.tailleDesc, form.tailleEntreprise === t.value && styles.tailleDescActive]}>{t.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.tailleEntreprise && <Text style={styles.error}>{errors.tailleEntreprise}</Text>}
        </View>

        <Input label="Téléphone entreprise" placeholder="+216 71 000 000" value={form.telephoneEntreprise} onChangeText={v => updateField('telephoneEntreprise', v)} error={errors.telephoneEntreprise} required keyboardType="phone-pad" />
        <Input label="Adresse" placeholder="12 Rue des Roses" value={form.adresse} onChangeText={v => updateField('adresse', v)} error={errors.adresse} required />
        <View style={styles.row}>
          <View style={styles.rowItem}><Input label="Ville" placeholder="Tunis" value={form.ville} onChangeText={v => updateField('ville', v)} error={errors.ville} required /></View>
          <View style={styles.rowItem}><Input label="Pays" placeholder="Tunisie" value={form.pays} onChangeText={v => updateField('pays', v)} error={errors.pays} required /></View>
        </View>
        <Input label="Site web (optionnel)" placeholder="https://mon-site.com" value={form.siteWeb} onChangeText={v => updateField('siteWeb', v)} keyboardType="url" />
      </Card>

      <Button label="Suivant — Mes informations" onPress={handleSuivant} fullWidth size="lg" style={styles.btn} />
    </Screen>
  );
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

const styles = StyleSheet.create({
  title:         { fontSize: typography.size.xl, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing[2], marginTop: spacing[4] },
  subtitle:      { fontSize: typography.size.sm, color: colors.textSecondary, marginBottom: spacing[5] },
  card:          { marginBottom: spacing[4] },
  fieldGroup:    { marginBottom: spacing[4] },
  fieldLabel:    { fontSize: typography.size.sm, fontWeight: '500', color: colors.textPrimary, marginBottom: spacing[2] },
  required:      { color: colors.danger },
  sectorGrid:    { flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing[2], rowGap: spacing[2] },
  chip:          { paddingVertical: spacing[2], paddingHorizontal: spacing[3], borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.bgSurface },
  chipActive:    { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  chipText:      { fontSize: typography.size.sm, color: colors.textSecondary, fontWeight: '500' },
  chipTextActive:{ color: colors.primary, fontWeight: '600' },
  tailleRow:     { flexDirection: 'row', columnGap: spacing[2], rowGap: spacing[2] },
  tailleCard:    { flex: 1, padding: spacing[3], borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.bgSurface, alignItems: 'center' },
  tailleCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  tailleLabel:   { fontSize: typography.size.md, fontWeight: '700', color: colors.textSecondary },
  tailleLabelActive: { color: colors.primary },
  tailleDesc:    { fontSize: typography.size.xs, color: colors.textTertiary, textAlign: 'center', marginTop: spacing[1] },
  tailleDescActive:  { color: colors.primaryText },
  row:           { flexDirection: 'row', columnGap: spacing[3], rowGap: spacing[3] },
  rowItem:       { flex: 1 },
  error:         { fontSize: typography.size.xs, color: colors.danger, marginTop: spacing[1] },
  btn:           { marginBottom: spacing[6] },
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