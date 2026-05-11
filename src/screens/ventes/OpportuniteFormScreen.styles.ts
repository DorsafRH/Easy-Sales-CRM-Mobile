/**
 * @file OpportuniteFormScreen.styles.ts
 * @description Styles du formulaire opportunité avec sélecteur client.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme }   from '../../theme';
import { layout }     from '../../theme/dimensions';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safe:    { flex: 1, backgroundColor: theme.colors.bgApp },
    scroll:  { flex: 1 },
    content: { flexGrow: 1, paddingBottom: theme.spacing[12] },

    header: {
      flexDirection:     'row',
      alignItems:        'center',
      paddingHorizontal: layout.screenPadding,
      paddingVertical:   theme.spacing[4],
      backgroundColor:   theme.colors.bgSurface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      columnGap:         theme.spacing[3],
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

    section: {
      paddingHorizontal: layout.screenPadding,
      marginTop:         theme.spacing[5],
    },
    sectionTitle: {
      fontSize:      theme.typography.size.xs,
      fontWeight:    '700',
      color:         theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom:  theme.spacing[3],
    },
    fieldGroup: { rowGap: theme.spacing[4] },

    // ── Sélecteur client ──────────────────────────────────────
    clientSelectBtn: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical:   theme.spacing[4],
      borderRadius:      theme.radius.lg,
      borderWidth:       1,
      borderColor:       theme.colors.border,
      backgroundColor:   theme.colors.bgSurface,
    },
    clientSelectBtnActif: {
      borderColor:     theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
    },
    clientSelectBtnError: {
      borderColor: theme.colors.danger,
    },
    clientSelectLeft: {
      flexDirection: 'row',
      alignItems:    'center',
      columnGap:     theme.spacing[3],
      flex:          1,
    },
    clientSelectText: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textTertiary,
    },
    clientSelectTextActif: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.primary,
    },
    clientSelectMeta: {
      fontSize:  theme.typography.size.xs,
      color:     theme.colors.textSecondary,
      marginTop: 2,
    },
    fieldError: {
      fontSize:  theme.typography.size.xs,
      color:     theme.colors.danger,
      marginTop: theme.spacing[1],
    },

    // ── Statut chips ──────────────────────────────────────────
    selectLabel: {
      fontSize:     theme.typography.size.sm,
      fontWeight:   '600',
      color:        theme.colors.textPrimary,
      marginBottom: theme.spacing[2],
    },
    statutGrid: {
      flexDirection: 'row',
      flexWrap:      'wrap',
      gap:           theme.spacing[2],
    },
    statutChip: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[2],
      borderRadius:      theme.radius.full,
      borderWidth:       1,
      borderColor:       theme.colors.border,
      backgroundColor:   theme.colors.bgSurface,
    },
    statutChipText: {
      fontSize:   theme.typography.size.xs,
      fontWeight: '500',
      color:      theme.colors.textSecondary,
    },

    // ── Actions ───────────────────────────────────────────────
    submitSection: {
      paddingHorizontal: layout.screenPadding,
      marginTop:         theme.spacing[6],
      rowGap:            theme.spacing[3],
    },
    submitBtn: {
      backgroundColor: theme.colors.primary,
      borderRadius:    theme.radius.xl,
      paddingVertical: theme.spacing[4],
      alignItems:      'center' as const,
    },
    submitBtnDisabled: { opacity: 0.5 },
    submitBtnText: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700' as const,
      color:      theme.colors.white,
    },
    cancelBtn: {
      alignItems:      'center' as const,
      paddingVertical: theme.spacing[3],
    },
    cancelBtnText: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
    },
  });