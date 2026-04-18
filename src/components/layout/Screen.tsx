/**
 * @file Screen.tsx
 * @description Composant de mise en page racine pour tous les écrans.
 *              Gère la safe area, le clavier, le défilement et le padding
 *              de manière uniforme dans toute l'application.
 * @author Riahi Dorsaf
 */

import React, { ReactNode } from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStyles } from '../../theme';
import { makeStyles } from './Screen.styles';

interface ScreenProps {
  children:      ReactNode;
  scrollable?:   boolean;
  padded?:       boolean;
  /** Couleur de fond personnalisée — utilise theme.colors.bgApp par défaut */
  bg?:           string;
  style?:        ViewStyle;
  contentStyle?: ViewStyle;
}

/**
 * Conteneur d'écran universel de l'application.
 * Applique automatiquement la safe area, le comportement clavier,
 * et propose deux modes d'affichage : défilant (ScrollView) ou fixe (View).
 *
 * @param children     - Contenu de l'écran
 * @param scrollable   - Si true (défaut), le contenu est scrollable
 * @param padded       - Si true (défaut), applique un padding horizontal standard
 * @param bg           - Couleur de fond (défaut : theme.colors.bgApp)
 * @param style        - Styles additionnels appliqués à la SafeAreaView
 * @param contentStyle - Styles additionnels appliqués au conteneur de contenu
 * @author Riahi Dorsaf
 */
export const Screen: React.FC<ScreenProps> = ({
  children, scrollable = true, padded = true,
  bg, style, contentStyle,
}) => {
  const styles = useStyles(makeStyles);

  const content = scrollable ? (
    <ScrollView
      style={styles.keyboard}
      contentContainerStyle={[
        styles.scrollContent,
        padded && styles.padded,
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fixedContent, padded && styles.padded, contentStyle]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, bg ? { backgroundColor: bg } : undefined, style]}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
