/**
 * @file useAvatarColor.ts
 * @description Hook utilitaire pour générer une couleur d'avatar déterministe
 *              depuis un nom ou une chaîne quelconque.
 *
 *              PRINCIPE :
 *              On calcule un hash numérique simple du texte,
 *              puis on mappe ce hash sur une palette fixe de 8 couleurs.
 *              Le même nom produira TOUJOURS la même couleur,
 *              même après un reload ou une navigation — c'est ce qu'on appelle
 *              une couleur "déterministe".
 *
 *              USAGE :
 *              const { bg, text, initiales } = useAvatarColor('InnoTech Solutions');
 *              // bg    → '#EFF6FF'    (fond bleu clair)
 *              // text  → '#2563EB'    (texte bleu)
 *              // initiales → 'IS'
 *
 * @author Riahi Dorsaf
 */

// ─────────────────────────────────────────────────────────────
// PALETTE DE COULEURS
// ─────────────────────────────────────────────────────────────

/**
 * 8 paires de couleurs (fond clair + texte sombre) pour les avatars.
 * Cohérentes avec la charte graphique Easy Sales CRM.
 */
const AVATAR_PALETTE: Array<{ bg: string; text: string }> = [
  { bg: '#EFF6FF', text: '#2563EB' }, // Bleu (couleur principale)
  { bg: '#F0FDF4', text: '#16A34A' }, // Vert
  { bg: '#FEF3C7', text: '#D97706' }, // Ambre
  { bg: '#FEE2E2', text: '#DC2626' }, // Rouge
  { bg: '#F3E8FF', text: '#7C3AED' }, // Violet
  { bg: '#ECFDF5', text: '#059669' }, // Émeraude
  { bg: '#FFF7ED', text: '#EA580C' }, // Orange
  { bg: '#F0F9FF', text: '#0369A1' }, // Bleu ciel
];

// ─────────────────────────────────────────────────────────────
// FONCTIONS UTILITAIRES
// ─────────────────────────────────────────────────────────────

/**
 * Calcule un hash numérique simple depuis une chaîne de caractères.
 * Algorithme : djb2 (rapide, distribution uniforme pour les noms courts).
 *
 * @param str - Chaîne à hasher
 * @returns Entier positif (index dans la palette)
 * @author Riahi Dorsaf
 */
const hashString = (str: string): number => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
};

/**
 * Extrait les initiales d'un nom d'affichage.
 * Exemples :
 *   "InnoTech Solutions" → "IS"
 *   "Sarra Mansour"      → "SM"
 *   "MedPharm"           → "ME"
 *
 * @param nom - Nom complet ou raison sociale
 * @returns 1 ou 2 lettres majuscules
 * @author Riahi Dorsaf
 */
export const extraireInitiales = (nom: string): string => {
  if (!nom?.trim()) return '?';

  const mots = nom.trim().split(/\s+/).filter(Boolean);

  if (mots.length === 1) {
    // Un seul mot → les 2 premières lettres
    return mots[0].substring(0, 2).toUpperCase();
  }

  // Plusieurs mots → première lettre de chaque mot (max 2)
  return mots
    .slice(0, 2)
    .map(m => m[0])
    .join('')
    .toUpperCase();
};

// ─────────────────────────────────────────────────────────────
// HOOK PRINCIPAL
// ─────────────────────────────────────────────────────────────

/** Résultat retourné par useAvatarColor */
export interface AvatarColorResult {
  /** Couleur de fond de l'avatar */
  bg:       string;
  /** Couleur du texte (initiales) */
  text:     string;
  /** Initiales extraites du nom (1-2 caractères) */
  initiales: string;
}

/**
 * Génère une couleur d'avatar déterministe et les initiales depuis un nom.
 *
 * @param nom - Nom d'affichage du client ou contact
 * @returns { bg, text, initiales }
 * @author Riahi Dorsaf
 */
export const useAvatarColor = (nom: string): AvatarColorResult => {
  const initiales = extraireInitiales(nom);
  const index     = hashString(nom || '') % AVATAR_PALETTE.length;
  const couleur   = AVATAR_PALETTE[index];

  return {
    bg:       couleur.bg,
    text:     couleur.text,
    initiales,
  };
};

/**
 * Version non-hook (pure fonction) utilisable hors composant React.
 * Même algorithme que useAvatarColor mais sans règles des hooks.
 *
 * @param nom - Nom d'affichage
 * @returns { bg, text, initiales }
 * @author Riahi Dorsaf
 */
export const getAvatarColor = (nom: string): AvatarColorResult => {
  const initiales = extraireInitiales(nom);
  const index     = hashString(nom || '') % AVATAR_PALETTE.length;
  const couleur   = AVATAR_PALETTE[index];

  return {
    bg:       couleur.bg,
    text:     couleur.text,
    initiales,
  };
};