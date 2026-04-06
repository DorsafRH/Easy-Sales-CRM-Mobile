import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';
import { StatutCompte } from '../../types/entreprise.types';

const CONFIG: Record<StatutCompte, { label: string; bg: string; text: string }> = {
  EN_ATTENTE: { label: 'En attente', bg: colors.statutEnAttenteLight, text: colors.statutEnAttente },
  ACTIVE:     { label: 'Actif',      bg: colors.statutActiveLight,    text: colors.statutActive    },
  REFUSE:     { label: 'Refusé',     bg: colors.statutRefuseLight,    text: colors.statutRefuse    },
  SUSPENDU:   { label: 'Suspendu',   bg: colors.statutSuspenduLight,  text: colors.statutSuspendu  },
};

export const StatusBadge: React.FC<{ statut: StatutCompte }> = ({ statut }) => {
  const config = CONFIG[statut] ?? CONFIG.EN_ATTENTE;
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.text }]} />
      <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', columnGap: spacing[1], rowGap: spacing[1], paddingVertical: spacing[1], paddingHorizontal: spacing[3], borderRadius: radius.full, alignSelf: 'flex-start' },
  dot:   { width: 6, height: 6, borderRadius: radius.full },
  label: { fontSize: typography.size.xs, fontWeight: '600', letterSpacing: 0.3 },
});