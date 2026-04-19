/**
 * @file dimensions.ts
 * @description Dimensions responsives calculées depuis la taille réelle
 *              de l'écran du device.
 *
 *              PRINCIPE :
 *              Toutes les tailles sont calculées en pourcentage de
 *              la largeur ou hauteur de l'écran — jamais en valeurs fixes.
 *              Ça garantit un rendu correct sur TOUS les devices :
 *              - Petit écran  : Samsung A03s (720x1600)
 *              - Moyen écran  : Pixel 6 (1080x2400)
 *              - Grand écran  : Samsung S24 Ultra (1440x3120)
 *
 * @author Riahi Dorsaf
 */

import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Largeur et hauteur de l'écran en points.
 * Utilisées comme base de calcul pour toutes les dimensions.
 */
export const screen = {
  width:  SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};

/**
 * Convertit un pourcentage de largeur en points.
 * @param percent - Pourcentage de la largeur (0-100)
 * @returns Valeur en points
 *
 * @example
 * wp(100) → largeur totale de l'écran
 * wp(50)  → moitié de la largeur
 * wp(5)   → 5% de la largeur (padding standard)
 */
export const wp = (percent: number): number =>
  Math.round((SCREEN_WIDTH * percent) / 100);

/**
 * Convertit un pourcentage de hauteur en points.
 * @param percent - Pourcentage de la hauteur (0-100)
 * @returns Valeur en points
 *
 * @example
 * hp(10) → 10% de la hauteur de l'écran
 * hp(7)  → hauteur standard d'un bouton
 */
export const hp = (percent: number): number =>
  Math.round((SCREEN_HEIGHT * percent) / 100);

/**
 * Dimensions précalculées pour les composants standard.
 * Utilise ces valeurs au lieu de valeurs fixes partout dans l'app.
 */
export const layout = {
  // ── Padding et marges ──────────────────────────────────────
  /** Padding horizontal standard des écrans */
  screenPadding:    wp(5),
  /** Padding horizontal réduit */
  screenPaddingSm:  wp(3),
  /** Padding horizontal large */
  screenPaddingLg:  wp(7),

  // ── Boutons ────────────────────────────────────────────────
  /** Hauteur standard d'un bouton (48px minimum pour l'ergonomie) */
  buttonHeight:     Math.max(hp(6.5), 48),
  /** Hauteur petite d'un bouton */
  buttonHeightSm:   Math.max(hp(5), 40),
  /** Hauteur grande d'un bouton */
  buttonHeightLg:   Math.max(hp(7.5), 56),

  // ── Inputs ─────────────────────────────────────────────────
  /** Hauteur standard d'un champ de saisie */
  inputHeight:      Math.max(hp(7), 52),

  // ── Icônes et avatars ──────────────────────────────────────
  /** Taille des icônes cliquables (44px minimum ergonomie) */
  iconTouchable:    Math.max(wp(11), 44),
  /** Taille des avatars petits */
  avatarSm:         wp(10),
  /** Taille des avatars moyens */
  avatarMd:         wp(14),
  /** Taille des avatars grands */
  avatarLg:         wp(20),

  // ── Cases OTP ──────────────────────────────────────────────
  /**
   * Taille d'une case OTP calculée dynamiquement.
   * Formule : (largeur écran - padding*2 - espaces entre cases) / 6
   * Garantit que les 6 cases rentrent toujours dans l'écran.
   */
  otpBoxSize: Math.floor((SCREEN_WIDTH - wp(10) - 5 * wp(3)) / 6),

  // ── Cards ──────────────────────────────────────────────────
  /** Largeur d'une card pleine largeur */
  cardWidth:        SCREEN_WIDTH - wp(10),
  /** Largeur d'une card demi-largeur */
  cardHalfWidth:    (SCREEN_WIDTH - wp(10) - wp(3)) / 2,

  // ── Bottom Tab Bar ─────────────────────────────────────────
  /** Hauteur de la bottom tab bar */
  tabBarHeight:     hp(8),

  // ── Header ─────────────────────────────────────────────────
  /** Hauteur du header de navigation */
  headerHeight:     hp(7),
} as const;

/**
 * Normalise une taille de police selon la densité de l'écran.
 * Évite les textes trop petits sur les écrans haute densité.
 *
 * @param size - Taille de base en points
 * @returns Taille normalisée
 *
 * @example
 * fontSize: normalize(14) // 14px normalisé selon le device
 */
export const normalize = (size: number): number => {
  const scale = SCREEN_WIDTH / 390; // 390 = largeur de référence iPhone 14
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};