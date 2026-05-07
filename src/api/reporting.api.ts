/**
 * @file reporting.api.ts
 * @description Fonctions d'appel API pour le module Reporting / Dashboard.
 * @author Riahi Dorsaf
 */

import apiClient from './axios.config';
import { ApiResponse } from '../types/auth.types';
import {
  ReportingKpisResponse,
  ActiviteResponse,
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