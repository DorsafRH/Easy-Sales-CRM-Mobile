/**
 * @file VerifyCodeScreen.styles.ts
 * @description Styles de l'écran de vérification du code OTP.
 * @author Riahi Dorsaf
 */

import { StyleSheet } from 'react-native';
import { AppTheme }   from '../../theme';
import { layout }     from '../../theme/dimensions';

/**
 * Factory de styles pour VerifyCodeScreen.
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

  email: {
    fontWeight: '600',
    color:      theme.colors.primary,
  },

  // ── Cases OTP ────────────────────────────────────────────────
  otpContainer: {
    flexDirection:  'row',
    justifyContent: 'center',
    columnGap:      layout.screenPadding / 2,
    marginBottom:   theme.spacing[6],
  },

  otpBox: {
    width:           layout.otpBoxSize,
    height:          layout.otpBoxSize + 8,
    borderRadius:    theme.radius.md,
    borderWidth:     2,
    borderColor:     theme.colors.border,
    backgroundColor: theme.colors.bgApp,
    alignItems:      'center',
    justifyContent:  'center',
  },

  otpBoxFocused: {
    borderColor:     theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },

  otpBoxFilled: {
    borderColor:     theme.colors.primary,
    backgroundColor: theme.colors.bgSurface,
  },

  otpBoxError: {
    borderColor:     theme.colors.danger,
    backgroundColor: theme.colors.dangerLight,
  },

  otpText: {
    fontSize:   theme.typography.size.xl,
    fontWeight: '700',
    color:      theme.colors.textPrimary,
  },

  // ── Timer ────────────────────────────────────────────────────
  timerWrapper: {
    alignItems:   'center',
    marginBottom: theme.spacing[6],
  },

  timerText: {
    fontSize: theme.typography.size.sm,
    color:    theme.colors.textSecondary,
  },

  timerCount: {
    fontWeight: '600',
    color:      theme.colors.primary,
  },

  timerExpired: {
    color: theme.colors.danger,
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

  // ── Boutons ──────────────────────────────────────────────────
  btnVerify: {
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

  footerLinkDisabled: {
    color: theme.colors.textTertiary,
  },
});