/**
 * @file AuthContext.tsx
 * @description Contexte React d'authentification.
 *
 *              Fournit à toute l'application :
 *              - L'utilisateur connecté (currentUser)
 *              - Les actions login / logout / refreshUser
 *              - L'état de chargement et les erreurs
 *              - Le statut du compte (isCompteActif) pour la navigation directe
 *
 *              SÉCURITÉ :
 *              Les tokens JWT sont stockés via expo-secure-store
 *              (Keychain iOS / Keystore Android) — jamais AsyncStorage.
 *
 *              FIX EXPO WEB :
 *              Le token est injecté directement dans
 *              apiClient.defaults.headers.common['Authorization']
 *              après login et restauration de session.
 *
 *              FIX BOUCLE INFINIE refreshUser :
 *              currentUser est référencé via un useRef (currentUserRef)
 *              dans refreshUser. Ainsi refreshUser a un tableau de
 *              dépendances vide [] — référence stable — et ne déclenche
 *              pas de re-render infini via useFocusEffect.
 *
 * @author Riahi Dorsaf
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import { AuthResponse } from '../types/auth.types';
import apiClient, {
  TOKEN_KEY,
  USER_KEY,
  saveSecure,
  getSecure,
  deleteSecureMultiple,
} from '../api/axios.config';
import * as AuthApi          from '../api/auth.api';
import * as ProprietaireApi  from '../api/proprietaire.api';

// ─────────────────────────────────────────────────────────────
// CLÉ DE STOCKAGE DU STATUT COMPTE
// ─────────────────────────────────────────────────────────────

const STATUT_COMPTE_KEY = 'crm_statut_compte';

// ─────────────────────────────────────────────────────────────
// HELPERS PRIVÉS
// ─────────────────────────────────────────────────────────────

const setAxiosToken = (token: string) => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const clearAxiosToken = () => {
  delete apiClient.defaults.headers.common['Authorization'];
};

// ─────────────────────────────────────────────────────────────
// INTERFACE DU CONTEXTE
// ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  currentUser:        AuthResponse | null;
  isInitializing:     boolean;
  isLoading:          boolean;
  loginError:         string | null;
  isCompteActif:      boolean;
  login:              (email: string, motDePasse: string) => Promise<void>;
  logout:             () => Promise<void>;
  clearLoginError:    () => void;
  refreshUser:        () => Promise<void>;
  marquerCompteActif: () => Promise<void>;
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
 *
 * @author Riahi Dorsaf
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser,    setCurrentUser]    = useState<AuthResponse | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading,      setIsLoading]      = useState(false);
  const [loginError,     setLoginError]     = useState<string | null>(null);
  const [isCompteActif,  setIsCompteActif]  = useState(false);

  /**
   * Référence stable vers currentUser.
   *
   * POURQUOI useRef ET PAS currentUser DANS LES DÉPENDANCES ?
   * Si refreshUser dépend de [currentUser], chaque appel à
   * setCurrentUser() crée une nouvelle référence → refreshUser
   * est recréé → useFocusEffect le détecte → rappelle refreshUser
   * → boucle infinie de requêtes API (1998 requêtes observées).
   *
   * Avec useRef : refreshUser a des dépendances [] (stable),
   * mais lit toujours la valeur la plus récente via currentUserRef.current.
   */
  const currentUserRef = useRef<AuthResponse | null>(null);

  // Synchronise le ref à chaque changement de currentUser
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // ── Restauration de session au démarrage ──────────────────

  useEffect(() => {
    const restore = async () => {
      try {
        const token = await getSecure(TOKEN_KEY);
        if (token) setAxiosToken(token);

        const stored = await getSecure(USER_KEY);
        if (stored) setCurrentUser(JSON.parse(stored));

        const statut = await getSecure(STATUT_COMPTE_KEY);
        if (statut === 'ACTIVE') setIsCompteActif(true);

      } catch {
        clearAxiosToken();
        await deleteSecureMultiple([TOKEN_KEY, USER_KEY, STATUT_COMPTE_KEY]);
      } finally {
        setIsInitializing(false);
      }
    };
    restore();
  }, []);

  // ── Action : login ────────────────────────────────────────

  const login = useCallback(async (
    email: string,
    motDePasse: string,
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

      if (user.role !== 'ROLE_PROPRIETAIRE') {
        setLoginError("Ce portail est réservé aux propriétaires d'entreprise.");
        return;
      }

      await saveSecure(TOKEN_KEY, user.accessToken);
      await saveSecure(USER_KEY, JSON.stringify(user));
      setAxiosToken(user.accessToken);
      setCurrentUser(user);

    } catch (error: any) {
      setLoginError(
        error?.response?.data?.message ?? 'Email ou mot de passe incorrect.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Action : logout ───────────────────────────────────────

  const logout = useCallback(async () => {
    clearAxiosToken();
    await deleteSecureMultiple([TOKEN_KEY, USER_KEY, STATUT_COMPTE_KEY]);
    setCurrentUser(null);
    setIsCompteActif(false);
  }, []);

  // ── Action : refreshUser ──────────────────────────────────

  /**
   * Recharge le profil depuis l'API.
   *
   * Utilise currentUserRef.current (pas currentUser) pour éviter
   * la dépendance circulaire qui causait la boucle infinie.
   * Dépendances : [] → fonction stable, jamais recréée.
   */
  const refreshUser = useCallback(async () => {
    try {
      const response = await ProprietaireApi.consulterProfil();
      // Lecture via ref — pas de dépendance sur currentUser
      if (!response.success || !currentUserRef.current) return;

      const profil = response.data;
      const updatedUser: AuthResponse = {
        ...currentUserRef.current,
        nom:           profil.nom           ?? currentUserRef.current.nom,
        prenom:        profil.prenom        ?? currentUserRef.current.prenom,
        nomEntreprise: profil.nomEntreprise ?? currentUserRef.current.nomEntreprise,
      };

      await saveSecure(USER_KEY, JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
    } catch {
      // silencieux
    }
  }, []); // ← [] intentionnel : référence stable, pas de boucle

  // ── Action : marquerCompteActif ───────────────────────────

  const marquerCompteActif = useCallback(async () => {
    await saveSecure(STATUT_COMPTE_KEY, 'ACTIVE');
    setIsCompteActif(true);
  }, []);

  // ── Action : clearLoginError ──────────────────────────────

  const clearLoginError = useCallback(() => setLoginError(null), []);

  return (
    <AuthContext.Provider value={{
      currentUser,
      isInitializing,
      isLoading,
      loginError,
      isCompteActif,
      login,
      logout,
      clearLoginError,
      refreshUser,
      marquerCompteActif,
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
 *
 * @author Riahi Dorsaf
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};