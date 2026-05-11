/**
 * @file ScoreBar.styles.ts
 * @description Styles de la jauge de score lead (0-100).
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      rowGap: theme.spacing[1],
    },
    labelRow: {
      flexDirection:  'row',
      justifyContent: 'space-between',
      alignItems:     'center',
    },
    labelText: {
      fontSize:   theme.typography.size.xs,
      color:      theme.colors.textSecondary,
      fontWeight: '500',
    },
    scoreText: {
      fontSize:   theme.typography.size.xs,
      fontWeight: '700',
    },
    track: {
      height:       6,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.border,
      overflow:     'hidden',
    },
    fill: {
      height:       6,
      borderRadius: theme.radius.full,
    },
  });