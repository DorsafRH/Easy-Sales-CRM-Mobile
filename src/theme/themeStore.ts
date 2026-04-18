/**
 * @file themeStore.ts
 * @description Store Zustand pour la gestion globale du thème.
 *
 *              POURQUOI ZUSTAND ?
 *              Zustand est un gestionnaire d'état global léger.
 *              Sans lui, pour partager le thème entre tous les composants,
 *              on devrait passer le thème en "props" à chaque composant
 *              (prop drilling) — très fastidieux et non maintenable.
 *              Avec Zustand, n'importe quel composant peut accéder au
 *              thème directement via useTheme() sans aucune prop.
 *
 *              FLUX DE DONNÉES :
 *              AsyncStorage (persistance)
 *                    ↓ hydrate() au boot
 *              useThemeStore (état global Zustand)
 *                    ↓ useTheme()
 *              AppTheme (objet thème complet)
 *                    ↓ useStyles(makeStyles)
 *              StyleSheet mémoïsé (styles du composant)
 *
 * @author Riahi Dorsaf
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorScheme, AppTheme } from './theme.types';
import { lightColors } from './lightTheme';
import { darkColors }  from './darkTheme';
import { spacing, radius } from './spacing';
import { typography } from './typography';

// ─────────────────────────────────────────────────────────────
// CONSTANTE DE CLÉ DE STOCKAGE
// ─────────────────────────────────────────────────────────────

/**
 * Clé utilisée pour persister le schéma de couleurs dans AsyncStorage.
 * On utilise AsyncStorage ici (et NON expo-secure-store) car
 * la préférence de thème n'est pas une donnée sensible —
 * c'est juste 'light' ou 'dark'.
 * expo-secure-store est réservé aux données sensibles (tokens JWT).
 */
const THEME_STORAGE_KEY = 'crm_color_scheme';

// ─────────────────────────────────────────────────────────────
// FONCTION UTILITAIRE — buildTheme
// ─────────────────────────────────────────────────────────────

/**
 * Construit un objet AppTheme complet à partir d'un ColorScheme.
 *
 * @param scheme - 'light' ou 'dark'
 * @returns AppTheme complet avec couleurs, spacing, radius, typography
 *
 * @example
 * const theme = buildTheme('dark');
 * // theme.colors.bgApp → '#0F172A'
 * // theme.colors.primary → '#3B82F6'
 * // theme.spacing[4] → 16
 */
const buildTheme = (scheme: ColorScheme): AppTheme => ({
  colors:     scheme === 'dark' ? darkColors : lightColors,
  spacing,
  radius,
  typography,
  isDark:     scheme === 'dark',
});

// ─────────────────────────────────────────────────────────────
// INTERFACE DU STORE
// ─────────────────────────────────────────────────────────────

/**
 * Structure complète du store Zustand.
 * Contient l'état (scheme, theme, isHydrated)
 * et les actions (toggleScheme, setScheme, hydrate).
 */
interface ThemeState {
  /** Schéma actuel : 'light' ou 'dark' */
  scheme: ColorScheme;

  /**
   * Objet thème complet prêt à être consommé par les composants.
   * Mis à jour automatiquement quand scheme change.
   */
  theme: AppTheme;

  /**
   * true quand AsyncStorage a été lu au boot.
   * Permet d'éviter un flash de thème incorrect au démarrage.
   */
  isHydrated: boolean;

  /**
   * Bascule entre light et dark.
   * Persiste le choix dans AsyncStorage.
   * @returns Promise<void>
   */
  toggleScheme: () => Promise<void>;

  /**
   * Force un schéma spécifique.
   * Utile pour respecter les préférences système de l'OS.
   * @param scheme - 'light' ou 'dark'
   * @returns Promise<void>
   */
  setScheme: (scheme: ColorScheme) => Promise<void>;

  /**
   * Lit le schéma sauvegardé dans AsyncStorage au démarrage.
   * Doit être appelé UNE SEULE FOIS dans App.tsx via useEffect.
   * @returns Promise<void>
   */
  hydrate: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────
// CRÉATION DU STORE ZUSTAND
// ─────────────────────────────────────────────────────────────

/**
 * Store Zustand principal pour le thème.
 *
 * IMPORTANT : Ne pas utiliser ce hook directement dans les composants.
 * Utiliser plutôt :
 * - useTheme() → pour accéder au thème
 * - useThemeStore(s => s.toggleScheme) → pour les actions
 */
export const useThemeStore = create<ThemeState>((set, get) => ({
  // ── État initial ────────────────────────────────────────────
  scheme:     'light',
  theme:      buildTheme('light'),
  isHydrated: false,

  // ── Action : hydrate ────────────────────────────────────────
  hydrate: async () => {
    try {
      // Lit la valeur sauvegardée dans AsyncStorage
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);

      // Valide que la valeur est bien 'light' ou 'dark'
      // Si la valeur est invalide ou absente → 'light' par défaut
      const scheme: ColorScheme =
        stored === 'dark' || stored === 'light' ? stored : 'light';

      // Met à jour le store avec le schéma restauré
      set({
        scheme,
        theme:      buildTheme(scheme),
        isHydrated: true,
      });
    } catch {
      // En cas d'erreur AsyncStorage → thème light par défaut
      set({ isHydrated: true });
    }
  },

  // ── Action : toggleScheme ───────────────────────────────────
  toggleScheme: async () => {
    // Calcule le prochain schéma (inverse du courant)
    const next: ColorScheme = get().scheme === 'light' ? 'dark' : 'light';

    // Persiste dans AsyncStorage pour survivre au redémarrage
    await AsyncStorage.setItem(THEME_STORAGE_KEY, next);

    // Met à jour le store — tous les composants se re-rendent
    set({
      scheme: next,
      theme:  buildTheme(next),
    });
  },

  // ── Action : setScheme ──────────────────────────────────────
  setScheme: async (scheme: ColorScheme) => {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
    set({
      scheme,
      theme: buildTheme(scheme),
    });
  },
}));

// ─────────────────────────────────────────────────────────────
// SÉLECTEURS DE COMMODITÉ
// ─────────────────────────────────────────────────────────────

/**
 * Hook de commodité — retourne uniquement l'objet AppTheme.
 * C'est ce hook qu'on utilise dans useStyles().
 *
 * Optimisation : Zustand ne re-rend le composant QUE SI
 * theme change — pas à chaque action du store.
 *
 * @returns AppTheme courant (light ou dark)
 *
 * @example
 * const theme = useTheme();
 * // theme.colors.primary → '#2563EB' en light
 * // theme.colors.primary → '#3B82F6' en dark
 */
export const useTheme = (): AppTheme =>
  useThemeStore(state => state.theme);