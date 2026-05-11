/**
 * @file StatCard.tsx
 * @description Carte de KPI pour le dashboard commercial.
 *              Affiche une icône, une valeur et un label.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles } from '../../theme';
import { makeStyles } from './StatCard.styles';

interface StatCardProps {
  iconName:  string;
  iconColor: string;
  iconBg:    string;
  value:     string | number;
  label:     string;
}

/**
 * Carte KPI avec icône Ionicons, valeur et label.
 *
 * @author Riahi Dorsaf
 */
export const StatCard: React.FC<StatCardProps> = ({
  iconName,
  iconColor,
  iconBg,
  value,
  label,
}) => {
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.card}>
      <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName as any} size={18} color={iconColor} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};