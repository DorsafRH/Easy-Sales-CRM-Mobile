/**
 * @file PublicationFormScreen.styles.ts
 * @description Styles du formulaire de publication.
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
      rowGap:            theme.spacing[3],
    },
    iaBox: {
      backgroundColor: theme.colors.primaryLight,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      rowGap:          theme.spacing[3],
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },
    iaTitreRow: {
      flexDirection: 'row',
      alignItems:    'center',
      columnGap:     theme.spacing[2],
    },
    iaTitre: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      theme.colors.primaryText,
    },
    label: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textSecondary,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap:      'wrap',
      columnGap:     theme.spacing[2],
      rowGap:        theme.spacing[2],
    },
    chip: {
      flexDirection:   'row',
      alignItems:      'center',
      columnGap:       theme.spacing[1],
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
      borderRadius:    theme.radius.full,
      backgroundColor: theme.colors.bgSurface,
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },
    chipActif: {
      backgroundColor: theme.colors.primaryLight,
      borderColor:     theme.colors.primary,
    },
    chipLabel: {
      fontSize:   theme.typography.size.xs,
      fontWeight: '600',
      color:      theme.colors.textTertiary,
    },
    chipLabelActif: {
      color: theme.colors.primary,
    },
    // ── Modal de sélection (catégorie / produit) ────────────────
    modalOverlay: {
      flex:            1,
      backgroundColor: theme.colors.overlay,
      justifyContent:  'center',
      paddingHorizontal: layout.screenPadding,
    },
    modalCard: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      rowGap:          theme.spacing[3],
      maxHeight:       '75%',
    },
    modalTitre: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },
    modalListe: {
      maxHeight: 320,
    },
    modalItem: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      paddingVertical:   theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },
    modalItemText: {
      fontSize: theme.typography.size.base,
      color:    theme.colors.textPrimary,
    },
    modalItemTextActif: {
      color:      theme.colors.primary,
      fontWeight: '700',
    },
    ameliorerRow: {
      flexDirection: 'row',
      alignItems:    'center',
      columnGap:     theme.spacing[1],
      alignSelf:     'flex-end',
      marginTop:     -theme.spacing[1],
    },
    ameliorerLien: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.primary,
    },
    ameliorerBox: {
      backgroundColor: theme.colors.primaryLight,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[3],
      rowGap:          theme.spacing[3],
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },
    textarea: {
      minHeight:         120,
      textAlignVertical: 'top',
    },
    aucunReseau: {
      fontSize:  theme.typography.size.sm,
      color:     theme.colors.textTertiary,
      fontStyle: 'italic',
    },
    switchRow: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
    },
    rowDateHeure: {
      flexDirection: 'row',
      columnGap:     theme.spacing[3],
    },
    fieldGroup: { rowGap: theme.spacing[2] },
    fieldDate:  { flex: 1 },
    fieldHeure: { width: 120 },
    pickerBtn: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      columnGap:         theme.spacing[2],
      paddingVertical:   theme.spacing[3],
      paddingHorizontal: theme.spacing[3],
      borderRadius:      theme.radius.md,
      backgroundColor:   theme.colors.bgSurface,
      borderWidth:       1,
      borderColor:       theme.colors.border,
    },
    pickerBtnTxt: {
      fontSize: theme.typography.size.base,
      color:    theme.colors.textPrimary,
    },
    submitWrapper: {
      marginTop: theme.spacing[4],
    },
    erreurBox: {
      backgroundColor: theme.colors.dangerLight,
      borderRadius:    theme.radius.md,
      padding:         theme.spacing[3],
    },
    erreurText: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.dangerText,
    },
  });
