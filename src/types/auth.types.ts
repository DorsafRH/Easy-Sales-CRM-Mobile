/**
 * @file auth.types.ts
 * @description Types TypeScript pour l'authentification.
 * @author Riahi Dorsaf
 */

export type RoleUtilisateur = 'ROLE_SUPER_ADMIN' | 'ROLE_PROPRIETAIRE';

/** Requête de connexion */
export interface LoginRequest {
  email:      string;
  motDePasse: string;
}

/** Requête de mot de passe oublié */
export interface ForgotPasswordRequest {
  email: string;
}

/** Requête de réinitialisation de mot de passe */
export interface ResetPasswordRequest {
  /** Token UUID reçu par email */
  token:            string;
  /** Nouveau mot de passe */
  nouveauMotDePasse: string;
}

/** Réponse d'authentification */
export interface AuthResponse {
  accessToken:   string;
  refreshToken:  string;
  tokenType:     string;
  userId:        number;
  nom:           string;
  prenom:        string;
  email:         string;
  role:          RoleUtilisateur;
  entrepriseId:  number | null;
  nomEntreprise: string | null;
  statutCompte:  string | null;
}

/** Réponse API générique */
export interface ApiResponse<T> {
  success:   boolean;
  message:   string;
  data:      T;
  timestamp: string;
}

/** Requête de vérification du code OTP */
export interface VerifyCodeRequest {
  token: string;
}