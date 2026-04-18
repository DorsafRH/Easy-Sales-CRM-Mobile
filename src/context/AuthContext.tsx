/**
 * @file AuthContext.tsx
 * @description Contexte React d'authentification.
 *
 *              Fournit à toute l'application :
 *              - L'utilisateur connecté (currentUser)
 *              - Les actions login / logout
 *              - L'état de chargement et les erreurs
 *
 *              SÉCURITÉ :
 *              Les tokens JWT sont stockés via expo-secure-store
 *              (Keychain iOS / Keystore Android) — jamais AsyncStorage.
 *
 * @author Riahi Dorsaf
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { AuthResponse } from '../types/auth.types';
import {
  TOKEN_KEY,
  USER_KEY,
  saveSecure,
  getSecure,
  deleteSecureMultiple,
} from '../api/axios.config';
import * as AuthApi from '../api/auth.api';

// ─────────────────────────────────────────────────────────────
// INTERFACE DU CONTEXTE
// ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  /** Utilisateur connecté ou null si non connecté */
  currentUser:     AuthResponse | null;
  /** true pendant la restauration de session au boot */
  isInitializing:  boolean;
  /** true pendant un appel API login */
  isLoading:       boolean;
  /** Message d'erreur de connexion ou null */
  loginError:      string | null;
  /** Connecte l'utilisateur */
  login:           (email: string, motDePasse: string) => Promise<void>;
  /** Déconnecte l'utilisateur */
  logout:          () => Promise<void>;
  /** Efface le message d'erreur */
  clearLoginError: () => void;
}

// ─────────────────────────────────────────────────────────────
// CRÉATION DU CONTEXTE
// ─────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────

/**
 * Provider d'authentification — enveloppe toute l'application.
 * Doit être placé dans App.tsx autour de AppNavigator.
 *
 * @param children - Composants enfants
 * @author Riahi Dorsaf
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser,    setCurrentUser]    = useState<AuthResponse | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading,      setIsLoading]      = useState(false);
  const [loginError,     setLoginError]     = useState<string | null>(null);

  // ── Restauration de session au démarrage ──────────────────

  /**
   * Lit les données utilisateur depuis SecureStore au boot.
   * Si un utilisateur était connecté, on restaure sa session
   * sans qu'il ait besoin de se reconnecter.
   */
  useEffect(() => {
    const restore = async () => {
      try {
        // Lit les données utilisateur depuis le stockage sécurisé
        const stored = await getSecure(USER_KEY);

        if (stored) {
          setCurrentUser(JSON.parse(stored));
        }
      } catch {
        // Session corrompue → supprime tout et repart de zéro
        await deleteSecureMultiple([TOKEN_KEY, USER_KEY]);
      } finally {
        setIsInitializing(false);
      }
    };

    restore();
  }, []);

  // ── Action : login ────────────────────────────────────────

  /**
   * Connecte l'utilisateur via l'API backend.
   * Sauvegarde le token JWT et le profil dans SecureStore.
   *
   * @param email      - Email de l'utilisateur
   * @param motDePasse - Mot de passe
   * @author Riahi Dorsaf
   */
  const login = useCallback(async (
    email: string,
    motDePasse: string
  ) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await AuthApi.login({ email, motDePasse });

      if (!response.success) {
        setLoginError(response.message ?? 'Connexion échouée.');
        return;
      }

      const user = response.data;

      // Vérifie que c'est bien un propriétaire d'entreprise
      if (user.role !== 'ROLE_PROPRIETAIRE') {
        setLoginError(
          "Ce portail est réservé aux propriétaires d'entreprise."
        );
        return;
      }

      // Sauvegarde sécurisée — Keychain iOS / Keystore Android
      await saveSecure(TOKEN_KEY, user.accessToken);
      await saveSecure(USER_KEY, JSON.stringify(user));

      setCurrentUser(user);

    } catch (error: any) {
      setLoginError(
        error?.response?.data?.message ??
        'Email ou mot de passe incorrect.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Action : logout ───────────────────────────────────────

  /**
   * Déconnecte l'utilisateur.
   * Supprime le token JWT et le profil du stockage sécurisé.
   *
   * @author Riahi Dorsaf
   */
  const logout = useCallback(async () => {
    await deleteSecureMultiple([TOKEN_KEY, USER_KEY]);
    setCurrentUser(null);
  }, []);

  // ── Action : clearLoginError ──────────────────────────────

  /**
   * Efface le message d'erreur de connexion.
   * Appelé quand l'utilisateur commence à retaper ses credentials.
   */
  const clearLoginError = useCallback(() => setLoginError(null), []);

  return (
    <AuthContext.Provider value={{
      currentUser,
      isInitializing,
      isLoading,
      loginError,
      login,
      logout,
      clearLoginError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────
// HOOK D'ACCÈS AU CONTEXTE
// ─────────────────────────────────────────────────────────────

/**
 * Hook pour accéder au contexte d'authentification.
 * Doit être utilisé uniquement dans un composant enfant de AuthProvider.
 *
 * @returns AuthContextValue
 * @throws Error si utilisé hors AuthProvider
 * @author Riahi Dorsaf
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};