/**
 * @file proprietaire.api.ts
 * @description Fonctions d'appel API pour la gestion du profil propriétaire.
 * @author Riahi Dorsaf
 */

import apiClient from './axios.config';
import { ApiResponse } from '../types/auth.types';
import {
  ProfilProprietaireResponse,
  ModifierProfilRequest,
  ModifierEntrepriseRequest,
} from '../types/proprietaire.types';

/**
 * Récupère le profil complet du propriétaire connecté.
 * @returns Profil + données entreprise
 * @author Riahi Dorsaf
 */
export const consulterProfil = async (): Promise<ApiResponse<ProfilProprietaireResponse>> => {
  const response = await apiClient.get<ApiResponse<ProfilProprietaireResponse>>(
    '/proprietaire/profil'
  );
  return response.data;
};

/**
 * Met à jour les données personnelles du propriétaire.
 * @param request - Nom, prénom, téléphone
 * @returns Profil mis à jour
 * @author Riahi Dorsaf
 */
export const modifierProfil = async (
  request: ModifierProfilRequest
): Promise<ApiResponse<ProfilProprietaireResponse>> => {
  const response = await apiClient.put<ApiResponse<ProfilProprietaireResponse>>(
    '/proprietaire/profil',
    request
  );
  return response.data;
};

/**
 * Met à jour les données de l'entreprise du propriétaire.
 * Génère une notification au Super Admin.
 * @param request - Données entreprise
 * @returns Profil mis à jour
 * @author Riahi Dorsaf
 */
export const modifierEntreprise = async (
  request: ModifierEntrepriseRequest
): Promise<ApiResponse<ProfilProprietaireResponse>> => {
  const response = await apiClient.put<ApiResponse<ProfilProprietaireResponse>>(
    '/proprietaire/entreprise',
    request
  );
  return response.data;
};