/**
 * @file PlanifierReunionScreen.styles.ts
 * @description Styles premium du formulaire de planification.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme }   from '../../theme';
import { layout }     from '../../theme/dimensions';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({

    safe:   { flex: 1, backgroundColor: theme.colors.bgApp },
    scroll: { flex: 1 },

    content: {
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[5],
      paddingBottom:     theme.spacing[12],
      rowGap:            theme.spacing[4],
    },

    // ── Header ───────────────────────────────────────────────
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
      width:           44,
      height:          44,
      borderRadius:    22,
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

    // ── Section ──────────────────────────────────────────────
    section: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.xl,
      padding:         theme.spacing[4],
      borderWidth:     1,
      borderColor:     theme.colors.border,
      rowGap:          theme.spacing[4],
      shadowColor:     '#000',
      shadowOffset:    { width: 0, height: 1 },
      shadowOpacity:   0.04,
      shadowRadius:    4,
      elevation:       1,
    },

    sectionTitle: {
      fontSize:      theme.typography.size.xs,
      fontWeight:    '700',
      color:         theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },

    // ── Champ ────────────────────────────────────────────────
    field: { rowGap: 6 },

    label: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },

    labelOpt: {
      fontSize:   theme.typography.size.xs,
      color:      theme.colors.textTertiary,
      fontWeight: '400',
    },

    input: {
      backgroundColor:   theme.colors.bgApp,
      borderRadius:      theme.radius.md,
      borderWidth:       1,
      borderColor:       theme.colors.border,
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[3],
      fontSize:          theme.typography.size.sm,
      color:             theme.colors.textPrimary,
    },

    inputMultiline: { minHeight: 80, textAlignVertical: 'top' },

    // ── Picker ───────────────────────────────────────────────
    pickerBtn: {
      flexDirection:     'row',
      alignItems:        'center',
      backgroundColor:   theme.colors.bgApp,
      borderRadius:      theme.radius.md,
      borderWidth:       1,
      borderColor:       theme.colors.border,
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[3],
    },

    pickerBtnTxt: {
      flex:     1,
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textPrimary,
    },

    pickerBtnPlaceholder: { color: theme.colors.textTertiary },

    // ── Date / Heure ─────────────────────────────────────────
    rowDateHeure: { flexDirection: 'row', columnGap: theme.spacing[3] },
    fieldDate:    { flex: 2 },
    fieldHeure:   { flex: 1 },

    // ── Toggle en ligne ───────────────────────────────────────
    toggleRow: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
    },

    toggleLabel: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },

    toggle: {
      width:           52,
      height:          28,
      borderRadius:    14,
      backgroundColor: theme.colors.border,
      padding:         3,
      justifyContent:  'center',
    },

    toggleActive: { backgroundColor: theme.colors.primary },

    toggleThumb: {
      width:           22,
      height:          22,
      borderRadius:    11,
      backgroundColor: theme.colors.white,
      shadowColor:     '#000',
      shadowOffset:    { width: 0, height: 1 },
      shadowOpacity:   0.15,
      shadowRadius:    2,
      elevation:       2,
    },

    toggleThumbActive: { alignSelf: 'flex-end' },

    lienRow: {
      flexDirection:  'row',
      alignItems:     'center',
      columnGap:      theme.spacing[2],
    },

    lienInput: { flex: 1 },

    btnGenerer: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[3],
      backgroundColor:   theme.colors.primaryLight,
      borderRadius:      theme.radius.md,
      borderWidth:       1,
      borderColor:       theme.colors.primary,
    },

    btnGenererTxt: {
      fontSize:   theme.typography.size.xs,
      fontWeight: '700',
      color:      theme.colors.primary,
    },

    // ── Participants ──────────────────────────────────────────
    participantCard: {
      backgroundColor: theme.colors.bgApp,
      borderRadius:    theme.radius.md,
      padding:         theme.spacing[3],
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },

    participantCardHeader: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginBottom:   theme.spacing[3],
    },

    participantCardTitle: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },

    participantDeleteBtn: {
      width:           28,
      height:          28,
      borderRadius:    14,
      backgroundColor: '#FEF2F2',
      alignItems:      'center',
      justifyContent:  'center',
    },

    participantRow: {
      flexDirection: 'row',
      columnGap:     theme.spacing[2],
    },

    participantField: { flex: 1 },

    typeBadgeRow: {
      flexDirection: 'row',
      columnGap:     theme.spacing[2],
      marginTop:     theme.spacing[2],
    },

    typeBadge: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[1],
      borderRadius:      theme.radius.lg,
      borderWidth:       1,
      borderColor:       theme.colors.border,
      backgroundColor:   theme.colors.bgSurface,
    },

    typeBadgeActif: {
      borderColor:     theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
    },

    typeBadgeTxt: {
      fontSize:   theme.typography.size.xs,
      fontWeight: '600',
      color:      theme.colors.textSecondary,
    },

    typeBadgeTxtActif: { color: theme.colors.primary },

    addParticipantBtn: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'center',
      columnGap:         theme.spacing[2],
      paddingVertical:   theme.spacing[3],
      borderRadius:      theme.radius.md,
      borderWidth:       1,
      borderColor:       theme.colors.primary,
      borderStyle:       'dashed',
      backgroundColor:   theme.colors.primaryLight,
    },

    addParticipantTxt: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.primary,
    },

    // ── Rappels ───────────────────────────────────────────────
    rappelsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] },

    rappelChip: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[2],
      borderRadius:      theme.radius.lg,
      borderWidth:       1,
      borderColor:       theme.colors.border,
      backgroundColor:   theme.colors.bgApp,
    },

    rappelChipActif: {
      borderColor:     theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
    },

    rappelChipTxt: {
      fontSize:   theme.typography.size.xs,
      fontWeight: '600',
      color:      theme.colors.textSecondary,
    },

    rappelChipTxtActif: { color: theme.colors.primary },

    // ── Invitation email ──────────────────────────────────────
    invitationRow: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
    },

    invitationInfo: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textTertiary,
      marginTop: 2,
    },

    // ── Bouton sauvegarder ────────────────────────────────────
    btnSauvegarder: {
      backgroundColor: theme.colors.primary,
      borderRadius:    theme.radius.xl,
      paddingVertical: theme.spacing[4],
      alignItems:      'center',
      shadowColor:     theme.colors.primary,
      shadowOffset:    { width: 0, height: 6 },
      shadowOpacity:   0.35,
      shadowRadius:    10,
      elevation:       6,
    },

    btnSauvegarderDisabled: {
      backgroundColor: theme.colors.textTertiary,
      shadowOpacity:   0,
      elevation:       0,
    },

    btnSauvegarderTxt: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      theme.colors.white,
    },

    // ── Modal ─────────────────────────────────────────────────
    /**
     * Overlay semi-transparent — tap dessus ferme le modal.
     * Pattern UX standard iOS/Android (pas de bouton X).
     */
    modalOverlay: {
      flex:            1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent:  'flex-end',
    },

    modalContainer: {
      backgroundColor:      theme.colors.bgSurface,
      borderTopLeftRadius:  theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      padding:              theme.spacing[5],
      maxHeight:            '75%',
    },

    modalTitle: {
      fontSize:     theme.typography.size.lg,
      fontWeight:   '700',
      color:        theme.colors.textPrimary,
      marginBottom: theme.spacing[4],
    },

    inputRecherche: {
      backgroundColor:   theme.colors.bgApp,
      borderRadius:      theme.radius.md,
      borderWidth:       1,
      borderColor:       theme.colors.border,
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[3],
      fontSize:          theme.typography.size.sm,
      color:             theme.colors.textPrimary,
      marginBottom:      theme.spacing[3],
    },

    modalSearching: { paddingVertical: theme.spacing[4], alignItems: 'center' },

    modalItem: {
      paddingVertical:   theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.bgApp,
    },

    modalItemTxt: {
      fontSize: theme.typography.size.sm,
      color:    theme.colors.textPrimary,
    },

    modalItemActif: { color: theme.colors.primary, fontWeight: '700' },

    modalItemSub: {
      fontSize:  theme.typography.size.xs,
      color:     theme.colors.textTertiary,
      marginTop: 2,
    },
  });