/**
 * @file PublicationDetailScreen.styles.ts
 * @description Styles du détail d'une publication.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';
import { layout } from '../../theme/dimensions';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.colors.bgApp },
    header: {
      flexDirection:     'row',
      alignItems:        'center',
      columnGap:         theme.spacing[3],
      backgroundColor:   theme.colors.bgSurface,
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[4],
      paddingBottom:     theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backBtn: {
      width:           40,
      height:          40,
      borderRadius:    20,
      backgroundColor: theme.colors.bgApp,
      alignItems:      'center',
      justifyContent:  'center',
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },
    headerTitle: {
      flex:       1,
      fontSize:   theme.typography.size.lg,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },
    content: {
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[4],
      paddingBottom:     theme.spacing[16],
    },
    statutRow: {
      flexDirection: 'row',
      marginBottom:  theme.spacing[3],
    },
    card: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      borderWidth:     1,
      borderColor:     theme.colors.border,
      rowGap:          theme.spacing[2],
      marginBottom:    theme.spacing[2],
    },
    texte: {
      fontSize:   theme.typography.size.base,
      color:      theme.colors.textPrimary,
      lineHeight: 22,
    },
    media: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },
    sectionTitre: {
      fontSize:      theme.typography.size.sm,
      fontWeight:    '700',
      color:         theme.colors.textSecondary,
      marginTop:     theme.spacing[5],
      marginBottom:  theme.spacing[3],
      textTransform: 'uppercase',
    },
    aucune: {
      fontSize:  theme.typography.size.sm,
      color:     theme.colors.textTertiary,
      fontStyle: 'italic',
    },
    diffusionItem: {
      flexDirection:   'row',
      alignItems:      'center',
      columnGap:       theme.spacing[3],
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[3],
      marginBottom:    theme.spacing[2],
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },
    reseauIcon: {
      width:          36,
      height:         36,
      borderRadius:   18,
      alignItems:     'center',
      justifyContent: 'center',
    },
    diffusionInfo: {
      flex:   1,
      rowGap: theme.spacing[1],
    },
    diffusionNom: {
      fontSize:   theme.typography.size.base,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },
    diffusionErreur: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.dangerText,
    },
    actions: {
      marginTop: theme.spacing[6],
      rowGap:    theme.spacing[3],
    },
  });
