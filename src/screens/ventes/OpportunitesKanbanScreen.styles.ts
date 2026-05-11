/**
 * @file OpportunitesKanbanScreen.styles.ts
 * @description Styles du Kanban pipeline horizontal scrollable.
 * @author Riahi Dorsaf
 */

import { StyleSheet, Dimensions } from 'react-native';
import { AppTheme } from '../../theme';
import { layout } from '../../theme/dimensions';

const CARD_WIDTH = Dimensions.get('window').width * 0.72;

export const KANBAN_CARD_WIDTH = CARD_WIDTH;

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safe:    { flex: 1, backgroundColor: theme.colors.bgApp },

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
    headerTitle: {
      flex:       1,
      fontSize:   theme.typography.size.lg,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },
    toggleBtn: {
      flexDirection:     'row',
      alignItems:        'center',
      columnGap:         theme.spacing[1],
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[2],
      borderRadius:      theme.radius.md,
      borderWidth:       1,
      borderColor:       theme.colors.border,
      backgroundColor:   theme.colors.bgApp,
    },
    toggleBtnText: {
      fontSize:   theme.typography.size.xs,
      fontWeight: '600',
      color:      theme.colors.textSecondary,
    },

    // ── Kanban horizontal ─────────────────────────────────────
    kanbanScroll: { flex: 1 },
    kanbanContent: {
      paddingHorizontal: layout.screenPadding,
      paddingVertical:   theme.spacing[4],
      columnGap:         theme.spacing[3],
      flexDirection:     'row',
      alignItems:        'flex-start',
    },

    colonne: {
      width:        CARD_WIDTH,
      borderRadius: theme.radius.xl,
      overflow:     'hidden',
    },
    colonneHeader: {
      flexDirection:     'row',
      alignItems:        'center',
      paddingHorizontal: theme.spacing[3],
      paddingVertical:   theme.spacing[3],
      borderTopLeftRadius:  theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      columnGap:         theme.spacing[2],
    },
    colonneTitle: {
      flex:       1,
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
    },
    colonneBadge: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical:   2,
      borderRadius:      theme.radius.full,
      backgroundColor:   'rgba(255,255,255,0.3)',
    },
    colonneBadgeText: {
      fontSize:   10,
      fontWeight: '700',
    },
    colonneBody: {
      backgroundColor: theme.colors.bgApp,
      minHeight:       120,
      padding:         theme.spacing[2],
      rowGap:          theme.spacing[2],
      borderBottomLeftRadius:  theme.radius.xl,
      borderBottomRightRadius: theme.radius.xl,
    },

    // ── Card opportunité ──────────────────────────────────────
    opportuniteCard: {
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[3],
      borderWidth:     1,
      borderColor:     theme.colors.border,
      shadowColor:     theme.colors.black,
      shadowOffset:    { width: 0, height: 1 },
      shadowOpacity:   0.05,
      shadowRadius:    3,
      elevation:       1,
    },
    cardTitre: {
      fontSize:     theme.typography.size.sm,
      fontWeight:   '600',
      color:        theme.colors.textPrimary,
      marginBottom: theme.spacing[1],
    },
    cardClient: {
      fontSize:     theme.typography.size.xs,
      color:        theme.colors.textSecondary,
      marginBottom: theme.spacing[2],
    },
    cardMontant: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.primary,
    },
    cardActionsRow: {
      flexDirection:  'row',
      columnGap:      theme.spacing[1],
      marginTop:      theme.spacing[2],
      paddingTop:     theme.spacing[2],
      borderTopWidth: 1,
      borderTopColor: theme.colors.bgApp,
    },
    cardActionBtn: {
      flex:            1,
      paddingVertical: theme.spacing[1],
      borderRadius:    theme.radius.md,
      borderWidth:     1,
      borderColor:     theme.colors.border,
      alignItems:      'center',
    },
    cardActionBtnText: {
      fontSize:   9,
      fontWeight: '600',
      color:      theme.colors.textSecondary,
    },

    addCardBtn: {
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'center',
      columnGap:       theme.spacing[1],
      paddingVertical: theme.spacing[3],
      borderRadius:    theme.radius.md,
      borderWidth:     1,
      borderStyle:     'dashed',
      borderColor:     theme.colors.border,
    },
    addCardBtnText: {
      fontSize:   theme.typography.size.xs,
      color:      theme.colors.textTertiary,
    },

    // ── Vue liste ─────────────────────────────────────────────
    listContent: {
      paddingHorizontal: layout.screenPadding,
      paddingVertical:   theme.spacing[4],
      paddingBottom:     theme.spacing[16],
    },
    groupTitle: {
      fontSize:      theme.typography.size.xs,
      fontWeight:    '700',
      color:         theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginTop:     theme.spacing[4],
      marginBottom:  theme.spacing[2],
    },
    listCard: {
      flexDirection:   'row',
      alignItems:      'center',
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      marginBottom:    theme.spacing[3],
      columnGap:       theme.spacing[3],
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },
    listCardIcon: {
      width:          40,
      height:         40,
      borderRadius:   20,
      alignItems:     'center',
      justifyContent: 'center',
    },
    listCardContent: { flex: 1 },
    listCardTitre: {
      fontSize:     theme.typography.size.sm,
      fontWeight:   '600',
      color:        theme.colors.textPrimary,
      marginBottom: 2,
    },
    listCardClient: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },
    listCardMontant: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.primary,
    },
    loadingContainer: {
      flex: 1, alignItems: 'center', justifyContent: 'center',
    },
  });