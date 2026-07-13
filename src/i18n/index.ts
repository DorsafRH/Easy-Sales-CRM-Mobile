/**
 * @file index.ts (i18n)
 * @description Initialisation du moteur de traduction i18next.
 *
 *              FLUX DE DONNÉES :
 *              locales/fr.json + locales/en.json (ressources)
 *                    ↓ init au chargement du module (langue par défaut : fr)
 *              i18next (singleton)
 *                    ↓ hydrate() du languageStore au boot
 *              langue réelle appliquée (AsyncStorage ou langue du téléphone)
 *                    ↓ useTranslation() dans les composants
 *              textes traduits, re-rendus automatiquement au changement
 *
 * @author Riahi Dorsaf
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import fr from './locales/fr.json';
import en from './locales/en.json';

/**
 * Init synchrone au chargement du module (import side-effect dans App.tsx).
 * La langue définitive est appliquée ensuite par hydrate() du languageStore
 * (AsyncStorage → sinon langue du téléphone via expo-localization).
 */
i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    lng:         'fr',
    fallbackLng: 'fr',
    interpolation: {
      // React échappe déjà les valeurs — pas besoin de double échappement
      escapeValue: false,
    },
  });

export default i18n;
