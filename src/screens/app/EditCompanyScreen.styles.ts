/**
 * @file EditCompanyScreen.styles.ts
 * @description Styles de l'écran de modification des données entreprise.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme }   from '../../theme';
import { layout }     from '../../theme/dimensions';

export const makeStyles = (theme: AppTheme) => StyleSheet.create({

  safe: { flex: 1, backgroundColor: theme.colors.bgApp },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: theme.colors.textSecondary, fontSize: theme.typography.size.base },

  // ── Header ──────────────────────────────────────────────────
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
    borderRadius:    theme.radius.full,
    backgroundColor: theme.colors.bgApp,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1,
    borderColor:     theme.colors.border,
  },

  backIcon: { fontSize: 20, color: theme.colors.textPrimary },

  headerTitle: {
    flex:       1,
    fontSize:   theme.typography.size.lg,
    fontWeight: '700',
    color:      theme.colors.textPrimary,
  },

  annulerBtn: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical:   theme.spacing[2],
  },

  annulerText: {
    fontSize:   theme.typography.size.sm,
    color:      theme.colors.danger,
    fontWeight: '600',
  },

  // ── Contenu ─────────────────────────────────────────────────
  scroll: { flex: 1 },

  content: {
    flexGrow:          1,
    paddingHorizontal: layout.screenPadding,
    paddingVertical:   theme.spacing[5],
    paddingBottom:     theme.spacing[10],
  },

  card: { marginBottom: theme.spacing[4] },

  cardTitle: {
    fontSize:     theme.typography.size.base,
    fontWeight:   '600',
    color:        theme.colors.textPrimary,
    marginBottom: theme.spacing[4],
  },

  // ── Fiche lecture ────────────────────────────────────────────
  ficheRow: {
    flexDirection:     'row',
    justifyContent:    'space-between',
    alignItems:        'center',
    paddingVertical:   theme.spacing[3],
    paddingHorizontal: theme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  ficheLabel: {
    fontSize:   theme.typography.size.sm,
    color:      theme.colors.textSecondary,
    fontWeight: '500',
    flex:       1,
  },

  ficheValue: {
    fontSize:   theme.typography.size.sm,
    color:      theme.colors.textPrimary,
    fontWeight: '600',
    flex:       2,
    textAlign:  'right',
  },

  // ── Taille entreprise ────────────────────────────────────────
  fieldGroup: { marginBottom: theme.spacing[4] },

  fieldLabel: {
    fontSize:     theme.typography.size.sm,
    fontWeight:   '500',
    color:        theme.colors.textPrimary,
    marginBottom: theme.spacing[2],
  },

  required: { color: theme.colors.danger },

  tailleRow: { flexDirection: 'row', columnGap: theme.spacing[2] },

  tailleCard: {
    flex:            1,
    padding:         theme.spacing[3],
    borderRadius:    theme.radius.md,
    borderWidth:     1.5,
    borderColor:     theme.colors.border,
    backgroundColor: theme.colors.bgSurface,
    alignItems:      'center',
  },

  tailleCardActive: {
    borderColor:     theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },

  tailleLabel: {
    fontSize:   theme.typography.size.md,
    fontWeight: '700',
    color:      theme.colors.textSecondary,
  },

  tailleLabelActive: { color: theme.colors.primary },

  tailleDesc: {
    fontSize:  theme.typography.size.xs,
    color:     theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: theme.spacing[1],
  },

  tailleDescActive: { color: theme.colors.primaryText },

  errorText: {
    fontSize:  theme.typography.size.xs,
    color:     theme.colors.danger,
    marginTop: theme.spacing[1],
  },

  // ── Deux colonnes ────────────────────────────────────────────
  row:     { flexDirection: 'row', columnGap: theme.spacing[3] },
  rowItem: { flex: 1 },

  // ── Alertes ──────────────────────────────────────────────────
  alertSuccess: {
    backgroundColor: theme.colors.successLight,
    borderWidth:     1,
    borderColor:     theme.colors.success,
    borderRadius:    theme.radius.md,
    padding:         theme.spacing[3],
    marginBottom:    theme.spacing[4],
  },

  alertSuccessText: {
    fontSize: theme.typography.size.sm,
    color:    theme.colors.successText,
  },

  alertError: {
    backgroundColor: theme.colors.dangerLight,
    borderWidth:     1,
    borderColor:     theme.colors.danger,
    borderRadius:    theme.radius.md,
    padding:         theme.spacing[3],
    marginBottom:    theme.spacing[4],
  },

  alertErrorText: {
    fontSize: theme.typography.size.sm,
    color:    theme.colors.dangerText,
  },

  // ── Info box ─────────────────────────────────────────────────
  infoBox: {
    flexDirection:   'row',
    alignItems:      'flex-start',
    backgroundColor: theme.colors.primaryLight,
    borderRadius:    theme.radius.md,
    padding:         theme.spacing[3],
    marginBottom:    theme.spacing[4],
    columnGap:       theme.spacing[2],
  },

  infoIcon: { fontSize: 16 },

  infoText: {
    flex:       1,
    fontSize:   theme.typography.size.xs,
    color:      theme.colors.primaryText,
    lineHeight: theme.typography.size.xs * 1.6,
  },

  // ── Bouton ───────────────────────────────────────────────────
  btnSubmit: { marginTop: theme.spacing[4] },
});