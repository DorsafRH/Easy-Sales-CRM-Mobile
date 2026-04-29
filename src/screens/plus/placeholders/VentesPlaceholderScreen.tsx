/**
 * @file VentesPlaceholderScreen.tsx
 * @description Écran placeholder affiché dans l'onglet Ventes (Sprint 2).
 *              Sera remplacé par le module Leads / Opportunités / Devis en Sprint 3.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons }     from '@expo/vector-icons';

import { useStyles, useTheme } from '../../../theme';
import { makeStyles }          from './VentesPlaceholderScreen.styles';

/**
 * Écran placeholder Ventes — disponible en Sprint 3.
 * @author Riahi Dorsaf
 */
export const VentesPlaceholderScreen: React.FC = () => {
  const styles = useStyles(makeStyles);
  const theme  = useTheme();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <Ionicons
            name="bar-chart-outline"
            size={40}
            color={theme.colors.textTertiary}
          />
        </View>

        <Text style={styles.titre}>Ventes</Text>
        <Text style={styles.soustitre}>
          Leads, Opportunités et Devis{'\n'}disponibles en Sprint 3
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>À venir — Sprint 3</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};