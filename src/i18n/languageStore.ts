/**
 * @file languageStore.ts
 * @description Store Zustand pour la gestion globale de la langue (FR/EN).
 *              Calqué sur le pattern de themeStore.ts.
 *
 *              FLUX DE DONNÉES :
 *              AsyncStorage (persistance) OU langue du téléphone (1er lancement)
 *                    ↓ hydrate() au boot
 *              useLanguageStore (état global Zustand)
 *                    ↓ setLanguage()
 *              i18n.changeLanguage() → tous les useTranslation() se re-rendent
 *
 * @author Riahi Dorsaf
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from './index';

// ─────────────────────────────────────────────────────────────
// CONSTANTE DE CLÉ DE STOCKAGE
// ─────────────────────────────────────────────────────────────

/**
 * Clé AsyncStorage pour persister la langue choisie.
 * Cohérente avec 'crm_color_scheme' du themeStore.
 * Pas une donnée sensible → AsyncStorage (et non expo-secure-store).
 */
const LANGUAGE_STORAGE_KEY = 'crm_language';

/** Les deux langues supportées par l'application. */
export type AppLanguage = 'fr' | 'en';

// ─────────────────────────────────────────────────────────────
// INTERFACE DU STORE
// ─────────────────────────────────────────────────────────────

interface LanguageState {
  /** Langue actuelle : 'fr' ou 'en' */
  language: AppLanguage;

  /**
   * true quand AsyncStorage a été lu au boot.
   * Permet d'éviter un flash FR→EN au démarrage.
   */
  isHydrated: boolean;

  /**
   * Change la langue : persiste dans AsyncStorage
   * et applique immédiatement via i18n.changeLanguage.
   */
  setLanguage: (lang: AppLanguage) => Promise<void>;

  /**
   * Lit la langue sauvegardée au démarrage.
   * Si absente (1er lancement) → détecte la langue du téléphone
   * via expo-localization ('en' si téléphone en anglais, sinon 'fr').
   * Doit être appelé UNE SEULE FOIS dans App.tsx via useEffect.
   */
  hydrate: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────
// CRÉATION DU STORE ZUSTAND
// ─────────────────────────────────────────────────────────────

export const useLanguageStore = create<LanguageState>((set) => ({
  // ── État initial ────────────────────────────────────────────
  language:   'fr',
  isHydrated: false,

  // ── Action : hydrate ────────────────────────────────────────
  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

      let language: AppLanguage;
      if (stored === 'fr' || stored === 'en') {
        // Choix explicite déjà sauvegardé
        language = stored;
      } else {
        // 1er lancement → détection de la langue du téléphone
        const deviceLang = Localization.getLocales()[0]?.languageCode;
        language = deviceLang === 'en' ? 'en' : 'fr';
      }

      await i18n.changeLanguage(language);
      set({ language, isHydrated: true });
    } catch {
      // En cas d'erreur → français par défaut
      set({ isHydrated: true });
    }
  },

  // ── Action : setLanguage ────────────────────────────────────
  setLanguage: async (lang: AppLanguage) => {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    await i18n.changeLanguage(lang);
    set({ language: lang });
  },
}));

// ─────────────────────────────────────────────────────────────
// SÉLECTEUR DE COMMODITÉ
// ─────────────────────────────────────────────────────────────

/** Hook de commodité — retourne uniquement la langue courante. */
export const useLanguage = (): AppLanguage =>
  useLanguageStore(state => state.language);
