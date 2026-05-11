/**
 * @file LeadFormScreen.styles.ts
 * @description Styles du formulaire creation/edition d'un lead.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';
import { layout } from '../../theme/dimensions';

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
    fieldGroup: {
      rowGap: theme.spacing[4],
    },

    // ── Selecteur source ──────────────────────────────────────
    selectLabel: {
      fontSize:     theme.typography.size.sm,
      fontWeight:   '600',
      color:        theme.colors.textPrimary,
      marginBottom: theme.spacing[2],
    },
    sourceGrid: {
      flexDirection: 'row',
      flexWrap:      'wrap',
      gap:           theme.spacing[2],
    },
    sourceChip: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[2],
      borderRadius:      theme.radius.full,
      borderWidth:       1,
      borderColor:       theme.colors.border,
      backgroundColor:   theme.colors.bgSurface,
    },
    sourceChipSelected: {
      borderColor:     theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
    },
    sourceChipText: {
      fontSize:   theme.typography.size.xs,
      fontWeight: '500',
      color:      theme.colors.textSecondary,
    },
    sourceChipTextSelected: {
      color:      theme.colors.primary,
      fontWeight: '700',
    },

    // ── Bouton soumettre ──────────────────────────────────────
    submitSection: {
      paddingHorizontal: layout.screenPadding,
      marginTop:         theme.spacing[6],
      rowGap:            theme.spacing[3],
    },
    submitBtn: {
      backgroundColor: theme.colors.primary,
      borderRadius:    theme.radius.xl,
      paddingVertical: theme.spacing[4],
      alignItems:      'center',
    },
    submitBtnDisabled: {
      opacity: 0.5,
    },
    submitBtnText: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      theme.colors.white,
    },
    cancelBtn: {
      alignItems:      'center',
      paddingVertical: theme.spacing[3],
    },
    cancelBtnText: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textSecondary,
    },

    errorText: {
      fontSize:  theme.typography.size.xs,
      color:     theme.colors.danger,
      marginTop: theme.spacing[1],
    },
  });
