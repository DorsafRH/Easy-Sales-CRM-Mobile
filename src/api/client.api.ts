/**
 * @file client.api.ts
 * @description Fonctions d'appel API pour la gestion des clients CRM.
 *              Tous les endpoints nécessitent ROLE_PROPRIETAIRE (JWT Bearer).
 *              Base path backend : /api/clients
 * @author Riahi Dorsaf
 */

import apiClient from './axios.config';
import { ApiResponse } from '../types/auth.types';
import {
  ClientRequest,
  ClientResponse,
  PageResponse,
} from '../types/client.types';

// ─────────────────────────────────────────────────────────────
// LISTE
// ─────────────────────────────────────────────────────────────

/**
 * Récupère la liste paginée des clients avec filtres optionnels.
 *
 * @param typeClient - Filtre par type : 'INDIVIDUEL' | 'ENTREPRISE' (optionnel)
 * @param keyword    - Recherche sur nomAffichage et email (optionnel)
 * @param page       - Numéro de page (défaut 0)
 * @param size       - Taille de page (défaut 20)
 * @returns Page de clients
 * @author Riahi Dorsaf
 */
export const listerClients = async (
  typeClient?: string,
  keyword?: string,
  page = 0,
  size = 20,
): Promise<ApiResponse<PageResponse<ClientResponse>>> => {
  const params: Record<string, string | number> = { page, size };
  if (typeClient && typeClient !== 'TOUS') params.typeClient = typeClient;
  if (keyword?.trim()) params.keyword = keyword.trim();

  const response = await apiClient.get<ApiResponse<PageResponse<ClientResponse>>>(
    '/clients',
    { params },
  );
  return response.data;
};

// ─────────────────────────────────────────────────────────────
// DÉTAIL
// ─────────────────────────────────────────────────────────────

/**
 * Récupère le détail complet d'un client par son identifiant.
 *
 * @param id - Identifiant du client
 * @returns Client complet avec nbContacts et chiffreAffaires
 * @author Riahi Dorsaf
 */
export const obtenirClient = async (
  id: number,
): Promise<ApiResponse<ClientResponse>> => {
  const response = await apiClient.get<ApiResponse<ClientResponse>>(
    `/clients/${id}`,
  );
  return response.data;
};

// ─────────────────────────────────────────────────────────────
// CRÉATION
// ─────────────────────────────────────────────────────────────

/**
 * Crée un nouveau client (individuel ou entreprise).
 *
 * @param request - Données du client à créer
 * @returns Client créé avec son identifiant généré
 * @author Riahi Dorsaf
 */
export const creerClient = async (
  request: ClientRequest,
): Promise<ApiResponse<ClientResponse>> => {
  const response = await apiClient.post<ApiResponse<ClientResponse>>(
    '/clients',
    request,
  );
  return response.data;
};

// ─────────────────────────────────────────────────────────────
// MODIFICATION
// ─────────────────────────────────────────────────────────────

/**
 * Modifie un client existant.
 *
 * @param id      - Identifiant du client à modifier
 * @param request - Nouvelles données du client
 * @returns Client mis à jour
 * @author Riahi Dorsaf
 */
export const modifierClient = async (
  id: number,
  request: ClientRequest,
): Promise<ApiResponse<ClientResponse>> => {
  const response = await apiClient.put<ApiResponse<ClientResponse>>(
    `/clients/${id}`,
    request,
  );
  return response.data;
};

// ─────────────────────────────────────────────────────────────
// IMPORT PHOTO (OCR)
// ─────────────────────────────────────────────────────────────

/**
 * Envoie une photo au backend pour détecter des clients via Groq Vision.
 * Retourne la liste des clients détectés (non encore créés).
 *
 * @param imageUri  - URI locale de l'image
 * @param mimeType  - Type MIME (image/jpeg, image/png…)
 * @author Riahi Dorsaf
 */
export const importerDepuisPhoto = async (
  imageUri: string,
  mimeType: string = 'image/jpeg',
): Promise<ApiResponse<ClientRequest[]>> => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: mimeType,
    name: 'import.jpg',
  } as unknown as Blob);

  const response = await apiClient.post<ApiResponse<ClientRequest[]>>(
    '/clients/import/photo',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data;
};

// ─────────────────────────────────────────────────────────────
// SUPPRESSION (soft delete)
// ─────────────────────────────────────────────────────────────

/**
 * Supprime logiquement un client (isDeleted = true côté backend).
 * Le client n'apparaît plus dans les listes mais ses données sont conservées.
 *
 * @param id - Identifiant du client à supprimer
 * @author Riahi Dorsaf
 */
export const supprimerClient = async (
  id: number,
): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(
    `/clients/${id}`,
  );
  return response.data;
};