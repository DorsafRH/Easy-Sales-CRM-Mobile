/**
 * @file axios.config.ts
 * @description Configuration centrale du client HTTP Axios.
 *
 *              SÉCURITÉ :
 *              Les tokens JWT sont stockés via expo-secure-store
 *              (Keychain iOS / Keystore Android / localStorage Web).
 *
 *              FIX EXPO WEB :
 *              Sur Expo Web, SecureStore.getItemAsync() peut retourner null
 *              dans l'intercepteur même si le token est bien sauvegardé.
 *              Solution : injecter le token directement dans
 *              apiClient.defaults.headers.common['Authorization'] après login
 *              et restauration de session — aucun appel async dans l'intercepteur.
 *
 * @author Riahi Dorsaf
 */

import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';

// ─────────────────────────────────────────────────────────────
// CLÉS DE STOCKAGE SÉCURISÉ
// ─────────────────────────────────────────────────────────────

export const TOKEN_KEY = 'crm_access_token';
export const USER_KEY  = 'crm_current_user';

// ─────────────────────────────────────────────────────────────
// URL DE BASE
// ─────────────────────────────────────────────────────────────

/**
 * URL du backend, configurable sans toucher au code.
 *
 * Définir EXPO_PUBLIC_API_URL dans .env.local (prioritaire, gitignoré) :
 *   - LAN direct    : http://192.168.1.246:8080/api
 *   - Tunnel HTTPS  : https://api.mon-domaine.com/api
 *
 * Les variables EXPO_PUBLIC_* sont inlinées au bundling → après
 * modification, relancer Expo avec le cache vidé : `npx expo start -c`.
 * Le fallback ci-dessous évite tout crash si la variable est absente.
 */
const FALLBACK_URL = __DEV__
  ? 'http://10.179.94.88:8080/api'
  : 'https://api.votre-domaine.com/api';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? FALLBACK_URL;

// ─────────────────────────────────────────────────────────────
// FONCTIONS UTILITAIRES SECURE STORE
// ─────────────────────────────────────────────────────────────

export const saveSecure = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`[SecureStore] Erreur saveSecure(${key}):`, error);
  }
};

export const getSecure = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`[SecureStore] Erreur getSecure(${key}):`, error);
    return null;
  }
};

export const deleteSecure = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`[SecureStore] Erreur deleteSecure(${key}):`, error);
  }
};

export const deleteSecureMultiple = async (keys: string[]): Promise<void> => {
  await Promise.all(keys.map(key => deleteSecure(key)));
};

// ─────────────────────────────────────────────────────────────
// INSTANCE AXIOS
// ─────────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─────────────────────────────────────────────────────────────
// INTERCEPTEUR RESPONSE — gestion 401
// ─────────────────────────────────────────────────────────────

/**
 * Si le backend retourne 401, le token est expiré ou invalide.
 * On supprime le header d'autorisation pour forcer la reconnexion.
 */
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      delete apiClient.defaults.headers.common['Authorization'];
      await deleteSecureMultiple([TOKEN_KEY, USER_KEY]);
    }
    return Promise.reject(error);
  },
);

export default apiClient;