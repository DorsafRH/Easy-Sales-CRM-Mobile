/**
 * @file ResetPasswordScreen.styles.ts
 * @description Styles de l'écran de réinitialisation du mot de passe.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme }   from '../../theme';

/**
 * Factory de styles pour ResetPasswordScreen.
 * @param theme - Thème courant (light ou dark)
 * @author Riahi Dorsaf
 */
export const makeStyles = (theme: AppTheme) => StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: theme.colors.bgSurface,
  },

  scroll: {
    flex: 1,
  },

  content: {
    flexGrow:          1,
    paddingHorizontal: theme.spacing[5],
    paddingBottom:     theme.spacing[10],
  },

  // ── Header ──────────────────────────────────────────────────
  backBtn: {
    width:           44,
    height:          44,
    borderRadius:    theme.radius.full,
    backgroundColor: theme.colors.bgApp,
    alignItems:      'center',
    justifyContent:  'center',
    marginTop:       theme.spacing[4],
    marginBottom:    theme.spacing[6],
    borderWidth:     1,
    borderColor:     theme.colors.border,
  },

  backIcon: {
    fontSize: 20,
    color:    theme.colors.textPrimary,
  },

  // ── Icône centrale ───────────────────────────────────────────
  iconWrapper: {
    width:           80,
    height:          80,
    borderRadius:    theme.radius.full,
    backgroundColor: theme.colors.primaryLight,
    alignItems:      'center',
    justifyContent:  'center',
    alignSelf:       'center',
    marginBottom:    theme.spacing[6],
  },

  icon: {
    fontSize: 36,
  },

  // ── Textes ───────────────────────────────────────────────────
  title: {
    fontSize:     theme.typography.size.xl,
    fontWeight:   '700',
    color:        theme.colors.textPrimary,
    textAlign:    'center',
    marginBottom: theme.spacing[3],
  },

  subtitle: {
    fontSize:     theme.typography.size.sm,
    color:        theme.colors.textSecondary,
    textAlign:    'center',
    lineHeight:   theme.typography.size.sm * 1.6,
    marginBottom: theme.spacing[8],
  },

  // ── Carte formulaire ─────────────────────────────────────────
  card: {
    marginBottom: theme.spacing[4],
  },

  // ── Indicateur force mot de passe ────────────────────────────
  strengthWrapper: {
    marginBottom: theme.spacing[4],
    marginTop:    -theme.spacing[2],
  },

  strengthBar: {
    height:          4,
    backgroundColor: theme.colors.border,
    borderRadius:    theme.radius.full,
    marginBottom:    theme.spacing[1],
  },

  strengthFill: {
    height:       4,
    borderRadius: theme.radius.full,
  },

  strengthLabel: {
    fontSize:   theme.typography.size.xs,
    fontWeight: '500',
  },

  // ── Alerte erreur ────────────────────────────────────────────
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

  // ── Bouton submit ────────────────────────────────────────────
  btnSubmit: {
    marginBottom: theme.spacing[4],
  },

  // ── Footer ───────────────────────────────────────────────────
  footer: {
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems:     'center',
    marginTop:      theme.spacing[2],
  },

  footerText: {
    fontSize: theme.typography.size.sm,
    color:    theme.colors.textSecondary,
  },

  footerLink: {
    fontSize:   theme.typography.size.sm,
    fontWeight: '600',
    color:      theme.colors.primary,
  },
});