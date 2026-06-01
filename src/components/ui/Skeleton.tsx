/**
 * @file Skeleton.tsx
 * @description Composants skeleton loader animés (pulse) réutilisables.
 *              Compatible light et dark mode via theme.colors.border.
 * @author Riahi Dorsaf
 */

import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle, DimensionValue } from 'react-native';
import { useTheme } from '../../theme';

// ─────────────────────────────────────────────────────────────
// SKELETON DE BASE
// ─────────────────────────────────────────────────────────────

interface SkeletonProps {
  width:         DimensionValue;
  height:        number;
  borderRadius?: number;
  style?:        ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width, height, borderRadius = 6, style,
}) => {
  const theme   = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1,   duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <View style={[{ width, height, borderRadius, overflow: 'hidden' }, style]}>
      <Animated.View
        style={{ flex: 1, backgroundColor: theme.colors.border, opacity }}
      />
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// SKELETON CARD (titre + sous-titre + montant)
// ─────────────────────────────────────────────────────────────

export const SkeletonCard: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const theme = useTheme();
  return (
    <View style={[{
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    12,
      padding:         16,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      rowGap:          10,
    }, style]}>
      <Skeleton width="70%" height={14} borderRadius={7} />
      <Skeleton width="50%" height={11} borderRadius={6} />
      <Skeleton width="35%" height={13} borderRadius={6} />
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// SKELETON LIST ITEM (icône + textes)
// ─────────────────────────────────────────────────────────────

export const SkeletonListItem: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const theme = useTheme();
  return (
    <View style={[{
      flexDirection:   'row',
      alignItems:      'center',
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    12,
      padding:         16,
      marginBottom:    8,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      columnGap:       12,
    }, style]}>
      <Skeleton width={40} height={40} borderRadius={20} />
      <View style={{ flex: 1, rowGap: 8 }}>
        <Skeleton width="60%" height={13} borderRadius={6} />
        <Skeleton width="40%" height={11} borderRadius={6} />
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// SKELETON KPI GRID (grille 2×2)
// ─────────────────────────────────────────────────────────────

export const SkeletonKpiGrid: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const theme = useTheme();
  return (
    <View style={[{
      flexDirection:     'row',
      flexWrap:          'wrap',
      columnGap:         12,
      rowGap:            12,
      paddingHorizontal: 16,
      paddingTop:        16,
    }, style]}>
      {[0, 1, 2, 3].map(i => (
        <View key={i} style={{
          width:           '47%',
          backgroundColor: theme.colors.bgSurface,
          borderRadius:    12,
          padding:         16,
          alignItems:      'center',
          rowGap:          8,
          borderWidth:     1,
          borderColor:     theme.colors.border,
        }}>
          <Skeleton width={40} height={22} borderRadius={6} />
          <Skeleton width={60} height={11} borderRadius={6} />
        </View>
      ))}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// SKELETON KANBAN CARD
// ─────────────────────────────────────────────────────────────

export const SkeletonKanbanCard: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const theme = useTheme();
  return (
    <View style={[{
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    10,
      padding:         12,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      rowGap:          8,
    }, style]}>
      <Skeleton width="80%" height={13} borderRadius={6} />
      <Skeleton width="55%" height={11} borderRadius={6} />
      <Skeleton width="40%" height={13} borderRadius={6} />
      <View style={{ flexDirection: 'row', columnGap: 8, marginTop: 4 }}>
        <Skeleton width="48%" height={28} borderRadius={6} />
        <Skeleton width="48%" height={28} borderRadius={6} />
      </View>
    </View>
  );
};
