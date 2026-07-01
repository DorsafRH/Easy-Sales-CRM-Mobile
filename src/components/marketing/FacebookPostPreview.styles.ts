/**
 * @file FacebookPostPreview.styles.ts
 * @description Styles de l'aperçu façon post Facebook (réutilisé formulaire + fiche).
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    apercuLabelRow: {
      flexDirection: 'row',
      alignItems:    'center',
      columnGap:     theme.spacing[1],
      marginBottom:  theme.spacing[2],
    },
    apercuLabel: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textSecondary,
    },
    fbCard: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      paddingTop:      theme.spacing[3],
      overflow:        'hidden',
      shadowColor:     '#000',
      shadowOffset:    { width: 0, height: 2 },
      shadowOpacity:   0.08,
      shadowRadius:    6,
      elevation:       3,
    },
    fbHeader: {
      flexDirection:     'row',
      alignItems:        'center',
      columnGap:         theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
    },
    fbAvatar: {
      width:           40,
      height:          40,
      borderRadius:    20,
      backgroundColor: '#1877F2',
      alignItems:      'center',
      justifyContent:  'center',
    },
    fbAvatarText: {
      color:      '#fff',
      fontSize:   18,
      fontWeight: '800',
    },
    fbHeadText: { flex: 1 },
    fbPageName: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },
    fbMetaRow: { flexDirection: 'row', alignItems: 'center' },
    fbMeta: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textTertiary,
    },
    fbText: {
      fontSize:          theme.typography.size.base,
      color:             theme.colors.textPrimary,
      lineHeight:        21,
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[3],
    },
    fbImage: {
      width:  '100%',
      height: 200,
      backgroundColor: theme.colors.bgApp,
    },
    fbStatsRow: {
      flexDirection:     'row',
      alignItems:        'center',
      columnGap:         theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[2],
    },
    fbReacts: { flexDirection: 'row' },
    fbReactBubble: {
      width:          16,
      height:         16,
      borderRadius:   8,
      alignItems:     'center',
      justifyContent: 'center',
      borderWidth:    1.5,
      borderColor:    theme.colors.bgSurface,
    },
    fbReactOverlap: { marginLeft: -5 },
    fbStatsText: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },
    fbDivider: {
      height:            1,
      backgroundColor:   theme.colors.border,
      marginHorizontal:  theme.spacing[3],
    },
    fbActionsRow: {
      flexDirection:   'row',
      paddingVertical: theme.spacing[2],
    },
    fbAction: {
      flex:           1,
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'center',
      columnGap:      theme.spacing[1],
      paddingVertical: theme.spacing[1],
    },
    fbActionText: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textSecondary,
    },
  });
