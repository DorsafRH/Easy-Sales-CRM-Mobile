/**
 * @file auth.api.ts
 * @description Fonctions d'appel API liées à l'authentification.
 *              Centralise tous les endpoints auth en un seul endroit.
 * @author Riahi Dorsaf
 */

import apiClient from './axios.config';
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyCodeRequest,
} from '../types/auth.types';

/**
 * Connecte un utilisateur via email et mot de passe.
 * @param request - Email et mot de passe
 * @returns Token JWT + profil utilisateur
 * @author Riahi Dorsaf
 */
export const login = async (
  request: LoginRequest
): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(
    '/auth/login',
    request
  );
  return response.data;
};

/**
 * Envoie un email de réinitialisation de mot de passe.
 * Le backend génère un code à 6 chiffres et l'envoie par email.
 * @param request - Email de l'utilisateur
 * @returns Message de confirmation
 * @author Riahi Dorsaf
 */
export const forgotPassword = async (
  request: ForgotPasswordRequest
): Promise<ApiResponse<string>> => {
  const response = await apiClient.post<ApiResponse<string>>(
    '/auth/mot-de-passe-oublie',
    request
  );
  return response.data;
};

/**
 * Réinitialise le mot de passe avec le token reçu par email.
 * @param request - Code 6 chiffres + nouveau mot de passe
 * @returns Message de confirmation
 * @author Riahi Dorsaf
 */
export const resetPassword = async (
  request: ResetPasswordRequest
): Promise<ApiResponse<string>> => {
  const response = await apiClient.post<ApiResponse<string>>(
    '/auth/reinitialiser-mot-de-passe',
    request
  );
  return response.data;
};

/**
 * Vérifie le code OTP à 6 chiffres reçu par email.
 * @param request - Code à 6 chiffres
 * @author Riahi Dorsaf
 */
export const verifyCode = async (
  request: VerifyCodeRequest
): Promise<ApiResponse<string>> => {
  const response = await apiClient.post<ApiResponse<string>>(
    '/auth/verifier-code',
    request
  );
  return response.data;
};