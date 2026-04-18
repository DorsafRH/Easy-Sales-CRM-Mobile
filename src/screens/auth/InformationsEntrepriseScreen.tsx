/**
 * @file InformationsEntrepriseScreen.tsx
 * @description Étape 1 du formulaire d'inscription — collecte les informations
 *              légales et opérationnelles de l'entreprise.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { View, Text, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen }  from '../../components/layout/Screen';
import { Card }    from '../../components/layout/Card';
import { Input }   from '../../components/ui/Input';
import { Button }  from '../../components/ui/Button';
import { useInscriptionContext } from '../../context/InscriptionContext';
import { useStyles } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { TailleEntreprise } from '../../types/entreprise.types';
import { makeStyles } from './InformationsEntrepriseScreen.styles';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'InformationsEntreprise'> };

const TAILLES: { value: TailleEntreprise; label: string; desc: string }[] = [
  { value: 'TPE', label: 'TPE', desc: '< 10 employés'    },
  { value: 'PME', label: 'PME', desc: '10-250 employés'  },
  { value: 'GE',  label: 'GE',  desc: '> 250 employés'   },
];

const SECTEURS = ['Commerce', 'Services', 'Industrie', 'BTP', 'Agriculture', 'Technologies', 'Santé', 'Éducation', 'Transport', 'Autre'];

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
 * Écran d'informations entreprise — première étape du tunnel d'inscription.
 * Collecte : nom, matricule fiscale, secteur, taille, téléphone, adresse et site web.
 *
 * @param navigation - Prop de navigation React Navigation
 * @author Riahi Dorsaf
 */
export const InformationsEntrepriseScreen: React.FC<Props> = ({ navigation }) => {
  const { form, errors, updateField, validateStep1 } = useInscriptionContext();
  const styles = useStyles(makeStyles);

  /**
   * Valide l'étape 1 et navigue vers l'étape suivante si valide.
   * @author Riahi Dorsaf
   */
  const handleSuivant = () => {
    if (validateStep1()) {
      navigation.navigate('InformationsProprietaire');
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StepIndicator current={1} total={3} />
        <Text style={styles.title}>Votre entreprise</Text>
        <Text style={styles.subtitle}>Renseignez les informations légales</Text>

        <Card style={styles.card}>
          <Input
            label="Nom de l'entreprise"
            placeholder="Ex : TechCorp SARL"
            value={form.nomEntreprise}
            onChangeText={v => updateField('nomEntreprise', v)}
            error={errors.nomEntreprise}
            required
            autoCapitalize="words"
          />
          <Input
            label="Matricule fiscale"
            placeholder="Ex : 1234567ABC"
            value={form.matriculeFiscale}
            onChangeText={v => updateField('matriculeFiscale', v.toUpperCase())}
            error={errors.matriculeFiscale}
            required
            autoCapitalize="characters"
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Secteur d'activité <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.sectorGrid}>
              {SECTEURS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, form.secteurActivite === s && styles.chipActive]}
                  onPress={() => updateField('secteurActivite', s)}
                >
                  <Text style={[styles.chipText, form.secteurActivite === s && styles.chipTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.secteurActivite && <Text style={styles.error}>{errors.secteurActivite}</Text>}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Taille <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.tailleRow}>
              {TAILLES.map(t => (
                <TouchableOpacity
                  key={t.value}
                  style={[styles.tailleCard, form.tailleEntreprise === t.value && styles.tailleCardActive]}
                  onPress={() => updateField('tailleEntreprise', t.value)}
                >
                  <Text style={[styles.tailleLabel, form.tailleEntreprise === t.value && styles.tailleLabelActive]}>
                    {t.label}
                  </Text>
                  <Text style={[styles.tailleDesc, form.tailleEntreprise === t.value && styles.tailleDescActive]}>
                    {t.desc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.tailleEntreprise && <Text style={styles.error}>{errors.tailleEntreprise}</Text>}
          </View>

          <Input
            label="Téléphone entreprise"
            placeholder="+216 71 000 000"
            value={form.telephoneEntreprise}
            onChangeText={v => updateField('telephoneEntreprise', v)}
            error={errors.telephoneEntreprise}
            required
            keyboardType="phone-pad"
          />
          <Input
            label="Adresse"
            placeholder="12 Rue des Roses"
            value={form.adresse}
            onChangeText={v => updateField('adresse', v)}
            error={errors.adresse}
            required
          />
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Input
                label="Ville"
                placeholder="Tunis"
                value={form.ville}
                onChangeText={v => updateField('ville', v)}
                error={errors.ville}
                required
              />
            </View>
            <View style={styles.rowItem}>
              <Input
                label="Pays"
                placeholder="Tunisie"
                value={form.pays}
                onChangeText={v => updateField('pays', v)}
                error={errors.pays}
                required
              />
            </View>
          </View>
          <Input
            label="Site web (optionnel)"
            placeholder="https://mon-site.com"
            value={form.siteWeb}
            onChangeText={v => updateField('siteWeb', v)}
            keyboardType="url"
          />
        </Card>

        <Button
          label="Suivant — Mes informations"
          onPress={handleSuivant}
          fullWidth
          size="lg"
          style={styles.btn}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
};
