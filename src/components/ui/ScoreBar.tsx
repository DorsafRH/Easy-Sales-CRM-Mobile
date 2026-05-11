/**
 * @file ScoreBar.tsx
 * @description Jauge visuelle du score d'un lead (0-100).
 *              Couleur dégradée : rouge < 40, orange 40-70, vert > 70.
 * @author Riahi Dorsaf
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useStyles } from '../../theme';
import { makeStyles } from './ScoreBar.styles';

interface ScoreBarProps {
  score:     number;
  showLabel?: boolean;
}

const getScoreColor = (score: number): string => {
  if (score >= 70) return '#16A34A';
  if (score >= 40) return '#D97706';
  return '#DC2626';
};

/**
 * Barre de score lead — affiche une jauge colorée proportionnelle au score.
 *
 * @param score     - Score entre 0 et 100
 * @param showLabel - Affiche le label "Score" et la valeur (defaut: true)
 * @author Riahi Dorsaf
 */
export const ScoreBar: React.FC<ScoreBarProps> = ({ score, showLabel = true }) => {
  const styles = useStyles(makeStyles);
  const color  = getScoreColor(score);
  const width  = `${Math.min(Math.max(score, 0), 100)}%` as const;

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.labelText}>Score</Text>
          <Text style={[styles.scoreText, { color }]}>{score}/100</Text>
        </View>
      )}
      <View style={styles.track}>
        <View style={[styles.fill, { width, backgroundColor: color }]} />
      </View>
    </View>
  );
};