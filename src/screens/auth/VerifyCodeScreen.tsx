/**
 * @file VerifyCodeScreen.tsx
 * @description Écran de vérification du code OTP à 6 chiffres.
 *
 *              FONCTIONNEMENT :
 *              1. L'utilisateur reçoit un code à 6 chiffres par email
 *              2. Il saisit le code dans les 6 cases
 *              3. Le code est vérifié automatiquement à la saisie du 6ème chiffre
 *              4. Si valide → navigation vers ResetPasswordScreen avec le code
 *              5. Si invalide → message d'erreur + cases rouges + Renvoyer actif
 *
 * @author Riahi Dorsaf
 */

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView }              from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp }                 from '@react-navigation/native';

import { Button }         from '../../components/ui/Button';
import { useStyles }      from '../../theme';
import { makeStyles }     from './VerifyCodeScreen.styles';
import { AuthStackParamList } from '../../navigation/AuthStack';
import * as AuthApi       from '../../api/auth.api';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'VerifyCode'>;
  route:      RouteProp<AuthStackParamList, 'VerifyCode'>;
};

/** Durée du timer en secondes */
const TIMER_DURATION = 60;

/** Nombre de cases OTP */
const OTP_LENGTH = 6;

/**
 * Écran de vérification du code OTP.
 *
 * @param navigation - Prop de navigation React Navigation
 * @param route      - Prop de route contenant l'email
 * @author Riahi Dorsaf
 */
