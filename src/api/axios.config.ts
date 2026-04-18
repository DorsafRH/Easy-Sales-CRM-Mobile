/**
 * @file axios.config.ts
 * @description Configuration centrale du client HTTP Axios.
 *
 *              POURQUOI EXPO-SECURE-STORE POUR LES TOKENS ?
 *              AsyncStorage stocke les données EN CLAIR sur le téléphone.
 *              N'importe quelle app malveillante avec accès root peut lire
 *              le token JWT et usurper l'identité de l'utilisateur.
 *
 *              expo-secure-store utilise :
 *              - iOS     → Keychain Services (chiffrement AES-256)
 *              - Android → Android Keystore (chiffrement matériel)
 *
 *              Les tokens JWT sont des données SENSIBLES → Keychain/Keystore.
 *              La préférence de thème n'est PAS sensible → AsyncStorage.
 *
 *              FONCTIONNEMENT DES INTERCEPTEURS AXIOS :
 *              - Intercepteur REQUEST  : injecte le token JWT dans chaque requête
 *              - Intercepteur RESPONSE : gère les erreurs 401 (token expiré)
 *
 * @author Riahi Dorsaf
 */

import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';

// ─────────────────────────────────────────────────────────────
// CLÉS DE STOCKAGE SÉCURISÉ
// ─────────────────────────────────────────────────────────────

/**
 * Clé de stockage du token JWT dans expo-secure-store.
 * Stocké dans le Keychain iOS / Keystore Android — chiffré.
 */
export const TOKEN_KEY = 'crm_access_token';

/**
 * Clé de stockage des données utilisateur dans expo-secure-store.
 * Contient le profil sérialisé en JSON — chiffré.
 */
export const USER_KEY = 'crm_current_user';

// ─────────────────────────────────────────────────────────────
// URL DE BASE
// ─────────────────────────────────────────────────────────────

/**
 * URL de base de l'API backend.
 *
 * __DEV__ est une variable globale Expo/React Native :
 * - true  en développement (npx expo start)
 * - false en production (build EAS)
 *
 * 10.0.2.2 = adresse fixe de localhost depuis l'émulateur Android.
 * Ne change jamais peu importe le réseau → solution définitive.
 */
const BASE_URL = __DEV__
  ? 'http://10.122.221.88:8080/api'
  : 'https://api.votre-domaine.com/api';

// ─────────────────────────────────────────────────────────────
// FONCTIONS UTILITAIRES SECURE STORE
// ─────────────────────────────────────────────────────────────

/**
 * Sauvegarde une valeur de façon sécurisée.
 * Wrapper autour de SecureStore.setItemAsync avec gestion d'erreur.
 *
 * @param key   - Clé de stockage
 * @param value - Valeur à chiffrer et stocker
 * @author Riahi Dorsaf
 */
export const saveSecure = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`[SecureStore] Erreur saveSecure(${key}):`, error);
  }
};

/**
 * Lit une valeur stockée de façon sécurisée.
 *
 * @param key - Clé de stockage
 * @returns La valeur déchiffrée ou null si absente
 * @author Riahi Dorsaf
 */
export const getSecure = async (
  key: string
): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`[SecureStore] Erreur getSecure(${key}):`, error);
    return null;
  }
};

/**
 * Supprime une valeur stockée de façon sécurisée.
 *
 * @param key - Clé de stockage à supprimer
 * @author Riahi Dorsaf
 */
export const deleteSecure = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`[SecureStore] Erreur deleteSecure(${key}):`, error);
  }
};

/**
 * Supprime plusieurs clés sécurisées en parallèle.
 * Équivalent de AsyncStorage.multiRemove() mais sécurisé.
 *
 * @param keys - Tableau de clés à supprimer
 * @author Riahi Dorsaf
 */
export const deleteSecureMultiple = async (
  keys: string[]
): Promise<void> => {
  await Promise.all(keys.map(key => deleteSecure(key)));
};

// ─────────────────────────────────────────────────────────────
// INSTANCE AXIOS
// ─────────────────────────────────────────────────────────────

/**
 * Instance Axios configurée pour l'API CRM.
 * Timeout de 15 secondes — adapté à une connexion mobile.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─────────────────────────────────────────────────────────────
// INTERCEPTEUR REQUEST
// ─────────────────────────────────────────────────────────────

/**
 * Intercepteur de requête — injecte automatiquement le token JWT.
 *
 * FONCTIONNEMENT :
 * Avant chaque requête HTTP, on lit le token depuis SecureStore
 * et on l'ajoute dans le header Authorization.
 * Le backend Spring Boot lit ce header pour authentifier l'utilisateur.
 *
 * FORMAT : Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
 */
apiClient.interceptors.request.use(
  async config => {
    // Lit le token JWT depuis le stockage sécurisé
    const token = await getSecure(TOKEN_KEY);

    if (token) {
      // Injecte le token dans le header de la requête
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

// ─────────────────────────────────────────────────────────────
// INTERCEPTEUR RESPONSE
// ─────────────────────────────────────────────────────────────

/**
 * Intercepteur de réponse — gère les erreurs d'authentification.
 *
 * FONCTIONNEMENT :
 * Si le backend retourne 401 (Unauthorized), le token est expiré
 * ou invalide. On supprime les données de session pour forcer
 * l'utilisateur à se reconnecter.
 */
apiClient.interceptors.response.use(
  // Réponse OK → retourne la réponse sans modification
  response => response,

  // Erreur → vérifie si c'est un 401
  async error => {
    if (error.response?.status === 401) {
      // Token expiré → supprime la session sécurisée
      await deleteSecureMultiple([TOKEN_KEY, USER_KEY]);
    }
    return Promise.reject(error);
  }
);

export default apiClient;