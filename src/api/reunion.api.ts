/**
 * @file reunion.api.ts
 * @description Fonctions d'appel API pour le module Agenda / Réunions.
 * @author Riahi Dorsaf
 */

import apiClient                           from './axios.config';
import { ApiResponse }                     from '../types/auth.types';
import { ReunionRequest, ReunionResponse } from '../types/reunion.types';

/** Retourne toutes les réunions du propriétaire. */
export const lister = async (): Promise<ApiResponse<ReunionResponse[]>> => {
  const res = await apiClient.get<ApiResponse<ReunionResponse[]>>('/reunions');
  return res.data;
};

/**
 * Retourne les réunions d'une période donnée.
 * @param debut - YYYY-MM-DD
 * @param fin   - YYYY-MM-DD
 */
export const listerSemaine = async (
  debut: string,
  fin:   string,
): Promise<ApiResponse<ReunionResponse[]>> => {
  const res = await apiClient.get<ApiResponse<ReunionResponse[]>>(
    '/reunions/semaine',
    { params: { debut, fin } },
  );
  return res.data;
};

/**
 * Retourne les réunions d'aujourd'hui.
 * Utilisé par le Dashboard pour la section "Réunions du jour".
 */
export const listerAujourdhui = async (): Promise<ApiResponse<ReunionResponse[]>> => {
  const today = new Date().toISOString().split('T')[0];
  return listerSemaine(today, today);
};

/**
 * Retourne les réunions d'un client spécifique.
 * @param clientId - Identifiant du client
 */
export const listerParClient = async (
  clientId: number,
): Promise<ApiResponse<ReunionResponse[]>> => {
  const res = await apiClient.get<ApiResponse<ReunionResponse[]>>(
    `/reunions/client/${clientId}`,
  );
  return res.data;
};

/**
 * Retourne le détail d'une réunion.
 * @param id - Identifiant de la réunion
 */
export const obtenir = async (id: number): Promise<ApiResponse<ReunionResponse>> => {
  const res = await apiClient.get<ApiResponse<ReunionResponse>>(`/reunions/${id}`);
  return res.data;
};

/**
 * Crée une nouvelle réunion.
 * @param request - Données de la réunion
 */
export const creer = async (
  request: ReunionRequest,
): Promise<ApiResponse<ReunionResponse>> => {
  const res = await apiClient.post<ApiResponse<ReunionResponse>>('/reunions', request);
  return res.data;
};

/**
 * Modifie une réunion existante.
 * @param id      - Identifiant
 * @param request - Nouvelles données
 */
export const modifier = async (
  id:      number,
  request: ReunionRequest,
): Promise<ApiResponse<ReunionResponse>> => {
  const res = await apiClient.put<ApiResponse<ReunionResponse>>(
    `/reunions/${id}`, request,
  );
  return res.data;
};

/** Marque une réunion comme terminée. */
export const terminer = async (id: number): Promise<ApiResponse<void>> => {
  const res = await apiClient.patch<ApiResponse<void>>(`/reunions/${id}/terminer`);
  return res.data;
};

/** Annule une réunion. */
export const annuler = async (id: number): Promise<ApiResponse<void>> => {
  const res = await apiClient.patch<ApiResponse<void>>(`/reunions/${id}/annuler`);
  return res.data;
};

/** Supprime définitivement une réunion. */
export const supprimer = async (id: number): Promise<ApiResponse<void>> => {
  const res = await apiClient.delete<ApiResponse<void>>(`/reunions/${id}`);
  return res.data;
};