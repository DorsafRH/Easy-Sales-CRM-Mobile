/**
 * @file reporting.api.ts
 * @description Fonctions d'appel API pour le module Reporting / Dashboard.
 * @author Riahi Dorsaf
 */

import apiClient from './axios.config';
import { ApiResponse } from '../types/auth.types';
import {
  ReportingKpisResponse,
  StatsVentesResponse,
  ActiviteResponse,
  CaMensuelDto,
  PageResponse,
  PeriodeDashboard,
} from '../types/reporting.types';

/**
 * Récupère les KPIs du tableau de bord filtrés par période.
 *
 * @param periode - Période de filtrage (défaut : CE_MOIS)
 */
export const getKpis = async (
  periode: PeriodeDashboard = 'CE_MOIS',
): Promise<ApiResponse<ReportingKpisResponse>> => {
  const response = await apiClient.get<ApiResponse<ReportingKpisResponse>>(
    '/reporting/kpis',
    { params: { periode } },
  );
  return response.data;
};

/**
 * Récupère le chiffre d'affaires (factures PAYÉE) du mois calendaire précédent.
 */
export const getCAMoisPrecedent = async (): Promise<ApiResponse<number>> =>
  (await apiClient.get<ApiResponse<number>>('/reporting/ca-mois-precedent')).data;

/**
 * Récupère les statistiques de vente avancées pour le dashboard.
 */
export const getStatsVentes = async (): Promise<ApiResponse<StatsVentesResponse>> =>
  (await apiClient.get<ApiResponse<StatsVentesResponse>>('/reporting/stats-ventes')).data;

/**
 * Récupère le CA mensuel sur les 12 derniers mois glissants.
 */
export const getCaParMois = async (): Promise<ApiResponse<CaMensuelDto[]>> =>
  (await apiClient.get<ApiResponse<CaMensuelDto[]>>('/reporting/ca-par-mois')).data;

/**
 * Récupère la liste paginée de toutes les activités.
 */
export const getActivites = async (
  page = 0,
  size = 20,
): Promise<ApiResponse<PageResponse<ActiviteResponse>>> => {
  const response = await apiClient.get<ApiResponse<PageResponse<ActiviteResponse>>>(
    '/reporting/activites',
    { params: { page, size } },
  );
  return response.data;
};