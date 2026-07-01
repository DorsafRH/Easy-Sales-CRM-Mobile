/**
 * @file marketing.api.ts
 * @description Fonctions d'appel API pour le module Marketing IA (Sprint 4).
 *              Génération IA, publications, diffusion et réseaux sociaux.
 * @author Riahi Dorsaf
 */

import apiClient from './axios.config';
import { ApiResponse } from '../types/auth.types';
import {
  AmeliorerContenuRequest,
  CompteSocialConnecte,
  GenererContenuRequest,
  GenererContenuResponse,
  GenererPublicationRequest,
  PublicationMarketing,
  PublicationRequest,
} from '../types/marketing.types';

// ─────────────────────────────────────────────────────────────
// GÉNÉRATION IA
// ─────────────────────────────────────────────────────────────

export const genererContenu = async (
  request: GenererContenuRequest,
): Promise<ApiResponse<GenererContenuResponse>> => {
  const res = await apiClient.post<ApiResponse<GenererContenuResponse>>(
    '/marketing/generer', request,
  );
  return res.data;
};

/**
 * Génère une publication pilotée par le catalogue : le backend récupère les produits/
 * catégorie selon la portée, calcule les prix promo et fait rédiger le post par l'IA.
 * @author Riahi Dorsaf
 */
export const genererPublication = async (
  request: GenererPublicationRequest,
): Promise<ApiResponse<GenererContenuResponse>> => {
  const res = await apiClient.post<ApiResponse<GenererContenuResponse>>(
    '/marketing/generer-publication', request,
  );
  return res.data;
};

/**
 * Améliore un texte déjà rédigé avec l'IA (raffinage itératif, relançable à volonté).
 * @author Riahi Dorsaf
 */
export const ameliorerContenu = async (
  request: AmeliorerContenuRequest,
): Promise<ApiResponse<GenererContenuResponse>> => {
  const res = await apiClient.post<ApiResponse<GenererContenuResponse>>(
    '/marketing/ameliorer', request,
  );
  return res.data;
};

// ─────────────────────────────────────────────────────────────
// PUBLICATIONS
// ─────────────────────────────────────────────────────────────

export const listerPublications = async (
): Promise<ApiResponse<PublicationMarketing[]>> => {
  const res = await apiClient.get<ApiResponse<PublicationMarketing[]>>(
    '/marketing/publications',
  );
  return res.data;
};

export const obtenirPublication = async (
  id: number,
): Promise<ApiResponse<PublicationMarketing>> => {
  const res = await apiClient.get<ApiResponse<PublicationMarketing>>(
    `/marketing/publications/${id}`,
  );
  return res.data;
};

export const creerPublication = async (
  request: PublicationRequest,
): Promise<ApiResponse<PublicationMarketing>> => {
  const res = await apiClient.post<ApiResponse<PublicationMarketing>>(
    '/marketing/publications', request,
  );
  return res.data;
};

export const modifierPublication = async (
  id: number,
  request: PublicationRequest,
): Promise<ApiResponse<PublicationMarketing>> => {
  const res = await apiClient.put<ApiResponse<PublicationMarketing>>(
    `/marketing/publications/${id}`, request,
  );
  return res.data;
};

export const supprimerPublication = async (
  id: number,
): Promise<ApiResponse<void>> => {
  const res = await apiClient.delete<ApiResponse<void>>(
    `/marketing/publications/${id}`,
  );
  return res.data;
};

export const publierPublication = async (
  id: number,
): Promise<ApiResponse<PublicationMarketing>> => {
  const res = await apiClient.post<ApiResponse<PublicationMarketing>>(
    `/marketing/publications/${id}/publier`,
  );
  return res.data;
};

export const annulerPublication = async (
  id: number,
): Promise<ApiResponse<PublicationMarketing>> => {
  const res = await apiClient.patch<ApiResponse<PublicationMarketing>>(
    `/marketing/publications/${id}/annuler`,
  );
  return res.data;
};

// ─────────────────────────────────────────────────────────────
// RÉSEAUX SOCIAUX
// ─────────────────────────────────────────────────────────────

export const listerReseaux = async (
): Promise<ApiResponse<CompteSocialConnecte[]>> => {
  const res = await apiClient.get<ApiResponse<CompteSocialConnecte[]>>(
    '/marketing/reseaux',
  );
  return res.data;
};

export const deconnecterReseau = async (
  id: number,
): Promise<ApiResponse<void>> => {
  const res = await apiClient.delete<ApiResponse<void>>(
    `/marketing/reseaux/${id}`,
  );
  return res.data;
};

export const getOAuthFacebookUrl = async (
): Promise<ApiResponse<string>> => {
  const res = await apiClient.get<ApiResponse<string>>(
    '/marketing/oauth/facebook',
  );
  return res.data;
};
