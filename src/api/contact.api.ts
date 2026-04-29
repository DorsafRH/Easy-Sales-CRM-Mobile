/**
 * @file contact.api.ts
 * @description Fonctions d'appel API pour la gestion des contacts d'un client.
 *              Tous les endpoints nécessitent ROLE_PROPRIETAIRE (JWT Bearer).
 *              Base path backend : /api/clients/{clientId}/contacts
 * @author Riahi Dorsaf
 */

import apiClient from './axios.config';
import { ApiResponse } from '../types/auth.types';
import { ContactRequest, ContactResponse } from '../types/contact.types';

// ─────────────────────────────────────────────────────────────
// LISTE
// ─────────────────────────────────────────────────────────────

/**
 * Récupère la liste des contacts d'un client avec recherche optionnelle.
 *
 * @param clientId - Identifiant du client parent
 * @param keyword  - Recherche sur nom, prénom, email, poste (optionnel)
 * @returns Liste des contacts du client
 * @author Riahi Dorsaf
 */
export const listerContacts = async (
  clientId: number,
  keyword?: string,
): Promise<ApiResponse<ContactResponse[]>> => {
  const params: Record<string, string> = {};
  if (keyword?.trim()) params.keyword = keyword.trim();

  const response = await apiClient.get<ApiResponse<ContactResponse[]>>(
    `/clients/${clientId}/contacts`,
    { params },
  );
  return response.data;
};

// ─────────────────────────────────────────────────────────────
// DÉTAIL
// ─────────────────────────────────────────────────────────────

/**
 * Récupère le détail d'un contact spécifique.
 *
 * @param clientId  - Identifiant du client parent
 * @param contactId - Identifiant du contact
 * @returns Contact complet
 * @author Riahi Dorsaf
 */
export const obtenirContact = async (
  clientId: number,
  contactId: number,
): Promise<ApiResponse<ContactResponse>> => {
  const response = await apiClient.get<ApiResponse<ContactResponse>>(
    `/clients/${clientId}/contacts/${contactId}`,
  );
  return response.data;
};

// ─────────────────────────────────────────────────────────────
// CRÉATION
// ─────────────────────────────────────────────────────────────

/**
 * Ajoute un nouveau contact à un client.
 * Règle backend : un seul contact principal par client.
 * Si isPrincipal = true, l'ancien principal est automatiquement décroché.
 *
 * @param clientId - Identifiant du client parent
 * @param request  - Données du contact à créer
 * @returns Contact créé
 * @author Riahi Dorsaf
 */
export const creerContact = async (
  clientId: number,
  request: ContactRequest,
): Promise<ApiResponse<ContactResponse>> => {
  const response = await apiClient.post<ApiResponse<ContactResponse>>(
    `/clients/${clientId}/contacts`,
    request,
  );
  return response.data;
};

// ─────────────────────────────────────────────────────────────
// MODIFICATION
// ─────────────────────────────────────────────────────────────

/**
 * Modifie un contact existant.
 *
 * @param clientId  - Identifiant du client parent
 * @param contactId - Identifiant du contact à modifier
 * @param request   - Nouvelles données du contact
 * @returns Contact mis à jour
 * @author Riahi Dorsaf
 */
export const modifierContact = async (
  clientId: number,
  contactId: number,
  request: ContactRequest,
): Promise<ApiResponse<ContactResponse>> => {
  const response = await apiClient.put<ApiResponse<ContactResponse>>(
    `/clients/${clientId}/contacts/${contactId}`,
    request,
  );
  return response.data;
};

// ─────────────────────────────────────────────────────────────
// SUPPRESSION
// ─────────────────────────────────────────────────────────────

/**
 * Supprime un contact.
 * Règle backend : impossible de supprimer le contact principal.
 * Un autre contact doit être défini comme principal d'abord.
 *
 * @param clientId  - Identifiant du client parent
 * @param contactId - Identifiant du contact à supprimer
 * @author Riahi Dorsaf
 */
export const supprimerContact = async (
  clientId: number,
  contactId: number,
): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(
    `/clients/${clientId}/contacts/${contactId}`,
  );
  return response.data;
};