export const VerifyCodeScreen: React.FC<Props> = ({ navigation, route }) => {
  const styles = useStyles(makeStyles);
  const { email } = route.params;

  // ── État ──────────────────────────────────────────────────────
  const [code,         setCode]         = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [isLoading,    setIsLoading]    = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [hasError,     setHasError]     = useState(false);
  const [timer,        setTimer]        = useState(TIMER_DURATION);
  const [isResending,  setIsResending]  = useState(false);

  /** Références vers les 6 TextInput pour gérer le focus */
  const inputs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));

  // ── Timer décompte ────────────────────────────────────────────
  /**
   * Le timer s'arrête dans 2 cas :
   * 1. Il arrive à 0 naturellement
   * 2. L'utilisateur a saisi un code incorrect (hasError = true)
   * Dans les deux cas, le bouton Renvoyer s'active.
   */
  useEffect(() => {
    // Arrête le timer si code incorrect ou timer déjà à 0
    if (hasError || timer === 0) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasError]);

  /**
   * Formate le timer en MM:SS.
   * @param seconds - Nombre de secondes restantes
   * @returns Chaîne formatée ex: "00:45"
   */
  const formatTimer = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  /**
   * Indique si le bouton Renvoyer est actif.
   * Actif si : timer expiré OU code incorrect saisi
   */
  const canResend = timer === 0 || hasError;

  // ── Gestion saisie OTP ────────────────────────────────────────

  /**
   * Gère la saisie d'un chiffre dans une case OTP.
   * Passe automatiquement au champ suivant après saisie.
   *
   * @param value - Valeur saisie
   * @param index - Index de la case (0-5)
   * @author Riahi Dorsaf
   */
  const handleChange = useCallback((value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError(null);
    setHasError(false);

    if (digit && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }

    if (digit && index === OTP_LENGTH - 1) {
      const fullCode = [...newCode.slice(0, OTP_LENGTH - 1), digit].join('');
      if (fullCode.length === OTP_LENGTH) {
        handleVerify(fullCode);
      }
    }
  }, [code]);

  /**
   * Gère la touche Backspace — revient à la case précédente.
   *
   * @param key   - Touche pressée
   * @param index - Index de la case courante
   * @author Riahi Dorsaf
   */
  const handleKeyPress = useCallback((key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  }, [code]);

  // ── Vérification du code ──────────────────────────────────────

  /**
   * Envoie le code au backend pour vérification.
   * Si valide → navigue vers ResetPasswordScreen.
   * Si invalide → active le bouton Renvoyer immédiatement.
   *
   * @param fullCode - Code complet à 6 chiffres
   * @author Riahi Dorsaf
   */
  const handleVerify = useCallback(async (fullCode?: string) => {
    const codeToVerify = fullCode ?? code.join('');

    if (codeToVerify.length !== OTP_LENGTH) {
      setError('Veuillez saisir les 6 chiffres du code.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthApi.verifyCode({ token: codeToVerify });

      if (response.success) {
        navigation.navigate('ResetPassword', { code: codeToVerify });
      } else {
        setError(response.message ?? 'Code invalide.');
        // ← Active immédiatement le bouton Renvoyer
        setHasError(true);
        setCode(Array(OTP_LENGTH).fill(''));
        inputs.current[0]?.focus();
        setFocusedIndex(0);
      }
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Code invalide ou expiré.';
      setError(message);
      // ← Active immédiatement le bouton Renvoyer
      setHasError(true);
      setCode(Array(OTP_LENGTH).fill(''));
      inputs.current[0]?.focus();
      setFocusedIndex(0);
    } finally {
      setIsLoading(false);
    }
  }, [code, navigation]);

  // ── Renvoi du code ────────────────────────────────────────────

  /**
   * Renvoie un nouveau code par email.
   * Disponible si timer expiré OU code incorrect saisi.
   * Réinitialise tout l'état après renvoi.
   *
   * @author Riahi Dorsaf
   */
  const handleResend = async () => {
    // ← Correction bug : vérifie canResend au lieu de timer > 0
    if (!canResend || isResending) return;

    setIsResending(true);
    setError(null);

    try {
      await AuthApi.forgotPassword({ email });
      setCode(Array(OTP_LENGTH).fill(''));
      setHasError(false);
      setTimer(TIMER_DURATION);
      inputs.current[0]?.focus();
      setFocusedIndex(0);
    } catch (err: any) {
      setError('Impossible de renvoyer le code. Réessayez.');
    } finally {
      setIsResending(false);
    }
  };

  // ── Rendu ─────────────────────────────────────────────────────

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
            <Text style={styles.icon}>📩</Text>
          </View>

          {/* Titre */}
          <Text style={styles.title}>Vérifiez votre email</Text>
          <Text style={styles.subtitle}>
            Nous avons envoyé un code à 6 chiffres à{'\n'}
            <Text style={styles.email}>{email}</Text>
          </Text>

          {/* Alerte erreur */}
          {error && (
            <View style={styles.alertError}>
              <Text style={styles.alertErrorText}>⚠️ {error}</Text>
            </View>
          )}

          {/* Cases OTP */}
          <View style={styles.otpContainer}>
            {Array(OTP_LENGTH).fill(0).map((_, index) => (
              <TextInput
                key={index}
                ref={ref => { inputs.current[index] = ref; }}
                style={[
                  styles.otpBox,
                  focusedIndex === index && styles.otpBoxFocused,
                  code[index] !== ''     && styles.otpBoxFilled,
                  hasError               && styles.otpBoxError,
                ]}
                value={code[index]}
                onChangeText={v => handleChange(v, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                onFocus={() => setFocusedIndex(index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Timer */}
          <View style={styles.timerWrapper}>
            {hasError ? (
              // Code incorrect — invite à renvoyer
              <Text style={[styles.timerText, styles.timerExpired]}>
                Code incorrect — renvoyez un nouveau code
              </Text>
            ) : timer > 0 ? (
              <Text style={styles.timerText}>
                Code valide pendant{' '}
                <Text style={styles.timerCount}>
                  {formatTimer(timer)}
                </Text>
              </Text>
            ) : (
              <Text style={[styles.timerText, styles.timerExpired]}>
                Le code a expiré
              </Text>
            )}
          </View>

          {/* Bouton vérifier */}
          <Button
            label="Vérifier le code"
            onPress={() => handleVerify()}
            loading={isLoading}
            fullWidth
            size="lg"
            style={styles.btnVerify}
            disabled={code.join('').length !== OTP_LENGTH || hasError}
          />

          {/* Renvoyer le code */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Pas reçu le code ?{' '}
            </Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={!canResend || isResending}
            >
              <Text style={[
                styles.footerLink,
                // ← Correction style : gris si pas encore actif
                !canResend && styles.footerLinkDisabled,
              ]}>
                {isResending ? 'Envoi...' : 'Renvoyer'}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};