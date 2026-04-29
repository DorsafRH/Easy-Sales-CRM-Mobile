/**
 * @file MarketingPlaceholderScreen.tsx
 * @description Écran placeholder affiché dans l'onglet Marketing (Sprint 2).
 *              Sera remplacé par le module Publications / Réseaux sociaux en Sprint 4.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons }     from '@expo/vector-icons';

import { useStyles, useTheme } from '../../../theme';
import { makeStyles }          from './MarketingPlaceholderScreen.styles';

/**
 * Écran placeholder Marketing — disponible en Sprint 4.
 * @author Riahi Dorsaf
 */
export const MarketingPlaceholderScreen: React.FC = () => {
  const styles = useStyles(makeStyles);
  const theme  = useTheme();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <Ionicons
            name="megaphone-outline"
            size={40}
            color={theme.colors.textTertiary}
          />
        </View>

        <Text style={styles.titre}>Marketing</Text>
        <Text style={styles.soustitre}>
          Publications et Réseaux Sociaux{'\n'}disponibles en Sprint 4
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>À venir — Sprint 4</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};