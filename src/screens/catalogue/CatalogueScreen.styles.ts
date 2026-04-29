/**
 * @file CatalogueScreen.styles.ts
 * @description Styles de l'écran catalogue (catégories en grille + liste produits).
 * @author Riahi Dorsaf
 */

import { StyleSheet, Dimensions } from 'react-native';
import { AppTheme }               from '../../theme';
import { layout }                 from '../../theme/dimensions';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP     = 12;
const CAT_WIDTH    = (SCREEN_WIDTH - layout.screenPadding * 2 - CARD_GAP) / 2;

/**
 * @param theme - Thème courant injecté par useStyles()
 * @author Riahi Dorsaf
 */
export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({

    safe: {
      flex:            1,
      backgroundColor: theme.colors.bgApp,
    },

    // ── Header ───────────────────────────────────────────────
    header: {
      backgroundColor:   theme.colors.bgSurface,
      paddingHorizontal: layout.screenPadding,
      paddingTop:        theme.spacing[4],
      paddingBottom:     theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    headerTitle: {
      fontSize:     theme.typography.size.xl,
      fontWeight:   '700',
      color:        theme.colors.textPrimary,
      marginBottom: theme.spacing[3],
    },

    searchWrapper:  { marginBottom: theme.spacing[3] },
    filtersWrapper: {},

    // ── Contenu scrollable ────────────────────────────────────
    scroll:  { flex: 1 },

    content: {
      flexGrow:      1,
      paddingBottom: theme.spacing[16],
    },

    section: {
      paddingHorizontal: layout.screenPadding,
      marginTop:         theme.spacing[4],
    },

    sectionHeader: {
      flexDirection:  'row',
      justifyContent: 'space-between',
      alignItems:     'center',
      marginBottom:   theme.spacing[3],
    },

    sectionTitle: {
      fontSize:   theme.typography.size.base,
      fontWeight: '700',
      color:      theme.colors.textPrimary,
    },

    gererBtn: {
      fontSize:   theme.typography.size.sm,
      color:      theme.colors.primary,
      fontWeight: '600',
    },

    // ── Grille catégories ─────────────────────────────────────
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap:      'wrap',
      columnGap:     CARD_GAP,
      rowGap:        CARD_GAP,
    },

    categorieCard: {
      width:           CAT_WIDTH,
      backgroundColor: theme.colors.bgSurface,
      borderRadius:    theme.radius.lg,
      padding:         theme.spacing[4],
      borderWidth:     1,
      borderColor:     theme.colors.border,
      alignItems:      'flex-start',
      rowGap:          theme.spacing[2],
    },

    categorieIconWrapper: {
      width:           44,
      height:          44,
      borderRadius:    theme.radius.md,
      backgroundColor: theme.colors.primaryLight,
      alignItems:      'center',
      justifyContent:  'center',
    },

    categorieNom: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '600',
      color:      theme.colors.textPrimary,
    },

    categorieCount: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },

    // ── Liste produits ────────────────────────────────────────
    produitItem: {
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

    produitIconWrapper: {
      width:           48,
      height:          48,
      borderRadius:    theme.radius.md,
      backgroundColor: theme.colors.bgApp,
      alignItems:      'center',
      justifyContent:  'center',
      borderWidth:     1,
      borderColor:     theme.colors.border,
    },

    produitInfo: { flex: 1 },

    produitNom: {
      fontSize:     theme.typography.size.sm,
      fontWeight:   '600',
      color:        theme.colors.textPrimary,
      marginBottom: 2,
    },

    produitCategorie: {
      fontSize: theme.typography.size.xs,
      color:    theme.colors.textSecondary,
    },

    produitRight: {
      alignItems: 'flex-end',
      rowGap:     theme.spacing[1],
    },

    produitPrix: {
      fontSize:   theme.typography.size.sm,
      fontWeight: '700',
      color:      theme.colors.primary,
    },

    // ── Chargement ────────────────────────────────────────────
    loadingContainer: {
      flex:            1,
      alignItems:      'center',
      justifyContent:  'center',
      paddingVertical: theme.spacing[10],
    },
  });