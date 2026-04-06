import React, { ReactNode } from 'react';
import {
  SafeAreaView, ScrollView, View, StyleSheet,
  KeyboardAvoidingView, Platform, ViewStyle,
} from 'react-native';
import { colors, spacing } from '../../theme';

interface ScreenProps {
  children:     ReactNode;
  scrollable?:  boolean;
  padded?:      boolean;
  bg?:          string;
  style?:       ViewStyle;
  contentStyle?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({
  children, scrollable = true, padded = true,
  bg = colors.bgApp, style, contentStyle,
}) => {
  const content = scrollable ? (
    <ScrollView
      style={{ flex: 1 }}
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
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }, style]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:          { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: spacing[10] },
  fixedContent:  { flex: 1 },
  padded:        { paddingHorizontal: spacing[5] },
});